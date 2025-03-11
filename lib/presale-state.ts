// This is a simple shared state service to ensure presale state is synchronized
// between different contexts

type Listener = () => void

interface PresaleState {
  isReleased: boolean
  isPaused: boolean
}

// Initial state
const state: PresaleState = {
  isReleased: false,
  isPaused: true,
}

// Check if we have stored state in localStorage
if (typeof window !== "undefined") {
  try {
    const storedState = localStorage.getItem("presaleState")
    if (storedState) {
      const parsedState = JSON.parse(storedState)
      state.isReleased = parsedState.isReleased
      state.isPaused = parsedState.isPaused
    }
  } catch (e) {
    console.error("Error loading presale state from localStorage:", e)
  }
}

const listeners: Listener[] = []

// Subscribe to state changes
export function subscribeToPresaleState(listener: Listener) {
  listeners.push(listener)
  return () => {
    const index = listeners.indexOf(listener)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }
}

// Get current state
export function getPresaleState(): PresaleState {
  return { ...state }
}

// Update state
export function updatePresaleState(newState: Partial<PresaleState>) {
  Object.assign(state, newState)

  // Save to localStorage for persistence
  if (typeof window !== "undefined") {
    localStorage.setItem("presaleState", JSON.stringify(state))
  }

  // Notify all listeners
  listeners.forEach((listener) => listener())
}

// Specific functions for common operations
export function releasePresale() {
  updatePresaleState({
    isReleased: true,
    isPaused: false,
  })
}

export function pausePresale() {
  updatePresaleState({
    isPaused: true,
  })
}

export function unpausePresale() {
  updatePresaleState({
    isPaused: false,
  })
}

