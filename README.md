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
    // this function is called after 5 seconds
  })

  every(0.1, () => {
    // this function is called every 0.1 seconds (100 ms)
  })

  repeat(10, 2, () => {
    // this function is called every 2 seconds (100 ms)
    // but just 10 times
  })
}
```
