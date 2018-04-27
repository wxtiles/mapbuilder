import React from 'react'
import rcSlider from 'rc-slider'
import moment from 'moment-timezone'
import defaults from 'lodash.defaults'
import clamp from 'lodash.clamp'
import humanizeDuration from 'humanize-duration'

class timeSlider extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.selectTime = this.selectTime.bind(this)
    this.handleAfterChange = this.handleAfterChange.bind(this)
    this.toggleAnimating = this.toggleAnimating.bind(this)
    this.changeAnimationRate = this.changeAnimationRate.bind(this)
    this.halveSpeed = this.halveSpeed.bind(this)
    this.doubleSpeed = this.doubleSpeed.bind(this)
    this.doAnimationFrame = this.doAnimationFrame.bind(this)
  }

  componentWillMount() {
    setInterval(this.doAnimationFrame, 100)
  }

  doAnimationFrame() {
    var mapOptions = this.props.mapOptions
    if(mapOptions.isAnimating) {
      var time = mapOptions.time
      var animationSpeed = mapOptions.animationFrameMinutes ? mapOptions.animationFrameMinutes : ((mapOptions.latestTime - mapOptions.earliestTime) / 1000 / 60) * 0.01
      time.add(animationSpeed, 'minute')
      if(time.isAfter(mapOptions.latestTime)) {
        time = mapOptions.earliestTime
      }
      mapOptions.animationFrameMinutes = animationSpeed
      this.selectTime(+time)
      this.props.updateMapOptions({mapOptions})
    }
  }

  selectTime(time) {
    this.props.selectTime({time: moment.utc(time), ignore: !this.props.mapOptions.isAnimating})
  }

  handleAfterChange(time) {
    this.props.selectTime({time: moment.utc(time), ignore: false})
  }

  toggleAnimating() {
    var mapOptions = this.props.mapOptions
    if (mapOptions.earliestTime && mapOptions.latestTime) {
      mapOptions.isAnimating = !mapOptions.isAnimating
    }
    this.props.updateMapOptions({mapOptions})
  }

  changeAnimationRate(options) {
    _.defaults(options, {rate: 1})
    var mapOptions = this.props.mapOptions
    if (mapOptions.animationFrameMinutes === undefined) {
      mapOptions.animationFrameMinutes = 30
    }
    var maxRate = ((mapOptions.latestTime - mapOptions.earliestTime) / 1000 / 60) * 0.33
    mapOptions.animationFrameMinutes = _.clamp(mapOptions.animationFrameMinutes * options.rate, 1, maxRate)
    this.props.updateMapOptions({mapOptions})
  }

  halveSpeed(){
    this.changeAnimationRate({rate: 0.5})
  }

  doubleSpeed(){
    this.changeAnimationRate({rate: 2})
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
        React.createElement('div', {className: 'animationControl'},
          !mapOptions.isAnimating && React.createElement('div', {onClick: this.toggleAnimating, className: 'glyphicon glyphicon-play'}),
          mapOptions.isAnimating && React.createElement('div', {onClick: this.toggleAnimating, className: 'glyphicon glyphicon-pause'}),
          React.createElement('div', {onClick: this.halveSpeed, className: 'speed-button glyphicon glyphicon-minus-sign'}),
          React.createElement('div', {onClick: this.doubleSpeed, className: 'speed-button glyphicon glyphicon-plus-sign'})
        ),
        React.createElement('div', {className: 'reactSliderContainer'},
          React.createElement(rcSlider, {
            included: false,
            min: +earliestTime,
            // max: +latestTime + (+latestTime - +earliestTime) * 0.05,
            max: +latestTime,
            value: mapOptions.time,
            step: null,
            marks: marks,
            tipFormatter: (tip, index) => {
              var t = moment.duration(moment(tip).diff(moment())).asMilliseconds()
              var args = {
                'conjunction': ' and ',
                'largest': Math.abs(t) > 3600000 ? 2 : 1,
                'serialComma': false
              }
              return t > -60000 && t < 60000 ? 'now' : t < 0 ? humanizeDuration(t, args) + ' ago' : 'in ' + humanizeDuration(t, args)
            },
            // step: null, // NOTE null step makes intermediate positions impossible, but disables tip fomatting. https://github.com/react-component/slider/issues/174
            onChange: this.selectTime,
            onAfterChange: this.handleAfterChange
          })
        )
      ),
      React.createElement('div', {className: 'displayDate'}, mapOptions.displayTime.local().format('ddd MMM DD \u2014 hh:mm A') + ' ' + moment.tz(moment.tz.guess()).format('z'))
    )
  }
}

export default timeSlider
