var showingMessage = false;

function urlParameter( parameter ) {
	var results = new RegExp( '[\?&]' + parameter + '=([^&#]*)' ).exec( window.location.href );
	if ( results !== null ) {	
		return decodeURI( results[1] );
	} else {
		return '';
	}
}

function showMessage( message, completed ) {
	$( '#message-box' ).html( message + "<br><br><span style='font-size: 1.8rem; font-style: normal; display: block; text-align: right'>press any button to continue</span>");
	showingMessage = completed || true;
	$( '#message-box' ).css( 'transform', 'translate( -' + Math.round( $( "#message-box" ).outerWidth() / 2 ) + 'px, -' + Math.round( $( "#message-box" ).outerHeight() / 2 ) + 'px )' );
	$( '#message-box' ).fadeTo( 200, 1 );
}

function hideMessage( execCompleted ) {
	execCompleted = typeof execCompleted !== 'undefined' ? execCompleted : true;
	$( '#message-box' ).fadeTo( 200, 0, function() {
		if ( ( typeof showingMessage == 'function' ) && execCompleted ) {
			showingMessage();
		}
		showingMessage = false;
	} );
}
