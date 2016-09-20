import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import wxtilesjs from './wxtiles'

class legend extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.url = null
  }

  componentWillMount() {
    wxtilesjs.getLegendUrl({
      layerId: this.props.layerId,
      instanceId: this.props.instanceId,
      onSuccess: (legendUrl) => {
        this.setState({url: legendUrl})
      },
      onError: (err) => {
        console.log(err)
      }
    })
  }

  render() {
    return React.createElement('div', {className: 'legend'},
      React.createElement('div', {}, this.props.label),
      this.state.url && React.createElement('img', {src: this.state.url})
    )
  }
}

export default legend
