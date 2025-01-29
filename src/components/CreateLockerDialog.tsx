
import { useState } from "react"
import { Dialog, DialogTitle, DialogContent, TextField, Button, Box, styled } from "@mui/material"

const BackdropImage = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20250129_103121-zivZvlHVwelgPE6wqDnAJC6BvaEW7L.png')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  filter: "blur(8px)",
})

interface CreateLockerDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (rows: number, columns: number) => void
}

export default function CreateLockerDialog({ open, onClose, onSubmit }: CreateLockerDialogProps) {
  const [rows, setRows] = useState("")
  const [columns, setColumns] = useState("")

  const handleSubmit = () => {
    const rowNum = Number.parseInt(rows)
    const colNum = Number.parseInt(columns)
    if (rowNum > 0 && colNum > 0) {
      onSubmit(rowNum, colNum)
      onClose()
      setRows("")
      setColumns("")
    }
  }

  return (
    <>
      {open && <BackdropImage />}
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            boxShadow: "none",
            width: "400px",
            maxWidth: "90%",
            borderRadius: "8px",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <DialogTitle
            sx={{
              textAlign: "center",
              fontSize: "1.2rem",
              pb: 2,
              pt: 0,
            }}
          >
            Create your locker
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                placeholder="Number of rows"
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                type="number"
                fullWidth
                variant="outlined"
                InputProps={{
                  sx: { bgcolor: "#fff" },
                }}
              />
              <TextField
                placeholder="Number of columns"
                value={columns}
                onChange={(e) => setColumns(e.target.value)}
                type="number"
                fullWidth
                variant="outlined"
                InputProps={{
                  sx: { bgcolor: "#fff" },
                }}
              />
              <Button
                onClick={handleSubmit}
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  py: 1.5,
                  mt: 1,
                }}
              >
                Create Locker
              </Button>
            </Box>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  )
}

