/*
 * jQuery global event plugin (gevent)
 * http://www.dynaorg.com/jquery/uriAnchor/
 *
 * Version 0.1
 *
 * Copyright (c) 2011, 2012 Michael S. Mikowski
 * Dual licensed under the MIT or GPL Version 2
 * http://jquery.org/license
 *
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global jQuery */

(function ( $ ) {
  'use strict';
  $.gevent = ( function () {
    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
      subscribeEvent, publishEvent, unsubscribeEvent,
      $customSubMap = {}
      ;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN PUBLIC METHODS -------------------
    // BEGIN public method /publishEvent/
    // Purpose     : TODO
    // Arguments   : positional -
    //   * 0 ( event_name )   : The event name to subscribe
    // Settings    : none
    // Returns     : true on success, false if no subscription
    // Throws      : none
    // Discussion  : TODO
    //
    publishEvent = function ( event_name, data_list ) {
      if ( ! $customSubMap[ event_name ] ){ return false; }

      if ( data_list && Array.isArray( data_list ) ) {
        $customSubMap[ event_name ].trigger( event_name, data_list );
        return true;
      }

      $customSubMap[ event_name ].trigger( event_name );
      return true;
    };

    // BEGIN public method /subscribeEvent/
    // Purpose     : TODO
    // Arguments   : positional -
    //   * 0 ( $collection ) : jquery collection to subscribe
    //   * 1 ( event_name )  : The event name to subscribe
    //   * 2 ( fn )          : The subscribed function
    // Settings    : none
    // Returns     : none
    // Throws      : none
    // Discussion  : TODO
    //
    subscribeEvent = function ( $collection, event_name, fn ) {
      $collection.on( event_name, fn );

      if ( ! $customSubMap[ event_name ] ) {
        $customSubMap[ event_name ] = $collection;
      }
      else {
        $customSubMap[ event_name ]
          = $customSubMap[ event_name ].add( $collection );
      }
    };
    // END public method /subscribeEvent/

    // BEGIN public method /unsubscribeEvent/
    // Purpose     : TODO
    // Arguments   : positional -
    //   * 0 ( $collection ) : jquery collection to unsubscribe
    //   * 1 ( event_name )  : The event name to unsubscribe
    // Settings    : none
    // Returns     : true on success, false if no subscription
    // Returns     : none
    // Throws      : none
    // Discussion  : TODO
    //
    unsubscribeEvent = function ( $collection, event_name ) {
      if ( ! $customSubMap[ event_name ] ){ return false; }

      $customSubMap[ event_name ]
        = $customSubMap[ event_name ].not( $collection );

      if ( $customSubMap[ event_name ].length === 0 ){
        delete $customSubMap[ event_name ];
      }

      return true;
    };
    // END public method /unsubscribeEvent/

    // return public methods
    return {
      publish     : publishEvent,
      subscribe   : subscribeEvent,
      unsubscribe : unsubscribeEvent
    };
    //------------------- END PUBLIC METHODS ---------------------
  }());
}( jQuery ));
