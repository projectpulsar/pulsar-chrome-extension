// -- main.js --
//
// Pulsar main screen script. Loads a channel from the configuration file and presents a gamepad controlled launcher.

var pulsarPlatform = 'chrome-extension';
var pulsarServerBase = 'https://projectpulsar.github.io/platform-resources';
var pulsarVersion = chrome.app.getDetails().version;
var categories;
var emularityURL = pulsarServerBase + '/' + pulsarPlatform + '/services/emularity/emularity.html';
var configURL = localStorage.pulsarConfig;
var channel = localStorage.pulsarChannel;
var ref = localStorage.pulsarRef;

document.addEventListener( 'DOMContentLoaded', function () {
	$( '#loading-spinner' ).css( 'transform', 'translate( -' + Math.round( $( "#loading-spinner" ).outerWidth() / 2 ) + 'px, -' + Math.round( $( "#loading-spinner" ).outerHeight() / 2 ) + 'px )' );
	$( '#loading-spinner' ).fadeTo( 200, 100 );
	$.ajax( configURL, {
		type : 'GET',
		cache: false,
		dataType: 'json' } )
		.done( function( configuration ) {
			document.title = configuration.channels[ channel ].title;
			$( '#top-bar, #top-blank' ).html( configuration.channels[ channel ].title.toUpperCase() );
			$.each( configuration.channels[ channel ].categories, function( order, category ) {
				$( '#showcase' ).append( '<div class="category"></div>' );
				$( '.category' ).last().append( '<div class="category-title">' + category.title +'</div>' );
				contentType = category.content_type;
				$( '.category' ).last().append( '<div class="category-content"></div>' );
				$( '.category-content' ).last().append( '<div class="showcase-slider"></div>' );
				$.each( category.items, function( order, item ) {
					switch( contentType ) {
					case 'web':
						var newItem = $( '<div class="item"><img src="' + item.thumbnail +'"></div>' );
						newItem.data( 'title', item.title || '-' );
						newItem.data( 'description', item.description || '-' );
						if ( typeof item.info !== 'undefined' ) {
							newItem.data( 'info', $('<div>' + item.info + '</div>').text().toUpperCase() );
						} else {
							newItem.data( 'info', '' );
						}
						newItem.data( 'url', item.url );
						newItem.data( 'keymap', item.keymap || '' );
						$( '.showcase-slider' ).last().append( newItem );
						if ( ( $( '.category' ).last().find( '.item' ).length == category.items.length ) && ( $( '.category' ).length == configuration.channels[ channel ].categories.length ) ) { initShowcase(); };
						break;
					case 'emularity':
						$.ajax( 'http://archive.org/metadata/' + item.id, {
							async : false,
							type : 'GET',
							dataType: 'json' } )
							.done( function( data ) {
								description = 'uploaded by ' + data.metadata.uploader;
								if ( typeof data.metadata.emulator_ext == 'object' ) {
									var emulator_ext = data.metadata.emulator_ext[0];
								} else {
									var emulator_ext = data.metadata.emulator_ext;
								}
								var newItem = $( '<div class="item"><div class="vertical-align-helper"></div><img style="vertical-align: middle; display: inline-block" src="https://archive.org/services/img/' + item.id + '"></div>' );
								newItem.data( 'title', data.metadata.title || '-' );
								newItem.data( 'description', '' );
								newItem.data( 'keymap', item.keymap || '' );
								if ( typeof item.info !== 'undefined' ) {
									newItem.data( 'info', $('<div>' + item.info + '</div>').text().toUpperCase() );
								} else {
									newItem.data( 'info', '' );
								}
								newItem.data('url', emularityURL + '?identifier=' + item.id + '&emulator_ext=' + emulator_ext );
								$( '.showcase-slider' ).last().append( newItem );
								if ( ( $( '.category' ).last().find( '.item' ).length == category.items.length ) && ( $( '.category' ).length == configuration.channels[ channel ].categories.length ) ) { initShowcase(); };
							});
						break;
					}
				});
			});
		})
		.fail(function() {
			$( '#loading-spinner' ).fadeTo( 200, 0, function() {
				$( '#container' ).css( 'opacity', '100' );
				requestAnimationFrame( checkGamepad );
				showMessage( 'Error loading channel content', function() { window.location.reload( false ); } );
			});
		});
});

