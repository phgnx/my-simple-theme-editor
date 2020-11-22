import React from 'react'
import ThemeEditor from './components/ThemeEditor/ThemeEditorComponent'
import { Provider } from 'react-redux'
import { store } from './redux/store'

const AppComponent: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <ThemeEditor />
      </div>
    </Provider>
  )
}

export default AppComponent
