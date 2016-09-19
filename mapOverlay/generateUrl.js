import React from 'react'
import ReactDOM from 'react-dom'

class generateUrl extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
  }

  render() {
    return React.createElement('div', {className: 'generateUrl'},
      React.createElement('div', {className: 'btn btn-primary'}, 'Get URL for this map')
    )
  }
}

export default generateUrl
