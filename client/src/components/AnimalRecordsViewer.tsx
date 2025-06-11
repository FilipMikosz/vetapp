import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Button,
  List,
  TextField,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'

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

const fieldDefinitions: Record<string, { label: string; type: string }[]> = {
  litters: [
    { label: 'year', type: 'number' },
    { label: 'description', type: 'text' },
  ],
  illnesses: [
    { label: 'name', type: 'text' },
    { label: 'date', type: 'date' },
    { label: 'notes', type: 'text' },
  ],
  vaccinations: [
    { label: 'name', type: 'text' },
    { label: 'date', type: 'date' },
    { label: 'mandatory', type: 'checkbox' },
  ],
  prescriptions: [
    { label: 'medication_name', type: 'text' },
    { label: 'dosage', type: 'text' },
    { label: 'date_prescribed', type: 'date' },
    { label: 'notes', type: 'text' },
  ],
  administered_medications: [
    { label: 'medication_name', type: 'text' },
    { label: 'dosage', type: 'text' },
    { label: 'date_administered', type: 'date' },
  ],
  imaging: [
    { label: 'type', type: 'text' },
    { label: 'image_url', type: 'text' },
    { label: 'date', type: 'date' },
    { label: 'description', type: 'text' },
  ],
  lab_tests: [
    { label: 'test_name', type: 'text' },
    { label: 'result', type: 'text' },
    { label: 'date', type: 'date' },
    { label: 'document_url', type: 'text' },
  ],
  special_notes: [
    { label: 'note', type: 'text' },
    { label: 'date_added', type: 'date' },
  ],
  visits: [
    { label: 'visit_date', type: 'datetime-local' },
    { label: 'reason', type: 'text' },
    { label: 'notes', type: 'text' },
  ],
}

export default function AnimalRecordsViewer({ userId, open, onClose }: Props) {
  const [records, setRecords] = useState<RecordGroup[]>([])
  const [selectedAnimal, setSelectedAnimal] = useState<RecordGroup | null>(null)
  const [loading, setLoading] = useState(false)
  const [ownerName, setOwnerName] = useState('')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newRecordType, setNewRecordType] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!open) return

    const controller = new AbortController()
    const signal = controller.signal

    const fetchData = async () => {
      try {
        const res1 = await fetch(
          `http://localhost:3000/api/users/username/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const nameData = await res1.json()
        setOwnerName(`${nameData.firstName} ${nameData.lastName}`)

        const res2 = await fetch(
          `http://localhost:3000/api/records/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal,
          }
        )
        const data = await res2.json()
        setRecords(data)
      } catch (e: any) {
        if (e.name === 'AbortError') {
          console.log('Fetch aborted')
          return
        }
        console.error('Fetch error', e)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchData()

    return () => controller.abort()
  }, [userId, open])

  const handleAnimalClick = (record: RecordGroup) => {
    setSelectedAnimal(record)
  }

  const handleDialogClose = () => {
    setSelectedAnimal(null)
    onClose()
  }

  const handleAddNew = (type: string) => {
    setNewRecordType(type)
    setFormData({})
    setAddDialogOpen(true)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!selectedAnimal || !newRecordType) return

    try {
      const res = await fetch(
        `http://localhost:3000/api/records/${selectedAnimal.animal.id}/${newRecordType}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      )
      if (!res.ok) throw new Error('Failed to add record')
      setAddDialogOpen(false)
      // Refresh data
      const refreshed = await fetch(
        `http://localhost:3000/api/records/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const refreshedData = await refreshed.json()
      setRecords(refreshedData)
      // keep selected animal
      const same = refreshedData.find(
        (r: RecordGroup) => r.animal.id === selectedAnimal.animal.id
      )
      setSelectedAnimal(same || null)
    } catch (e) {
      console.error('Error adding record', e)
    }
  }

  const renderNiceData = (data: any[]) =>
    data.length === 0 ? (
      <Typography variant='body2'>Brak danych</Typography>
    ) : (
      data.map((item, index) => {
        const clean = { ...item }
        delete clean.id
        delete clean.animal_id
        return (
          <Paper key={index} sx={{ p: 1, mb: 1 }} variant='outlined'>
            {Object.entries(clean).map(([k, v]) => (
              <Typography key={k} variant='body2'>
                <strong>{k.replace(/_/g, ' ')}:</strong> {String(v)}
              </Typography>
            ))}
          </Paper>
        )
      })
    )

  const renderAddDialog = () => {
    if (!newRecordType) return null
    const fields = fieldDefinitions[newRecordType] || []

    return (
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        fullWidth
      >
        <DialogTitle>Dodaj nowy rekord: {newRecordType}</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          {fields.map((f) => (
            <TextField
              key={f.label}
              label={f.label.replace(/_/g, ' ')}
              type={f.type}
              value={formData[f.label] || ''}
              onChange={(e) => handleInputChange(f.label, e.target.value)}
              fullWidth
              InputLabelProps={
                f.type === 'date' || f.type === 'datetime-local'
                  ? { shrink: true }
                  : undefined
              }
              inputProps={
                f.type === 'date' || f.type === 'datetime-local'
                  ? { placeholder: '' }
                  : undefined
              }
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Anuluj</Button>
          <Button onClick={handleSubmit} variant='contained'>
            Dodaj
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth='lg'>
      <DialogTitle>Zwierzęta właściciela: {ownerName}</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display='flex' justifyContent='center' p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Box display='flex' gap={2}>
            {/* Sidebar with animal list */}
            <Box sx={{ width: '30%', borderRight: '1px solid #ccc', pr: 2 }}>
              <List>
                {records.map((r) => (
                  <Box
                    key={r.animal.id}
                    onClick={() => handleAnimalClick(r)}
                    sx={{
                      p: 2,
                      mb: 1,
                      borderRadius: 2,
                      cursor: 'pointer',
                      bgcolor:
                        selectedAnimal?.animal.id === r.animal.id
                          ? 'action.selected'
                          : 'background.paper',
                    }}
                  >
                    <Typography variant='subtitle1'>{r.animal.name}</Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {r.animal.breed || 'brak'} | Chip:{' '}
                      {r.animal.chip_number || 'brak'}
                    </Typography>
                  </Box>
                ))}
              </List>
            </Box>

            {/* Main content */}
            <Box sx={{ width: '70%', pr: 2 }}>
              {selectedAnimal && (
                <>
                  <Typography variant='h6' gutterBottom>
                    Rekordy: {selectedAnimal.animal.name}
                  </Typography>
                  {Object.entries(selectedAnimal)
                    .filter(([k]) => k !== 'animal')
                    .map(([k, v]) => (
                      <Accordion key={k} disableGutters>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>
                            {k.replace(/_/g, ' ')} ({(v as any[]).length})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {renderNiceData(v as any[])}
                          <Box textAlign='center' mt={2}>
                            <Button
                              variant='outlined'
                              startIcon={<AddIcon />}
                              onClick={() => handleAddNew(k)}
                            >
                              Dodaj nowy
                            </Button>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                </>
              )}
            </Box>
          </Box>
        )}
        {renderAddDialog()}
      </DialogContent>
    </Dialog>
  )
}
