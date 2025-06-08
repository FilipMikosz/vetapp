import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Stack,
  CircularProgress,
  Divider,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import {
  Person as PersonIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'

interface Doctor {
  id: number
  first_name: string
  last_name: string
  email: string
}

const MyDoctors = () => {
  const [myDoctors, setMyDoctors] = useState<Doctor[]>([])
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [addingDoctorId, setAddingDoctorId] = useState<number | null>(null)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)

  const token = localStorage.getItem('token')

  const fetchDoctors = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/doctors/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data: Doctor[] = await res.json()
      setAllDoctors(data)

      const myDoctorRes = await fetch(
        'http://localhost:3000/api/doctors/mine',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const myDoctorData: Doctor[] = await myDoctorRes.json()
      setMyDoctors(myDoctorData)
    } catch (err) {
      console.error('Error fetching doctors:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const handleAddDoctor = async (doctorId: number) => {
    setAddingDoctorId(doctorId)
    try {
      const res = await fetch('http://localhost:3000/api/doctors/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ doctorId }),
      })

      if (!res.ok) {
        const err = await res.json()
        console.error(err.error)
        return
      }

      const addedDoctor = allDoctors.find((doc) => doc.id === doctorId)
      if (addedDoctor) {
        setMyDoctors((prev) => [...prev, addedDoctor])
      }
    } catch (error) {
      console.error('Error adding doctor:', error)
    } finally {
      setAddingDoctorId(null)
    }
  }

  const handleRemoveDoctor = async () => {
    if (!selectedDoctor) return

    try {
      const res = await fetch('http://localhost:3000/api/doctors/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ doctorId: selectedDoctor.id }),
      })

      if (res.ok) {
        setMyDoctors((prev) =>
          prev.filter((doc) => doc.id !== selectedDoctor.id)
        )
      } else {
        const err = await res.json()
        console.error(err.error)
      }
    } catch (error) {
      console.error('Error removing doctor:', error)
    } finally {
      setOpenConfirm(false)
      setSelectedDoctor(null)
    }
  }

  const isMyDoctor = (id: number) => myDoctors.some((doc) => doc.id === id)

  const filteredDoctors = allDoctors.filter(
    (doc) =>
      `${doc.first_name} ${doc.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      doc.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Box p={4} maxWidth='800px' mx='auto'>
      <Typography variant='h4' gutterBottom>
        Moi lekarze
      </Typography>

      {myDoctors.length === 0 ? (
        <Typography color='text.secondary' mb={4}>
          Nie masz jeszcze przypisanego żadnego lekarza.
        </Typography>
      ) : (
        <Stack spacing={3} mb={5}>
          {myDoctors.map((doc) => (
            <Card key={doc.id} elevation={3}>
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant='h6'>
                      {doc.first_name} {doc.last_name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {doc.email}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant='caption' color='text.secondary'>
                    Twój lekarz
                  </Typography>
                  <IconButton
                    color='error'
                    onClick={() => {
                      setSelectedDoctor(doc)
                      setOpenConfirm(true)
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Typography variant='h6' gutterBottom>
        Wyszukaj lekarzy:
      </Typography>

      <TextField
        label='Szukaj po imieniu lub e-mailu'
        variant='outlined'
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
      />

      {loading ? (
        <Box display='flex' justifyContent='center' mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={3}>
          {filteredDoctors.map((doctor) => {
            const added = isMyDoctor(doctor.id)
            return (
              <Card key={doctor.id} elevation={2}>
                <CardContent
                  sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant='subtitle1'>
                      {doctor.first_name} {doctor.last_name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {doctor.email}
                    </Typography>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                  <Button
                    variant='contained'
                    color={added ? 'success' : 'primary'}
                    startIcon={added ? <CheckIcon /> : <AddIcon />}
                    disabled={added || addingDoctorId === doctor.id}
                    onClick={() => handleAddDoctor(doctor.id)}
                  >
                    {added ? 'Dodano' : 'Dodaj lekarza'}
                  </Button>
                </CardActions>
              </Card>
            )
          })}
        </Stack>
      )}

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Potwierdź usunięcie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz usunąć lekarza{' '}
            <strong>
              {selectedDoctor?.first_name} {selectedDoctor?.last_name}
            </strong>{' '}
            z listy?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color='primary'>
            Anuluj
          </Button>
          <Button onClick={handleRemoveDoctor} color='error'>
            Usuń lekarza
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MyDoctors
