// -- main.js --
//
// Pulsar main screen script. Loads a channel and presents a gamepad controlled launcher.

var pulsarPlatform = 'chrome-extension';
var pulsarServerBase = 'https://projectpulsar.github.io/platform-resources';
var pulsarVersion = chrome.app.getDetails().version;
var categories;
var showingMessage = false;

function showMessage( message, completed ) {
	$( '#message-box' ).html( message + "<br><br><span style='font-size: 1.8rem; font-style: normal; display: block; text-align: right'>press any button to continue</span>");
	showingMessage = completed || true;
	$( '#message-box' ).css( 'transform', 'translate( -' + Math.round($("#message-box").outerWidth() / 2) + 'px, -' + Math.round($("#message-box").outerHeight() / 2) + 'px )' );
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

var channelURL = pulsarServerBase + '/' + pulsarPlatform + '/' + pulsarVersion + '/main.json';

document.addEventListener( 'DOMContentLoaded', function () {
	$.ajax( channelURL, {
		type : 'GET',
		cache: false,
		dataType: 'json' } )
		.done( function( channel ) {
			$.each( channel, function( channelTitle, categories ) {
				$( '#top-bar' ).html( 'pulsar' );
				$.each( categories, function( categoryTitle, category ) {
					$( '#showcase' ).append( '<div class="category"></div>' );
					$( '.category' ).last().append( '<div class="category-title">' + categoryTitle +'</div>' );
					contentType = category[ 'content-type' ];
					$( '.category' ).last().append( '<div class="category-content"></div>' );
					$( '.category-content' ).last().append( '<div class="showcase-slider"></div>' );
					$.each( category.items, function( order, item ) {
						switch( contentType ) {
						case 'web':
							var newItem = $( '<div class="item"><img src="' + item.thumbnail +'"></div>' );
							newItem.data( 'title', item.title || '-' );
							newItem.data( 'author', item.author || '-' );
							if ( typeof item.info !== 'undefined' ) {
								newItem.data( 'info', $('<div>' + item.info + '</div>').text().toUpperCase() );
							} else {
								newItem.data( 'info', '' );
							}
							newItem.data( 'url', item.url + '?pulsarActive=yes&pulsarKeymap=' + item.keymap || '' );
							$( '.showcase-slider' ).last().append( newItem );
							if ( ( $( '.category' ).last().find( '.item' ).length == category.items.length ) && ( $( '.category' ).length == Object.keys( categories ).length ) ) { initShowcase(); };
							break;
						}
					});
				});
			});
		})
		.fail(function() {
			$( '#container' ).css( 'opacity', '100' );
			requestAnimationFrame( checkGamepad );
			showMessage( 'Error loading channel content', function() { window.location.reload( false ); } );
		});
});

function initShowcase() {
	var selectedItemUrl = new RegExp( '[\?&]selectedItem=([^&#]*)' ).exec( window.location.href );
	if ( selectedItemUrl === null ) {
		var selectedItem = 0;
	} else {
		var selectedItem = parseInt( decodeURI( selectedItemUrl[1] ) );
	}
	$( '#showcase .category:first-child' ).addClass( 'selected-category' );
	$( '.category-content' ).append( '<div class="info"><div class="info-title"></div><div class="info-author"></div></div>' );
	categories = ( $( '.category' ).length ) -1;
	$( '.showcase-slider' ).each( function() {
		var items = $( this ). find( '.item' ).length;
		if ( items < 3 ) {
			for (i = 1; i <= ( 6 - items ); i++) {
				$( this ).append( '<div class="item empty"></div>' );
			}
		} else if ( items < 6 ) {
			$( this ).find( '.item' ).clone( true ).appendTo( $( this ) );
		}
	});
	$( '.showcase-slider' ).slick({
		centerPadding: '1%',
		draggable: false,
		accesibility: false,
		arrows: false,
		centerMode: true,
		infinite: true,
		speed: 100,
		slidesToShow: 5,
		initialSlide: selectedItem
	});
	$( '.showcase-slider' ).on( 'beforeChange', function( event, slick, currentSlide, nextSlide ){
		$( '.selected-item' ).removeClass( 'selected-item' );
		$( '.selected-category' ).find( '.info-title, .info-author' ).animate( { opacity: 0 }, 50 );
	});
	$( '.showcase-slider' ).on( 'afterChange', function(event, slick, currentSlide){
		$( '.selected-category .slick-center:not( .slick-cloned )' ).addClass( 'selected-item' );
		refreshInfo();
		$( '.selected-category' ).find( '.info-title, .info-author' ).animate( { opacity: 1 }, 50 );
	});
	$( '.selected-category .slick-center:not( .slick-cloned )' ).addClass( 'selected-item' );
	refreshInfo();
	$( '.category-content' ).hide();
	$( '.selected-category .category-content' ).show();
	if ( ( typeof localStorage.pulsarFirstTipShown == 'undefined' ) || ( localStorage.pulsarFirstTipShown !== pulsarVersion ) ) {
		showMessage( 'Left/Right: Change selection<br>Button 1: Play selected item<br>Back+Start: Return to the main screen<br>ESC: Exit Pulsar', function() {
			localStorage.pulsarFirstTipShown = pulsarVersion;
			$( '#container' ).animate( { opacity: 100 } );
		});
	} else {
		$( '#container' ).animate( { opacity: 100 } );
	}
	requestAnimationFrame( checkGamepad );
}

function changeCategory( increment ) {
	var selectedCategory = $( '.selected-category' ).index();
	var prevCategoryContent = $( '.selected-category .category-content' );
	$( '.selected-category' ).removeClass( 'selected-category' );
	$( '.selected-item' ).removeClass( 'selected-item' );
	selectedCategory = selectedCategory + increment;
	if ( selectedCategory < 0 ) { selectedCategory = categories };
	if ( selectedCategory > categories ) { selectedCategory = 0 };
	$( '.category' ).eq(selectedCategory).addClass( 'selected-category' );
	$( '.selected-category .slick-center:not( .slick-cloned )' ).addClass( 'selected-item' );
	prevCategoryContent.slideUp( 150, function() {
		$( 'html, body' ).animate( { scrollTop: $( '.selected-category' ).offset().top - $( '#top-bar' ).outerHeight() }, 100 );
	} );
	$( '.selected-category .category-content' ).slideDown( 150 );
	refreshInfo();
}

function refreshInfo() {
	$( '.selected-category .info-title' ).text( $( '.selected-item' ).data( 'title' ) );
	$( '.selected-category .info-author' ).text( $( '.selected-item' ).data( 'author' ) );
}

function UCup(){
	if ( categories > 0 ) { changeCategory( -1 ) };
}

function UCdown(){
	if ( categories > 0 ) { changeCategory( 1 ) };
}

function UCleft(){
	if ( !$( '.selected-category .selected-item' ).prev().hasClass( 'empty' ) ) {		
		$( '.selected-category .showcase-slider' ).slick( 'slickPrev' );
	}
}

function UCright(){
	if ( !$( '.selected-category .selected-item' ).next().hasClass( 'empty' ) ) {		
		$( '.selected-category .showcase-slider' ).slick( 'slickNext' );
	}
}

function UCAction1(){
	var currentItem = $( '.selected-item' ).index( '.item:not(.empty, .slick-cloned)' );
	var info = $( '.selected-item' ).data( 'info' );
	if ( info != '' ) {
		showMessage( info, function() {
			$( '#container' ).fadeOut( 100, function() {
				window.location.href = $( '.selected-item' ).data( 'url' ) + '&pulsarSelectedItem=' + $( '.showcase-slider' ).slick('slickCurrentSlide');
			});
		});
	} else {
		$( '#container' ).fadeOut( 100, function() {
			window.location.href = $( '.selected-item' ).data( 'url' ) + '&pulsarSelectedItem=' + $( '.showcase-slider' ).slick('slickCurrentSlide');
		});
	}
}
