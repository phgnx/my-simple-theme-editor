import { AppState } from '../../redux/types'
import { selectRefsFromVariable } from '../../redux/selectors'

export const typeValidationRegexp = {
  em: /^\d+(\.\d+)?$/,
  px: /^\d+(\.\d+)?$/,
  color: /^#[0-9a-fA-F]{6}$/,
}

/**
 * Extract the list of all variables mentioned in the raw input
 * @param rawInput
 */
export function extractRefs(rawInput: string) {
  const rawRefs = rawInput.match(/\{(\w+.\w+)\}/g)
  if (!rawRefs) {
    return []
  }
  return rawRefs.map((res) => res.replace(/[{}]/g, ''))
}

/**
 * Replace the references from the raw input by their value
 * @param rawInput
 * @param refs
 * @param state
 */
export function removeRefs(rawInput: string, refs: string[], state: AppState) {
  let rawInputWithoutRef = rawInput
  refs.forEach((ref) => {
    rawInputWithoutRef = rawInputWithoutRef.replace(
      `{${ref}}`,
      state[ref].computedValue
    )
  })
  return rawInputWithoutRef
}

/**
 * Validation function for a raw text input, ensuring no cross reference, no unknown variable reference
 * and applying the field type associated validation on top
 * @param name
 * @param rawInput
 * @param state
 */
export function validateTextRawInput(
  name: string,
  rawInput: string,
  state: AppState
): { isValid: boolean; value: string; rawValue: string; errors: string[] } {
  const refs = extractRefs(rawInput)
  const refsValid = validateRefxExists(refs, state)
  let rawInputWithoutRefs = rawInput
  if (refsValid.isValid) {
    if (hasCrossRefs(name, refs, state)) {
      refsValid.isValid = false
      refsValid.errors.push(`Cross reference found`)
    } else {
      rawInputWithoutRefs = removeRefs(rawInput, refs, state)
      const validationRegexp = typeValidationRegexp[state[name].type]
      const isInputValid = !!rawInputWithoutRefs.match(validationRegexp)
      if (!isInputValid) {
        refsValid.isValid = false
        refsValid.errors.push(
          `Invalid text input, resolved value ${rawInputWithoutRefs} doesn't match ${validationRegexp}`
        )
      }
    }
  }
  return {
    isValid: refsValid.isValid,
    value: rawInputWithoutRefs,
    rawValue: rawInput,
    errors: refsValid.errors,
  }
}

/**
 * Ensure that all the refs exists
 * @param refs
 * @param state
 */
export function validateRefxExists(
  refs: string[],
  state: AppState
): { isValid: boolean; errors: string[] } {
  let isValid = true
  const errors: string[] = []
  refs.forEach((ref) => {
    if (!state[ref]) {
      isValid = false
      errors.push(`${ref} variable doesn't exist`)
    }
  })
  return { isValid: isValid, errors: errors }
}

/**
 * This function ensures that there is no cross reference between the variables
 * ex : if sizes.h1 depends on sizes.h2, sizes.h2 can't depend on sizes.h1
 * @param name
 * @param refs
 * @param state
 */
export function hasCrossRefs(
  name: string,
  refs: string[],
  state: AppState
): boolean {
  if (refs.length === 0) {
    return false
  } else if (refs.find((ref) => ref === name)) {
    return true
  }
  return refs.some((ref) => {
    return hasCrossRefs(name, selectRefsFromVariable(state, ref), state)
  })
}
