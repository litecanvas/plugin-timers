/*! Timers plugin for litecanvas by Luiz Bills | MIT Licensed */
import "litecanvas"

window.pluginTimers = plugin

const INF = Infinity

// timer class
export class Timer {
  remaining = 0
  repeat = 0

  /**
   *
   * @param {LitecanvasInstance} engine
   * @param {number} duration in seconds
   * @param {() => void} callback a function to be called when this timer finishes
   */
  constructor(engine, duration, callback) {
    this._duration = duration
    this._callback = callback
    this._e = engine
    this.start()
  }

  start(seconds = null, repeat = false) {
    this._pause = 0
    this.repeat = Number(repeat) || 0
    this.remaining = seconds || this._duration
    this._e.emit("timer-started", this)
  }

  stop(finished = false) {
    this._pause = INF
    if (finished) {
      this._callback()
    }
    this._e.emit("timer-stopped", this, finished)
  }

  get running() {
    return this._pause === 0 && this.remaining > 0
  }

  pause() {
    this._pause++
  }

  resume() {
    this._pause--
  }

  update(dt) {
    if (this._pause > 0) return

    this.remaining -= dt
    if (this.remaining <= 0) {
      this._callback()
      if (this.repeat > 1) {
        this.repeat--
        this.remaining += this._duration
      } else {
        this.stop()
      }
    }
  }
}

/**
 * @param {LitecanvasInstance} engine
 * @param {LitecanvasPluginHelpers} _
 * @para {*} config
 * @returns {*}
 */
export default function plugin(engine, _, config) {
  // list of active timers
  let _timers = []

  // update all timers
  engine.listen("before:update", (dt) => {
    if (0 === _timers.length) return
    for (const timer of _timers) {
      timer.update(dt)
    }
  })

  engine.listen("timer-started", (timer) => {
    timer._index = _timers.push(timer)
  })

  engine.listen("timer-stopped", (timer) => {
    const len = _timers.length
    if (len > 1 && len !== timer._index) {
      const last = _timers[len - 1]
      last._index = timer._index
      _timers[last._index - 1] = last
    }
    _timers.pop()
  })

  if (config.exposeTimers) {
    engine.setvar("TIMERS", _timers)
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
      return new Timer(engine, seconds, callback)
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
      const t = new Timer(engine, seconds, callback)
      t.repeat = n
      return t
    },
  }
}
