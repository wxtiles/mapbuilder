import React from 'react'
import ReactDOM from 'react-dom'

class wxtilesTag extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
  }

  render() {
    return React.createElement('div', {className: 'wxtilesTag'},
      React.createElement('span', {}, 'Powered by '),
      React.createElement('a', {href: 'https://wxtiles.com', target: '_blank'}, 'WXTiles.com')
    )
  }
}

export default wxtilesTag
