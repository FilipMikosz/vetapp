import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Button,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface Animal {
  id: number
  name: string
  breed: string
  birth_year: number
  chip_number: string
  kennel_name: string
}

interface RecordGroup {
  animal: Animal
  litters: any[]
  illnesses: any[]
  vaccinations: any[]
  prescriptions: any[]
  administered_medications: any[]
  imaging: any[]
  lab_tests: any[]
  special_notes: any[]
  visits: any[]
}

interface Props {
  userId: number
  open: boolean
  onClose: () => void
}

export default function AnimalRecordsViewer({ userId, open, onClose }: Props) {
  const [records, setRecords] = useState<RecordGroup[]>([])
  const [selectedAnimal, setSelectedAnimal] = useState<RecordGroup | null>(null)
  const [loading, setLoading] = useState(false)
  const [ownerName, setOwnerName] = useState('')

  useEffect(() => {
    if (!open) return

    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('No auth token found')
      setRecords([])
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const signal = controller.signal

    const fetchOwnerName = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/users/username/${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) {
          throw new Error(
            `Error fetching user name: ${res.status} ${res.statusText}`
          )
        }

        const data = await res.json()
        setOwnerName(`${data.firstName} ${data.lastName}`)
      } catch (error) {
        console.error('Error fetching owner name:', error)
      }
    }

    const fetchRecords = async () => {
      setLoading(true)
      try {
        const res = await fetch(`http://localhost:3000/api/records/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          signal,
        })

        if (!res.ok) {
          throw new Error(
            `Error fetching records: ${res.status} ${res.statusText}`
          )
        }

        const data: RecordGroup[] = await res.json()
        setRecords(data)
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted')
        } else {
          console.error('Fetch error:', error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOwnerName()
    fetchRecords()

    return () => {
      controller.abort()
    }
  }, [userId, open])

  const handleAnimalClick = (record: RecordGroup) => {
    setSelectedAnimal(record)
  }

  const handleDialogClose = () => {
    setSelectedAnimal(null)
    onClose()
  }

  const renderNiceData = (data: any[]) => {
    if (data.length === 0) {
      return <Typography variant='body2'>Brak danych</Typography>
    }

    const formatDateTime = (value: any): string => {
      const date = new Date(value)
      if (isNaN(date.getTime())) return String(value)
      const pad = (n: number) => n.toString().padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )} ${pad(date.getHours())}:${pad(date.getMinutes())}`
    }

    return data.map((item, index) => {
      const filteredItem = { ...item }
      delete filteredItem.id
      delete filteredItem.animal_id

      return (
        <Paper key={index} variant='outlined' sx={{ p: 1, mb: 1 }}>
          {Object.entries(filteredItem).map(([key, value]) => {
            const displayValue =
              typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)
                ? formatDateTime(value)
                : String(value)

            return (
              <Typography key={key} variant='body2' sx={{ mb: 0.5 }}>
                <strong>{key.replace(/_/g, ' ')}:</strong> {displayValue}
              </Typography>
            )
          })}
        </Paper>
      )
    })
  }

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth='lg'>
      <DialogTitle>Zwierzęta właściciela: {ownerName || '...'}</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            minHeight={200}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box
              sx={{
                width: '30%',
                maxHeight: '70vh',
                overflowY: 'auto',
                borderRight: '1px solid',
                borderColor: 'divider',
              }}
            >
              <List disablePadding>
                {records.length === 0 ? (
                  <Typography variant='body2' color='text.secondary' p={2}>
                    Brak zwierząt do wyświetlenia
                  </Typography>
                ) : (
                  records.map((record) => (
                    <Box
                      key={record.animal.id}
                      sx={{
                        borderRadius: 2,
                        p: 2,
                        mb: 1,
                        bgcolor:
                          selectedAnimal?.animal.id === record.animal.id
                            ? 'action.hover'
                            : 'background.paper',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                      onClick={() => handleAnimalClick(record)}
                    >
                      <Typography variant='subtitle1'>
                        {record.animal.name}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Rasa: {record.animal.breed || 'brak'}, Chip:{' '}
                        {record.animal.chip_number || 'brak'}
                      </Typography>
                    </Box>
                  ))
                )}
              </List>
            </Box>

            <Box
              sx={{ width: '70%', maxHeight: '70vh', overflowY: 'auto', px: 2 }}
            >
              {selectedAnimal && (
                <>
                  <Typography variant='h6' mb={2}>
                    Medical record: {selectedAnimal.animal.name}
                  </Typography>

                  {[
                    { label: 'Mioty', data: selectedAnimal.litters },
                    { label: 'Choroby', data: selectedAnimal.illnesses },
                    { label: 'Szczepienia', data: selectedAnimal.vaccinations },
                    { label: 'Recepty', data: selectedAnimal.prescriptions },
                    {
                      label: 'Leki w gabinecie',
                      data: selectedAnimal.administered_medications,
                    },
                    { label: 'RTG/USG', data: selectedAnimal.imaging },
                    { label: 'Badania', data: selectedAnimal.lab_tests },
                    { label: 'Notatki', data: selectedAnimal.special_notes },
                    { label: 'Wizyty', data: selectedAnimal.visits },
                  ].map(({ label, data }) => (
                    <Accordion key={label} disableGutters>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>
                          {label} ({data.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {renderNiceData(data)}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </>
              )}
            </Box>
          </Box>
        )}
        <Box mt={2} textAlign='right'>
          <Button onClick={handleDialogClose}>Zamknij</Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
