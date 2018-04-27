import React from 'react'

class StyleOption extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return React.createElement('div', {},
      React.createElement('div', {className: 'styleName'}, this.props.name),
      this.props.hasLegend && React.createElement('img', {src: this.props.url, onError: this.loadingError})
    )
  }
}

export default StyleOption
