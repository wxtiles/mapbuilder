import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import wxtilesjs from './wxtiles'
import { Select } from 'antd'
import 'antd/lib/select/style/css'

class styleOption extends React.Component {
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

  render() {
    return React.createElement('img', {src: this.state.url, onError: this.loadingError})
  }
}

export default styleOption
