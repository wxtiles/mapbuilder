import React from 'react'
import ReactDOM from 'react-dom'
import select from 'react-select'
import _ from 'lodash'

class mapButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    //this.state.selectedMap = props.selectedMap;
  }

  handleClick() {
    this.props.showMap(this.props.mapOption);
  }

  render() {
    var selectedClass = '';
    if(this.props.selected) {
      selectedClass = 'active';
    }
    return React.createElement('div', {
            className: 'btn btn-default ' + selectedClass,
            onClick: () => this.handleClick()
          }, this.props.mapOption.label)
  }
}

export default mapButton