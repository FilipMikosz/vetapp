import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  CircularProgress,
  Divider,
} from '@mui/material'
import PetsIcon from '@mui/icons-material/Pets'

interface Animal {
  id: number
  name: string
  breed: string
  birth_year: number
  chip_number: string
  kennel_name: string
}

const MyAnimals = () => {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem('token')

  const fetchAnimals = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/animals/mine', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      setAnimals(data)
    } catch (err) {
      console.error('Error fetching animals:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnimals()
  }, [])

  return (
    <Box p={4} maxWidth='800px' mx='auto'>
      <Typography variant='h4' gutterBottom>
        Moje zwierzęta
      </Typography>

      {loading ? (
        <Box display='flex' justifyContent='center' mt={4}>
          <CircularProgress />
        </Box>
      ) : animals.length === 0 ? (
        <Typography color='text.secondary'>
          Nie masz jeszcze dodanych zwierząt.
        </Typography>
      ) : (
        <Stack spacing={3} mt={2}>
          {animals.map((animal) => (
            <Card key={animal.id} elevation={2}>
              <CardContent
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <Avatar>
                  <PetsIcon />
                </Avatar>
                <Box>
                  <Typography variant='h6'>{animal.name}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Rasa: {animal.breed || 'Nieznana'} | Rok urodzenia:{' '}
                    {animal.birth_year || 'Brak'}
                  </Typography>
                  {animal.kennel_name && (
                    <Typography variant='body2'>
                      Przydomek: {animal.kennel_name}
                    </Typography>
                  )}
                  {animal.chip_number && (
                    <Typography variant='body2'>
                      Chip: {animal.chip_number}
                    </Typography>
                  )}
                </Box>
              </CardContent>
              <Divider />
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default MyAnimals
