import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import rcSlider from 'rc-slider'
import moment from momentjs

class timeSelector extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.timeSelected = this.timeSelected.bind(this)
  }

  componentWillMount() {

  }

  componentWillReceiveProps(props) {
  }

  timeSelected() {
    console.log('image has loaded')
    this.setState({imageHasLoaded: true})
  }

  render() {
    console.log(this.props.times)
    var ticks = _.map(this.props.times, ({label, value}) => value
    return React.createElement('div', {className: 'timeSelector'},
      React.createElement('div', {}, 'Time series'),
      React.createElement(rcSlider, {
        defaultValue: 80,
        step: ,
        onChange: (time) => this.timeSelected(time)
      })
    )
  }
}

export default timeSelector
