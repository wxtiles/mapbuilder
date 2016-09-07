import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import maps from './maps'

class hideLayer extends React.Component {
  constructor() {
    super()
    this.state = {
      menuIsVisible: true
    }

    this.toggleLayerEditor = this.toggleLayerEditor.bind(this)
  }

  componentWillMount() {
  }

  toggleLayerEditor() {
    if (this.state.menuIsVisible) {
      document.querySelector('#layerEditor').style['display'] = 'none'
      document.querySelector('.mapContainer').className = 'mapContainer editorIsHidden'
    } else {
      document.querySelector('#layerEditor').style['display'] = 'block'
      document.querySelector('.mapContainer').className = 'mapContainer'
    }
    this.setState({menuIsVisible: !this.state.menuIsVisible})

    maps.poke()
  }

  render() {
    // <a id="hideLayerEditorLink" href="#" onclick="toggleLayerEditor()">Hide layer editor</a>
    return React.createElement('a', {href: '#', onClick: this.toggleLayerEditor},
      this.state.menuIsVisible && React.createElement('span', {}, 'Hide layer editor'),
      (this.state.menuIsVisible == false) && React.createElement('span', {}, 'Show layer editor')
    )
  }
}

export default hideLayer
