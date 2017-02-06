// -- intro.js --
//
// Gamepad initialization and layout definition. Redirects to the channel or game selection pages.

var gamepads;
var mainGamepad;
var gamepadIndex;
var gamepadButtons;
var gamepadAxes;
var prevBtnPressed = [ true, true, true, true ];
var waitingAction = false;
var lastPressedButton;
var configURL = urlParameter( 'config' );
var configuration;
var pulsarVersion = chrome.app.getDetails().version;

document.onkeydown = function ( event ) {
	if ( event.which == '27' ) window.close();
};

function gamepadAnyButtonPressed() {
	for (var i = 0; i < 4; i++) {
		if ( gamepads[gamepadIndex].buttons[i].pressed ) {
			return true;
		}
	}
	return false;
}

function checkGamepad() {
	if ( typeof mainGamepad !== 'undefined' ) {
		var gamepad = navigator.getGamepads()[ mainGamepad ];
		if (	gamepad.id.includes( 'Vendor: 045e Product: 0719' ) ||	// XBox 360 wireless controller
				gamepad.id.includes( 'Vendor: 045e Product: 028e' ) ||	// XBox 360 wired controller
				gamepad.id.includes( 'Xbox 360' ) ) {					// XBox 360 Windows id style
					localStorage.pulsarGamepadLayout = JSON.stringify( [
						{ description: 'back', button: 8, gamepad_id: gamepad.id },
						{ description: 'start', button: 9, gamepad_id: gamepad.id },
						{ description: 'up', button: 12, gamepad_id: gamepad.id },
						{ description: 'down', button: 13, gamepad_id: gamepad.id },
						{ description: 'left', button: 14, gamepad_id: gamepad.id },
						{ description: 'right', button: 15, gamepad_id: gamepad.id }
					] );
		} else {
			for ( t = 0; t < gamepadLayout.length; t++ ) {
				if ( ( ( gamepadLayout[t].button === '' ) || ( gamepadLayout[t].gamepad_id !== gamepad.id ) ) && ( t < 2 || gamepadButtons >= 14 ) ) { // Minimum 14 buttons for d-pad support
					if ( waitingAction ) {
						for ( i = 4; i < gamepad.buttons.length; i++ ) {
							if ( gamepad.buttons[i].pressed && ( typeof lastPressedButton  == 'undefined' || !gamepad.buttons[lastPressedButton].pressed ) ) {
								lastPressedButton = i;
								prevBtnPressed[i] = true;
								gamepadLayout[t].button = i;
								gamepadLayout[t].gamepad_id = gamepad.id;
								localStorage.pulsarGamepadLayout = JSON.stringify( gamepadLayout );
								$( '#flex-row' ).fadeOut( 200, function() {
									waitingAction = false;
								});
								break;
							}
						}
					} else {
						waitingAction = true;
						$( '#flex-row' ).html( "<div class='flex-item'>press " + gamepadLayout[t].description + " button</div>" );
						$( '#flex-row' ).fadeIn( 200 );
						break;
					}
				}
			}
		}

		if ( !waitingAction ) {
			if ( configuration.channels.length == 1 ) {
				localStorage.pulsarChannel = 0;
				localStorage.pulsarRef = 'intro';
			}				
			if ( ( typeof localStorage.pulsarFirstTipShown == 'undefined' ) || ( localStorage.pulsarFirstTipShown !== pulsarVersion ) ) {
				showMessage( '<span class=\'button\'>Up/Down/Left/Right:</span> Change selection<br><span class=\'button\'>Button 1:</span> Enter channel/Play game<br><span class=\'button\'>Back:</span> Return to channel selection<br><span class=\'button\'>Back+Start:</span> Return to game selection<br><span class=\'button\'>ESC:</span> Exit Pulsar', function() {
					localStorage.pulsarFirstTipShown = pulsarVersion;
					if ( configuration.channels.length > 1 ) {
						window.location.href = 'channels.html';
					} else {
						window.location.href = 'main.html';
					}				
				});
				requestAnimationFrame( checkHideMessage );
			} else {
					if ( configuration.channels.length > 1 ) {
						window.location.href = 'channels.html';
					} else {
						window.location.href = 'main.html';
					}				
			}
		} else {
			requestAnimationFrame( checkGamepad );
		}

	} else {
		gamepads = navigator.getGamepads();
		for ( gamepadIndex=0; gamepadIndex < gamepads.length; gamepadIndex++ ) {
			if 	( gamepads[gamepadIndex] &&
				( typeof gamepads[gamepadIndex] == 'object' ) &&
				( typeof gamepads[gamepadIndex].buttons == 'object' ) ) {
					gamepadButtons = gamepads[gamepadIndex].buttons.length;
					if ( typeof gamepads[gamepadIndex].axes == 'object' ) {
						gamepadAxes = gamepads[gamepadIndex].axes.length;
					} else {
						gamepadAxes = 0;
					}
					if ( gamepadButtons >= 6 && gamepadAxes >= 2 ) {
						if ( gamepadAnyButtonPressed() ) {
							mainGamepad = gamepadIndex;
							localStorage.pulsarMainGamepad = mainGamepad;
							$( '#flex-row' ).fadeOut( 0 );
							break;
						}
					} else {
						$( '#flex-row' ).html( "<div class='flex-item'>minimum 2 axes and 6 buttons gamepad required</div>" );
					}
			}
		}
		requestAnimationFrame( checkGamepad );
	}
}

function checkHideMessage() {
	var gamepad = navigator.getGamepads()[ mainGamepad ];
	if ( typeof gamepad == 'object' ) {
		if ( ( ( typeof showingMessage == 'boolean' ) && ( showingMessage ) ) || ( typeof showingMessage == 'function' ) ) {
			if ( ( gamepad.buttons[0].pressed && !prevBtnPressed[0] ) ||
				 ( gamepad.buttons[1].pressed && !prevBtnPressed[1] ) ||
				 ( gamepad.buttons[2].pressed && !prevBtnPressed[2] ) ||
				 ( gamepad.buttons[3].pressed && !prevBtnPressed[3] ) ) {
					hideMessage();
			}
		}
	}
	for ( i = 0; i < 4; i++ ) {
		prevBtnPressed[i] = gamepad.buttons[i].pressed;
	}
	requestAnimationFrame( checkHideMessage );
}

localStorage.pulsarConfig = configURL;
localStorage.pulsarSelectedItem = 0;
localStorage.pulsarSelectedCategory = 0;

$.ajax( configURL, {
	type : 'GET',
	cache: false,
	dataType: 'json' } )
	.done( function( config ) {
		configuration = config;
		if ( typeof localStorage.pulsarGamepadLayout !== 'string' ) {
			localStorage.pulsarGamepadLayout = JSON.stringify( [
				{ description: 'back', button: '', gamepad_id: '' },
				{ description: 'start', button: '', gamepad_id: '' },
				{ description: 'up', button: '', gamepad_id: '' },
				{ description: 'down', button: '', gamepad_id: '' },
				{ description: 'left', button: '', gamepad_id: '' },
				{ description: 'right', button: '', gamepad_id: '' }
			] );
		}
		gamepadLayout = JSON.parse( localStorage.pulsarGamepadLayout );
		requestAnimationFrame( checkGamepad );
});
