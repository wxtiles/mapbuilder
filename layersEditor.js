import React from "react";
import remove from "lodash.remove";
import apikeyField from "./apikeyField";
import createTileLayer from "./createTileLayer";
import dragula from "react-dragula";

class layersEditor extends React.Component {
  constructor() {
    super();
    this.state = {
      apikey:
        this.props && this.props.mapOptions
          ? this.props.mapOptions.apikey
          : null
    };
    this.state.totalLayers = 1;
    this.state.shouldShowLayerMenu = true;
    this.state.isMakingUrl = false;
    this.drake = null;

    this.updateApikey = this.updateApikey.bind(this);
    this.addLayerSelectionRow = this.addLayerSelectionRow.bind(this);
    this.createLayer = this.createLayer.bind(this);
    this.removeLayer = this.removeLayer.bind(this);
    this.toggleLayerMenu = this.toggleLayerMenu.bind(this);
  }

  componentDidMount() {
    var drake = dragula([document.querySelector("#testIdizzle")], {
      moves: (el, source, handle, sibling) => {
        return handle.classList.contains("glyphicon-move");
      }
    });
    drake.on("drop", (el, target, source, sibling) => {
      var layersInDom = Array.from(drake.containers[0].children);
      var layers = this.props.layers;
      layers = layers.map(layer => {
        if (!layer) return undefined;
        var indexOfLayer = layersInDom.findIndex(layerDom => {
          return layerDom.attributes[1].nodeValue == layer.key;
        });
        layer.zIndex = layersInDom.length - indexOfLayer;
        return layer;
      });
      this.props.updateLayers({ layers });
    });
    this.setState({ drake }, () => {});
  }

  //This is called when the user clicks the button to add a new layer.
  addLayerSelectionRow() {
    var layers = this.props.layers;
    layers.unshift({
      key: this.state.totalLayers,
      zIndex: this.state.totalLayers,
      opacity: 1
    });
    this.setState({ totalLayers: this.state.totalLayers + 1 }, () => {
      this.props.updateLayers({ layers });
    });
  }

  //This is called when the user selects a time value for the layer.
  //This also happens once when the layer selection row is first loaded, the 0th time value is auto selected for the user.
  createLayer({ layerObject }) {
    var layers = this.props.layers;
    var layerIndex = layers.findIndex(layer => {
      if (!layer) return false;
      return layer.key == layerObject.key;
    });
    layers[layerIndex] = layerObject;
    this.props.updateLayers({ layers });
  }

  removeLayer({ key }) {
    var layers = this.props.layers;
    layers = remove(layers, layer => layer.key != key);
    this.props.updateLayers({ layers });
  }

  toggleLayerMenu() {
    this.setState(
      { shouldShowLayerMenu: !this.state.shouldShowLayerMenu },
      () => {
        if (this.state.shouldShowLayerMenu)
          document.querySelector("#layerEditor").style["max-width"] = "100%";
        else document.querySelector("#layerEditor").style["max-width"] = "50px";
      }
    );
  }

  updateApikey({ apikey }) {
    var mapOptions = this.props.mapOptions;
    mapOptions.apikey = apikey;
    this.setState({ apikey }, () => {
      this.props.updateMapOptions({ mapOptions });
      this.forceUpdate();
    });
  }

  render() {
    return React.createElement(
      "div",
      { className: "layers" },
      React.createElement(apikeyField, {
        updateApikey: this.updateApikey
      }),
      React.createElement(
        "div",
        {},
        React.createElement(
          "div",
          { className: "addLayerRow" },
          React.createElement(
            "div",
            {
              className: "btn btn-success addLayer",
              onClick: this.addLayerSelectionRow
            },
            "Add a layer"
          )
        ),
        React.createElement(
          "div",
          { id: "testIdizzle" },
          this.props.layers.map(
            layer =>
              layer &&
              React.createElement(
                "div",
                {
                  className: "layerContainer",
                  key: layer.key,
                  "data-key": layer.key
                },
                React.createElement(createTileLayer, {
                  layer,
                  updateLayer: this.createLayer,
                  removeLayer: this.removeLayer,
                  apikey: this.state.apikey
                })
              )
          )
        )
      )
    );
  }
}

export default layersEditor;
