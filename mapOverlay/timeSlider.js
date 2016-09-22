import React from 'react'
import rcSlider from 'rc-slider'
import moment from 'moment'
import _ from 'lodash'

class timeSlider extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.times = []
    this.updateHoveringOverTime = this.updateHoveringOverTime.bind(this)
    this.selectTime = this.selectTime.bind(this)
  }

  componentWillMount() {
    var now = moment.utc()
    var twoDaysAgo = now.clone().add(-2, 'day',)
    var sevenDaysAhead = now.clone().add(7, 'day')

    this.setState({times: [twoDaysAgo, now, sevenDaysAhead]})
  }

  updateHoveringOverTime(time) {
    console.log('update hovering over time')
    console.log(time)
  }

  selectTime(time) {
    console.log('select time')
    console.log(time)
  }

  render() {
    var times = _.map(this.state.times, (time) => +time)
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
        defaultValue: earliestTime,
        step: null,
        marks: marks,
        onChange: this.updateHoveringOverTime,
        onAfterChange: this.selectTime
      })
    )
  }
}

export default timeSlider
