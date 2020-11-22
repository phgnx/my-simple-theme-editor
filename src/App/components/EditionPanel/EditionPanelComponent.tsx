import React, { ChangeEvent, useState } from 'react'
import { AppState, UpdateVariable, Variable } from '../../redux/types'
import { useForm } from 'react-hook-form'
import { validateTextRawInput, typeValidationRegexp } from './helpers'
import { connect, ConnectedProps } from 'react-redux'
import './style.css'

const mapDispatchToProps = {
  updateVariable: (name: string, rawValue: string, type: string) =>
    ({
      type: 'UPDATE_VARIABLE',
      payload: { name, rawValue, type },
    } as UpdateVariable),
}
const mapStateToProps = (state: AppState) => ({
  state: state,
})
const connector = connect(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

type EditionPanelProps = PropsFromRedux & {
  variable: Variable
}
const EditionPanelComponent: React.FC<EditionPanelProps> = ({
  variable,
  state,
  updateVariable,
}) => {
  const [selectedOption, setSelectedOption] = useState('text')
  const { register, handleSubmit, errors } = useForm({
    mode: 'onSubmit',
  })
  const validate = (value: string) => {
    if (selectedOption === 'em') {
      return (
        !!value.match(typeValidationRegexp.em) ||
        `Invalid input for em, expected format : ${typeValidationRegexp.em}`
      )
    } else if (selectedOption === 'px') {
      return (
        !!value.match(typeValidationRegexp.px) ||
        `Invalid input for px, expected format : ${typeValidationRegexp.px}`
      )
    } else if (selectedOption === 'color') {
      return (
        !!value.match(typeValidationRegexp.color) ||
        `Invalid input for em, expected format : ${typeValidationRegexp.color}`
      )
    } else {
      const result = validateTextRawInput(variable.name, value, state)
      return result.isValid || result.errors.join(' - ')
    }
  }
  const onSubmit = (data: { value: string }) => {
    updateVariable(variable.name, data.value, selectedOption)
  }
  const handleRadioChange = (changeEvent: ChangeEvent<{ value: string }>) => {
    setSelectedOption(changeEvent.target.value)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <label>
        Value
        <input
          type="text"
          name="value"
          defaultValue={variable.rawValue}
          ref={register({ validate })}
        />
        {errors.value && <span className="error">{errors.value.message})</span>}
      </label>
      <div>
        <span className="radio">
          <label>
            <input
              type="radio"
              value="text"
              checked={selectedOption === 'text'}
              onChange={handleRadioChange}
            />
            text
          </label>
        </span>
        {variable.type !== 'color' ? (
          <span className="radio">
            <label>
              <input
                type="radio"
                value="em"
                checked={selectedOption === 'em'}
                onChange={handleRadioChange}
              />
              em
            </label>
          </span>
        ) : null}
        {variable.type !== 'color' ? (
          <span className="radio">
            <label>
              <input
                type="radio"
                value="px"
                checked={selectedOption === 'px'}
                onChange={handleRadioChange}
              />
              px
            </label>
          </span>
        ) : null}
        {variable.type === 'color' ? (
          <span className="radio">
            <label>
              <input
                type="radio"
                value="color"
                checked={selectedOption === 'color'}
                onChange={handleRadioChange}
              />
              color
            </label>
          </span>
        ) : null}
      </div>
      <input type="submit" value="OK" />
    </form>
  )
}

export default connector(EditionPanelComponent)
