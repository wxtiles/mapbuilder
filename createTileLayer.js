import React from "react";
import wxTiles from "./wxtiles";
import select from "react-select";
import sortBy from "lodash.sortby";
import defaults from "lodash.defaults";
import without from "lodash.without";
import layerLabel from "./layerLabel";
import rcSlider from "rc-slider";
import legend from "./legend";
import moment from "moment";

function degradeArray(array, options) {
  defaults(options, { fromLeftSide: false, maxLength: 30, retainEnds: true });
  var offset = 2;
  var start = options.retainEnds ? array[0] : undefined;
  var end = options.retainEnds ? array[array.length - 1] : undefined;
  var maxLength = options.retainEnds
    ? options.maxLength - 2
    : options.maxLength;
  var retArray = options.retainEnds ? array.slice(1, -1) : array;
  var i = null;
  while (retArray.length > maxLength) {
    i = !options.fromLeftSide ? array.length - offset : offset - 1;
    if (array[i] != undefined) {
      retArray = without(retArray, array[i]);
      offset += 2;
    } else {
      return degradeArray(retArray, options);
    }
  }
  return options.retainEnds ? [start].concat(retArray, [end]) : retArray;
}

class createTileLayer extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.state.selectedLayer = null;
    this.state.loadingInstance = false;
    this.state.layerOptions = [];
    this.selectLayer = this.selectLayer.bind(this);
    this.selectStyle = this.selectStyle.bind(this);
    this.deleteLayer = this.deleteLayer.bind(this);
    this.setOpacity = this.setOpacity.bind(this);
  }

  selectLayer(selectingLayer) {
    var instances = selectingLayer.instances.map(instance => {
      instance.value = instance.id;
      return instance;
    });
    instances = sortBy(instances, instance => {
      return instance.displayName;
    }).reverse();
    var layer = this.props.layer;
    layer.id = selectingLayer.id;
    layer.instances = instances;
    layer.instanceId = instances[0].id;
    layer.label = selectingLayer.name;
    layer.description = selectingLayer.description;
    layer.bounds = selectingLayer.bounds;
    layer.maxNativeZoom = selectingLayer.maxNativeZoom
      ? selectingLayer.maxNativeZoom
      : null;
    layer.minNativeZoom = selectingLayer.minNativeZoom
      ? selectingLayer.minNativeZoom
      : 0;
    layer.instanceType = selectingLayer.instanceType;
    layer.styles = selectingLayer.styles;
    layer.styleId = selectingLayer.defaults.style; // Instantiate with default
    layer.styles = layer.styles.map(style => {
      var legendUrl = style.resources.legend;
      style.hasLegend = legendUrl != undefined;
      if (style.hasLegend) {
        style.legendUrl = legendUrl
          .replace("<size>", "small")
          .replace("<orientation>", "horizontal");
      }
      return style;
    });

    wxTiles.getInstance({
      apikey: this.props.apikey,
      layerId: layer.id,
      instanceId: layer.instanceId,
      onSuccess: instanceObject => {
        var times = degradeArray(instanceObject.times, {
          fromLeftSide: layer.instanceType != "observational" ? false : true
        });
        layer.times = times;
        layer.time = times[0];
        wxTiles.getAllTileLayerUrls({
          apikey: this.props.apikey,
          layerId: layer.id,
          styleId: layer.styleId,
          instanceId: layer.instanceId,
          times: layer.times,
          level: 0,
          onSuccess: timeUrls => {
            var timeUrls = timeUrls.map(timeUrl => {
              timeUrl.time = moment.utc(timeUrl.time, "YYYY-MM-DDTHH:mm:ss[Z]");
              return timeUrl;
            });
            layer.timeUrls = timeUrls;
            wxTiles.getTileLayerUrl({
              apikey: this.props.apikey,
              layerId: layer.id,
              styleId: layer.styleId,
              instanceId: layer.instanceId,
              time: layer.time,
              level: 0,
              onSuccess: visibleUrl => {
                layer.visibleUrl = visibleUrl;
                this.props.updateLayer({ layerObject: layer });
              }
            });
          }
        });
      },
      onError: error => {
        console.log(error);
      }
    });
  }

  selectInstance(instance) {}

  componentDidCatch() {
    this.setState({ layerOptions: [] });
  }

  componentDidUpdate(prevProps) {
    if (this.props.apikey !== prevProps.apikey) {
      wxTiles.getAllLayers({
        apikey: this.props.apikey,
        onSuccess: layerOptions => {
          layerOptions = layerOptions.map(layerOption => {
            layerOption.value = layerOption.id;
            layerOption.label = layerOption.name;
            return layerOption;
          });
          this.setState({ layerOptions });
        },
        onError: error => {
          console.log(error);
          this.setState({ layerOptions: [] });
        }
      });
    }
  }

  deleteLayer() {
    this.props.removeLayer({ key: this.props.layer.key });
  }

  setOpacity(opacity) {
    var layerObject = this.props.layer;
    layerObject.opacity = opacity;
    this.props.updateLayer({ layerObject });
  }

  selectStyle(styleId) {
    var layerObject = this.props.layer;
    layerObject.styleId = styleId;
    this.props.updateLayer({ layerObject });
  }

  render() {
    var layer = this.props.layer;
    return React.createElement(
      "div",
      { className: "createTileLayer" },
      React.createElement(
        "div",
        { className: "select-container" },
        React.createElement(
          "div",
          { className: "select-list" },
          React.createElement(layerLabel, {
            deleteLayer: this.deleteLayer,
            layers: this.state.layerOptions,
            selectLayer: this.selectLayer,
            layer: layer.id
          }),
          React.createElement(
            "div",
            { className: "controls" },
            React.createElement(
              "div",
              { className: "transparencyContainer" },
              React.createElement("div", {}, "Opacity"),
              React.createElement(rcSlider, {
                defaultValue: layer.opacity * 100,
                onChange: opacity => this.setOpacity(opacity / 100)
              })
            )
          )
        )
      )
    );
  }
}

export default createTileLayer;
