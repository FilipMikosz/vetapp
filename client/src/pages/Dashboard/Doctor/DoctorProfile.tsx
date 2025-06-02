import { useEffect, useState } from 'react'
import {
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  Box,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'

type UserProfile = {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
}

const DoctorProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          'http://localhost:3000/api/users/profile',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data: UserProfile = await response.json()
        setProfile(data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!profile) {
    return (
      <Container>
        <Typography variant='h6' color='error'>
          Failed to load profile.
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth='sm' sx={{ mt: 5 }}>
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Avatar sx={{ bgcolor: '#1976d2', width: 80, height: 80, mx: 'auto' }}>
          <PersonIcon fontSize='large' />
        </Avatar>
        <CardContent>
          <Typography variant='h5' sx={{ mb: 1 }}>
            Dr. {profile.first_name} {profile.last_name}
          </Typography>
          <Typography variant='body1' color='textSecondary'>
            Email: {profile.email}
          </Typography>
          <Typography variant='body1' color='textSecondary'>
            Role: {profile.role}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}

export default DoctorProfile
