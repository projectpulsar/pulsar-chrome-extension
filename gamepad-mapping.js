// -- pulsarGamepad-mapping.js --
//
// Gamepad-keyboard mapping + back-to-home function, using Pulsar pulsarGamepad configured layout.

var pulsarPrevBtnPressed = [ false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false ];
var pulsarPrevLeft = false;
var pulsarPrevRight = false;
var pulsarPrevDown = false;
var pulsarPrevUp = false;

function pulsarTriggerKeyboardKeydown( keyCode )
{
	var pulsarEventObj = document.createEvent( 'Events' );
	pulsarEventObj.initEvent( 'keydown', true, true );
	pulsarEventObj.keyCode = keyCode[ 0 ];
	pulsarEventObj.which = keyCode[ 0 ];
	if ( typeof keyCode[ 1 ] == 'number' ) pulsarEventObj.location = keyCode[ 1 ];
	window.dispatchEvent( pulsarEventObj );
}

function pulsarTriggerKeyboardKeyup( keyCode )
{
	var pulsarEventObj = document.createEvent( 'Events' );
	pulsarEventObj.initEvent( 'keyup', true, true );
	pulsarEventObj.keyCode = keyCode[ 0 ];
	pulsarEventObj.which = keyCode[ 0 ];
	if ( typeof keyCode[ 1 ] == 'number' ) pulsarEventObj.location = keyCode[ 1 ];
	window.dispatchEvent( pulsarEventObj );
}

