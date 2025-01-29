import { useState, useEffect } from "react"
import { Box, Button, Paper, Typography, Grid, CircularProgress, styled } from "@mui/material"
import CreateLockerDialog from "./components/CreateLockerDialog"
import LockerActionsMenu from "./components/LocerActionsMenu"
import type { LockerGrid, LockerState } from "./types/locker"
import { saveToStorage, loadFromStorage } from "./utils/storage"

const BackgroundContainer = styled(Box)({
  backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20250129_103121-zivZvlHVwelgPE6wqDnAJC6BvaEW7L.png')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

const ContentContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: 1200,
  margin: "auto",
}))

const StatusDot = styled("div")(({ color }: { color: string }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: color,
  border: color === "#FFFFFF" ? "1px solid #E5E7EB" : "none",
}))

export default function App() {
  const [grid, setGrid] = useState<LockerGrid | null>(null)
  const [dialogOpen, setDialogOpen] = useState(true)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedLocker, setSelectedLocker] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedGrid = loadFromStorage()
    if (savedGrid) {
      setGrid(savedGrid)
      setDialogOpen(false)
    }
    setLoading(false)
  }, [])

  const handleCreateGrid = (rows: number, columns: number) => {
    const newGrid: LockerGrid = {
      rows,
      columns,
      lockers: {},
    }

    for (let i = 1; i <= rows * columns; i++) {
      newGrid.lockers[i] = {
        id: i,
        state: "closed",
      }
    }

    setGrid(newGrid)
    saveToStorage(newGrid)
    setDialogOpen(false)
  }

  const handleLockerClick = (event: React.MouseEvent<HTMLElement>, lockerId: number) => {
    setAnchorEl(event.currentTarget)
    setSelectedLocker(lockerId)
  }

  const handleStateChange = (state: LockerState) => {
    if (grid && selectedLocker) {
      const newGrid = {
        ...grid,
        lockers: {
          ...grid.lockers,
          [selectedLocker]: {
            ...grid.lockers[selectedLocker],
            state,
          },
        },
      }
      setGrid(newGrid)
      saveToStorage(newGrid)
    }
  }

  const handleRowAction = (rowIndex: number, state: LockerState) => {
    if (!grid) return

    const newGrid = { ...grid }
    for (let col = 0; col < grid.columns; col++) {
      const lockerId = rowIndex * grid.columns + col + 1
      newGrid.lockers[lockerId] = {
        ...newGrid.lockers[lockerId],
        state,
      }
    }

    setGrid(newGrid)
    saveToStorage(newGrid)
  }

  const getLockerColor = (state: LockerState) => {
    switch (state) {
      case "reserved":
        return "#FFE4D6"
      case "open":
        return "#E8F3D6"
      default:
        return "#FFFFFF"
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <BackgroundContainer>
      <ContentContainer>
        <Typography variant="h6" sx={{ color: "grey.500", mb: 3 }}>
          Lockers.
        </Typography>

        {grid && (
          <Grid container spacing={1}>
            {Array.from({ length: grid.rows }, (_, rowIndex) => (
              <Grid container item spacing={1} key={rowIndex}>
                <Grid item xs={2} sm={1}>
                  <Button
                    size="small"
                    onClick={() => handleRowAction(rowIndex, "reserved")}
                    sx={{
                      fontSize: "0.75rem",
                      color: "primary.main",
                      border: "1px solid",
                      borderColor: "primary.main",
                      "&:hover": {
                        bgcolor: "rgba(255,87,34,0.04)",
                      },
                      whiteSpace: "nowrap",
                      minWidth: "auto",
                      px: 1,
                    }}
                  >
                    Select Row
                  </Button>
                </Grid>
                {Array.from({ length: grid.columns }, (_, colIndex) => {
                  const lockerId = rowIndex * grid.columns + colIndex + 1
                  const locker = grid.lockers[lockerId]
                  return (
                    <Grid item xs={2} key={colIndex}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: "center",
                          cursor: "pointer",
                          bgcolor: getLockerColor(locker.state),
                          transition: "background-color 0.3s",
                          border: "1px solid",
                          borderColor: "grey.200",
                          boxShadow: "none",
                          borderRadius: "4px",
                          "&:hover": {
                            opacity: 0.8,
                          },
                        }}
                        onClick={(e) => handleLockerClick(e, locker.id)}
                      >
                        {locker.id}
                      </Paper>
                    </Grid>
                  )
                })}
              </Grid>
            ))}
          </Grid>
        )}

        <CreateLockerDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={handleCreateGrid} />

        <LockerActionsMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} onStateChange={handleStateChange} />

        {grid && (
          <Box sx={{ mt: 4, display: "flex", gap: 2, alignItems: "center", justifyContent: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <StatusDot color="#E8F3D6" />
              <Typography sx={{ fontSize: "0.875rem", color: "grey.500" }}>Reserved</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <StatusDot color="#FFFFFF" />
              <Typography sx={{ fontSize: "0.875rem", color: "grey.500" }}>Open</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <StatusDot color="#FFE4D6" />
              <Typography sx={{ fontSize: "0.875rem", color: "grey.500" }}>Selected</Typography>
            </Box>
          </Box>
        )}
      </ContentContainer>
    </BackgroundContainer>
  )
}

