import React, { useState } from 'react'
import './style.css'
import EditionPanelComponent from '../EditionPanel/EditionPanelComponent'
import { Variable } from '../../redux/types'

interface VariableProps {
  variable: Variable
}

const VariableComponent: React.FC<VariableProps> = ({ variable }) => {
  const [edition, setEdition] = useState(false)
  const handleClickCategory = () => {
    setEdition(!edition)
  }
  return (
    <div>
      <div className="variable" onClick={handleClickCategory}>
        {' '}
        {variable.description} : {variable.computedValue}
        <span className="variableName">{variable.name}</span>
      </div>
      {edition ? (
        <EditionPanelComponent variable={variable}></EditionPanelComponent>
      ) : null}
    </div>
  )
}

export default VariableComponent
