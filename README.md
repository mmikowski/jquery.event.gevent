# jquery.event.gevent
## Use libraries, not frameworks
This is a library that strives to be best-in-class.
If you are considering using an SPA framework, please read [Do you
really want an SPA framework?][0] first.

## Summary
A plugin that provides the capability to **publish**, **subscribe**,
or **unsbuscribe** to jQuery-style **global custom events**.

jQuery 1.8.x and lower supported global custom events.
These were not officially supported and have been completely removed
as of jQuery 1.9. I found this disappointing as I used global events
as a robust mechanism to publish asynchronous changes from my model
to the view.

This plugin is featured in the
book **Single Page Web Applications - JavaScript end-to-end**
which is available from [Amazon][1] and directly from [Manning][2].
Methods include `subscribe`, `publish`, and `unsubscribe`.

I wrote this plugin to restore and improve this capability.

## Methods

### $.gevent.publish()

#### Summary
Publish a **global custom event**.

#### Example
```js
$.gevent.publish(
  'spa-model-msg-receive',
  [ { user : 'fred', msg : 'Hi gang' } ]
);
```

#### Purpose
Publish an event with an optional list of arguments.
The handler will receive an event object and the arguments provided.

#### Arguments (positional)
- 0 event-name : The global event name
- 1 data : Optional data to be passeed as arguments.
    If an array is provided, mutliple positional arguments will be passed.

#### Throws
none

#### Returns
none

### $.gevent.subscribe()

#### Summary
Subscribe to a **global custom event**.

#### Example
```js
$.gevent.subscribe(
  $( '.ns-_msg_' ),
  'spa-msg-receive',
  onModelMsgReceive
);
```

#### Purpose
You may **subscribe** a **jQuery collection** and a **function** from
a **global custom event**.

Every time the **custom global event** occurs, the function is invoked
for *each element* of the **jQuery collection**. The invoked function:

- Always receive the **global event object** as the first argument.
- May receive additional arguments as provided by the **publish** invocation.
- Has `this` bound to the element of the jQuery collection being considered.
  If, for example, we have `$('.ns-_msg_')` **subscribed** to a 
  **global custom event**, the value of `this` provided to the handler 
  will be be the DOM element affected. If the collection contains 5 
  elements, the function will be invoked 5 times, once for each element
  in the collection with `this` pointing to each element.

#### Arguments (positional)

- 0 ( $collection ) : A jQuery collection
- 1 ( event-name )  : A global event name
- 2 ( fn ) - A function to bind to the event on the collection

#### Throws
none

#### Returns
none

### $.gevent.unsubscribe

#### Summary
Unsbuscribe a **collection** from a **global custom event**.

#### Example

```js
$.gevent.unsubscribe(
  $( '#msg' ),
  'spa-model-msg-receive'
);
```

#### Purpose
Remove the binding for the named event on a provided collection

#### Arguments (positional)

- 0 ( $collection ) : A jQuery collection 
- 1 ( event-name )  : A global event name

#### Throws
none

#### Returns
none

## Example: Deleted DOM elements
If we delete DOM elements that had subscriptions, **no** subscribed functions
will be executed for that collection.  **This is desired behavior**

Let's say we want  `<div id='user'/>`, to show a username when a *name-change* event occurs. We can **subscribe** the **collection** `$( '#user' )` and the **function** `onNameChange` to the **global custom event** `name-change` like so:

```js
$.gevent.subscribe( $( '.ns-_user_' ), 'name-change', onNameChange );
```

When we publish the 'name-change' event, the `<div id='user/>` exists and so the **function** ( `onNameChange` ) subscribed to the **global custom event** `name-change` iterates over the **jQuery collection** `$( '.ns-_user_')`, invoking the function for each element.

But later we adjust the page and remove the `$( '.ns-_user_' )` DOM elements, the **function** will not be invoked because the DOM elements have been removed.

You may play along at home to see this happen. Let's open the an HTML page that has jQuery and this plugin loaded (or use JSFiddle.com) and then cut and paste the following into the JavaScript console, one step at a time:

```js
// 1. Create a div
$('body').append( '<div class=".ns-_user_"/>' );

// 2. Subscribe to an event
$.gevent.subscribe(
  $( '.ns-_user_' ),
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

// 4. We should see output in the JavaScript log

// 5. Delete the div where the event was subscribed on
$( '.ns-_user_' ).remove();

// 6. Now republish the event
$.gevent.publish(
  'spa-model-msg-receive',
  [ { user : 'fred', msg : 'Hi gang' } ]
);

// 7. We should not see any output in the console
//    because the subscribed function is not invoked.
```

