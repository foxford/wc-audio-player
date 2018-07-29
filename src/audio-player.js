import {
  AudioPlayer,
  withStyles
} from './index'
import css from './styles.css'

window.customElements.define('audio-player', withStyles(AudioPlayer, css))
