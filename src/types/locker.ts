export type LockerState = "open" | "reserved" | "closed"

export interface Locker {
  id: number
  state: LockerState
}

export interface LockerGrid {
  rows: number
  columns: number
  lockers: Record<number, Locker>
}

