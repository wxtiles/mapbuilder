import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import legend from '../legend'

class legends extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.showLegends = true
    this.showLegends = this.showLegends.bind(this)
    this.hideLegends = this.hideLegends.bind(this)
  }

  componentWillMount() {
  }

  showLegends() {
    this.setState({showLegends: true})
  }

  hideLegends() {
    this.setState({showLegends: false})
  }

  render() {
    return React.createElement('div', {className: 'legends'},
      React.createElement('div', {className: 'legends-control'},
        !this.state.showLegends && React.createElement('a', {href: '#', onClick: this.showLegends}, 'Show legends'),
        this.state.showLegends && React.createElement('a', {href: '#', onClick: this.hideLegends}, 'Hide legends')
      ),
      this.state.showLegends && _.map(this.props.legends.layers, (layer) => {
        return React.createElement('div', {key: layer.layerId + ' ' + layer.instanceId},
          React.createElement(legend, {
            layerId: layer.layerId,
            styleId: layer.styleId,
            label: layer.label,
            description: layer.description,
            styles: layer.styles,
            selectStyle: this.props.legends.selectStyle
          })
        )
      }),
      React.createElement('div', {className: 'wxtilesPlug'},
        React.createElement('span', {}, 'Powered by ',
          React.createElement('a', {href: 'https://wxtiles.com', target: '_blank'}, 'WXTiles.com')
        )
      )
    )
  }
}

export default legends
