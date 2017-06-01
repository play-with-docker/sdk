# Play with docker javascript SDK

This is the client side JS of PWD that allows to run terminals and attach them to your site


## Using the SDK

Here's a minimal example of the SDK usage:


```html
<html>
    <head>
        <title>PWD SDK Demo</title>
    </head>
    <body>
    <div id="myTerm" style="width 500px; height: 500px;"></div>
    <script src="./dist/pwd.js"></script>
    <script>
        pwd.newSession([{selector: '#myTerm'}]);
    </script>                                                                                                                                                                                                                                
    </body>
</html>
```

## Building the SDK

Clone this repo and run `npm install && npm run build`

## Development

To make development easier, run `npm install && npm run dev`. All file changes will automatically trigger a Webpack build.


## Events

The SDK provides the ability to listen to various events.

### Available Events

More events will be added over time. If you have a request, file an issue with your request!

| Event Name         | Arguments       | Description                            |
|--------------------|-----------------|----------------------------------------|
| `instance.new`     | instanceDetails | Invoked when a new instance is created |


### Events API

#### `pwd.on(eventName, callback)`

Add a listener to the provided event name. Returns the pwd object to allow chaining.

**Example:**

```
pwd.on('instance.new', onNewInstance);

function onNewInstance(instanceDetails) { 
    console.log("New instance with name: " + instanceDetails.name);
}
```


#### `pwd.off(eventName, callback)`

Remove an event listener. Returns the pwd object to allow chaining.

**Example:**

```
pwd.off('instance.new', onNewInstance);
```