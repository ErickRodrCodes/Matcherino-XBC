const xjs = require('xjs');
const Source = xjs.Source;
var mySource = null;
var pluginConfig = null;
const pluginKey = "MatcherinoPluginForXBCv2.0.0";

// within the source HTML, we initialize the settings
xjs.ready()
.then(Source.getCurrentSource)
.then( currentSource => {
  mySource = currentSource;
  return mySource.loadConfig();
}).then( config => {
  // Do some checking to see if we already have settings saved.
  // The config should be empty if this is the first time the source is added.
  var ls = localStorage.getItem(pluginKey);
  pluginConfig = JSON.parse(ls);
  if (pluginConfig !== null) {
    console.log("source - there is data already saved", pluginConfig);
  }
  return mySource.setName("Matcherino Plugin for XBC V2.0");
}).then( mySource => {
  // Property setters are chainable, so they resolve with the same object!
  // This means you can continue setting any properties.
  return mySource.setKeepLoaded(true); // always keep loaded in memory
}).then( mySource => {
  // Continue initialization as necessary. We recommend saving a dummy
  // value in the configuration object to indicate that the defaults have
  // already been applied. If the user refreshes the source, you will
  // know not to override your user's position/size settings!
  if(pluginConfig !== null){
    var nlbc = new startNLBC();
    debugger;
    var args = {
      ids: pluginConfig.matcherinoIds,
      codes: pluginConfig.matcherinoCodes,
      runLatest: pluginConfig.isNotificationLatest,
      pos: pluginConfig.goalsPosition,
      displayDonationTime: 5000,
      displayAnimationTime: 1000
    };
    nlbc._set('args', args);
    nlbc._set('ids', args.ids.split(','));
    nlbc._set('codes', args.codes.split(','));
    nlbc._set('position', args.pos);
    nlbc._set('runLatest', args.runLatest);
    nlbc.run();
  }
});
  
