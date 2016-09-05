import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import rcSlider from 'rc-slider'
import moment from 'moment'

class timeSelector extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.isAnimating = false
    this.timeSelected = this.timeSelected.bind(this)
    this.updateHoveringOverTime = this.updateHoveringOverTime.bind(this)
    this.animate = this.animate.bind(this)
    this.stopAnimation = this.stopAnimation.bind(this)
    this.doAnimationFrame = this.doAnimationFrame.bind(this)
  }

  componentWillMount() {
    var ticks = _.map(this.props.times, ({label, value}) => +moment.utc(value))
    ticks = ticks.sort()
    var min = ticks[0]
    this.updateHoveringOverTime(min)
    this.timeSelected(min)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedTime != nextProps.selectedTime) this.timeSelected(+moment.utc(nextProps.selectedTime))
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeoutKey)
  }

  timeSelected(time) {
    this.setState({selectedTime: time})
    this.props.updateTime(moment.utc(time).format('YYYY-MM-DDTHH:mm:ss[Z]'))
  }

  updateHoveringOverTime(time) {
    this.setState({hoveringOverTime: time})
  }

  doAnimationFrame() {
    var timeoutKey = setTimeout(() => {
      if (!this.state.isAnimating) return

      var sortedTimes = _.sortBy(this.props.times, (time) => {
        return +moment.utc(time.value)
      })
      var index = _.findIndex(sortedTimes, (time) => {
        return (+moment.utc(time.value) == this.state.selectedTime)
      })
      index = (index + 1) % sortedTimes.length
      this.timeSelected(+moment.utc(sortedTimes[index].value))

      this.doAnimationFrame()
    }, 3000)

    this.setState({timeoutKey})
  }

  animate() {
    this.setState({isAnimating: true})
    this.doAnimationFrame()
  }

  stopAnimation() {
    this.setState({isAnimating: false})
  }

  render() {
    var ticks = _.map(this.props.times, ({label, value}) => +moment.utc(value))
    ticks = ticks.sort()
    var min = ticks[0]
    var max = ticks[ticks.length-1]
    var marks = {}

    _.forEach(ticks, (tick) => {
      marks[tick] = ''
    })

    return React.createElement('div', {className: 'timeSelector'},
      React.createElement('span', {style: {float: 'left'}}, 'Time series'),
      React.createElement('div', {className: 'animateLink'},
        (this.state.isAnimating == false) && React.createElement('a', {onClick: this.animate, href: '#'}, 'Animate'),
        this.state.isAnimating && React.createElement('a', {onClick: this.stopAnimation, href: '#'}, 'Stop animation')
      ),
      React.createElement('div', {key: this.state.selectedTime},
        React.createElement(rcSlider, {
          included: false,
          min: min,
          max: max,
          defaultValue: this.state.selectedTime,
          step: null,
          marks: marks,
          onChange: (time) => this.updateHoveringOverTime(time),
          onAfterChange: (time) => this.timeSelected(time)
        })
      ),
      React.createElement('div', {className: 'timeLabel'}, moment.utc(this.state.hoveringOverTime).format('YYYY MMM DD - HH:mm') + ' UTC')
    )
  }
}

export default timeSelector
