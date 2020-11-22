import { AppState } from '../redux/types'

/**
 * Load App state from the local storage if it exists
 */
export const loadState = () => {
  try {
    const serializedAppState = localStorage.getItem('MY_SIMPLE_EDITOR')
    return serializedAppState
      ? (JSON.parse(serializedAppState) as AppState)
      : undefined
  } catch (error) {
    return undefined
  }
}

/**
 * Save App state to the local storage
 * @param state
 */
export const saveState = (state: AppState) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('MY_SIMPLE_EDITOR', serializedState)
  } catch (error) {}
}
