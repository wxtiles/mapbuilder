//Change callbacks from the wxTiles api format:
//  callback(error, data, response)
//to this example's way:
//onSuccess(data), onError(error) 
var callbackAdapter = (onSuccess, onError) => {
  return (error, data, response) => {
    if(error) onError(error);
    else onSuccess(data);
  }
}



// /<ownerID>/layer/
var getAllLayers = (onSuccess, onError) => {
  //Make new adapter
  var callback = callbackAdapter(onSuccess, onError);
  wxTiles.getLayers("wxtiles", {}, callback);
}

var getInstance = ({layerId, instanceId, onSuccess, onError}) => {
  //Make new adapter
  var callback = callbackAdapter(onSuccess, onError);
  wxTiles.getInstance("wxtiles", layerId, instanceId, {}, callback);
}

// /<ownerID>/layer/<layerID>/<instanceID>/times/
var getTimesForInstance = (options) => {
  //Make new adapter
  var callback = callbackAdapter(onSuccess, onError);
  wxTiles.getTimes("wxtiles", options.layerId, options.instanceId, {}, callback);
}

// /<ownerID>/layer/<layerID>/<instanceID>/levels/
var getLevelsForInstance = (options) => {
  //Make new adapter
  var callback = callbackAdapter(onSuccess, onError);
  wxTiles.getLevels("wxtiles", options.layerId, options.instanceId, {}, callback);
}

// /<ownerID>/tile/<layerID>/<instanceID>/<time>/<level>/<z>/<x>/<y>.<extension>
var getTileLayerUrl = ({layerId, instanceId, time, level, onSuccess, onError}) => {
  onSuccess(wxTiles.getPNGTileURL("wxtiles", layerId, instanceId, time, level));
}

// https://api.wxtiles.com/v0/{ownerId}/legend/{layerId}/{instanceId}/{size}/{orientation}.png
var getLegendUrl = ({layerId, instanceId, onSuccess, onError}) => {
  onSuccess(`${server}/wxtiles/legend/${layerId}/${instanceId}/small/horizontal.png`)
}


//Call this with your url and plug the returned object into google maps.
//E.G:
//var mapLayer = wxTiles.google.getImageMapType(layerTilesUrl);
//googleMap.overlayMapTypes.setAt(layerKey, mapLayer);
var googleMaps = wxTiles.googleMaps;

export default { getAllLayers, getTimesForInstance, getTileLayerUrl, googleMaps, getInstance, getLegendUrl }
