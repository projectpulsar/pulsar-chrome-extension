// -- channel.js --
//
// Loads channels from the configuration file, presents a channel selection screen, and redirects to the game selection screen when a channel is selected.

var items;
var selectedItem;
var configURL = localStorage.pulsarConfig;

function initShowcase(){
	items = $( '.channels-slider' ). find( '.item' ).length;
	if ( items < 6 ) {
		for (i = 1; i <= ( 6 - items ); i++) {
			$( '.channels-slider' ).append( '<div class=\'item empty\'></div>' );
		}
	}
	$( '.channels-slider .item:first-child' ).addClass( 'selected-item' );
	$( '.channels-slider' ).slick({
		draggable: false,
		accesibility: false,
		arrows: false,
		speed: 100,
		rows: Math.ceil( $( '.item' ).length / 5 ),
		slidesPerRow: 5
	});
	$( '.channels-slider' ).on( 'beforeChange', function(event, slick, currentSlide, nextSlide){
		$( '.selected-item' ).removeClass( 'selected-item' );
	});
	$( '.channels-slider' ).on( 'afterChange', function(event, slick, currentSlide){
		$( '.selected-category .slick-center:not( .slick-cloned )' ).addClass( 'selected-item' );
	});
	$( '#channels' ).css( 'left', Math.round( ( $( '.channels-slider .item:first-child' ).outerWidth() / 2 ) * ( 5 - items ) ) + 'px' );
	$( 'body' ).animate( { opacity: 100 }, 100 );
	requestAnimationFrame( checkGamepad );
}

function UCpre(){
	items = $( '.item' ).length - 1;
	selectedItem = $( '.item' ).index( $( '.selected-item' ) );
}

function UCup(){
	if ( selectedItem > 4 ) {
		$( '.selected-item' ).removeClass( 'selected-item' );
		$( '.item' ).eq( selectedItem - 5).addClass( 'selected-item' );
		$( 'html, body' ).animate( { scrollTop: $( '.selected-item' ).offset().top - $( '#top-bar' ).outerHeight() - parseInt( $( '.selected-item' ).css( 'margin-top' ) ) }, 200 );
	}
}

function UCdown(){
	if ( ( selectedItem + 5) <= items ) {
		$( '.selected-item' ).removeClass( 'selected-item' );
		$( '.item' ).eq( selectedItem + 5 ).addClass( 'selected-item' );
		$( 'html, body' ).animate( { scrollTop: $( '.selected-item' ).offset().top - $( '#top-bar' ).outerHeight() - parseInt( $( '.selected-item' ).css( 'margin-top' ) ) }, 200 );
	}
}

function UCleft(){
	if ( ( selectedItem + 5 ) % 5 != 0 ) {
		$( '.selected-item' ).removeClass( 'selected-item' );
		$( '.item' ).eq( selectedItem - 1 ).addClass( 'selected-item' );
	}
}

function UCright(){
	if ( ( selectedItem < items ) && ( !$( '.item' ).eq( selectedItem + 1 ).hasClass( 'empty' ) ) && ( ( selectedItem + 1 ) % 5 != 0 ) ) {
		$( '.selected-item' ).removeClass( 'selected-item' );
		$( '.item' ).eq( selectedItem + 1 ).addClass( 'selected-item' );
	}
}

function UCAction1(){
	$( 'body' ).fadeOut( 100, function() {
		localStorage.pulsarChannel = $( '.selected-item' ).data( 'channel' );
		localStorage.pulsarRef = 'channels';
		window.location.href = 'main.html';
	});
}

$.ajax( configURL, {
	type : 'GET',
	dataType: 'json' } )
	.done( function( configuration ) {
		document.title = configuration.title;
		$('#top-bar, #top-blank').html( '<img src=\'' + configuration.logo + '\'></div>' );
		$.each( configuration.channels, function( order, channel ) {
			$( '.channels-slider' ).append( '<div class=\'item\' data-channel=\'' + order + '\'><img src=\'' + channel['thumbnail'] +'\'><div class=\'item-title\'>' + channel['title'] + '</div></div>' );
		});
		initShowcase();
	}
);
