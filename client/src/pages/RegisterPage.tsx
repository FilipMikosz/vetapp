import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, TextField, Typography, Link, Alert } from '@mui/material'

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    console.log('Registering user:', formData)
    // backend here
  }

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
