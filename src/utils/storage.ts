import type { LockerGrid } from "../types/locker"

const STORAGE_KEY = "locker_grid"

export const saveToStorage = (grid: LockerGrid) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(grid))
}

export const loadFromStorage = (): LockerGrid | null => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

