/* Background sound. Plays audio/rhubarb.mp3 if you add that file; otherwise an original
   generated drone. Browsers block autoplay, so sound starts on the first tap/keypress
   (unless the player muted it, which is remembered). */
(function () {
  const btn = document.getElementById('snd'), MUTE = 'arg2020:mute';
  const el = new Audio('audio/rhubarb.mp3');
  el.loop = true; el.volume = .5; el.preload = 'auto';
  let on = false, ctx = null;
  const muted = () => { try { return localStorage.getItem(MUTE) === '1'; } catch (e) { return false; } };

  function drone() {                       // original ambient fallback (Web Audio, no file needed)
    if (ctx) return ctx.resume();
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const g = ctx.createGain(); g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(.07, ctx.currentTime + 4); g.connect(ctx.destination);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 420; f.connect(g);
    [55, 55.4, 82.5, 110.7].forEach(hz => {
      const o = ctx.createOscillator(); o.type = hz > 100 ? 'triangle' : 'sine';
      o.frequency.value = hz; o.connect(f); o.start();
    });
    const l = ctx.createOscillator(), lg = ctx.createGain();
    l.frequency.value = .08; lg.gain.value = 160; l.connect(lg); lg.connect(f.frequency); l.start();
  }
  function start() {
    on = true; paint();
    if (el.error) drone(); else el.play().catch(drone);
  }
  function stop() { on = false; paint(); el.pause(); if (ctx) ctx.suspend(); }
  function paint() { btn.textContent = on ? 'sound on' : 'sound off'; btn.setAttribute('aria-pressed', on); }

  el.addEventListener('error', () => { if (on) drone(); });
  btn.onclick = e => {
    e.stopPropagation();
    if (on) { try { localStorage.setItem(MUTE, '1'); } catch (x) {} stop(); }
    else { try { localStorage.removeItem(MUTE); } catch (x) {} start(); }
  };
  if (!muted()) {
    const first = () => { removeEventListener('pointerdown', first); removeEventListener('keydown', first); if (!on && !muted()) start(); };
    addEventListener('pointerdown', first); addEventListener('keydown', first);
  }
  paint();
  window.ArgAudio = { start, stop };
})();
