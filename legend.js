import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import wxtilesjs from './wxtiles'
import rcPopover from 'rc-popover'
import styleSelector from './styleSelector'

class legend extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    var popoverTitle = React.createElement('span', {className: 'legendPopoverTitle'}, this.props.label)
    return React.createElement('div', {className: 'legend'},
      React.createElement('div', {},
        React.createElement('div', {className: 'legendLabel'}, this.props.label),
        React.createElement(rcPopover, {title: popoverTitle, content: this.props.description, trigger: 'click'},
          React.createElement('a', {href: 'javascript:void(0);', className: 'description glyphicon glyphicon-question-sign'})
        )
      ),
      this.props.hasLegend && React.createElement('div', {className: 'styleSelectWrapper'},
        React.createElement(styleSelector, {
          layerId: this.props.layerId,
          styleId: this.props.styleId
        })
      )
    )
  }
}

export default legend
