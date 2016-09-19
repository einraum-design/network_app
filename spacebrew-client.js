/*global $ */
$( document ).ready( function () {
	var spaceBrewClient;

	fetch( '../config.json' )
		.then ( function ( res ) {
			return res.json();
		} )
		.then( initSpacebrew );

	var isConnected = false;
	var isConnecting = false;

	var deviceInQueryStr = getQueryString( 'deviceId' ) || '';
	var deviceId = ( deviceInQueryStr.length && deviceInQueryStr !== 'undefined' )
		? parseInt( deviceInQueryStr, 10 )
		: ~~( Math.random() * 69 );
	var deviceName = 'tablet-app-' + deviceId;
	var appName = 'network';

	var isMaster = getQueryString( 'master' ) === 'true';

	function initSpacebrew ( config ) {
		console.log( 'spacebrew', config );
		spaceBrewClient = new Spacebrew.Client( {
			server: config.host
		} );

		spaceBrewClient.name( deviceName );
		spaceBrewClient.addPublish( 'componentActivated', 'string' );
		spaceBrewClient.addPublish( 'appOpened', 'string' );
		spaceBrewClient.addPublish( 'appClosed', 'string' );
		spaceBrewClient.addPublish( 'plantActivated', 'string' );
		spaceBrewClient.addPublish( 'plantDeactivated', 'string' );
		
		isConnecting = true;
		spaceBrewClient.connect();
		
		spaceBrewClient.onOpen = function () {
			isConnected = true;
			isConnecting = false;
			console.log( 'CONNECTED' );
		};

		spaceBrewClient.onError = function ( err ) {
			isConnecting = false;
			// isConnected = false;
		};

		spaceBrewClient.onClose = function () {
			isConnecting = false;
			isConnected = false;
			console.log( 'DISCONNECTED' );
		};
	}

	function sendMessage ( type, value ) {
		if ( isConnected ) {
			var data = { };
			data.deviceId = deviceId;
			data.appName = appName;
			data.isMaster = isMaster;
			
			if ( typeof value !== 'undefined' ) {
				data.value = value;
			}

			console.log( 'spacebrew sent', type, JSON.stringify( data ) );
			spaceBrewClient.send( type, 'string', JSON.stringify( data ) );
		} else {
			console.log( 'could not send because spacebrew is not connected', type, value );
		}
	}

	if ( Visibility ) {
		Visibility.change( function ( event, state ) {
			if ( 'visible' !== Visibility.state() ) {
				if ( isConnected && ! isConnecting ) {
					spaceBrewClient.close();
				}
			} else {
				if ( ! isConnected && ! isConnecting ) {
					isConnecting = true;
					spaceBrewClient.connect();
				}
			}
		});
	}

	window.sendSpacebrewMessage = sendMessage;

	// send( 'appOpened' );
	// send( 'appClosed' );
	// send( 'componentActivated', getRandomNumber( 0, 34 ) );
} );