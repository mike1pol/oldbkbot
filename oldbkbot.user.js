// ==UserScript==
// @name      Oldbkbot
// @namespace http://oldbkbot.pz9.ru/
// @description    BOT for oldbk.com
// @include http://*.oldbk.com/*
// @match http://*.oldbk.com/*
// ==/UserScript==

(function(){
  var load = false;
  function ready() {
    if (load == false){
      load = true;
      if(document.URL.indexOf("/battle.php")!=-1){
        init_plugin();
      }
    }
  }
  function init_plugin(){
    var b = document.body;
    var jq_init = document.createElement("script");
    jq_init.setAttribute("type", "text/javascript");
    jq_init.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js");
    b.appendChild(jq_init);    
    var js_init = document.createElement("script");
    js_init.setAttribute("type", "text/javascript");
    js_init.setAttribute("src", "https://raw.github.com/MikleSol/oldbkbot/master/bot.js");
    b.appendChild(js_init);
  }
  if (document.addEventListener) {
    document.addEventListener("load", function() {
      ready()
    }, false)
  } else if (document.attachEvent) {

    if (document.documentElement.doScroll && window == window.top) {
      function tryScroll() {
        if (called) return
        if (!document.body) return
        try {
          document.documentElement.doScroll("left")
          ready()
        } catch (e) {
          setTimeout(tryScroll, 0)
        }
      }
      tryScroll()
    }

    window.attachEvent( "onload", ready );

    document.attachEvent("onreadystatechange", function() {
      if (document.readyState === "complete") {
        ready()
      }
    })
  }
  if (window.addEventListener)
    window.addEventListener('load', ready, false)
})();
