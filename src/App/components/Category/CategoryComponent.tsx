import React from 'react'
import { AppState, Variable } from '../../redux/types'
import { selectVariablesFromCategory } from '../../redux/selectors'
import { connect } from 'react-redux'
import VariableComponent from '../VariableComponent/VariableComponent'

interface CategoryProps {
  categoryName: string
  variables: Variable[]
}

const mapStateToProps = (
  state: AppState,
  ownProps: { categoryName: string }
) => ({
  variables: selectVariablesFromCategory(state, ownProps.categoryName),
})

const CategoryComponent: React.FC<CategoryProps> = ({
  categoryName,
  variables,
}) => {
  const variablesDisplay = variables.map((variable) => {
    return <VariableComponent key={variable.name} variable={variable} />
  })
  return (
    <div className="category">
      <h2>{categoryName} </h2>
      {variablesDisplay}
    </div>
  )
}

export default connect(mapStateToProps)(CategoryComponent)
