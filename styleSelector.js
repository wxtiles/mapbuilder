import React from 'react'
import ReactDOM from 'react-dom'
import wxtilesjs from './wxtiles'
import { Select } from 'antd'
import 'antd/lib/select/style/css'

const Option = Select.Option

class styleSelector extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.url = null
  }

  componentWillMount() {
    wxtilesjs.getLegendUrl({
      layerId: this.props.layerId,
      styleId: this.props.styleId,
      onSuccess: (legendUrl) => {
        this.setState({url: legendUrl})
      },
      onError: (err) => {
        console.log(err)
      }
    })
  }
  loadingError() {
    this.setState({url: null})
  }

  onStyleChange(value) {
    console.log(`style checked: ${value}`)
    // this.setState({})
  }

  render() {
    return React.createElement(Select, {defaultValue: 'default-legend', onChange: this.onStyleChange, style: {width: '100%'}},
      React.createElement(Option, {className: 'styleSelectPreview', value: 'default-legend'}, React.createElement('img', {src: this.state.url, onError: this.loadingError}))
    )
  }
}

export default styleSelector
