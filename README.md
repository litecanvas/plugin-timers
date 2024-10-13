# Timers plugin for litecanvas

Helpers to manage timers in [litecanvas](https://github.com/litecanvas/engine) games.

## Install

**NPM**: `npm i @litecanvas/plugin-timers`

**CDN**: `https://unpkg.com/@litecanvas/plugin-timers/dist/dist.js`

## Usage

```js
import litecanvas from "litecanvas"
import pluginTimers from "@litecanvas/plugin-timers"

litecanvas({
  loop: { init },
})

use(pluginTimers) // load the plugin

function init() {
  wait(5, () => {
    // this function will be executed after 5 seconds
  })

  repeat(10, 2, () => {
    // this function will be executed 10 times every 2 seconds
  })
}
```

### Other features

Stop a timer:

```js
const t = wait(5, () => {
  // ...
})

t.stop() // cancel the timer
```

Pause a timer:

```js
const t = wait(5, () => {
  // ...
})

t.pause() // pause the timer

t.resume() // resume a paused timer

t.running // true if the timer is not paused
```

Get/set the remaining time:

```js
const t = wait(5, () => {
  // ...
})

t.remaining += 10 // add 10 seconds
```

Get all active timers:

```js
...
litecanvas()

use(pluginTimers, {
  exposeTimers: true // enable that settings
})

// now you can use the TIMERS variable
TIMERS.forEach((t) => {
  // ...
})
```
