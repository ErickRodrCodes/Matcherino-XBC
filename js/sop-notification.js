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
  setup : (params) => {
    this.queueContainer = params.queueContainer || '.queue';
    this.textNotice = params.textNotice || '.textNotice';
   },
  _storage : [],
  _execution:false,
  size : () => {
    return Queue._storage.length;
  },
  _push : (data) => {
    if(Queue._storage.length > 0){
      Queue._storage.push(data);
    } else {
      Queue.enqueue(data);
    }
  },
  _animation : () => {
      var data = Queue._storage[0];
      var d = $.Deferred();
      $('.queue').html(data[0]);
      var widthObj = document.querySelectorAll('.queue')[0].getBoundingClientRect().width;
      $('.queue')
      .css({
        left:`-${widthObj + 40}px`
      }).animate({
        left:'0px' 
      },data[1],function(){
      })
      .delay(data[2])
      .animate({
        left:`-${widthObj + 40}px`
      },data[1],function(){
        Queue.dequeue();
      });
  },
  enqueue : (data) => {
    Queue._storage.push(data);
    Queue._animation();
  },
  dequeue : () => {
    Queue._storage.shift();
    Queue._execution = false;
    if(Queue.size() > 0){
      return Queue._animation();
    }
  }
};
