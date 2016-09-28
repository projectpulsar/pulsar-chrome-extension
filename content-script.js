// -- content-script.js --
//
// If the current URL includes the parameter 'pulsarActive=yes', injects scripts for:
//  - Hiding mouse cursor and window scrollbar
//  - Declaring Pulsar environment variables
//  - Gamepad-keyboard mapping

var currentUrl;

function urlParameter( url, parameter ) {
	var results = new RegExp( '[\?&]' + parameter + '=([^&#]*)' ).exec( url );
	return decodeURI( results[1] );
}

chrome.runtime.sendMessage( { action: 'getUrl' }, function( response ) {
	currentUrl = response;
	if ( currentUrl.includes( 'pulsarActive=yes' ) ) {

		chrome.runtime.sendMessage( { action: 'getMainGamepad' }, function( response ) {
			var mainGamepad = response;

			var mainGamepadScript = document.createElement( 'script' );
			mainGamepadScript.innerText = 'var pulsarMainGamepad = ' + mainGamepad + ';';
			mainGamepadScript.onload = function() {
				this.parentNode.removeChild( this );
			};
			( document.head || document.documentElement ).appendChild( mainGamepadScript );

			chrome.runtime.sendMessage( { action: 'getGamepadLayout' }, function( response ) {
				var gamepadLayout = response;

				var gamepadLayoutScript = document.createElement( 'script' );
				gamepadLayoutScript.innerText = 'var pulsarGamepadLayout = ' + gamepadLayout + ';';
				gamepadLayoutScript.onload = function() {
					this.parentNode.removeChild( this );
				};
				( document.head || document.documentElement ).appendChild( gamepadLayoutScript );

				var pointerHideScript = document.createElement( 'script' );
				pointerHideScript.innerText = 'document.styleSheets[0].insertRule( "* { cursor: none !important }", 0 ); document.styleSheets[0].insertRule( "::-webkit-scrollbar { display: none !important }", 0 );';
				pointerHideScript.onload = function() {
					this.parentNode.removeChild( this );
				};
				( document.head || document.documentElement ).appendChild( pointerHideScript );

				var extensionUrlScript = document.createElement( 'script' );
				extensionUrlScript.innerText = 'var pulsarExtensionUrl = "chrome-extension://' + chrome.runtime.id + '";';
				extensionUrlScript.onload = function() {
					this.parentNode.removeChild( this );
				};
				( document.head || document.documentElement ).appendChild( extensionUrlScript );

				var selectedItem = urlParameter( currentUrl, 'pulsarSelectedItem' );
				var selectedItemScript = document.createElement( 'script' );
				selectedItemScript.innerText = 'var pulsarSelectedItem = ' + selectedItem + ';';
				selectedItemScript.onload = function() {
					this.parentNode.removeChild( this );
				};
				( document.head || document.documentElement ).appendChild( selectedItemScript );

				var keymap = urlParameter( currentUrl, 'pulsarKeymap' );
				if ( keymap != '' ) {
					var keymapScript = document.createElement( 'script' );
					keymapScript.innerText = 'var pulsarKeymap = ' + keymap + ';';
					keymapScript.onload = function() {
						this.parentNode.removeChild( this );
					};
					( document.head || document.documentElement ).appendChild( keymapScript );
				}

				var gamepadMappingScript = document.createElement( 'script' );
				gamepadMappingScript.src = chrome.extension.getURL( 'gamepad-mapping.js' );
				gamepadMappingScript.onload = function() {
					this.parentNode.removeChild( this );
				};
				( document.head || document.documentElement ).appendChild( gamepadMappingScript );

			});
		});

	}

});
