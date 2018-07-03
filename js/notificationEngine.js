
/**
 * Copyright (c) 2018 StreamOverlayPro, All rights reserved.
 * <licenseinfo@streamoverlaypro.com>
 * 
 * You may only use this file subject to direct and explicit grant of rights by StreamOverlayPro,
 * either by written license agreement or written permission.
 * 
 * You may use this file in its original or modified form solely for the purpose, and subject to the terms,
 * stipulated by the license agreement or permission.
 * 
 * If you have not received this file in source code format directly from StreamOverlayPro,
 * then you have no right to use this file or any part hereof.
 * Please delete all traces of the file from your system and notify StreamOverlayPro immediately.
 */
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}  
const canvasWidth = 1080;
let cacheDonators = [];
let listToClone;
let allowedWidth = 0;

/**
 * Copyright (c) 2018 StreamOverlayPro, All rights reserved.
 * <licenseinfo@streamoverlaypro.com>
 * 
 * You may only use this file subject to direct and explicit grant of rights by StreamOverlayPro,
 * either by written license agreement or written permission.
 * 
 * You may use this file in its original or modified form solely for the purpose, and subject to the terms,
 * stipulated by the license agreement or permission.
 * 
 * If you have not received this file in source code format directly from StreamOverlayPro,
 * then you have no right to use this file or any part hereof.
 * Please delete all traces of the file from your system and notify StreamOverlayPro immediately.
 */
var Queue = {
  setup: (params) => {
    this.queueContainer = params.queueContainer || '.queue';
    this.textNotice = params.textNotice || '.textNotice';
  },
  _storage: [],
  _execution: false,
  size: () => {
    return Queue._storage.length;
  },
  _push: (data) => {
    if (Queue._storage.length > 0) {
      Queue._storage.push(data);
    } else {
      Queue.enqueue(data);
    }
  },
  _animation: () => {
    var data = Queue._storage[0];
    var d = $.Deferred();
    $('.queue').html(data[0]);
    var widthObj = document.querySelectorAll('.queue')[0].getBoundingClientRect().width;
    $('.queue')
      .css({
        left: `-${widthObj + 40}px`
      }).animate({
        left: '0px'
      }, data[1], function () {
      })
      .delay(data[2])
      .animate({
        left: `-${widthObj + 40}px`
      }, data[1], function () {
        Queue.dequeue();
      });
  },
  enqueue: (data) => {
    Queue._storage.push(data);
    Queue._animation();
  },
  dequeue: () => {
    Queue._storage.shift();
    Queue._execution = false;
    if (Queue.size() > 0) {
      return Queue._animation();
    }
  }
};


class startNLBC {
  constructor(){
    this.args = null;
    this.ids = null;
    this.codes = null;
    this.position = null;
    this.runLatest = null;
    this.displayAnimationTime = null;
    this.displayDonationTime = null;
    this.cacheDonators = [];
    this.formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
    this.donationCashStr = '<span class="nContent"><img src="{0}" class="serviceLogo"/><img src="{1}" class="avatar"/> <span class="highlight">{2}</span> has donated <span class="highlight">{3}</span> in cash to {4}!</span>';
    this.donationCodeStr = '<span class="nContent"><img src="{0}" class="serviceLogo"/><img src="{1}" class="avatar"/> <span class="highlight">{2}</span> has donated <span class="highlight">{3}</span> using Matcherino Code {4}!</span>';
    this.donationRewaStr = '<span class="nContent"><img src="{0}" class="serviceLogo"/><img src="{1}" class="avatar"/> <span class="highlight">{2}</span> has added <span class="highlight">{3}</span> buying Matcherino rewards for {4}!</span>';
    this.twitchIcon = 'https://matcherino.com/public/3.6.4/img/Glitch_Purple_RGB.png';
    this.googleIcon = 'https://matcherino.com/public/3.6.4/img/btn_google_light_normal_ios.png';
    this.twitterIcon = 'https://matcherino.com/public/3.6.4/img/Twitter_Logo_Blue.png';
    this.dataRetriever = [];
    this.MatcherinoSkeletonItem = '<div class="tickerItem {0}">Code {0}: <span class="current">{1}</span>/<span class="total">{2}</span></div>';
    this.intervalObjs = [];
    this.Queue = Queue;
    this.cacheObject = [];
  }