function initShowcase() {
	var selectedItem = parseInt( localStorage.pulsarSelectedItem );
	var selectedCategory = parseInt( localStorage.pulsarSelectedCategory );

	if ( selectedCategory == 0 ) {
		var prevCategory = 0;
	} else {
		var prevCategory = selectedCategory - 1;
	}

	$( '.category' ).eq( selectedCategory ).addClass( 'selected-category' );
	$( '.category-content' ).append( '<div class="info"><div class="info-title"></div><div class="info-description"></div></div>' );
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
	$( '.selected-category .showcase-slider' ).slick({
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
	$( '.category:not( .selected-category ) .showcase-slider' ).slick({
		centerPadding: '1%',
		draggable: false,
		accesibility: false,
		arrows: false,
		centerMode: true,
		infinite: true,
		speed: 100,
		slidesToShow: 5,
		initialSlide: 0
	});
	$( '.vertical-align-helper' ).each( function() {
		var parentWidth = $(this).parent().width();
		$(this).height( parentWidth )
	});
	$( '.showcase-slider' ).on( 'beforeChange', function( event, slick, currentSlide, nextSlide ){
		$( '.selected-item' ).removeClass( 'selected-item' );
		$( '.selected-category' ).find( '.info-title, .info-description' ).animate( { opacity: 0 }, 50 );
	});
	$( '.showcase-slider' ).on( 'afterChange', function(event, slick, currentSlide){
		$( '.selected-category .slick-center:not( .slick-cloned )' ).addClass( 'selected-item' );
		refreshInfo();
		$( '.selected-category' ).find( '.info-title, .info-description' ).animate( { opacity: 1 }, 50 );
	});
	$( '.selected-category .slick-center:not( .slick-cloned )' ).addClass( 'selected-item' );
	refreshInfo();
	$( '.category-content' ).hide();
	$( '.selected-category .category-content' ).show();
	$( 'html, body' ).scrollTop( $( '.category' ).eq( prevCategory ).offset().top - $( '#top-blank' ).outerHeight( true ) );
	$( '#loading-spinner' ).fadeTo( 200, 0, function() {
		$( '#container' ).animate( { opacity: 100 } );
		requestAnimationFrame( checkGamepad );
	});
}

function changeCategory( increment ) {
	var selectedCategory = $( '.selected-category' ).index();
	if ( selectedCategory == 0 ) {
		var prevCategory = 0;
	} else {
		var prevCategory = selectedCategory - 1;
	}
	var prevCategoryContent = $( '.selected-category .category-content' );
	$( '.selected-category' ).removeClass( 'selected-category' );
	$( '.selected-item' ).removeClass( 'selected-item' );
	selectedCategory = selectedCategory + increment;
	if ( selectedCategory < 0 ) { selectedCategory = categories };
	if ( selectedCategory > categories ) { selectedCategory = 0 };
	$( '.category' ).eq( selectedCategory ).addClass( 'selected-category' );
	$( '.selected-category .slick-center:not( .slick-cloned )' ).addClass( 'selected-item' );
	prevCategoryContent.slideUp( 150, function() {
		$( 'html, body' ).animate( { scrollTop: $( '.category' ).eq( prevCategory ).offset().top - $( '#top-blank' ).outerHeight( true ) }, 100 );
	} );
	$( '.selected-category .category-content' ).slideDown( 150 );
	refreshInfo();
}

function refreshInfo() {
	$( '.selected-category .info-title' ).text( $( '.selected-item' ).data( 'title' ) );
	$( '.selected-category .info-description' ).text( $( '.selected-item' ).data( 'description' ) );
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

function UCActionBack(){
	if ( ref == 'channels' ) {
		$( '#container' ).fadeOut( 100, function() {
			window.location.href = 'channels.html?config=' + configURL;
		});
	}
}

function UCAction1(){
	var currentItem = $( '.selected-item' ).index( '.item:not(.empty, .slick-cloned)' );
	var info = $( '.selected-item' ).data( 'info' );
	localStorage.pulsarSelectedItem = $( '.selected-category .showcase-slider' ).slick('slickCurrentSlide');
	localStorage.pulsarSelectedCategory = $( '.selected-category' ).index();
	localStorage.pulsarKeymap = $( '.selected-item' ).data( 'keymap' );
	if ( typeof info == 'string' ) {
		showMessage( info, function() {
			$( '#container' ).fadeOut( 100, function() {
				window.location.href = $( '.selected-item' ).data( 'url' ) + '?pulsarActive=yes';
			});
		});
	} else {
		$( '#container' ).fadeOut( 100, function() {
			window.location.href = $( '.selected-item' ).data( 'url' ) + '?pulsarActive=yes';
		});
	}
}
