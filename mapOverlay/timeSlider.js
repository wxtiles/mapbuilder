import React from 'react'
import rcSlider from 'rc-slider'
import moment from 'moment'
import _ from 'lodash'

class timeSlider extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.selectTime = this.selectTime.bind(this)
    this.toggleAnimating = this.toggleAnimating.bind(this)
    this.doAnimationFrame = this.doAnimationFrame.bind(this)
  }

  componentWillMount() {
    setInterval(this.doAnimationFrame, 100)
  }

  doAnimationFrame() {
    if(this.props.mapOptions.isAnimating) {
      var time = this.props.mapOptions.time
      time.add(30, 'minute')
      this.selectTime(+time)
    }
  }

  selectTime(time) {
    this.props.selectTime({time: moment.utc(time)})
  }

  toggleAnimating() {
    var mapOptions = _.cloneDeep(this.props.mapOptions)
    mapOptions.isAnimating = !mapOptions.isAnimating
    this.props.updateMapOptions({mapOptions})
  }

  render() {
    var times = this.props.times
    var earliestTime = this.props.earliestTime
    var latestTime = this.props.latestTime

    var marks = {}
    _.forEach(times, (time) => {
      marks[+time] = ''
    })
    var mapOptions = _.cloneDeep(this.props.mapOptions)
    return React.createElement('div', {className: 'timeSlider'},
      React.createElement('div', {},
        !mapOptions.isAnimating && React.createElement('div', {onClick: this.toggleAnimating, className: 'glyphicon glyphicon-play'}),
        mapOptions.isAnimating && React.createElement('div', {onClick: this.toggleAnimating, className: 'glyphicon glyphicon-pause'}),
        React.createElement('div', {className: 'reactSliderContainer'},
          React.createElement(rcSlider, {
            included: false,
            min: +earliestTime,
            max: +latestTime,
            value: mapOptions.time,
            marks: marks,
            tipFormatter: null,
            onChange: this.selectTime
          })
        )
      ),
      React.createElement('div', {}, moment.utc(mapOptions.displayTime).local().format('MMM DD - hh:mm a'))
    )
  }
}

export default timeSlider
