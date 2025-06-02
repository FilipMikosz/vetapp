import { useState, useEffect } from 'react'
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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AnimalRecordsViewer from './AnimalRecordsViewer' // import your component here

interface Owner {
  id: number
  first_name: string
  last_name: string
  email: string
  created_at: string
}

export default function ClientTable() {
  const [owners, setOwners] = useState<Owner[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)

  useEffect(() => {
    fetch('http://localhost:3000/api/users/getusers')
      .then((res) => res.json())
      .then((data) => setOwners(data))
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
              <TableCell>Name</TableCell>
              <TableCell>Surname</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Registration Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOwners.map((owner) => (
              <TableRow
                key={owner.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => setSelectedOwner(owner)}
              >
                <TableCell>{owner.id}</TableCell>
                <TableCell>{owner.first_name}</TableCell>
                <TableCell>{owner.last_name}</TableCell>
                <TableCell>{owner.email}</TableCell>
                <TableCell>{owner.created_at.slice(0, 10)}</TableCell>
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

      {/* Modal popup for animals and records */}
      <Dialog
        open={!!selectedOwner}
        onClose={() => setSelectedOwner(null)}
        fullWidth
        maxWidth='xl'
        scroll='paper'
      >
        <DialogTitle>
          Zwierzęta właściciela: {selectedOwner?.first_name}{' '}
          {selectedOwner?.last_name}
          <IconButton
            aria-label='close'
            onClick={() => setSelectedOwner(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedOwner && (
            <AnimalRecordsViewer
              userId={selectedOwner.id}
              open={!!selectedOwner}
              onClose={() => setSelectedOwner(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}
