// -- user-control.js --
//
// Launcher control using gamepad.

var gamepadIndex;
var mainGamepad = localStorage.pulsarMainGamepad;
var gamepads = navigator.getGamepads();
var prevBtnPressed = [ false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false ];
var prevAxis = [ 0, 0 ];
var gamepadLayout = JSON.parse( localStorage.pulsarGamepadLayout );

function checkGamepad() {
	var gamepad = navigator.getGamepads()[ mainGamepad ];
	if ( typeof gamepad == 'object' ) {
		if ( ( ( typeof showingMessage == 'boolean' ) && ( showingMessage ) ) || ( typeof showingMessage == 'function' ) ) {
			if ( ( gamepad.buttons[0].pressed && !prevBtnPressed[0] ) ||
				 ( gamepad.buttons[1].pressed && !prevBtnPressed[1] ) ||
				 ( gamepad.buttons[2].pressed && !prevBtnPressed[2] ) ||
				 ( gamepad.buttons[3].pressed && !prevBtnPressed[3] ) ) {
					hideMessage();
			} else if ( gamepad.buttons[gamepadLayout[0].button].pressed && !prevBtnPressed[gamepadLayout[0].button] ) {
					hideMessage( false );
			}
		} else {
			if ( typeof UCpre == 'function' ) UCpre();
			if ( ( ( gamepad.axes[1] < -0.5 ) && ( !(prevAxis[1] < -0.5) ) ) || ( gamepadLayout[2].button != '' && gamepad.buttons[gamepadLayout[2].button].pressed && !prevBtnPressed[gamepadLayout[2].button] ) ) {
				if ( typeof UCup == 'function' ) UCup();
			} else if ( ( ( gamepad.axes[1] > 0.5 ) && ( !(prevAxis[1] > 0.5) ) ) || ( gamepadLayout[3].button != '' && gamepad.buttons[gamepadLayout[3].button].pressed && !prevBtnPressed[gamepadLayout[3].button] ) ) {
				if ( typeof UCdown == 'function' ) UCdown();
			} else if ( ( ( gamepad.axes[0] < -0.5 ) && ( !(prevAxis[0] < -0.5) ) ) || ( gamepadLayout[4].button != '' && gamepad.buttons[gamepadLayout[4].button].pressed && !prevBtnPressed[gamepadLayout[4].button] ) ) {
				if ( typeof UCleft == 'function' ) UCleft();
			} else if ( ( ( gamepad.axes[0] > 0.5 ) && ( !(prevAxis[0] > 0.5) ) ) || ( gamepadLayout[5].button != '' && gamepad.buttons[gamepadLayout[5].button].pressed && !prevBtnPressed[gamepadLayout[5].button] ) ) {
				if ( typeof UCright == 'function' ) UCright();
			} else if ( gamepad.buttons[0].pressed && !prevBtnPressed[0] ) {
				if ( typeof UCAction1 == 'function' ) UCAction1();
			} else if ( gamepad.buttons[1].pressed && !prevBtnPressed[1] ) {
				if ( typeof UCAction2 == 'function' ) UCAction2();
			} else if ( gamepad.buttons[2].pressed && !prevBtnPressed[2] ) {
				if ( typeof UCAction3 == 'function' ) UCAction3();
			} else if ( gamepad.buttons[3].pressed && !prevBtnPressed[3] ) {
				if ( typeof UCAction4 == 'function' ) UCAction4();
			} else if ( gamepad.buttons[gamepadLayout[0].button].pressed && !prevBtnPressed[gamepadLayout[0].button] ) {
				if ( typeof UCActionBack == 'function' ) UCActionBack();
			} else if ( gamepad.buttons[gamepadLayout[1].button].pressed && !prevBtnPressed[gamepadLayout[1].button] ) {
				if ( typeof UCActionStart == 'function' ) UCActionStart();
			}
		}
		for ( i = 0; i < gamepad.buttons.length; i++ ) {
			prevBtnPressed[i] = gamepad.buttons[i].pressed;
		}
		prevAxis[0] = gamepad.axes[0];
		prevAxis[1] = gamepad.axes[1];
	}
	requestAnimationFrame( checkGamepad );
}

// Keyboard navigation for testing purposes

document.onkeydown = checkKey;
function checkKey ( event ) {
	var keycode = event.which;
	if ( typeof UCpre == 'function' ) UCpre();
	if ( keycode == '87' ){
		if ( typeof UCup == 'function' ) UCup();
	} else if ( keycode == '83' ){
		if ( typeof UCdown == 'function' ) UCdown();
	} else if ( keycode == '65' ){
		if ( typeof UCleft == 'function' ) UCleft();
	} else if ( keycode == '68' ){
		if ( typeof UCright == 'function' ) UCright();
	} else if ( keycode == '89' ){
		if ( typeof UCAction1 == 'function' ) UCAction1(); // 'y'
	} else if ( keycode == '85' ){
		if ( typeof UCAction2 == 'function' ) UCAction2(); // 'u'
	} else if ( keycode == '73' ){
		if ( typeof UCAction3 == 'function' ) UCAction3(); // 'i'
	} else if ( keycode == '79' ){
		if ( typeof UCAction4 == 'function' ) UCAction4(); // 'o'
	} else if ( keycode == '72' ){
		if ( typeof UCActionBack == 'function' ) UCActionBack(); // 'h'
	} else if ( keycode == '74' ){
		if ( typeof UCActionStart == 'function' ) UCActionStart(); // 'j'
	} else if ( keycode == '27' ){
		window.close();
	}
};

