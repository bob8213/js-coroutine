# js-coroutine
Simple coroutines for javascript

Usage:
```js
// f: function to run
// ms: time interval in milliseconds
// autorun: start automatically
let loop = Utils.coroutine(f, ms, true);
// Or:
let loop = Utils.coroutine(f, ms);
loop.start();
// ...
loop.stop();
loop.resume();
// Or run once with a delay:
let loop = Utils.coroutine(f, ms);
loop.once();

// Call once when mouse out of element, after the delay in ms:
(async () => {
  events.forEach(event => {
    event.onmouseover = () => {
      // Prevents spamming the event
      loop.setDirty();
    };
    event.onmouseout = async () => {
      loop.once();
    };
  });
})();
```
