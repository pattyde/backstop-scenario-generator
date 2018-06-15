const fs = require( 'fs' );

// CONFIG
const urls = [ '' ]; // An array of URLs (strings) that you want to create scenarios for in Backstop
const baseUrl = ''; // The base URL (string) for your application, typically a local build or staging environment
const referenceBaseUrl = ''; // The base reference URL (string) for your application, typically your production envrionment
const testTemplate = { // Template for your backstop.json configuration file. Add viewports and adjust global settings here
	'id': '',
	'viewports': [
		{
			'label': 'macbook pro 13',
			'width': 2560,
			'height': 1600
		}
	],
	'onBeforeScript': 'puppet/onBefore.js',
	'onReadyScript': 'puppet/onReady.js',
	'scenarios': void(0),
	'paths': {
		'bitmaps_reference': 'backstop_data/bitmaps_reference',
		'bitmaps_test': 'backstop_data/bitmaps_test',
		'engine_scripts': 'backstop_data/engine_scripts',
		'html_report': 'backstop_data/html_report',
		'ci_report': 'backstop_data/ci_report'
	},
	'report': ['browser'],
	'engine': 'puppeteer',
	'engineOptions': {
		'args': ['--no-sandbox']
	},
	'asyncCaptureLimit': 5,
	'asyncCompareLimit': 50,
	'debug': false,
	'debugWindow': false
};

/**
 * Settings here will be applied to each scenario generated
 * label, url, and referenceUrl will be unique for each scenario based on the
 * urls constant
 *
 * @param  {string} url - The url for this scenario
 *
 * @return {object}     - The config object
 */
const createScenario = ( url ) => ({
	'label': setLabel( url ),
	'cookiePath': 'backstop_data/engine_scripts/cookies.json',
	'url': url,
	'referenceUrl': setReferenceUrl( url ),
	'readyEvent': '',
	'readySelector': '',
	'delay': 0,
	'hideSelectors': [],
	'removeSelectors': [],
	'hoverSelector': '',
	'clickSelector': '',
	'postInteractionWait': 0,
	'selectors': [],
	'selectorExpansion': true,
	'expect': 0,
	'misMatchThreshold' : 0.1,
	'requireSameDimensions': true
});

/**
 * Generate a label based on the url
 *
 * @param  {string} url - The url unprocessed
 *
 * @return {string}     - The label to be applied to the scenario
 */
const setLabel = ( url ) =>
	url.endsWith( baseUrl )
		? 'homepage'
		: page = url.slice( baseUrl.length + 1 ).concat(' page');

/**
 * Generate a reference url
 *
 * @param  {string} url - The url unprocessed
 *
 * @return {string}     - The reference url to be applied to the scenario
 */
const setReferenceUrl = ( url ) =>
	url.includes( baseUrl )
		? url.replace( baseUrl, referenceBaseUrl )
		: referenceBaseUrl;

/**
 * Generate json configuration file
 *
 * @param  {array}  urls     - A list of all urls
 * @param  {object} template - The template object
 *
 * @return {object}          - The finished object
 */
const generateObject = ( urls, template = testTemplate ) => {
	const scenarios = [];

	urls.forEach( function( url ) {
		scenarios.push( createScenario( url ) );
	});

	template.scenarios = scenarios;

	return testTemplate;
}

/**
 * Writes backstop.json to the current directory
 *
 * @param  {array}  allUrls  - A list of all urls
 * @param  {string} filename - The filname the json needs to be written to
 */
const writeFile = ( allUrls = urls, filename = 'backstop.json' ) => {
	let content = generateObject( allUrls );
	content = JSON.stringify( content, null, '\t' );

	fs.writeFile( filename, content, ( error ) => {
		if ( error ) {
			throw err;
		}

		console.log( 'Backstop configuration file successfully created' )
	});
}

// MAIN PROGRAMM
writeFile();