function pulsarCheckGamepad() {
	var pulsarGamepad = navigator.getGamepads()[ pulsarMainGamepad ];
	if ( pulsarGamepad && typeof pulsarGamepad == 'object' ) {
		if ( typeof pulsarKeymap == 'object' ) {
			if ( typeof pulsarKeymap.button1 == 'object' ) {
				if ( pulsarGamepad.buttons[ 0 ].pressed ) {
					if ( !pulsarPrevBtnPressed[ 0 ] ) pulsarTriggerKeyboardKeydown( pulsarKeymap.button1 );
				} else if ( pulsarPrevBtnPressed[ 0 ] ) pulsarTriggerKeyboardKeyup( pulsarKeymap.button1 );
			}

			if ( typeof pulsarKeymap.button2 == 'object' ) {
				if ( pulsarGamepad.buttons[ 1 ].pressed ) {
					if ( !pulsarPrevBtnPressed[ 1 ] ) pulsarTriggerKeyboardKeydown( pulsarKeymap.button2 );
				} else if ( pulsarPrevBtnPressed[ 1 ] ) pulsarTriggerKeyboardKeyup( pulsarKeymap.button2 );
			}

			if ( typeof pulsarKeymap.button3 == 'object' ) {
				if ( pulsarGamepad.buttons[ 2 ].pressed ) {
					if ( !pulsarPrevBtnPressed[ 2 ] ) pulsarTriggerKeyboardKeydown( pulsarKeymap.button3 );
				} else if ( pulsarPrevBtnPressed[ 2 ] ) pulsarTriggerKeyboardKeyup( pulsarKeymap.button3 );
			}

			if ( typeof pulsarKeymap.button4 == 'object' ) {
				if ( pulsarGamepad.buttons[ 3 ].pressed ) {
					if ( !pulsarPrevBtnPressed[ 3 ] ) pulsarTriggerKeyboardKeydown( pulsarKeymap.button4 );
				} else if ( pulsarPrevBtnPressed[ 3 ] ) pulsarTriggerKeyboardKeyup( pulsarKeymap.button4 );
			}

			if ( typeof pulsarKeymap.up == 'object' ) {
				if ( pulsarGamepadLayout[2].button != '' ) {
					if ( pulsarGamepad.buttons[ pulsarGamepadLayout[2].button ].pressed ) {
						if ( !pulsarPrevBtnPressed[ pulsarGamepadLayout[2].button ] ) pulsarTriggerKeyboardKeydown( pulsarKeymap.up );
					} else if ( pulsarPrevBtnPressed[ pulsarGamepadLayout[2].button ] ) pulsarTriggerKeyboardKeyup( pulsarKeymap.up );
				}
				if ( pulsarGamepad.axes[1] < -0.5 ) {
					if ( !pulsarPrevUp ) pulsarTriggerKeyboardKeydown( pulsarKeymap.up );
				} else if ( pulsarPrevUp ) pulsarTriggerKeyboardKeyup( pulsarKeymap.up );
			}

			if ( typeof pulsarKeymap.down == 'object' ) {
				if ( pulsarGamepadLayout[3].button != '' ) {
					if ( pulsarGamepad.buttons[ pulsarGamepadLayout[3].button ].pressed ) {
						if ( !pulsarPrevBtnPressed[ pulsarGamepadLayout[3].button ] ) pulsarTriggerKeyboardKeydown( pulsarKeymap.down );
					} else if ( pulsarPrevBtnPressed[ pulsarGamepadLayout[3].button ] ) pulsarTriggerKeyboardKeyup( pulsarKeymap.down );
				}
				if ( pulsarGamepad.axes[1] > 0.5 ) {
					if ( !pulsarPrevDown ) pulsarTriggerKeyboardKeydown( pulsarKeymap.down );
				} else if ( pulsarPrevDown ) pulsarTriggerKeyboardKeyup( pulsarKeymap.down );
			}

			if ( typeof pulsarKeymap.left == 'object' ) {
				if ( pulsarGamepadLayout[4].button != '' ) {
					if ( pulsarGamepad.buttons[ pulsarGamepadLayout[4].button ].pressed ) {
						if ( !pulsarPrevBtnPressed[ pulsarGamepadLayout[4].button ] ) pulsarTriggerKeyboardKeydown( pulsarKeymap.left );
					} else if ( pulsarPrevBtnPressed[ pulsarGamepadLayout[4].button ] ) pulsarTriggerKeyboardKeyup( pulsarKeymap.left );
				}
				if ( pulsarGamepad.axes[0] < -0.5 ) {
					if ( !pulsarPrevLeft ) pulsarTriggerKeyboardKeydown( pulsarKeymap.left );
				} else if ( pulsarPrevLeft ) pulsarTriggerKeyboardKeyup( pulsarKeymap.left );
			}

			if ( typeof pulsarKeymap.right == 'object' ) {
				if ( pulsarGamepadLayout[5].button != '' ) {
					if ( pulsarGamepad.buttons[ pulsarGamepadLayout[5].button ].pressed ) {
						if ( !pulsarPrevBtnPressed[ pulsarGamepadLayout[5].button ] ) pulsarTriggerKeyboardKeydown( pulsarKeymap.right );
					} else if ( pulsarPrevBtnPressed[ pulsarGamepadLayout[5].button ] ) pulsarTriggerKeyboardKeyup( pulsarKeymap.right );
				}
				if ( pulsarGamepad.axes[0] > 0.5 ) {
					if ( !pulsarPrevRight ) pulsarTriggerKeyboardKeydown( pulsarKeymap.right );
				} else if ( pulsarPrevRight ) pulsarTriggerKeyboardKeyup( pulsarKeymap.right );
			}

			if ( typeof pulsarKeymap.back == 'object' ) {
				if ( pulsarGamepad.buttons[ pulsarGamepadLayout[0].button ].pressed ) {
					if ( !pulsarPrevBtnPressed[ pulsarGamepadLayout[0].button ] ) pulsarTriggerKeyboardKeydown( pulsarKeymap.back );
				} else if ( pulsarPrevBtnPressed[ pulsarGamepadLayout[0].button ] ) pulsarTriggerKeyboardKeyup( pulsarKeymap.back );
			}

			if ( typeof pulsarKeymap.start == 'object' ) {
				if ( pulsarGamepad.buttons[ pulsarGamepadLayout[1].button ].pressed ) {
					if ( !pulsarPrevBtnPressed[ pulsarGamepadLayout[1].button ] ) pulsarTriggerKeyboardKeydown( pulsarKeymap.start );
				} else if ( pulsarPrevBtnPressed[ pulsarGamepadLayout[1].button ] ) pulsarTriggerKeyboardKeyup( pulsarKeymap.start );
			}
		}

		if ( ( pulsarGamepad.buttons[ pulsarGamepadLayout[0].button ].pressed ) && ( pulsarGamepad.buttons[ pulsarGamepadLayout[1].button ].pressed ) ) {
			window.location.href = pulsarExtensionUrl + '/app/main.html?selectedItem=' + pulsarSelectedItem + '&selectedCategory=' + pulsarSelectedCategory;
		}

		for ( i = 0; i < pulsarGamepad.buttons.length; i++ ) {
			pulsarPrevBtnPressed[i] = pulsarGamepad.buttons[i].pressed;
		}

		pulsarPrevLeft = pulsarGamepad.axes[0] < -0.5;
		pulsarPrevRight = pulsarGamepad.axes[0] > 0.5;
		pulsarPrevDown = pulsarGamepad.axes[1] > 0.5;
		pulsarPrevUp = pulsarGamepad.axes[1] < -0.5;

	}
	requestAnimationFrame( pulsarCheckGamepad );
}

requestAnimationFrame( pulsarCheckGamepad );
