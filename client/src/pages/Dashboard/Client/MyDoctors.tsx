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
} from '@mui/material'
import { Person as PersonIcon, Add as AddIcon } from '@mui/icons-material'

interface Doctor {
  id: number
  first_name: string
  last_name: string
  email: string
}

const MyDoctors = () => {
  const [myDoctors, setMyDoctors] = useState<Doctor[]>([]) // future use
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true)
      try {
        const res = await fetch('http://localhost:3000/api/doctors/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        setAllDoctors(data)
      } catch (err) {
        console.error('Error fetching doctors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const handleAddDoctor = (doctorId: number) => {
    console.log('Add doctor with ID:', doctorId)
    // Future: POST to assign doctor to user
  }

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

      {myDoctors.length === 0 && (
        <Typography color='text.secondary' mb={4}>
          Nie masz jeszcze przypisanego żadnego lekarza.
        </Typography>
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
          {filteredDoctors.map((doctor) => (
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
                  startIcon={<AddIcon />}
                  onClick={() => handleAddDoctor(doctor.id)}
                >
                  Dodaj lekarza
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default MyDoctors
