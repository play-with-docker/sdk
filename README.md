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

If you are running [Play with Docker](https://github.com/play-with-docker/play-with-docker) locally (which saves resources on our production machines) create the new session with an additional option:
```
pwd.newSession([{selector: '#myTerm'}], {baseUrl: 'http://localhost'});
```

## Building the SDK

Clone this repo and run `npm install && npm run build`
