import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import wxtilesjs from './wxtiles'
import rcPopover from 'rc-popover'
// import Radio from 'antd/lib/radio'
import { Radio, Select } from 'antd'
import 'antd/lib/radio/style/css'
import 'antd/lib/select/style/css'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const Option = Select.Option

class legend extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.url = null
  }

  componentWillMount() {
    wxtilesjs.getLegendUrl({
      layerId: this.props.layerId,
      styleId: this.props.styleId,
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

  onStyleChange(e) {
    console.log(`radio checked:${e.target.value}`)
    // this.setState({})
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
        React.createElement(Select, {defaultValue: 'default-legend', style: {width: '100%'}},
          React.createElement(Option, {className: 'styleSelectPreview', value: 'default-legend'}, React.createElement('img', {src: this.state.url, onError: this.loadingError}))
        )
      )
    )
  }
}

export default legend
