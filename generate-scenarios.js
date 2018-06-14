// An array of URLs (strings) for backstop to test
const urls = [ ];

// The base URL (string) for your application
const baseUrl = "";

// The base Reference URL (string) for your application
const referenceBaseUrl = "";

var scenarios = [ ];

// Settings here will be applied to each scenario generated
function createScenario( url ) {
  return {
    "label": setLabel( url ),
    "cookiePath": "backstop_data/engine_scripts/cookies.json",
    "url": url,
    "referenceUrl": setReferenceUrl( url ),
    "readyEvent": "",
    "readySelector": "",
    "delay": 0,
    "hideSelectors": [],
    "removeSelectors": [],
    "hoverSelector": "",
    "clickSelector": "",
    "postInteractionWait": 0,
    "selectors": [],
    "selectorExpansion": true,
    "expect": 0,
    "misMatchThreshold" : 0.1,
    "requireSameDimensions": true
  }
};

function setLabel( url ){
  if ( url.slice( baseUrl.length ).length > 0 ) {
    page = url.slice( baseUrl.length + 1 );
    return page.concat( " page" );
  } else {
    return "homepage"
  }
};

function setReferenceUrl( url ) {
  if ( url.slice( baseUrl.length ).length > 0 ) {
    return referenceBaseUrl + url.slice( baseUrl.length )
  } else {
    return referenceBaseUrl
  }
};

urls.forEach( function( url ) {
  scenarios.push( createScenario( url ) );
});

// Template for your backstop.json configuration file. Add viewports and adjust
// global settings here
var testTemplate = {
  "id": "",
  "viewports": [
    {
      "label": "macbook pro 13",
      "width": 2560,
      "height": 1600
    }
  ],
  "onBeforeScript": "puppet/onBefore.js",
  "onReadyScript": "puppet/onReady.js",
  "scenarios": scenarios,
  "paths": {
    "bitmaps_reference": "backstop_data/bitmaps_reference",
    "bitmaps_test": "backstop_data/bitmaps_test",
    "engine_scripts": "backstop_data/engine_scripts",
    "html_report": "backstop_data/html_report",
    "ci_report": "backstop_data/ci_report"
  },
  "report": ["browser"],
  "engine": "puppeteer",
  "engineOptions": {
    "args": ["--no-sandbox"]
  },
  "asyncCaptureLimit": 5,
  "asyncCompareLimit": 50,
  "debug": false,
  "debugWindow": false
};

var json = JSON.stringify( testTemplate, null, 2 );

// Writes backstop.json to the current directory
const fs = require( 'fs' );
fs.writeFile( 'backstop.json', json, (err) => {
  if ( err ) throw err;
  console.log( 'Backstop configuration file successfully created' )
});
