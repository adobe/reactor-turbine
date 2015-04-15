function importModule(moduleFactory) {
  var module = {};
  moduleFactory(module);
  return module.exports;
}

_satellite.init({
  //"tools": {
  //  "f489afdcde1a53ef58aec319401144f7": {
  //    "engine": "sc",
  //    "loadOn": "pagebottom",
  //    "account": "aaronhardyprod",
  //    "euCookie": false,
  //    "sCodeURL": "7adf9ad51d40b4e06390693913f85f1a37e869de/s-code-contents-22c7cbe13317f4c9e99900c0b530d66471196f02-staging.js",
  //    "initVars": {
  //      "charSet": "UTF-8",
  //      "currencyCode": "TND",
  //      "referrer": "myreferreroverride",
  //      "campaign": "mycamp",
  //      "pageURL": "http://reallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverride",
  //      "trackInlineStats": true,
  //      "trackDownloadLinks": true,
  //      "linkDownloadFileTypes": "avi,css,csv,doc,docx,eps,exe,jpg,js,m4v,mov,mp3,pdf,png,ppt,pptx,rar,svg,tab,txt,vsd,vxd,wav,wma,wmv,xls,xlsx,xml,zip,fake",
  //      "trackExternalLinks": true,
  //      "linkInternalFilters": "javascript:,mailto:,tel:",
  //      "linkLeaveQueryString": false,
  //      "dynamicVariablePrefix": "$$",
  //      "eVar50": "toolevar50",
  //      "prop50": "toolprop50"
  //    }
  //  },
  "tools": {
    "da8f823508d51bfe232b1a9609a426dcbfce8709": {
      "accountId": "1351231"
    }
  },
  //},
  //"pageLoadRules": [{
  //  name: "KitchenSink",
  //  trigger: [{
  //    engine: "sc",
  //    command: "setVars",
  //    arguments: [{
  //      eVar10: "MyEvar10",
  //      eVar11: "MyEvar11",
  //      prop10: "MyProp10",
  //      prop11: "MyProp11",
  //      pageName: "MyPageName",
  //      channel: "MyChannel",
  //      pageURL: "http://reallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverride",
  //      campaign: "MyCampaign",
  //      hier1: "HierLev1|HierLev2|HierLev3|HierLev4"
  //    }]
  //  }, {engine:"sc",command:"addEvent",arguments:["event10:MyEvent10","event11:MyEvent11","prodView:MyProdView"]}, {
  //    engine: "tnt",
  //    command: "addMbox",
  //    arguments: [{mboxGoesAround: "", mboxName: "", arguments: [], timeout: "1500"}]
  //  }],
  //  event: "pagebottom"
  //}],
  "rules": [
    {
      "name":"Dead Header",
      "trigger": [
        {
          "tool":"da8f823508d51bfe232b1a9609a426dcbfce8709",
          "fulfillment": _satellite.executeModule(function(module) {
            module.exports = function(toolSettings, ruleSettings) {
              var url = 'http://target.adobe.com/' + toolSettings.accountId + '/getoffer';
              _satellite.io.get(url, {offer: ruleSettings.offer}, function(response){
                var el = _satellite.dom.querySelector(ruleSettings.container);

                if (el) {
                  el.innerHTML = response;
                }
              });
            };
          }),
          "settings": [
            {
              "offer":"myoffer",
              "container":".mycontainer"
            }
          ]
        }
      ],
      "conditions":[
        function(event,target){ return !_satellite.isLinked(target) }
      ],
      "selector": "h1, h2, h3, h4, h5",
      "event":"click",
      "bubbleFireIfParent":true,
      "bubbleFireIfChildFired":true,
      "bubbleStop":false
    }
  ]
  //"directCallRules": [
  //
  //],
  //"settings": {
  //  "trackInternalLinks": true,
  //  "libraryName": "satelliteLib-802733f55cb916def018044ee9a299e20898b26d",
  //  "isStaging": true,
  //  "allowGATTcalls": false,
  //  "downloadExtensions": /\.(?:doc|docx|eps|jpg|png|svg|xls|ppt|pptx|pdf|xlsx|tab|csv|zip|txt|vsd|vxd|xml|js|css|rar|exe|wma|mov|avi|wmv|mp3|wav|m4v)($|\&|\?)/i,
  //  "notifications": false,
  //  "utilVisible": false,
  //  "domainList": [
  //    "aaronhardy.com"
  //  ],
  //  "scriptDir": "7adf9ad51d40b4e06390693913f85f1a37e869de/scripts/",
  //  "tagTimeout": 3000
  //},
  //"data": {
  //  "URI":
  //  document.location.pathname + document.location.search
  //  ,
  //  "browser": {
  //  },
  //  "cartItems": [
  //
  //  ],
  //  "revenue": "",
  //  "host": {
  //    "http": "dtm.aaronhardy.com",
  //    "https": "dtm.aaronhardy.com"
  //  }
  //},
  //"dataElements": {
  //},
  //"appVersion": "52A",
  //"buildDate": "2015-03-16 20:55:42 UTC",
  //"publishDate": "2015-03-16 14:43:44 -0600"
});
