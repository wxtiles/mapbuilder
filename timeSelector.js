import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import rcSlider from 'rc-slider'
import moment from 'moment'

class timeSelector extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.timeSelected = this.timeSelected.bind(this)
    this.updateHoveringOverTime = this.updateHoveringOverTime.bind(this)
  }

  componentWillMount() {
    var ticks = _.map(this.props.times, ({label, value}) => +moment(value))
    ticks = ticks.sort()
    var min = ticks[0]
    this.updateHoveringOverTime(min)
    this.timeSelected(min)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedTime != nextProps.selectedTime) this.timeSelected(+moment.utc(nextProps.selectedTime))
  }

  timeSelected(time) {
    this.setState({selectedTime: time})
    this.props.updateTime(moment.utc(time).format('YYYY-MM-DDTHH:mm:ss[Z]'))
  }

  updateHoveringOverTime(time) {
    this.setState({hoveringOverTime: time})
  }

  render() {
    var ticks = _.map(this.props.times, ({label, value}) => +moment(value))
    ticks = ticks.sort()
    var min = ticks[0]
    var max = ticks[ticks.length-1]
    var marks = {}

    _.forEach(ticks, (tick) => {
      marks[tick] = ''
    })

    return React.createElement('div', {className: 'timeSelector'},
      React.createElement('div', {}, 'Time series'),
      React.createElement(rcSlider, {
        included: false,
        min: min,
        max: max,
        defaultValue: min,
        step: null,
        marks: marks,
        onChange: (time) => this.updateHoveringOverTime(time),
        onAfterChange: (time) => this.timeSelected(time)
      }),
      React.createElement('div', {className: 'timeLabel'}, moment(this.state.hoveringOverTime).format('YYYY MMM DD - HH:mm'))
    )
  }
}

export default timeSelector
