import { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    role: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const allFieldsFilled = Object.values(formData).every(
      (value) => value.trim() !== ''
    )
    if (!allFieldsFilled) {
      setError('Please fill in all fields.')
      setSuccess('')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      setSuccess('')
      return
    }

    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong.')
        setSuccess('')
        return
      }

      setSuccess('Registration successful!')
      setError('')
      setFormData({
        role: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    } catch (err) {
      console.error(err)
      setError('Network error or server is down.')
      setSuccess('')
    }
  }

  // Optional: auto-clear alerts after 4s
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('')
        setSuccess('')
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 5,
        p: 3,
        border: '1px solid #ddd',
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 1,
      }}
      noValidate
      autoComplete='off'
    >
      <Typography variant='h5' component='h1' align='center' mb={3}>
        Register
      </Typography>

      <FormControl fullWidth required margin='normal'>
        <InputLabel id='role-label'>I am a...</InputLabel>
        <Select
          labelId='role-label'
          name='role'
          value={formData.role}
          label='I am a...'
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, role: e.target.value }))
          }
        >
          <MenuItem value='owner'>Pet Owner</MenuItem>
          <MenuItem value='doctor'>Veterinarian</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label='First Name'
        name='firstName'
        value={formData.firstName}
        onChange={handleChange}
        fullWidth
        required
        margin='normal'
      />

      <TextField
        label='Last Name'
        name='lastName'
        value={formData.lastName}
        onChange={handleChange}
        fullWidth
        required
        margin='normal'
      />

      <TextField
        label='Email'
        type='email'
        name='email'
        value={formData.email}
        onChange={handleChange}
        fullWidth
        required
        margin='normal'
      />

      <TextField
        label='Password'
        type='password'
        name='password'
        value={formData.password}
        onChange={handleChange}
        fullWidth
        required
        margin='normal'
      />

      <TextField
        label='Confirm Password'
        type='password'
        name='confirmPassword'
        value={formData.confirmPassword}
        onChange={handleChange}
        fullWidth
        required
        margin='normal'
      />

      {error && (
        <Alert severity='error' sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity='success' sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}

      <Button
        type='submit'
        variant='contained'
        color='primary'
        fullWidth
        sx={{ mt: 3 }}
      >
        Register
      </Button>

      <Typography variant='body2' align='center' sx={{ mt: 2 }}>
        Already have an account?{' '}
        <Link component={RouterLink} to='/login'>
          Login here
        </Link>
      </Typography>
    </Box>
  )
}