  /**
   * [_set is an universal method to access properties on this class. it is advisable to use it rather than using a direct assignation.]
   * @param {String} variable [name of the property on the class]
   * @param {Any}    value    [the value the property will have]
   */
  _set(variable = '', value = undefined) {
    this[variable] = value;
    console.log(`this[${variable}]`, this[variable]);
  }
  /**
   * [_get is an universal method to get the value of a property of this class]
   * @param  {String} variable [name of the variable]
   * @return {Any}             [the value that such property has]
   */
  _get(variable = '') {
    console.trace(`this[${variable}]`, this[variable]);
    return this[variable];
  }

  run(){
    var self = this;
    console.log(self.args);
    self.displayDonationTime =  5000;
    self.displayAnimationTime = 1000;
    self.runLatest = self.args.runLatest;
    self.renderBars();
  }

  renderBars() {
    const rowTemplate = '<div class="matcherinoTicker {0}"></div>';
    let self = this;
    let _position = self.position || 'bottom';
    let tpl = rowTemplate.format(_position === 'bottom' ? 'matcherinoTickerBottom' : 'matcherinoTickerTop');
    $(tpl).appendTo('.container');
    
    self.fetchData();
  }

  fetchData(){
    let self = this;
    let _promises = [];

    self.ids.forEach((o,i) => {
      _promises.push(self.getMatcherinoData(o,self.codes[i]));
    });

    Promise.all(_promises)
    .then( results => {
      let transactions = [];
      $(".ovfailure").remove();

      results.forEach((o,i)=>{
        let itemContent = self.MatcherinoSkeletonItem.format(self.codes[i],`${self.formatter.format((o.balance/100))}`,`${self.formatter.format((o.meta.goal/100))}`);
        $(itemContent).appendTo('.matcherinoTicker');
      });
      $('.matcherinoTicker').animate({opacity: 1},1000);
      results.forEach((o,i)=>{
        transactions = transactions.concat(o.transactions);
      });
      //lets sort the transactions by ID
      transactions.sort((a,b) => {
        return a.id - b.id;
      });
      console.log('transactions', transactions);
      if(self.runLatest){
        transactions.forEach((o,i) => {
          let obj = {
            action : o.action,
            amount : o.amount,
            authProvider : o.authProvider,
            comment : o.comment,
            displayName : o.displayName,
            avatar: o.avatar,
            code: o.code
          };
          self.cacheDonators[o.id] = obj;
        });
        self.runlatest = false;
      } else {
        console.log('showing everything', self.runlatest);
        transactions.forEach((o,i) => {
          let obj = {
            action : o.action,
            amount : o.amount,
            authProvider : o.authProvider,
            comment : o.comment,
            displayName : o.displayName,
            avatar: o.avatar,
            code: o.code
          };
          self.cacheDonators[o.id] = obj;
          self.pushNotification(o);

        });
        
      }
      self.ids.forEach((o,i) => {
        self.refreshData(o,i,self.codes[i]);
      });
    })
    .catch( function(err){
      setTimeout(()=>{
        if($(".ovfailure").length === 0){
          $('<div class="ovfailure" style="position:absolute; bottom:0; left:0"><svg class="spinner" width="10px" height="10px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"><circle class="path" fill="none" stroke-width="10" stroke-linecap="round" cx="33" cy="33" r="30"></circle></svg></div>').appendTo('body');
        }
        self.fetchData();
      },1000);
      
    });
  }

