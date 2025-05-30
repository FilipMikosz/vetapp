import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, TextField, Typography, Link, Alert } from '@mui/material'

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Basic validation example:
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.')
      return
    }
    setError('')
    // Handle login logic here, e.g., call backend API
    console.log('Logging in with:', formData)
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
        Login
      </Typography>

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
        Login
      </Button>

      <Typography variant='body2' align='center' sx={{ mt: 2 }}>
        Don't have an account?{' '}
        <Link component={RouterLink} to='/register'>
          Register here
        </Link>
      </Typography>
    </Box>
  )
}
