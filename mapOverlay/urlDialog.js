import React from 'react'
import {ModalContainer, ModalDialog} from 'react-modal-dialog'

class urlDialog extends React.Component {
  constructor() {
    super()
    this.generateUrl = this.generateUrl.bind(this)
  }

  componentWillMount() {
  }

  generateUrl() {
    var urlParams = {
      apiKey: this.props.apikey,
      mapDatums: this.props.urlDatums
    }
    console.log(urlParams)
    var jsonStringified = JSON.stringify(urlParams)
    var base64EncodedDatums = btoa(jsonStringified)
    return 'https://wxtiles.github.io/wxtiles-map/?datums=' + base64EncodedDatums
  }

  render() {
    var url = this.generateUrl()
    return React.createElement('div', {className: 'urlDialog'},
      React.createElement(ModalContainer, {onClose: this.props.close, zIndex: 1001},
        React.createElement(ModalDialog, {onClose: this.props.close},
          React.createElement('div', {className: 'dialog'},
            React.createElement('div', {className: 'glyphiconContainer'},
              React.createElement('div', {className: 'glyphicon glyphicon-link'})
            ),
            React.createElement('div', {className: 'url'},
              React.createElement('a', {href: url, target: '_blank'}, 'Click here for a link to your map.'),
              React.createElement('div', {}, 'You can share this link and the map will automatically stay current.')
            )
          )
        )
      )
    )
  }
}

export default urlDialog
