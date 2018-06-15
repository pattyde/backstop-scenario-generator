#!/usr/bin/env node

const fs = require( 'fs' );
const url = require( 'url' );
const path = require( 'path' );

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
 * urls constant
 *
 * @param  {string} url - The url for this scenario
 *
 * @return {object}     - The config object
 */
const createScenario = ( url, referenceUrl ) => ({
	'label': setLabel( url ),
	'cookiePath': 'backstop_data/engine_scripts/cookies.json',
	'url': url,
	'referenceUrl': setReferenceUrl( url, referenceUrl ),
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

const getSettings = () => {
	const cwd = process.cwd();
	const pkg = fs.readFileSync( `${cwd}/package.json`, 'utf8' );
	return JSON.parse( pkg )['backstop-scenario-generator'];
}

/**
 * Generate a label based on the url
 *
 * @param  {string} url - The url unprocessed
 *
 * @return {string}     - The label to be applied to the scenario
 */
const setLabel = ( thisUrl ) =>
	thisUrl.endsWith( url.parse( thisUrl ).hostname )
		? 'homepage'
		: `${thisUrl.replace( url.parse( thisUrl ).hostname, '' )} page`;

/**
 * Generate a reference url
 *
 * @param  {string} url - The url unprocessed
 *
 * @return {string}     - The reference url to be applied to the scenario
 */
const setReferenceUrl = ( thisUrl, referenceUrl ) =>
	thisUrl.includes( url.parse( thisUrl ).hostname )
		? thisUrl.replace( url.parse( thisUrl ).hostname, referenceUrl )
		: referenceUrl;

		// append path to the end of referenceUrl
		// get first bit of url, returns the first bit of url incuding protocol, host, port, then replace with nothing or the referenceUrl

// const parseUrl = ( thisUrl ) =>
// 	url.parse ( thisUrl ).origin;

/**
 * Generate json configuration file
 *
 * @param  {array}  urls     - A list of all urls
 * @param  {object} template - The template object
 *
 * @return {object}          - The finished object
 */
const generateObject = ( settings, template = testTemplate ) => {
	const scenarios = [];
	settings.urls.forEach( url => {
		scenarios.push( createScenario( url, settings.referenceUrl ) );
	});

	template.scenarios = scenarios;

	return template;
}

/**
 * Writes backstop.json to the current directory
 *
 * @param  {array}  allUrls  - A list of all urls
 * @param  {string} filename - The filname the json needs to be written to
 */
const writeFile = ( settings, filename = 'backstop.json' ) => {
	let content = generateObject( settings, testTemplate );
	content = JSON.stringify( content, null, '\t' );

	fs.writeFile( filename, content, ( error ) => {
		if ( error ) {
			throw err;
		}

		console.log( 'Backstop configuration file successfully created' )
	});
}

// MAIN PROGRAMM

const settings = getSettings();
writeFile( settings );
