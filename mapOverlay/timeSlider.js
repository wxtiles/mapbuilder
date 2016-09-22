import React from 'react'
import rcSlider from 'rc-slider'
import moment from 'moment'
import _ from 'lodash'

class timeSlider extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.time = null
    this.state.defaultTime = null
    this.state.displayTime = 'Select a time'
    this.updateHoveringOverTime = this.updateHoveringOverTime.bind(this)
    this.selectTime = this.selectTime.bind(this)
  }

  componentWillMount() {
    var now = moment.utc()
    var twoDaysAgo = now.clone().add(-2, 'day',)
    var sevenDaysAhead = now.clone().add(7, 'day')

    this.setState({time: now, displayTime: now, defaultTime: now})
  }

  updateHoveringOverTime(displayTime) {
    this.setState({displayTime})
  }

  selectTime(time) {
    
    this.setState({time, displayTime: time})
  }

  render() {
    var times = this.props.times
    if (!times) times = []

    times = _.map(times, (time) => +time)
    times = _.sortBy(times)

    var earliestTime = _.first(times)
    var latestTime = _.last(times)

    var marks = {}
    _.forEach(times, (time) => {
      marks[time] = ''
    })

    return React.createElement('div', {className: 'timeSlider'},
      React.createElement(rcSlider, {
        included: false,
        min: earliestTime,
        max: latestTime,
        defaultValue: this.state.defaultTime,
        marks: marks,
        tipFormatter: null,
        onChange: this.updateHoveringOverTime,
        onAfterChange: this.selectTime
      }),
      React.createElement('div', {}, moment.utc(this.state.displayTime).local().format('MMM DD - hh:mm a'))
    )
  }
}

export default timeSlider
