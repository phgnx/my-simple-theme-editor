import { createStore } from 'redux'
import { AppReducer } from './reducers'
import { loadState, saveState } from '../utils/localstorage'
import { initialState } from './initalState'

export const localStorageState = loadState()
//Load state either from local storage if found, either use the initial default one
export const store = createStore(
  AppReducer,
  localStorageState ? localStorageState : initialState
)

//Save state to the local storage on any update
store.subscribe(() => {
  saveState(store.getState())
})
