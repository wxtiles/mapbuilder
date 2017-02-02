import React from 'react'
import ReactDOM from 'react-dom'

class apikeyField extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.apikey = ''

    this.handleUserInput = this.handleUserInput.bind(this)
  }

  handleUserInput(e) {
    var apikey = e.target.value
    this.setState({apikey})
    this.props.updateApikey({apikey})
  }

  render() {
    return React.createElement('div', {className: 'apikeyForm'},
      React.createElement('input', {
        value: this.state.apikey,
        type: "text",
        onChange: this.handleUserInput,
        placeholder: "Paste your API key here",
        name: "apikey"
      }),
      React.createElement('label', {
        className: 'getApikeyLink',
        for: "apikey"
        }, React.createElement('a', {
            href: "https://wxtiles.com/my-account/"
          }, "Don't have an API key?"
        )
      )
    )
  }
}

export default apikeyField
