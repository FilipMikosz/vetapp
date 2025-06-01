import React, { useState, useEffect } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

interface Owner {
  id: number
  first_name: string
  last_name: string
  email: string
  created_at: string
}

const mockData: Owner[] = [
  {
    id: 1,
    first_name: 'Anna',
    last_name: 'Kowalska',
    email: 'anna.kowalska@example.com',
    created_at: '2024-01-10',
  },
  {
    id: 2,
    first_name: 'Marek',
    last_name: 'Nowak',
    email: 'marek.nowak@example.com',
    created_at: '2023-12-15',
  },
  {
    id: 3,
    first_name: 'Julia',
    last_name: 'Wiśniewska',
    email: 'julia.w@example.com',
    created_at: '2024-03-20',
  },
]

export default function ClientTable() {
  const [owners, setOwners] = useState<Owner[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Replace this with real fetch in production
    setOwners(mockData)
  }, [])

  const filteredOwners = owners.filter((owner) =>
    `${owner.first_name} ${owner.last_name} ${owner.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <Box p={2}>
      <TextField
        fullWidth
        variant='outlined'
        label='Search by id / name / email / registration date'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Imię</TableCell>
              <TableCell>Nazwisko</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Data rejestracji</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOwners.map((owner) => (
              <TableRow key={owner.id}>
                <TableCell>{owner.id}</TableCell>
                <TableCell>{owner.first_name}</TableCell>
                <TableCell>{owner.last_name}</TableCell>
                <TableCell>{owner.email}</TableCell>
                <TableCell>{owner.created_at}</TableCell>
              </TableRow>
            ))}
            {filteredOwners.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align='center'>
                  Brak wyników.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
