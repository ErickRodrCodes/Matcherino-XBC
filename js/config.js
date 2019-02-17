var count = 0;
(function () {
  'use strict';
  const PluginTitle = 'Matcherino Plugin for XBC v2.0.3';
  document.onselectstart = function (event) {
    var nodeName = event.target.nodeName;
    if (nodeName === "INPUT" || nodeName === "TEXTAREA" || nodeName === "XUI-INPUT" || nodeName === "XUI-SLIDER") {
      return true;
    }
    else {
      return false;
    }
  };
  document.onkeydown = function (event) {
    if ((event.target || event.srcElement).nodeName !== 'INPUT' &&
      (event.target || event.srcElement).nodeName !== 'TEXTAREA' &&
      (event.target || event.srcElement).nodeName !== 'XUI-SLIDER' &&
      (event.target || event.srcElement).nodeName !== 'XUI-INPUT' &&
      (event.target || event.srcElement).nodeName !== 'XUI-COLORPICKER' &&
      (event.target || event.srcElement).contentEditable !== true) {
      if (event.keyCode == 8)
        return false;
    }
  };
  document.oncontextmenu = function () { return false; };

  var xjs = require('xjs'),
    Item = xjs.Source,
    SourcePropsWindow = xjs.SourcePropsWindow;
  var currentSource;
  var temp = true;
  var _config = {};

  var elements = {
    matcherinoCodes: $('#matcherinoCodes'),
    matcherinoIds: $('#matcherinoIds'),
    goalsPosition: $('#goalsPosition'),
    positionNotification: $('#positionNotification'),
    isNotificationLatest: $('#isNotificationLatest'),
    submitData: $('#submitData')
  };

  var updateElements = function (config) {
    count++;
    console.log(count);
    console.trace('Trace Config', config);
    var matcherinoCodes = config.matcherinoCodes !== undefined ? config.matcherinoCodes : elements.matcherinoCodes.val();
    var matcherinoIds = config.matcherinoIds !== undefined ? config.matcherinoIds : elements.matcherinoIds.val();
    var goalsPosition = config.goalsPosition !== undefined ? config.goalsPosition : elements.goalsPosition.find('option:selected').val();
    elements.matcherinoCodes.val(matcherinoCodes);
    elements.matcherinoIds.val(matcherinoIds);
    $(`input[name="goalsPosition"][value=${goalsPosition}]`).prop('checked', true);

    if (config.isNotificationLatest === true || config.isNotificationLatest === "true") {
      config.isNotificationLatest = true;
      elements.isNotificationLatest.prop('checked', true);
    } else {
      config.isNotificationLatest = false;
    }
  };

  var updateConfig = function (item) {
    var config = {
      matcherinoCodes: elements.matcherinoCodes.val(),
      matcherinoIds: elements.matcherinoIds.val(),
      goalsPosition: $(`input[name="goalsPosition"]:checked`).val(),
      isNotificationLatest: $("#isNotificationLatest").is(":checked")
    };
    updateElements(config);
    item.requestSaveConfig(config);
    item.refresh();
  };

  xjs.ready().then(function () {
    var configWindow = SourcePropsWindow.getInstance();
    configWindow.useTabbedWindow({
      customTabs: [PluginTitle],
      tabOrder: [PluginTitle, 'Color', 'Layout', 'Transition']
    });
    return Item.getCurrentSource();
  }).then(function (myItem) {
    currentSource = myItem;
    return currentSource.loadConfig();
  }).then(function (config) {
    //set default data
    var cfg = {
      matcherinoCodes: config.matcherinoCodes === undefined ? "REALMS1" : config.matcherinoCodes,
      matcherinoIds: config.matcherinoIds === undefined ? "13736" : config.matcherinoIds,
      goalsPosition: config.goalsPosition === undefined ? "bottom" : config.goalsPosition,
      isNotificationLatest: config.isNotificationLatest === undefined ? false : config.isNotificationLatest
    };
    console.log('loadData on startup', cfg);
    updateElements(cfg);
    // initialize event listeners

    elements.submitData.on('click', function () {
      updateConfig(currentSource);
    });
  });
})();