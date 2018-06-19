#!/usr/bin/env node

const fs = require( 'fs' );
const url = require( 'url' );
const path = require( 'path' );
const prompt = require( 'prompt' );
const getSiteUrls = require( 'get-site-urls' );

// CONFIG

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
 * scenarioUrl
 *
 * @param  {string} scenarioUrl 		- The URL to test for this scenario
 * @param  {string} referenceUrl 		- The URL to test against for this scenario
 *
 * @return {object}									- The scenario object
 */
const createScenario = ( scenarioUrl, settings ) => ({
	'label': setLabel( scenarioUrl, settings ),
	'cookiePath': 'backstop_data/engine_scripts/cookies.json',
	'url': scenarioUrl,
	'referenceUrl': setReferenceUrl( scenarioUrl, settings[ 'Reference URL' ] ),
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
 * Generate a unique label based on the url
 *
 * @param  {string} scenarioUrl	- The url unprocessed
 *
 * @return {string}							- The label for the scenario
 */
const setLabel = ( scenarioUrl, settings ) =>
	scenarioUrl === settings['Test URL']
		? 'homepage'
		: `${ url.parse( scenarioUrl ).path } page`;

/**
 * Generate a reference url
 *
 * @param  {string} scenarioUrl	- The url unprocessed
 *
 * @return {string}							- The reference url for the scenario
 */
const setReferenceUrl = ( scenarioUrl, referenceUrl ) =>
	referenceUrl + url.parse( scenarioUrl ).path;

/**
 * Generate JSON configuration file
 *
 * @param  {object} settings		- Settings object from the console prompt
 * @param  {object} template		- The template object
 *
 * @return {object}							- The finished object
 */
const generateObject = async ( settings, template = testTemplate ) => {
	const scenarios = [];
	const urls = await getSiteUrls( settings['Test URL'] );
	urls.pages.forEach( scenarioUrl => {
		scenarios.push( createScenario( scenarioUrl, settings ) );
	});

	template.scenarios = scenarios;

	return template;
}

/**
 * Writes backstop.json to the current directory
 *
 * @param  {string} filename - The filname for the configuration file
 */
const writeFile = async ( settings, filename = 'backstop.json' ) => {
	let content = await generateObject( settings, testTemplate );
	content = JSON.stringify( content, null, '\t' );

	fs.writeFile( filename, content, ( error ) => {
		if ( error ) {
			throw err;
		}

		console.log( 'Backstop configuration file successfully created' )
	});
}

// MAIN PROGRAMM
prompt.message = '';
prompt.start();

/**
 * Get test URL and reference URL from the user
 *
 * @return {object}		Settings object with test and reference URLs
*/
prompt.get([ 'Test URL', 'Reference URL' ], ( err, result ) => {
	const settings = result;
	writeFile( settings );
});
