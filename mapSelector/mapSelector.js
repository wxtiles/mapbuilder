import React from 'react'
import ReactDOM from 'react-dom'
import select from 'react-select'
import _ from 'lodash'
import mapButton from './mapButton'

class mapSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return React.createElement('div', null,
      React.createElement('div', { className: 'row mapSelector' },
        React.createElement('h4', { className: 'col-sm-4 col-sm-offset-4' }, 'Choose an example map integration:')
      ),
      React.createElement('div', { className: 'row' },
        _.map(this.props.mapOptions, (mapOption) => {
          var buttonSelected = this.props.selectedMap === mapOption; 
          return React.createElement('div', { className: 'col-sm-4' },
            React.createElement(mapButton, { key: mapOption.value, mapOption: mapOption, showMap: this.props.showMap, selected: buttonSelected })
          )
        }
        )
      )
    )
  }
}

export default mapSelector
