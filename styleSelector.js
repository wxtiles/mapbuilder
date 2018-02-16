import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { Select } from 'antd'
import 'antd/lib/select/style/css'
import StyleOption from './styleOption'
import wxtilesjs from './wxtiles'

const Option = Select.Option

class StyleSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value: props.styleId, styles: props.styles}
    this.onStyleChange = this.onStyleChange.bind(this)
  }

  componentWillMount() {
    _.map(this.props.styles, (style) => {
      style.url = undefined
      wxtilesjs.getLegendUrl({
        layerId: this.props.layerId,
        styleId: style.id,
        onSuccess: (legendUrl) => {
          style.url = legendUrl
        },
        onError: (err) => {
          console.log(err)
        }
      })
    })
    this.setState({styles: this.props.styles, value: this.props.styleId})
  }

  onStyleChange(value) {
    this.props.selectStyle({layerId: this.props.layerId, styleId: value})
    this.setState({value: value})
  }

  render() {
    return React.createElement(Select, {
        value: this.state.value,
        onChange: this.onStyleChange
      },
      _.map(this.props.styles, (mapStyle, key) => {
        return React.createElement(
          Option,
          {
            value: mapStyle.id,
            key: mapStyle.id
          },
          // TODO style description
          React.createElement(StyleOption, {
            styleId: mapStyle.id,
            layerId: this.props.layerId,
            name: mapStyle.name,
            url: mapStyle.url,
            hasLegend: mapStyle.hasLegend
          })
        )
      })
    )
  }
}

export default StyleSelector
