import React from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent'

request
  .get('http://tapa01.unisys.metocean.co.nz/wxtiles/layer/')
  .end(function(err, res) {
    console.log(JSON.parse(res.text))
  })

var Hello = React.createClass({
  displayName: 'Hello',
  render: function() {
    return React.createElement("div", null, "Hello ", this.props.name);
  }
});

ReactDOM.render(
    React.createElement(Hello, {name: "World"}),
    document.getElementById('map')
);
