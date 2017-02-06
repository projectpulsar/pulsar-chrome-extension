// -- custom-launcher.js --
//
// Opens a new fullscreen window, loading the intro.html, when called from the external custom-laucher.html web page.

configUrl = RegExp( '[\?&]config=([^&#]*)' ).exec( window.location.href )[1];
chrome.windows.create( { url: 'app/intro.html?config=' + configUrl, state: 'fullscreen' } );
window.history.back();
