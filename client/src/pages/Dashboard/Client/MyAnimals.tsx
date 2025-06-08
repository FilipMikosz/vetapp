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
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  IconButton,
} from '@mui/material'
import PetsIcon from '@mui/icons-material/Pets'
import DeleteIcon from '@mui/icons-material/Delete'

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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [nameError, setNameError] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    birth_year: '',
    chip_number: '',
    kennel_name: '',
  })

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null)

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (e.target.name === 'name' && e.target.value.trim() !== '') {
      setNameError(false)
    }
  }

  const handleAddAnimal = async () => {
    if (!formData.name.trim()) {
      setNameError(true)
      return
    }

    try {
      const res = await fetch('http://localhost:3000/api/animals/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Failed to add animal')
      }

      const newAnimal = await res.json()
      setAnimals((prev) => [...prev, newAnimal])
      setDialogOpen(false)
      setFormData({
        name: '',
        breed: '',
        birth_year: '',
        chip_number: '',
        kennel_name: '',
      })
      setNameError(false)
    } catch (err) {
      console.error('Error adding animal:', err)
    }
  }

  // Open delete confirmation dialog
  const confirmDeleteAnimal = (animal: Animal) => {
    setAnimalToDelete(animal)
    setDeleteDialogOpen(true)
  }

  // Actually delete after confirmation
  const handleDeleteAnimal = async () => {
    if (!animalToDelete) return

    try {
      const res = await fetch(
        `http://localhost:3000/api/animals/${animalToDelete.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error('Failed to delete animal')
      }

      setAnimals((prev) =>
        prev.filter((animal) => animal.id !== animalToDelete.id)
      )
      setDeleteDialogOpen(false)
      setAnimalToDelete(null)
    } catch (err) {
      console.error('Error deleting animal:', err)
    }
  }

  return (
    <Box p={4} maxWidth='800px' mx='auto'>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant='h4' gutterBottom>
          Moje zwierzęta
        </Typography>
        <Button variant='contained' onClick={() => setDialogOpen(true)}>
          Dodaj zwierzę
        </Button>
      </Box>

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
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                </Box>
                <IconButton
                  onClick={() => confirmDeleteAnimal(animal)}
                  aria-label='delete'
                  size='small'
                  sx={{ color: 'black' }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
              <Divider />
            </Card>
          ))}
        </Stack>
      )}

      {/* Add Animal Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          setNameError(false)
        }}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>Dodaj nowe zwierzę</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label='Imię'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
              fullWidth
              error={nameError}
              helperText={nameError ? 'Imię jest wymagane' : ''}
            />
            <TextField
              label='Rasa'
              name='breed'
              value={formData.breed}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label='Rok urodzenia'
              name='birth_year'
              type='number'
              value={formData.birth_year}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label='Numer chipu'
              name='chip_number'
              value={formData.chip_number}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label='Przydomek hodowlany'
              name='kennel_name'
              value={formData.kennel_name}
              onChange={handleInputChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false)
              setNameError(false)
            }}
          >
            Anuluj
          </Button>
          <Button variant='contained' onClick={handleAddAnimal}>
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Potwierdź usunięcie</DialogTitle>
        <DialogContent>
          <Typography>
            Czy na pewno chcesz usunąć zwierzę{' '}
            <strong>{animalToDelete?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Anuluj</Button>
          <Button
            variant='contained'
            color='error'
            onClick={handleDeleteAnimal}
          >
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MyAnimals
