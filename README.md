# jquery.event.gevent #
=======================

## Summary ##
A plugin that provides global events roughly as they existed prior
to jQuery 1.9.

## Release Notes ##

### Copyright (c)###
2013 Michael S. Mikowski (mike[dot]mikowski[at]gmail[dotcom])

### License ###
Dual licensed under the MIT or GPL Version 2
http://jquery.org/license

### Version 0.1.2 ###
This is the first release.
I have tested with jQuery 1.7.2 and 1.9.1, although
not extensively.  Be warned, there may be lurking bugs.


## Examples ##

### Subscribe to an event on '#msg' div ###
    $.gevent.subscribe(
      $( '#msg' ),             // jQuery selection
      'spa-model-msg-receive', // Event name
      onModelMsgReceive        // Handler function
    );


### Publish an event ###
    $.gevent.publish(
      'spa-model-msg-receive',
      [ { user : 'fred', msg : 'Hi gang' } ]
    );

### Unsubscribe from event on '#msg' div ###
    $.gevent.unsubscribe(
      $( '#msg' ),         // jQuery selection
      'spa-model-msg-receive', // Event name
    );

## Overview ##

Jquery 1.8.x and lower supported global events (also called
'custom events'). Apparently these were not officially supported
and have been removed as of jQuery 1.9. I found this disappointing
as I used global events as a robust mechanism to publish asynchronous
changes from my model to the view. I wrote this plugin to restore
this capability.


## Methods ##

This documentation is extracted directly from the plugin source.
If the plugin is misbehaving, you may wish to review the source
to ensure this documentation is up to date.

### $.gevent.publish ###

    // Example  :
    //   $.gevent.publish(
    //     'spa-model-msg-receive',
    //     [ { user : 'fred', msg : 'Hi gang' } ]
    //   );
    // Purpose  :
    //   Publish an event with an optional list of arguments
    //   which a subscribed handler will receive after the event object.
    // Arguments (positional)
    //   * 0 ( event_name )  - The global event name
    //   * 2 ( data_list )   - Optional list of arguments
    // Throws   : none
    // Returns  : none

### $.gevent.subscribe ###

    // Example  :
    //   $.gevent.subscribe(
    //     $( '#msg' ),
    //     'spa-msg-receive',
    //     onModelMsgReceive
    //   );
    // Purpose  :
    //   Subscribe a function to a published event on a jQuery collection
    // Arguments (positional)
    //   * 0 ( $collection ) - The jQuery collection on which to bind event
    //   * 1 ( event_name )  - The global event name
    //   * 2 ( fn ) - The function to bound to the event on the collection
    // Throws   : none
    // Returns  : none
    //

### $.gevent.unsubscribe ###

    // BEGIN public method /unsubscribeEvent/
    // Example  :
    //   $.gevent.unsubscribe(
    //     $( '#msg' ),
    //     'spa-model-msg-receive'
    //   );
    // Purpose  :
    //   Remove a binding for the named event on a provided collection
    // Arguments (positional)
    //   * 0 ( $collection ) - The jQuery collection on which to bind event
    //   * 1 ( event_name )  - The global event name
    // Throws   : none
    // Returns  : none
    //

## Other notes ##

This is a global plugin, and therefore does not offer chaining. For example:

    // DOES NOT WORK:
    //   $.gevent.subscribe(
    //     $( '#msg' ),
    //     'spa-msg-receive',
    //     onModelMsgReceive
    //   ).gevent.trigger( ... );
    //

Sorry about that :)

## See also ##

The [multicast plugin](http://plugins.jquery.com/multicast/) appears
quite similar, although I don't believe it has one important, magical
capability as this plugin: if an element has been deleted from the 
DOM, no event will be processed.  An example is in order:

    // create a div 
    $('body').append( '<div id="msg"/>' );

    // subscribe to event
    $.gevent.subscribe(
      $( '#msg' ),
      'spa-model-msg-receive',
      function ( event, msg_map ) {
        console.log(
          'message received',
          event,
          msg_map
        );
      }
    );

    // publish event
    $.gevent.publish(
      'spa-model-msg-receive',
      [ { user : 'fred', msg : 'Hi gang' } ]
    );

    // you should see output in the JavaScript log

    // now delete the div
    $( '#msg' ).remove();

    // publish event
    $.gevent.publish(
      'spa-model-msg-receive',
      [ { user : 'fred', msg : 'Hi gang' } ]
    );

    // no event will be handled.  If you add
    // back the '#msg' div, you need to rebind the event.

I find this behavior very desirable.


## TODO ##

Investigate out of date collections and remove them from the plugin.

END
