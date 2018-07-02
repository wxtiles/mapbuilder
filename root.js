import React from "react";
import sortBy from "lodash.sortby";
import first from "lodash.first";
import last from "lodash.last";
import flatten from "lodash.flatten";
import map from "lodash.map";
import layersEditor from "./layersEditor";
import mapWrapper from "./mapWrapper";
import mapControls from "./mapControls";
import moment from "moment";

class root extends React.Component {
  constructor() {
    super();
    this.state = {
      layers: [],
      mapOptions: {},
      now: null
    };
    this.updateLayers = this.updateLayers.bind(this);
    this.updateMapOptions = this.updateMapOptions.bind(this);
  }

  componentWillMount() {
    var layers = [
      {
        label: "",
        key: 0,
        opacity: 1,
        zIndex: 0
      }
    ];
    this.setState({
      layers,
      mapOptions: {
        time: this.props.now,
        displayTime: this.props.now,
        layers,
        marks: {},
        apikey: ""
      }
    });
  }

  updateLayers({ layers }) {
    var mapOptions = this.state.mapOptions;
    mapOptions.layers = layers;
    var times = map(layers, layer => {
      return map(layer.times, time => {
        return moment.utc(time);
      });
    });
    times = flatten(times);
    // times.push(this.props.now)
    times = sortBy(times, time => +time);
    mapOptions.marks = {};
    times.forEach(time => {
      mapOptions.marks[+time] = "";
    });
    var arrowStyle = {};
    if (+this.props.now < +first(times)) {
      mapOptions.marks[+first(times)] = {
        style: arrowStyle,
        label: "\u21E6"
      };
    } else if (+this.props.now > +last(times)) {
      mapOptions.marks[+last(times)] = {
        style: arrowStyle,
        label: "\u21E8"
      };
    } else {
      mapOptions.marks[+this.props.now] = {
        style: arrowStyle,
        label: "\u21E7"
      };
    }
    mapOptions.times = times;
    mapOptions.earliestTime = first(times);
    mapOptions.latestTime = last(times);
    this.setState({ layers, mapOptions });
  }

  updateMapOptions({ mapOptions }) {
    var layers = this.state.layers;
    mapOptions.layers = layers;
    this.setState({ layers, mapOptions });
  }

  render() {
    return React.createElement(
      "div",
      { className: "root" },
      React.createElement(
        "div",
        { className: "layers-container" },
        React.createElement(
          "a",
          { className: "logo", href: "https://wxtiles.com", target: "_blank" },
          React.createElement("img", { src: "wxtiles-logo.png" })
        ),
        React.createElement(layersEditor, {
          layers: this.state.layers,
          updateLayers: this.updateLayers,
          mapOptions: this.state.mapOptions,
          updateMapOptions: this.updateMapOptions
        })
      ),
      React.createElement(
        "div",
        { className: "mapContainer" },
        React.createElement(mapWrapper, {
          layers: this.state.layers,
          mapOptions: this.state.mapOptions,
          updateMapOptions: this.updateMapOptions
        })
      ),
      React.createElement(
        "div",
        { className: "mapControlsContainer" },
        React.createElement(mapControls, {
          updateLayers: this.updateLayers,
          mapOptions: this.state.mapOptions,
          updateMapOptions: this.updateMapOptions
        })
      )
    );
  }
}

export default root;
