events = require('./events/events');

module.exports ={
"events": {
  'click': events.click
},
"tools": {
  "f489afdcde1a53ef58aec319401144f7": {
    "engine": "sc",
    "loadOn": "pagebottom",
    "account": "aaronhardyprod",
    "euCookie": false,
    "sCodeURL": "7adf9ad51d40b4e06390693913f85f1a37e869de/s-code-contents-22c7cbe13317f4c9e99900c0b530d66471196f02-staging.js",
    "initVars": {
      "charSet": "UTF-8",
      "currencyCode": "TND",
      "referrer": "myreferreroverride",
      "campaign": "MyToolCampaign",
      "pageURL": "http://reallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverride",
      "trackInlineStats": true,
      "trackDownloadLinks": true,
      "linkDownloadFileTypes": "avi,css,csv,doc,docx,eps,exe,jpg,js,m4v,mov,mp3,pdf,png,ppt,pptx,rar,svg,tab,txt,vsd,vxd,wav,wma,wmv,xls,xlsx,xml,zip,fake",
      "trackExternalLinks": true,
      "linkInternalFilters": "javascript:,mailto:,tel:",
      "linkLeaveQueryString": false,
      "dynamicVariablePrefix": "$$",
      "eVar50": "toolevar50",
      "prop50": "toolprop50"
    }
  },
  "da8f823508d51bfe232b1a9609a426dcbfce8709": {
    "engine": "tnt",
    "mboxURL": "7adf9ad51d40b4e06390693913f85f1a37e869de/mbox-contents-da8f823508d51bfe232b1a9609a426dcbfce8709-staging.js",
    "loadSync": true,
    "pageParams": {}
  }
},
extensions: {
  'abcdef': {
    instanceId: 'abcdef',
    extensionId: 'adobeAnalytics',
    settings: {
      account: 'aaronhardyprod',
      euCookie: false,
      trackVars: {
        charSet: 'UTF-8',
        currencyCode: 'TND',
        referrer: 'myreferreroverride',
        campaign: 'MyToolCampaign',
        pageURL: "http://reallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverride",
        trackInlineStats: true,
        trackDownloadLinks: true,
        linkDownloadFileTypes: "avi,css,csv,doc,docx,eps,exe,jpg,js,m4v,mov,mp3,pdf,png,ppt,pptx,rar,svg,tab,txt,vsd,vxd,wav,wma,wmv,xls,xlsx,xml,zip,fake",
        trackExternalLinks: true,
        linkInternalFilters: "javascript:,mailto:,tel:",
        linkLeaveQueryString: false,
        dynamicVariablePrefix: "$$",
        eVar50: "toolevar50",
        prop50: "toolprop50",
        // TODO: Why is this in the var list and not a direct child of settings? (currently follows Tool structure)
        dc: '122'
      }
    }
  }
},
newRules: [{
  // TODO Needs event stuff.
  name: 'Test Rule',
  actions: [{
    extensionInstanceIds: ['abcdef'],
    method: 'trackPageView',
    settings: {
      trackVars: {
        eVar10: 'MyEvar10',
        eVar11: 'MyEvar11',
        prop10: 'MyProp10',
        prop11: 'MyProp11',
        pageName: 'MyPageName',
        channel: 'MyChannel',
        pageURL: "http://reallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverride",
        campaign: 'MyRuleCampaign',
        hier1: "HierLev1|HierLev2|HierLev3|HierLev4"
      },
      trackEvents: [
        "event10:MyEvent10",
        "event11:MyEvent11",
        "prodView:MyProdView"
      ]
    }
  }]
},{
  name: 'Dead Header Rule',
  event: {
    type: 'click',
    settings: {
      selector: 'h1, h2, h3, h4, h5'
    },
  },
  conditions: [
    function(event, target) {
      return !_satellite.utils.isLinked(target);
    }
  ],
  actions: [{
    extensionInstanceIds: ['abcdef'],
    method: 'trackLink',
    settings: {
      trackVars: {
        linkType: 'o',
        linkName: 'MyLink',
        pageName: 'MyPageName',
        eVar20: 'MyDeadHeaderEvar',
        prop20: 'D=v20',
        campaign: _satellite.utils.queryParams.getQueryParam('dead')
      },
      trackEvents: [
        'event20:deadevent'
      ]
    }
  }]
},{
  name: 'Crazy Test Rule',
  event: {
    type: 'click',
    settings: {
      selector: 'h1, h2, h3, h4, h5',
      'bubbleFireIfParent': true,
      'bubbleFireIfChildFired': false,
      'bubbleStop': true,
      'property': {
        'className': 'test'
      },
//      'eventHandlerOnElement': true
    },
  },
  conditions: [
    function(event, target) {
      return !_satellite.utils.isLinked(target);
    }
  ],
  actions: [{
    extensionInstanceIds: ['abcdef'],
    method: 'trackLink',
    settings: {
      trackVars: {
        linkType: 'o',
        linkName: 'MyLink',
        pageName: 'MyPageName',
        eVar20: 'MyDeadHeaderEvar',
        prop20: 'D=v20',
        campaign: _satellite.utils.queryParams.getQueryParam('dead')
      },
      trackEvents: [
        'event20:deadevent'
      ]
    }
  }]
}],

"pageLoadRules": [{
  name: "KitchenSink",
  trigger: [{
    engine: "sc",
    command: "setVars",
    arguments: [{
      eVar10: "MyEvar10",
      eVar11: "MyEvar11",
      prop10: "MyProp10",
      prop11: "MyProp11",
      pageName: "MyPageName",
      channel: "MyChannel",
      pageURL: "http://reallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverride",
      campaign: "MyRuleCampaign",
      hier1: "HierLev1|HierLev2|HierLev3|HierLev4"
    }]
  }, {
    engine: "sc",
    command: "addEvent",
    arguments: ["event10:MyEvent10", "event11:MyEvent11", "prodView:MyProdView"]
  }, {
    engine: "tnt",
    command: "addMbox",
    arguments: [{
      mboxGoesAround: "",
      mboxName: "",
      arguments: [],
      timeout: "1500"
    }]
  }],
  event: "pagebottom"
}],
"rules": [{
    "name": "Dead Header",
    "trigger": [{
      "engine": "sc",
      "command": "trackLink",
      "arguments": [{
        "type": "o",
        "linkName": "MyLink",
        "setVars": {
          "eVar20": "MyDeadHeaderEvar",
          "prop20": "D=v20",
          "campaign": _satellite.utils.queryParams.getQueryParam('dead')
        },
        "addEvent": ["event20:deadevent"]
      }]
    }],
    "conditions": [function(event, target) {
      return !_satellite.utils.isLinked(target)
    }],
    "selector": "h1, h2, h3, h4, h5",
    "event": "click",
    "bubbleFireIfParent": true,
    "bubbleFireIfChildFired": true,
    "bubbleStop": false
  }
  //{"name":"Dead Header","trigger":[{"engine":"sc","command":"trackPageView","arguments":[{"type":"o","linkName":"MyLink","setVars":{"eVar20":"MyDeadHeaderEvar","prop20":"D=v20","campaign":
  //    SL.getQueryParam('dead')
  //},"addEvent":["event20:deadevent"]}]}],"conditions":[function(event,target){
  //  return !_satellite.utils.isLinked(target)
  //}],"selector":"h1, h2, h3, h4, h5","event":"click","bubbleFireIfParent":true,"bubbleFireIfChildFired":true,"bubbleStop":false},
  //{"name":"Download Link","trigger":[{"engine":"sc","command":"trackLink","arguments":[{"type":"d","linkName":"%this.href%"}]},{"command":"delayActivateLink"}],"selector":"a","event":"click","bubbleFireIfParent":true,"bubbleFireIfChildFired":true,"bubbleStop":false,"property":{"href":/\.(?:doc|docx|eps|xls|ppt|pptx|pdf|xlsx|tab|csv|zip|txt|vsd|vxd|xml|js|css|rar|exe|wma|mov|avi|wmv|mp3|wav|m4v)($|\&|\?)/i}}
],
"directCallRules": [

],
"settings": {
  "trackInternalLinks": true,
  "libraryName": "satelliteLib-802733f55cb916def018044ee9a299e20898b26d",
  "isStaging": true,
  "allowGATTcalls": false,
  "downloadExtensions": /\.(?:doc|docx|eps|jpg|png|svg|xls|ppt|pptx|pdf|xlsx|tab|csv|zip|txt|vsd|vxd|xml|js|css|rar|exe|wma|mov|avi|wmv|mp3|wav|m4v)($|\&|\?)/i,
  "notifications": false,
  "utilVisible": false,
  "domainList": [
    "aaronhardy.com"
  ],
  "scriptDir": "7adf9ad51d40b4e06390693913f85f1a37e869de/scripts/",
  "tagTimeout": 3000
},
"data": {
  "URI": document.location.pathname + document.location.search,
  "browser": {},
  "cartItems": [

  ],
  "revenue": "",
  "host": {
    "http": "dtm.aaronhardy.com",
    "https": "dtm.aaronhardy.com"
  }
},
"dataElements": {},
"appVersion": "52A",
"buildDate": "2015-03-16 20:55:42 UTC",
"publishDate": "2015-03-16 14:43:44 -0600"
};
