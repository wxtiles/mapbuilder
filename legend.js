import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import wxtilesjs from './wxtiles'
import rcPopover from 'rc-popover'

class legend extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.url = null
  }

  componentWillMount() {
    wxtilesjs.getLegendUrl({
      layerId: this.props.layerId,
      instanceId: this.props.instanceId,
      onSuccess: (legendUrl) => {
        this.setState({url: legendUrl})
      },
      onError: (err) => {
        console.log(err)
      }
    })
  }

  loadingError() {
    this.setState({url: null})
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
      React.createElement('div', {className: 'imgWrapper'},
        this.props.hasLegend && React.createElement('img', {src: this.state.url, onError: this.loadingError})
      )
    )
  }
}

export default legend
