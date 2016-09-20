import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

class legends extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
  }

  render() {
    return React.createElement('div', {className: 'legends'},
      _.map(this.props.legends, (legend) => {
        return React.createElement('div', {key: legend.url},
          React.createElement('div', {}, legend.label),
          React.createElement('div', {}, legend.url)
        )
      })
    )
  }
}

export default legends
