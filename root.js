import React from 'react'
import ReactDOM from 'react-dom'
import urlDialog from './urlDialog'

class root extends React.Component {
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
      'root'
    )
  }
}

export default root
