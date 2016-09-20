import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import legend from '../legend'

class legends extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
  }

  render() {
    return React.createElement('div', {className: 'legends'},
      _.map(this.props.legends, (legendDatums) => {
        return React.createElement('div', {key: legendDatums.instanceId},
          React.createElement(legend, {
            layerId: legendDatums.layerId,
            instanceId: legendDatums.instanceId,
            label: legendDatums.label
          })
        )
      })
    )
  }
}

export default legends
