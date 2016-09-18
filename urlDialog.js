import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import {ModalContainer, ModalDialog} from 'react-modal-dialog'

class urlDialog extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.url = null
    this.state.apiKey = null
    this.updateApiKey = this.updateApiKey.bind(this)
    this.generateUrl = this.generateUrl.bind(this)
  }

  componentWillMount() {
  }

  updateApiKey(e) {
    this.setState({apiKey: e.target.value})
  }

  generateUrl() {
    var jsonStringified = JSON.stringify({
      apiKey: this.state.apiKey,
      layerIds: this.props.layerIds
    })
    var base64EncodedDatums = btoa(jsonStringified)
    this.setState({url: 'https://superSecretShenanigans.com?datums=' + base64EncodedDatums})
  }

  render() {
    return React.createElement('div', {className: 'urlDialog'},
      React.createElement(ModalContainer, {onClose: this.props.close, zIndex: 1001},
        React.createElement(ModalDialog, {onClose: this.props.close},
          React.createElement('div', {},
            React.createElement('div', {className: 'glyphicon glyphicon-link'}),
            !this.state.url && React.createElement('div', {},
              React.createElement('div', {}, 'Please Enter your ApiKey: '),
              React.createElement('input', {onChange: this.updateApiKey}),
              React.createElement('button', {onClick: this.generateUrl, className: 'btn btn-primary'}, 'Generate Url')
            ),
            this.state.url && React.createElement('a', {href: this.state.url, target: '_blank'}, this.state.url)
          )
        )
      )
    )
  }
}

export default urlDialog
