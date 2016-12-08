import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { Select } from 'antd'
import 'antd/lib/select/style/css'
import styleOption from './styleOption'

const Option = Select.Option

class styleSelector extends React.Component {
  constructor() {
    super()
    this.state = {defaultValue: null}
    this.onStyleChange = this.onStyleChange.bind(this)
  }

  componentWillMount() {
  }

  onStyleChange(value) {
    console.log(`style changed: ${value}`)
    this.props.selectStyle({layerId: this.props.layerId, styleId: value})
    this.setState({defaultValue: value})
  }

  render() {
    console.log(this.state)
    var defaultValue = this.state.defaultValue ? this.state.defaultValue : this.props.styleId
    return React.createElement(Select, {value: this.state.defaultValue, onChange: this.onStyleChange, style: {width: '100%'}},
      _.map(this.props.styles, (style, key) => {
        return React.createElement(Option, {className: 'styleSelectPreview', value: style.id, key: style.id + ' ' + key},
          // TODO style name, description?
          style.hasLegend && React.createElement(styleOption, {
            styleId: style.id,
            layerId: this.props.layerId
            // description: style.description
          })
        )
      })
    )
  }
}

export default styleSelector
