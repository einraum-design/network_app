/*global $ */
$( document ).ready( function () {
	var spaceBrewClient;

	fetch( '../config.json' )
		.then ( function ( res ) {
			return res.json();
		} )
		.then( initSpacebrew );

	function initSpacebrew ( config ) {
		spaceBrewClient = new Spacebrew.Client( {
			server: config.host
		} );

		spaceBrewClient.name( 'network-app' );
		spaceBrewClient.addPublish( 'interactionId', 'string' );
		spaceBrewClient.connect();

		setInterval( function ( ) {
			sendInteractionMessage( Math.round( Math.random() * 20 ) );
		}, 2500 );
	}

	function sendInteractionMessage ( number ) {
		console.log( 'sending interaction message to server', number.toString() );
		
		if ( spaceBrewClient ) {
			spaceBrewClient.send( 'interactionId', 'string', number.toString() );
		}
	}
} );