  getMatcherinoData(id,code=false,tag=false){
    return new Promise((resolve,reject)=>{
      let _cache = new Date().getTime();
      let _url = `https://matcherino.com/__api/bounties/findById?cache=${_cache}&${id}`;
        $.ajax({
        url: _url,
        type:'POST',
        data : { [id]:true}, 
        jsonp : 'callback'
      })
      .done(function(data) {
        if(code){
          if data.
          data.body.transactions.forEach((o,i)=>{
            data.body.transactions[i].code = code;
          });
        }
        resolve(data.body);
      })
      .fail(function(){
        reject('data was not able to be read.');
      });
    });
  }

  refreshData(code,idx,tag){
    const self = this;
    if(typeof self.cacheObject[code] === 'undefined'){
      self.cacheObject[code] = [];
    }
    console.log('refreshData');
    let _obj = code;
    let _idx = idx;
    let _tag = tag;
    self.intervalObjs[idx] = setInterval(function() {
      let _cache = new Date().getTime();
      let _url = `https://matcherino.com/__api/bounties/findById?cache=${_cache}&${_obj}`;
        $.ajax({
        url: _url,
        type:'POST',
        data : { [_obj]:true}, 
        jsonp : 'callback'
      })
      .done(function(data) {
        data = data.body;
        let tpl = 'Code {0}: <span class="current">{1}</span>/<span class="total">{2}</span>';
        tpl = tpl.format(tag,`${self.formatter.format((data.balance/100))}`,`${self.formatter.format((data.meta.goal/100))}`);
        $('.'+tag).html(tpl);
        self.executeDonations(code,data.transactions,tag);
      });
    },1000);
  }

  /**
   * [executeDonations pushes a notification if a donation doesn't exist on the cacheDonators]
   * @param  {string} code [matcherino code]
   * @param  {object} data [object data of all the transactions to be compared]
   * @param  {[type]} tag  [description]
   * @return {[type]}      [description]
   */
  executeDonations (code,data,tag) {
    var self = this;
    if(typeof data !== undefined){
      data.forEach((o,i)=>{
      if(typeof self.cacheDonators[o.id] === 'undefined'){
        o.code = tag;
        self.pushNotification(o);
      }
    });
    }
  }

  pushNotification(o) {
    const self = this;
    let obj = {
      action : o.action,
      amount : o.amount,
      authProvider : o.authProvider,
      comment : o.comment,
      displayName : o.displayName,
      avatar: o.avatar,
      code : o.code
    };
    let str = "";
    let authP = "";
    switch(o.action){
      case 'revshare':
      str = self.donationRewaStr;
      break;
      case 'donate':
      str = self.donationCashStr;
      break;
      case 'coupon:use':
      str = self.donationCodeStr;
      break;
      default:
      str = self.donationRewaStr;
      break;
    }
    switch (o.authProvider){
      case 'gplus':
      authP = self.googleIcon;
      break;
      case 'twitch':
      authP = self.twitchIcon;
      if (o.avatar.length === 0) o.avatar = 'https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png?imenable=1&impolicy=user-profile-picture&imwidth=30';
      break;
      case 'twitter':
      authP = self.twitterIcon;
      o.displayName = `@${o.displayName}`;
      break;
      default:
      authP = self.twitchIcon;
      if (o.avatar.length === 0) obj.avatar = 'https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png?imenable=1&impolicy=user-profile-picture&imwidth=30';
      break;
    }
    //if(o.action === 'revshare'){
      self.Queue._push([
        str.format(
          authP,
          o.avatar,
          o.displayName,
          `${self.formatter.format(o.amount/100)}`,
          o.code),
        self.displayAnimationTime,
        self.displayDonationTime
      ]);
    //}
    
    self.cacheDonators[o.id] = obj;
  }
}

const stateCheck = setInterval(() => {
  if (document.readyState === 'complete') {
    clearInterval(stateCheck);
    var nlbc = new startNLBC();
    nlbc.run();
  }
}, 100);