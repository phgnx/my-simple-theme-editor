import { AppState } from './types'
import { updateVariableReducer } from './reducers'

fdescribe('Reducer tests ', () => {
  const fakeState: AppState = {
    'variable.parent1': {
      name: 'variable.parent1',
      computedValue: '#000001',
      description: 'Parent 1',
      refs: [],
      referencedBy: ['variable.current'],
      category: 'General Colors',
      rawValue: '#000001',
      type: 'color',
    },
    'variable.parent2': {
      name: 'variable.parent2',
      computedValue: '#000002',
      description: 'Parent 2',
      refs: [],
      referencedBy: [],
      category: 'General Colors',
      rawValue: '#000002',
      type: 'color',
    },
    'variable.current': {
      name: 'variable.current',
      computedValue: '#000001',
      description: 'Highlight on secondary background',
      refs: ['variable.parent1'],
      referencedBy: ['variable.child1', 'variable.child2'],
      category: 'General Colors',
      rawValue: '{variable.parent1}',
      type: 'color',
    },
    'variable.child1': {
      name: 'variable.child1',
      computedValue: '#000001',
      description: 'Child 1',
      refs: ['variable.current'],
      referencedBy: [],
      category: 'General Colors',
      rawValue: '{variable.current}',
      type: 'color',
    },
    'variable.child2': {
      name: 'variable.child2',
      computedValue: '#000001',
      description: 'Child 2',
      refs: ['variable.current'],
      referencedBy: ['variable.childOfChild2'],
      category: 'General Colors',
      rawValue: '{variable.current}',
      type: 'color',
    },
    'variable.childOfChild2': {
      name: 'variable.childOfChild2',
      computedValue: '#000001',
      description: 'Child of child 2',
      refs: ['variable.child2'],
      referencedBy: [],
      category: 'General Colors',
      rawValue: '{variable.child2}',
      type: 'color',
    },
  }

  it('UPDATE_VARIABLE should work as expected', () => {
    const newState = updateVariableReducer(fakeState, {
      name: 'variable.current',
      rawValue: '#000002',
      type: 'color',
    })
    //Should have cleaned the ref on parent 1
    expect(newState['variable.parent1'].referencedBy).toStrictEqual([])
    //Should have add the ref on parent 2
    expect(newState['variable.parent2'].referencedBy).toStrictEqual([])
    //New value should match parent 2
    expect(newState['variable.current'].computedValue).toStrictEqual('#000002')
    //Child 1 and 2 ref should be updated
    expect(newState['variable.child1'].computedValue).toStrictEqual('#000002')
    expect(newState['variable.child2'].computedValue).toStrictEqual('#000002')
    // childOfChild2 value should be updated
    expect(newState['variable.childOfChild2'].computedValue).toStrictEqual(
      '#000002'
    )
  })
})
