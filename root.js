import React from 'react'
import ReactDOM from 'react-dom'
import EventEmitter from 'event-emitter'
import wxtiles from './wxtiles'
import select from 'react-select'

class root extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.selectedLayer = null
    this.eventEmitter = EventEmitter({})
  }

  componentWillMount() {
    this.eventEmitter.on('selectedLayer', (layerId) => {
      console.log(layerId)
    })

    this.eventEmitter.emit('selectedLayer', {testProps: 2})

    wxtiles.getAllLayers((err, res) => {
      console.log(root)
    })
  }

  render() {
    console.log(this.state)
    return React.createElement(`div`, null,
      React.createElement(`div`, null,
        React.createElement(`div`, null, `Pick a layer`),
        React.createElement(select)
      )
    )
  }
}

export default root
