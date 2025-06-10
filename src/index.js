import "litecanvas"

// timer class
class Timer {
  remaining = 0
  repeat = 0
  duration = 0

  /**
   * @param {LitecanvasInstance} engine
   * @param {number} duration in seconds
   * @param {() => void} callback a function to be called when this timer finishes
   */
  constructor(engine, duration, callback) {
    this._cb = callback
    this._e = engine
    this.duration = duration
    this.start()
  }

  start(repeat = 0) {
    this._p = 0 // unpause
    this.repeat = repeat // maybe redefine the repeat
    this.remaining = this.duration // restart the duration
    this._e.emit("timer-started", this)
    return this
  }

  stop(finished = false) {
    this._p = Infinity
    if (finished) {
      this._cb()
    }
    this._e.emit("timer-stopped", this, finished)
    return this
  }

  get running() {
    return this._p === 0 && this.remaining > 0
  }

  pause() {
    this._p++
    return this
  }

  resume() {
    this._p--
    return this
  }

  /**
   * @param {number} dt
   */
  update(dt) {
    if (this._p > 0) return

    this.remaining -= dt

    if (this.remaining <= 0) {
      this._cb()
      if (this.repeat > 1) {
        this.repeat--
        const multiplier = Math.ceil(this.remaining / -this.duration)
        this.remaining += multiplier * this.duration
      } else {
        this.stop()
      }
    }
  }
}

/**
 * @param {LitecanvasInstance} engine
 * @para {*} config
 * @returns {*}
 */
export default function plugin(engine, config = {}) {
  /**
   * @type {Timer[]} list of active timers
   */
  let _timers = []

  // update all active timers
  engine.listen(
    "before:update",
    /**
     * @param {number} dt
     */
    (dt) => {
      for (let i = 0; i < _timers.length; i++) {
        _timers[i].update(dt)
      }
    }
  )

  engine.listen(
    "before:timer-started",
    /**
     * @param {Timer} timer
     */
    (timer) => {
      timer.__i = _timers.push(timer)
    }
  )

  engine.listen(
    "after:timer-stopped",
    /**
     * @param {Timer} timer
     */
    (timer) => {
      // abort if this timer was restarted
      if (timer.running) return

      const len = _timers.length
      if (len > 1 && len !== timer.__i) {
        const last = _timers[len - 1]
        last.__i = timer.__i
        _timers[last.__i - 1] = last
      }

      _timers.pop()
    }
  )

  if (config.exposeTimers) {
    engine.def("TIMERS", _timers)
  }

  return {
    /**
     * the Timer class
     */
    Timer,

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

    /**
     * Repeat the callback every X seconds
     *
     * @param {number} seconds time in seconds
     * @param {function} callback
     * @return {Timer} this timer instance
     */
    loop(seconds, callback) {
      return this.repeat(Infinity, seconds, callback)
    },
  }
}
