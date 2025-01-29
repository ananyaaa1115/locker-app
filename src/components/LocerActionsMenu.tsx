import { Menu, MenuItem } from "@mui/material"
import type { LockerState } from "../types/locker"

interface LockerActionsMenuProps {
  anchorEl: HTMLElement | null
  onClose: () => void
  onStateChange: (state: LockerState) => void
}

export default function LockerActionsMenu({ anchorEl, onClose, onStateChange }: LockerActionsMenuProps) {
  const handleStateChange = (state: LockerState) => {
    onStateChange(state)
    onClose()
  }

  return (
    <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={onClose}
  >
      <MenuItem onClick={() => handleStateChange("open")}>Open</MenuItem>
      <MenuItem onClick={() => handleStateChange("closed")}>Close</MenuItem>
      <MenuItem onClick={() => handleStateChange("reserved")}>Reserve</MenuItem>
    </Menu>
  )
}

