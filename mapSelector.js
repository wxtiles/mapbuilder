import React from 'react'
import ReactDOM from 'react-dom'
import select from 'react-select'

class mapSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.state.selectedMap = props.selectedMap;
  }

  render() {
    return React.createElement('div', { className: 'row mapSelector' },
      React.createElement(`div`, { className: 'col-sm-3 select-container' },
        React.createElement('div', null, 'Choose an example map integration:'),
        React.createElement(select, {
          options: this.props.options,
          value: this.state.selectedMap,
          onChange: (selectedMap) => {
            this.setState({ selectedMap })
            this.props.showMap(selectedMap)
          }
        })
      )
    )
  }
}

export default mapSelector
