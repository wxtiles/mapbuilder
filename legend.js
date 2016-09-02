import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import wxtilesjs from './wxtiles'

class legend extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.url = null
    this.state.imageHasLoaded = false
    this.legendLoaded = this.legendLoaded.bind(this)
  }

  componentWillMount() {

  }

  componentWillReceiveProps(props) {
    if(props.layerId && props.instanceId) {
      wxtilesjs.getLegendUrl({
        layerId: props.layerId,
        instanceId: props.instanceId,
        onSuccess: (legendUrl) => {
          this.setState({url: legendUrl})
        },
        onError: (err) => {
          console.log(err)
        }
      })
    }
  }

  legendLoaded() {
    console.log('image has loaded')
    this.setState({imageHasLoaded: true})
  }

  render() {
    var imgClasses = 'hideMeh'
    if (this.state.imageHasLoaded)
      imgClasses = 'showMeh'
    return React.createElement('div', {className: 'legend'},
      this.state.url && React.createElement('img', {className: imgClasses, src: this.state.url, onLoad: this.legendLoaded})
    )
  }
}

export default legend
