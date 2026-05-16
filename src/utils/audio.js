/**
 * SBR Audio Utility - Premium Sound System
 * Manages UI sound effects with volume control and pre-loading.
 */

const SOUND_URLS = {
  SUCCESS: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
  ERROR: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
  CLICK: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  VICTORY: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  TICK: 'https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3',
  BADGE: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'
};

class AudioManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    
    if (typeof window !== 'undefined') {
      this.enabled = localStorage.getItem('sbr_sounds') !== 'false';
      this.preload();
    }
  }

  preload() {
    if (typeof Audio === 'undefined') return;
    Object.entries(SOUND_URLS).forEach(([key, url]) => {
      this.sounds[key] = new Audio(url);
      this.sounds[key].load();
    });
  }

  play(key) {
    if (!this.enabled || !this.sounds[key]) return;
    
    // Clone to allow overlapping sounds of the same type
    const sound = this.sounds[key].cloneNode();
    sound.volume = 0.4;
    sound.play().catch(e => console.log('Audio playback prevented by browser policy'));
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('sbr_sounds', this.enabled);
    return this.enabled;
  }
}

const audioManager = new AudioManager();
export default audioManager;
