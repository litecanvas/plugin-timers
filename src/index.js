/*! Timers plugin for litecanvas v0.2.0 by Luiz Bills | MIT Licensed */
window.pluginTimers = plugin

export default function plugin(engine, { on }) {
  let _timers = []

  // timer class
  class Timer {
    constructor(seconds, callback, repeat = false) {
      this.elapsed = 0
      this.seconds = seconds
      this.callback = callback
      this.repeat = true === repeat ? Infinity : ~~repeat
      this.id = _timers.push(this)
    }

    update(dt) {
      this.elapsed += dt
      if (this.elapsed >= this.seconds) {
        this.callback()
        this.elapsed -= this.seconds
        if (this.repeat > 1) {
          this.repeat--
        } else {
          this.cancel()
        }
      }
    }

    cancel() {
      const len = _timers.length
      if (len > 1 && len !== this.id) {
        const last = _timers[len - 1]
        last.id = this.id
        _timers[last.id - 1] = last
      }
      _timers.pop()
    }
  }

  // update all timers
  on("update", _updateAll, true)

  function _updateAll(dt) {
    if (0 === _timers.length) return
    for (const timer of _timers) {
      timer.update(dt)
    }
  }

  return {
    /**
     * Wait X seconds and call the callback
     *
     * @param {number} seconds time in seconds
     * @param {function} callback
     * @return {Timer} this timer instance
     */
    wait(seconds, callback) {
      return new Timer(seconds, callback, false)
    },

    /**
     * Call the callback every X seconds
     *
     * @param {number} seconds time in seconds
     * @param {function} callback
     * @return {Timer} this timer instance
     */
    every(seconds, callback) {
      return new Timer(seconds, callback, true)
    },

    /**
     * Repeat the callback N times every X seconds
     *
     * @param {number} n times to repeat
     * @param {number} seconds time in seconds
     * @param {function} callback
     * @return {Timer} this timer instance
     */
    repeat(n, seconds, callback) {
      return new Timer(seconds, callback, n)
    },
  }
}
