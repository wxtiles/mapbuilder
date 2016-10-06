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
    var urlParams = {
      apiKey: this.state.apiKey,
      mapDatums: this.props.urlDatums
    }
    console.log(urlParams)
    var jsonStringified = JSON.stringify(urlParams)
    var base64EncodedDatums = btoa(jsonStringified)
    this.setState({url: 'https://wxtiles.github.io/wxtiles-map/?datums=' + base64EncodedDatums})
  }

  render() {
    return React.createElement('div', {className: 'urlDialog'},
      React.createElement(ModalContainer, {onClose: this.props.close, zIndex: 1001},
        React.createElement(ModalDialog, {onClose: this.props.close},
          React.createElement('div', {className: 'dialog'},
            React.createElement('div', {className: 'glyphiconContainer'},
              React.createElement('div', {className: 'glyphicon glyphicon-link'})
            ),
            !this.state.url && React.createElement('form-horizontal', {},
              React.createElement('div', {className: 'form-group'},
                React.createElement('label', {className: 'col-sm-2'}, 'ApiKey'),
                React.createElement('div', {className: 'col-sm-10'},
                  React.createElement('input', {onChange: this.updateApiKey, className: 'form-control'})
                )
              ),
              React.createElement('div', {className: 'form-group'},
                React.createElement('div', {className: 'col-sm-offset-2 col-sm-10'},
                  React.createElement('button', {onClick: this.generateUrl, className: 'btn btn-primary'}, 'Generate Url')
                )
              )
            ),
            this.state.url && React.createElement('div', {className: 'url'},
              React.createElement('a', {href: this.state.url, target: '_blank'}, 'Click here for the map')
            )
          )
        )
      )
    )
  }
}

export default urlDialog
