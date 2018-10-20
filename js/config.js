// within your config HTML
var xjs = require('xjs');

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



var propsWindow = null;
var pluginConfig = null;
var currentSource = null;
const pluginKey = 'MatcherinoPluginForXBCv2.0.0';
const elements = {
  matcherinoCodes: $('#matcherinoCodes'),
  matcherinoIds: $('#matcherinoIds'),
  goalsPosition: $('#goalsPosition'),
  positionNotification: $('#positionNotification'),
  isNotificationLatest: $('#isNotificationLatest'),
  submitData: $('#submitData')
};

const updateConfig = function (item) {
  var config = {
    matcherinoCodes: elements.matcherinoCodes.val(),
    matcherinoIds: elements.matcherinoIds.val(),
    goalsPosition: elements.goalsPosition.find('option:selected').val(),
    positionNotification: elements.positionNotification.find('option:selected').val(),
    isNotificationLatest: elements.isNotificationLatest.is(":checked"),
    displayDonationTime: 5000,
    displayAnimationTime: 1000
  };
  localStorage.setItem(pluginKey,JSON.stringify(config));
  item.refresh();
};



// Option 1: Use XSplit's existing tab system
xjs.ready()
.then(function () {
  propsWindow = xjs.SourcePropsWindow.getInstance();
  propsWindow.useTabbedWindow({
    customTabs: ['Custom'],
    // Layout/Color/Transition are optional reusable XSplit tabs
    tabOrder: ['Custom', 'Layout', 'Color', 'Transition']
  });
  currentSource = xjs.Source.getCurrentSource();
  return currentSource
})
.then (item => item.loadConfig())
.then (config => {
  var ls = localStorage.getItem("pluginConfig");
  ls = JSON.parse(ls);
  if (ls === null) {
    pluginConfig = { 
      matcherinoIds: "12490", 
      matcherinoCodes: "ECT2018", 
      isNotificationLatest: true,
      positionNotification: 'bottom',
      displayDonationTime : 5000,
      displayAnimationTime : 1000
    };
    console.log("there is default data", pluginConfig);
  } else {
    pluginConfig = ls;
    console.log("there is data already saved", pluginConfig);
  }
  elements.matcherinoIds.val(pluginConfig.matcherinoIds);
  elements.matcherinoCodes.val(pluginConfig.matcherinoCodes);
  elements.positionNotification.val(pluginConfig.goalsPosition);
  elements.isNotificationLatest.prop("checked", pluginConfig.isNotificationLatest ? true : false );
  return currentSource
})
.then( currentSource => {
  $(function(){
    elements.submitData.on('click', function () {
      updateConfig(currentSource);
    });
  })
});