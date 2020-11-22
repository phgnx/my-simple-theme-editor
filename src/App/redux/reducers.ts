import { AppActionTypes, AppState, UpdateVariablePayload } from './types'
import { extractRefs, removeRefs } from '../components/EditionPanel/helpers'
import { initialState } from './initalState'

/**
 * Main reducer of the application
 * @param state
 * @param action
 * @constructor
 */
export const AppReducer = (
  state = initialState,
  action: AppActionTypes
): AppState => {
  switch (action.type) {
    case 'UPDATE_VARIABLE':
      return updateVariableReducer(state, action.payload)
    default:
      return state
  }
}

/**
 * Update variable reducer
 * Will compute the new value, update parent references, and update all children
 * @param state
 * @param payload
 */
export const updateVariableReducer = (
  state: AppState,
  payload: UpdateVariablePayload
) => {
  const stateCopy = { ...state }
  const variableName = payload.name
  const currentVariable = stateCopy[variableName]
  let newRefs: string[] = []
  const rawValue = payload.rawValue
  let computedValue = rawValue
  //UPDATE PARENTS ( ADD NEW ONES AND REMOVE PREVIOUS)
  if (payload.type === 'text') {
    newRefs = extractRefs(rawValue)
    computedValue = removeRefs(rawValue, newRefs, state)
    //Add new referenceBy where it's needed
    newRefs.forEach((ref) => {
      stateCopy[ref] = {
        ...stateCopy[ref],
        referencedBy: [...stateCopy[ref].referencedBy, variableName],
      }
    })
  } else if (payload.type === 'px') {
    currentVariable.type = 'px'
  } else if (payload.type === 'em') {
    currentVariable.type = 'em'
  }
  //Clear previous referenceBy if no longer relevant
  currentVariable.refs.forEach((ref) => {
    if (!newRefs.includes(ref)) {
      stateCopy[ref] = {
        ...stateCopy[ref],
        referencedBy: stateCopy[ref].referencedBy.filter(
          (ref) => ref !== variableName
        ),
      }
    }
  })
  //UPDATE VARIABLE
  stateCopy[variableName] = {
    ...currentVariable,
    refs: newRefs,
    rawValue,
    computedValue,
  }
  //UPDATE CHILDREN AND RETURN THE UPDATED STATE
  return getDirectAndTransitiveUpdatedChildren(stateCopy, variableName)
}

/**
 * Recursively get all updated direct and transitive children impacted by the initial change
 * @param stateCopy
 * @param updatedVariableName
 */
export const getDirectAndTransitiveUpdatedChildren = (
  stateCopy: AppState,
  updatedVariableName: string
) => {
  stateCopy[updatedVariableName].referencedBy.forEach((ref) => {
    stateCopy[ref] = {
      ...stateCopy[ref],
      computedValue: removeRefs(
        stateCopy[ref].rawValue,
        stateCopy[ref].refs,
        stateCopy
      ),
    }
    stateCopy = getDirectAndTransitiveUpdatedChildren(stateCopy, ref)
  })
  return stateCopy
}
