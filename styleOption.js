import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { Select } from 'antd'
import 'antd/lib/select/style/css'

class StyleOption extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return React.createElement('div', {},
      React.createElement('div', {className: 'styleName'}, this.props.name),
      this.props.hasLegend && React.createElement('img', {src: this.props.url, onError: this.loadingError})
    )
  }
}

export default StyleOption
