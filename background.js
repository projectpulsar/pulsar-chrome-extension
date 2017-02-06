// -- background.js --
//
// Privileged script providing some functions for non-privileged modules.

chrome.runtime.onMessageExternal.addListener( function(request, sender, sendResponse) {
	if (request) {
		if (request.message) {
			if (request.message == "getPulsarVersion") {
				sendResponse( chrome.app.getDetails().version );
			}
		}
	}
	return true;
});

chrome.runtime.onMessage.addListener(
	function( request, sender, sendResponse ) {
		if ( request.action == 'getUrl' ) {
			getUrl( sendResponse );
			return true;
		} else if ( request.action == 'getGamepadLayout' ) {
			getGamepadLayout( sendResponse );
			return true;
		} else if ( request.action == 'getMainGamepad' ) {
			getMainGamepad( sendResponse );
			return true;
		} else if ( request.action == 'getKeymap' ) {
			getKeymap( sendResponse );
			return true;
		}
});

function getUrl( sendResponse ){
	chrome.tabs.query( { 'active': true, 'lastFocusedWindow': true }, function ( tabs ) {
		sendResponse( tabs[0].url );
	});
}

function getGamepadLayout( sendResponse ){
	sendResponse( localStorage.pulsarGamepadLayout );
}

function getMainGamepad( sendResponse ){
	sendResponse( localStorage.pulsarMainGamepad );
}

function getKeymap( sendResponse ){
	sendResponse( JSON.stringify( localStorage.pulsarKeymap ) );
}