If we add another `<div class=".ns-_user_"/>` to the DOM after this example, we will need to resubscribe to the event if we want it to respond as before.

## Example: Panels
Let's say we display various panels in our web page that show how many widgets Acme Inc. has manufactured and rejected on a given day. We occassionally receive a messages from Acme's web service that tells us the revised widget reject count.

With this plugin we can publish a `widget-reject` event and have all the panels update themselves:

```js
// function to update reject panels
var onWidgetReject = function ( event, reject_count ) {
  $( this ).text( reject_count );
};

// collection of all panels in our page
var $panels = $( '.widget-reject-panel' );

// subscribe to the 'widget-reject' event
$.gevent.subscribe( $panels, 'widget-reject', onWidgetReject );

// publish the event (we now have 23 rejects)
$.gevent.publish( 'widget-reject', 23 );
```

This pub-sub mechanism is elegant and easy to create and maintain. We can add or subtract panels at will.  Events published by a controller may be used by many other modules without the tedium and tangle of callbacks. We have found it invaluable when building scalable Single Page web Applications (SPAs).

## More examples
### Subscribe to an event on '#msg' div

```js
$.gevent.subscribe(
  $( '.ns-_msg_' ),        // jQuery collection
  'spa-model-msg-receive', // Event name
  onModelMsgReceive        // Handler function
);
```

### Publish an event

```js
$.gevent.publish(
  'spa-model-msg-receive',
  [ { user : 'fred', msg : 'Hi gang' } ]
);
```

### Unsubscribe from event on the '#msg' div

```js
$.gevent.unsubscribe(
  $( '.ns-_msg_' ),             // jQuery collection
  'spa-model-msg-receive', // Event name
);
```

## Other notes
This is a global jQuery plugin, and therefore does not offer chaining. For example:

```js
// THIS DOES NOT WORK!
$.gevent.subscribe(
  $( '#msg' ),
  'spa-msg-receive',
  onModelMsgReceive
).gevent.trigger( ... );
```
Sorry about that :)

## Error handling
Like many other jQuery plugins, this code does not throw exceptions. Instead, it does its work quietly. For example, you may "publish" an event that has no subscribers, although by definition nothing will receive it. Or if you publish an event and pass in something besides an array of arguments, it will convert the variable into an array of one.

## Release notes
### Copyright (c)
2013-2016 Michael S. Mikowski (mike[dot]mikowski[at]gmail[dotcom])

### License
Dual licensed under the MIT or GPL Version 2
http://jquery.org/license

### Versions 0.1.0 - 0.1.5
This is the first release.  The reason there are multiple version
numbers is I was getting up to speed on the jQuery plugin site.

### Version 0.1.6
Allows passing non-array data as second argument to publish.
When this occurs, the data variable is used as the second argument
(after the event object) to the subscribed functions.

### Versions 0.1.7-10
Changed manifests for jQuery plugin registry.

### Version 0.2.0
Updated publish events so that falsie values (undefined, null, blank, 0)
may be published as arguments.

### Versions 1.0.2-3
Reversed a negative if-else statement (easier to understand); updated tags to
publish updates to jQuery plugins site.  Fixed documentation typos and listed
this as part of the SPA stack.

### Versions 1.1.0
Updated documentation.

### Versions 1.1.2
Add keywords for jquery-plugin and environment:jquery

### Testing
I have tested with jQuery 1.7.2 through 2.3. You may check out the test
HTML page to see this in action. Make sure you have your JavaScript console open.

## See also
The [multicast plugin](http://plugins.jquery.com/multicast/).

## TODO
- Investigate out-of-date collections and remove them from the
  plugin session storage. This can be done by looping through
  collections and checking `$collection.closest( 'body' ).length >= 1`.

- Consider a resubscribe method.

- Consider only allowing a collection subscribe a function to an event
  only once, at least as an option.

- Other kinds of garbage collection could use some consideration.

## Contribute!
If you want to help out, like all jQuery plugins this is hosted at
GitHub.  Any improvements or suggestions are welcome!
You can reach me at mike[dot]mikowski[at]gmail[dotcom].

## End
[0]:http://mmikowski.github.io/no-frameworks
[1]:http://www.amazon.com/dp/1617290750
[2]:http://manning.com/mikowski
