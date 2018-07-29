import { LitElement, html, classString } from '@polymer/lit-element'
import { Howl } from 'howler'

function formatTime (secs) {
  const minutes = Math.floor(secs / 60) || 0
  const seconds = (secs - minutes * 60) || 0

  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
}

class AudioPlayer extends LitElement {
  static get properties () {
    return {
      label: String,
      src: String
    }
  }
  constructor () {
    super()

    this.howl = null
    this.timeoutId = null

    this._step = this._step.bind(this)
  }
  _propertiesChanged (props, changedProps, prevProps) {
    super._propertiesChanged(props, changedProps, prevProps)

    if (changedProps && changedProps.src !== undefined) {
      this._destroyHowl()
      this.requestRender()

      if (props.src) {
        this._initHowl(props.src)
      }
    }
  }
  _initHowl (src) {
    this.howl = new Howl({
      src: src,
      html5: true,
      onplay: () => {
        clearTimeout(this.timeoutId)

        this.timeoutId = setTimeout(this._step, 500)

        this.requestRender()
      },
      onload: () => {
        this.requestRender()
      },
      onloaderror: () => {
        this._destroyHowl()
        this.requestRender()
      }
    })
  }
  _destroyHowl () {
    if (this.howl) {
      this.howl.unload()
      this.howl = null
    }
  }
  _step () {
    if (this._playing()) {
      this.timeoutId = setTimeout(this._step, 500)
    }

    this.requestRender()
  }
  _handlePlayPauseClick () {
    if (this.howl !== null) {
      if (this._playing()) {
        this.howl.pause()
      } else {
        this.howl.play()
      }

      this.requestRender()
    }
  }
  _handleRepeatClick () {
    if (this.howl !== null) {
      this.howl.seek(0)

      if (!this._playing()) {
        this.howl.play()
      }

      this.requestRender()
    }
  }
  _handleVolumeClick () {
    if (this.howl !== null) {
      this.howl.mute(!this._muted())

      this.requestRender()
    }
  }
  _handleProgressClick (e) {
    if (this.howl !== null) {
      const progressRect = this._root.querySelector('.progress').getBoundingClientRect()
      const progressRectLeft = progressRect.x || progressRect.left
      const seek = e.clientX < progressRectLeft
        ? 0
        : e.clientX > progressRectLeft + progressRect.width
          ? 1
          : ((e.clientX - progressRectLeft) / progressRect.width)

      this.howl.seek(Math.round(seek * this._duration()))

      this.requestRender()
    }
  }
  _playing () {
    return this.howl !== null ? this.howl.playing() : false
  }
  _muted () {
    return this.howl !== null ? this.howl.mute() : false
  }
  _progress () {
    return this._currentTime() === 0 || isNaN(this._currentTime())
      ? 0
      : this._currentTime() < this._duration()
        ? (this._currentTime() / this._duration()) * 100 || 0
        : 100
  }
  _currentTime () {
    return this.howl !== null ? Math.round(this.howl.seek()) : 0
  }
  _duration () {
    return this.howl !== null ? Math.round(this.howl.duration()) : 0
  }
  _render (props) {
    const { label } = props

    return html`
      <div class="wrapper">
        <div class="row">
          <div class="col min with-border-right">
            <div class="container">
              <div
                class$="${classString({button: true, play: !this._playing(), pause: this._playing()})}"
                on-click="${(e) => this._handlePlayPauseClick()}"
              ></div>
            </div>
          </div>
          <div class="col max">
            <div class="container pb10">
              <div class="row row--justify-space-between">
                <div class="col">
                  <div class="label">${label}</div>
                </div>
                <div class="row">
                  <div class="col">
                    <div
                      class="button sm repeat"
                      on-click="${(e) => this._handleRepeatClick()}"
                    ></div>
                  </div>
                  <div class="col">
                    <div
                      class$="${classString({'button sm': true, 'volume-up': !this._muted(), 'volume-down': this._muted()})}"
                      on-click="${(e) => this._handleVolumeClick()}"
                    ></div>
                  </div>
                </div>
              </div>
              <div
                class="progress"
                on-click="${(e) => this._handleProgressClick(e)}"
              >
                <div style$="${`width: ${this._progress()}%`}">
                  <div></div>
                </div>
              </div>
              <div class="row row--justify-space-between">
                <div class="col">
                  <span class="time">${formatTime(this._currentTime())}</span>
                </div>
                <div class="col">
                  <span class="time">${formatTime(this._duration())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }
}

function withStyles (baseClass, styles) {
  return class extends baseClass {
    _renderStyles () {
      return html`<style>${styles}</style>`
    }
    _render (props) {
      return html`
        ${this._renderStyles()}
        ${super._render(props)}
      `
    }
  }
}

export {
  AudioPlayer,
  withStyles
}
