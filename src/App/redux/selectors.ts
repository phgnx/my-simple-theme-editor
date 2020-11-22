import { AppState, Variable } from './types'

//TODO createSelector check memoized
/**
 * Select all categories
 * @param state
 */
export const selectCategories = (state: AppState) => {
  const categories: string[] = []
  Object.keys(state).forEach((variableName) => {
    const category = state[variableName].category
    if (categories.indexOf(category) < 0) {
      categories.push(category)
    }
  })
  return categories
}

/**
 * Select variables associated to a specific category
 * @param state
 * @param category
 */
export const selectVariablesFromCategory = (
  state: AppState,
  category: string
) => {
  const variables: Variable[] = []
  Object.keys(state).forEach((variableName) => {
    if (state[variableName].category === category) {
      variables.push(state[variableName])
    }
  })
  return variables
}

/** Select references from a variable */
export const selectRefsFromVariable = (state: AppState, variableName: string) =>
  state[variableName].refs
