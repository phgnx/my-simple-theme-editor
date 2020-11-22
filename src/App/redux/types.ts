/** Update variable type string */
export const UPDATE_VARIABLE = 'UPDATE_VARIABLE'

/**
 * Update variable action payload
 */
export interface UpdateVariablePayload {
  name: string
  rawValue: string
  type: string
}

/**
 * Update variable interface to call the action
 */
export interface UpdateVariable {
  type: typeof UPDATE_VARIABLE
  payload: UpdateVariablePayload
}

/**
 * Describes the Variable interface that will be used to the store
 */
export interface Variable {
  description: string
  category: string
  name: string
  type: 'px' | 'em' | 'color'
  computedValue: string
  rawValue: string
  refs: string[]
  referencedBy: string[]
}

/**
 * Describes the App state, we chose he to go for a flat map of Variables
 */
export interface AppState {
  [key: string]: Variable
}
export type AppActionTypes = UpdateVariable
