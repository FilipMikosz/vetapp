import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Box, Button, TextField, Typography, Link, Alert } from '@mui/material'

export default function LoginForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.')
      setSuccess('')
      return
    }

    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed.')
        setSuccess('')
        return
      }
      navigate('/dashboard')
      // Login successful
      console.log('Login successful:', data)

      localStorage.setItem('token', data.token)

      setSuccess('Login successful!')
      setError('')
    } catch (err) {
      console.error(err)
      setError('Network error or server is down.')
      setSuccess('')
    }
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
