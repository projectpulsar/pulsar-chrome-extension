// -- pulsar.js --
//
// Script for launching Pulsar from the extension (browser action) pop-up window (pulsar.html), and settings management.

var pulsarPlatform = 'chrome-extension';
var pulsarServerBase = 'https://projectpulsar.github.io/platform-resources';
var pulsarVersion = chrome.app.getDetails().version;
var pulsarServerFull = pulsarServerBase + '/' + pulsarPlatform + '/' + pulsarVersion.substr(0, pulsarVersion.lastIndexOf( '.' ) );

function launch() {
	chrome.windows.create( { url: 'app/intro.html?config=' + pulsarServerFull + '/pulsar.json', state: 'fullscreen' } );
}

function resetSettings() {
	localStorage.clear();
	document.getElementById( 'settings' ).innerHTML = 'default settings applied';
}

document.addEventListener( 'DOMContentLoaded', function () {
	document.getElementById( 'launcher-link' ).addEventListener( 'click', launch);
	document.getElementById( 'settings' ).addEventListener( 'click', resetSettings);
	if ( localStorage.length > 0 ) {
		document.getElementById( 'settings' ).innerHTML = "<a href='#'>reset settings</a>";
	}
});


