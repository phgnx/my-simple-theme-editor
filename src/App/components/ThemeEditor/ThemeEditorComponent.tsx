import React from 'react'
import Category from '../Category/CategoryComponent'
import { AppState } from '../../redux/types'
import { selectCategories } from '../../redux/selectors'
import { connect } from 'react-redux'

interface ThemeEditorProps {
  categories: string[]
}

const mapStateToProps = (state: AppState) => ({
  categories: selectCategories(state),
})

const ThemeEditorComponent: React.FC<ThemeEditorProps> = ({ categories }) => {
  const categoriesDisplay = categories.map((categoryName) => {
    return <Category key={categoryName} categoryName={categoryName} />
  })
  return (
    <div id="ThemeEditor">
      <h1>Simple theme editor</h1>
      {categoriesDisplay}
    </div>
  )
}

export default connect(mapStateToProps)(ThemeEditorComponent)
