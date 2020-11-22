import {
  extractRefs,
  hasCrossRefs,
  removeRefs,
  validateRefxExists,
  validateTextRawInput,
} from './helpers'
import { AppState } from '../../redux/types'

describe('Validation helpers ', () => {
  const fakeState: AppState = {
    'colors.highlight2': {
      name: 'colors.highlight2',
      computedValue: '#ffab40',
      description: 'Highlight on secondary background',
      refs: ['colors.highlight1'],
      referencedBy: [],
      category: 'General Colors',
      rawValue: '{colors.highlight1}',
      type: 'color',
    },
    'colors.highlight1': {
      name: 'colors.highlight1',
      computedValue: '#ffab40',
      description: 'Highlight on secondary background',
      refs: [],
      referencedBy: ['colors.highlight2'],
      category: 'General Colors',
      rawValue: '#ffab40',
      type: 'color',
    },
    'sizes.text': {
      name: 'sizes.text',
      computedValue: '1.1',
      description: 'Default text size',
      refs: [],
      referencedBy: [],
      category: 'Global Sizes',
      rawValue: '1.1',
      type: 'em',
    },
  }

  it('ExtractRefs should extract all the variables from the rawInput given', () => {
    expect(extractRefs('')).toStrictEqual([])
    expect(extractRefs('string{}string')).toStrictEqual([])
    expect(extractRefs('ababa{my.var}dsjks')).toStrictEqual(['my.var'])
    expect(extractRefs('{my.var1}fkdl{my.var2}')).toStrictEqual([
      'my.var1',
      'my.var2',
    ])
    expect(extractRefs('{a.a.a}')).toStrictEqual([])
    expect(extractRefs('{a..a}')).toStrictEqual([])
  })

  it('RemoveRefs should replace all refs by their value inside the rawInput', () => {
    expect(removeRefs('', [], {})).toStrictEqual('')
    expect(
      removeRefs('{colors.highlight2}', ['colors.highlight2'], fakeState)
    ).toStrictEqual('#ffab40')
    expect(
      removeRefs(
        '{colors.highlight2} and {sizes.text}',
        ['colors.highlight2', 'sizes.text'],
        fakeState
      )
    ).toStrictEqual('#ffab40 and 1.1')
  })

  it('hasCrossRef should ensure there is no cross reference created adding the new refs to the current variable', () => {
    expect(hasCrossRefs('colors.highlight1', [], fakeState)).toBeFalsy()
    expect(
      hasCrossRefs('colors.highlight1', ['colors.highlight1'], fakeState)
    ).toBeTruthy()
  })

  it('validateRefxExists should validate if all the refs exists', () => {
    expect(validateRefxExists([], fakeState)).toEqual({
      isValid: true,
      errors: [],
    })
    expect(
      validateRefxExists(['colors.highlight2', 'colors.highlight1'], fakeState)
    ).toEqual({
      isValid: true,
      errors: [],
    })
    expect(
      validateRefxExists(['colors.highlight2', 'unknown.color'], fakeState)
    ).toEqual({
      isValid: false,
      errors: [`unknown.color variable doesn't exist`],
    })
  })

  it('validateTextRawInput should validate the raw input properly, returning errors if not valid', () => {
    expect(
      validateTextRawInput('colors.highlight2', '#000000', fakeState)
    ).toEqual({
      isValid: true,
      value: '#000000',
      rawValue: '#000000',
      errors: [],
    })
    expect(
      validateTextRawInput('colors.highlight2', '#0000000', fakeState)
    ).toEqual({
      isValid: false,
      value: '#0000000',
      rawValue: '#0000000',
      errors: [
        `Invalid text input, resolved value #0000000 doesn't match /^#[0-9a-fA-F]{6}$/`,
      ],
    })
    expect(validateTextRawInput('sizes.text', '1.1', fakeState)).toEqual({
      isValid: true,
      value: '1.1',
      rawValue: '1.1',
      errors: [],
    })
    expect(validateTextRawInput('sizes.text', '1.1.1', fakeState)).toEqual({
      isValid: false,
      value: '1.1.1',
      rawValue: '1.1.1',
      errors: [
        `Invalid text input, resolved value 1.1.1 doesn't match /^\\d+(\\.\\d+)?$/`,
      ],
    })
    expect(
      validateTextRawInput(
        'colors.highlight2',
        '{colors.highlight1}',
        fakeState
      )
    ).toEqual({
      isValid: true,
      value: '#ffab40',
      rawValue: '{colors.highlight1}',
      errors: [],
    })
  })
})
