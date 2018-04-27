import React from 'react'
import rcPopover from 'rc-popover'
import StyleSelector from './styleSelector'

class legend extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    // var popoverTitle = React.createElement('span', {className: 'legendPopoverTitle'}, this.props.label)
    return React.createElement('div', {className: 'legend'},
      React.createElement('div', {},
        React.createElement('div', {className: 'legendLabel'}, this.props.label),
        React.createElement(rcPopover, {
          title: '', // popoverTitle,
          content: this.props.description,
          trigger: 'click'},
          React.createElement('a', {href: 'javascript:void(0);', className: 'description glyphicon glyphicon-question-sign'})
        )
      ),
      React.createElement('div', {className: 'styleSelectWrapper'},
        React.createElement(StyleSelector, {
          layerId: this.props.layerId,
          styleId: this.props.styleId,
          styles: this.props.styles,
          selectStyle: this.props.selectStyle
        })
      )
    )
  }
}

export default legend
