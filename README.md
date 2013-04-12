# jquery.event.gevent #
=======================

## Summary ##
A plugin that provides global custom events roughly as they 
existed prior to their removal in jQuery 1.9.x

## Release Notes ##

### Copyright (c)###
2013 Michael S. Mikowski (mike[dot]mikowski[at]gmail[dotcom])

### License ###
Dual licensed under the MIT or GPL Version 2
http://jquery.org/license

### Versions 0.1.0 - 0.1.5 ###
This is the first release.  The reason there
are multiple version numbers is I was getting up to speed on the
jquery plugin site.

### Version 0.1.6 ###
Allows passing non-array data as second argument to publish.
When this occurs, the data variable is passed as the second argument
(after the event object) to the subscribed functions.

### Testing ###

I have tested with jQuery 1.7.2 and 1.9.1, although
not extensively. Be warned, there may be lurking bugs.
I will be testing more extensively in the next few days.
You may check out the test HTML page to see this in action.
Make sure you have your JavaScript console open.

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
    //   * 2 ( data )        - Optional data to be passed as argument(s)
    //                         to subscribed functions. Provide an array for
    //                         multiple arguments.
    // Throws   : none
    // Returns  : none
    //

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

## Error handling ##

Like many other plugins, this code does not throw exceptions.
Instead, it does its work quietly.  For example, you may "publish" an
event that has no subscribers, although by definition nothing will
receive it.  Or if you publish an event and pass in something besides
an array of arguments, it will convert it to an array.

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
DOM, no event will be processed.  As an example, you may open up the
test HTML page, and then cut and paste the following into the JavaScript
console, one step at a time:

    // 1. Create a div 
    $('body').append( '<div id="msg"/>' );

    // 2. Subscribe to an event
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

    // 3. Publish the event
    $.gevent.publish(
      'spa-model-msg-receive',
      [ { user : 'fred', msg : 'Hi gang' } ]
    );

    // 4. You should see output in the JavaScript log

    // 5. Delete the div where the event was subscribed on
    $( '#msg' ).remove();

    // 6. Now republish the event
    $.gevent.publish(
      'spa-model-msg-receive',
      [ { user : 'fred', msg : 'Hi gang' } ]
    );

    // 7. You should not see any output in the console.
    // back the '#msg' div, you need to rebind the event.

I find this behavior very desirable.


## TODO ##

Investigate out of date collections and remove them from the plugin
session storage. This can be done by looping through collections
and checking if $collection.closest( 'body' ).length >= 1.

## Contribute! ##

If you want to help out, like all jQuery plugins this is hosted at
GitHub.  Any improvements or suggestions are welcome!

Cheers, Mike

END
