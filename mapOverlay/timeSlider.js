import React from 'react'
import rcSlider from 'rc-slider'
import moment from 'moment-timezone'
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
      if(time.isAfter(this.props.mapOptions.latestTime)) {
        time = this.props.mapOptions.earliestTime
      }
      this.selectTime(+time)
    }
  }

  selectTime(time) {
    this.props.selectTime({time: moment.utc(time)})
  }

  toggleAnimating() {
    var mapOptions = this.props.mapOptions
    if (mapOptions.earliestTime && mapOptions.latestTime) {
      mapOptions.isAnimating = !mapOptions.isAnimating
    }
    this.props.updateMapOptions({mapOptions})
  }

  render() {
    var mapOptions = this.props.mapOptions
    var times = mapOptions.times
    var earliestTime = mapOptions.earliestTime
    if (!earliestTime) earliestTime = 1
    var latestTime = mapOptions.latestTime
    if (!latestTime) latestTime = 1
    var marks = mapOptions.marks

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
      React.createElement('div', {}, mapOptions.displayTime.local().format('MMM DD - hh:mm a') + ' ' + moment.tz(moment.tz.guess()).format('z'))
    )
  }
}

export default timeSlider