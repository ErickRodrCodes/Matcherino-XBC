(function(){
  'use strict';
  var xjs = require('xjs');
  var Item = xjs.Source;
  var myItem;
  var _cnf;
  var tempConfig = {};
  const PluginTitle = 'Matcherino Plugin for XBC';
  
  var initializePlugin = function(config){
    //Apply config on Load
    myItem.loadConfig().then(function(config) {
      updateHTML(config);
      updateData(config);
    });
    //Apply config on Save
    xjs.SourcePluginWindow.getInstance().on('save-config', function(config) {
      updateHTML(config);
      updateData(config);
    });
    updateData(config,true);
  };

  var updateHTML = function(config,isInitial) {
    const stateCheck = setInterval(() => {
      if (document.readyState === 'complete') {
        clearInterval(stateCheck);
        console.log('config',config)
        var nlbc = new startNLBC();
        var args = {
          ids: config.matcherinoIds.split(','),
          codes: config.matcherinoCodes.split(','),
          runLatest: config.isNotificationLatest,
          pos: config.goalsPosition,
          displayDonationTime: 5000,
          displayAnimationTime: 1000
        };
        nlbc._set('args',args);
        nlbc._set('ids', args.ids);
        nlbc._set('codes',args.codes);
        nlbc._set('position',args.pos);
        nlbc._set('runLatest',args.runLatest);
        nlbc.run();
      }
    }, 100);
  };

  //Merge config to tempConfig
  var updateData = function(config,isInitial) {    
    myItem.saveConfig(config);
  };


  xjs.ready()
  .then(Item.getCurrentSource)
  .then(function(item) {
    myItem = item;
    debugger;
    return item.loadConfig();
  })
  .then(function(config){
    _cnf = config;
    updateData(config, true);  
    return myItem.setName(PluginTitle);
  })
  .then(xjs.Item.getItemList)
  .then(listItems => {
    const currentItem = listItems[0];
    currentItem.setBrowserCustomSize(xjs.Rectangle.fromDimensions(1920,1080));
    currentItem.setPosition(xjs.Rectangle.fromCoordinates(0,0,1,1));
    currentItem.setPositionLocked(true);
    return myItem;
  })
  .then(function(item){   
    initializePlugin(_cnf);
  })
})();