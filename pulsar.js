// -- pulsar.js --
//
// Script for launching Pulsar from the extension (browser action) pop-up window (pulsar.html), and settings management.

function launch() {
	chrome.windows.create( { url: 'app/intro.html', state: 'fullscreen' } );
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


