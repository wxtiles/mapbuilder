import React from 'react'
import ReactDOM from 'react-dom'
import urlDialog from './urlDialog'

class generateUrl extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.isGeneratingUrl = false
    this.openDialog = this.openDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
  }

  componentWillMount() {
  }

  openDialog() {
    this.setState({isGeneratingUrl: true})
  }

  closeDialog() {
    this.setState({isGeneratingUrl: false})
  }

  render() {
    return React.createElement('div', {className: 'generateUrl'},
      this.state.isGeneratingUrl && React.createElement(urlDialog, {close: this.closeDialog, layers: this.props.layers}),
      React.createElement('div', {onClick: this.openDialog, className: 'btn btn-primary'}, 'Generate URL for this map')
    )
  }
}

export default generateUrl
