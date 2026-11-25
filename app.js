/* EDIT ME: fragments (one per finger) and the final transmission. */
const FRAGMENTS = [
  "Seal one of twenty. It was never hidden. You were only not hungry yet.",
  "He counted his fingers before he counted his sins. The first number was wrong.",
  "A shrine keeps what a god refuses to finish.",
  "Two fingers, one hand. The other hand is somewhere you have already been.",
  "Every room you entered was a throat. You were swallowed politely.",
  "The names on the walls are not names. Read them as coordinates.",
  "Look again at the footer you ignored.",
  "Silence has a frequency. This one sits just below hearing.",
  "Nobody was ever meant to hold all twenty at once.",
  "The offering is not the finger. The offering is the one who carries it.",
  "A smile with four eyes is still only watching.",
  "Rot is a clock. This one has been running since before the first site went live.",
  "Count the pillars. Subtract the ones that are not holding anything up.",
  "He is patient in the way that tides are patient.",
  "Page source is a prayer in a language you already speak.",
  "Somebody before you took this one and put it back. Ask why.",
  "The shrine has no door. You are standing in it.",
  "Twenty relics. Twenty rooms. One house.",
  "Hunger is the oldest signal. It was always going to reach you.",
  "The last one is always the one you were carrying."
];
const FINALE = [
  ["k", "TRANSMISSION 20:20 // SOURCE: UNKNOWN"],
  ["p", "You were not collecting. You were being counted."],
  ["p", "Every site you opened was a room in the same house. The rooms never knew each other. The house always knew you."],
  ["p", "Twenty fingers. A hand and a hand and a hand and a hand, and none of them were yours."],
  ["p", "Go back to the first room. Read what you skipped. It has been waiting to say something."],
  ["k", "END OF TRANSMISSION. THE SEAL HOLDS FOR NOW."]
];

const $ = s => document.querySelector(s);
const EGGS = { ruin: .05, figure: .8 };            // odds per load; never on the very first visit
const MODE = (() => {                                // ?egg=ruin | figure | none  forces one
  const m = location.search.match(/[?&]egg=(\w+)/), q = location.search.match(/[?&]ruin=(\d)/);
  if (m) return ['ruin', 'figure'].includes(m[1]) ? m[1] : 'normal';
  if (q) return q[1] === '1' ? 'ruin' : 'normal';
  try {
    const seen = localStorage.getItem('arg2020:visited');
    localStorage.setItem('arg2020:visited', '1');
    if (!seen) return 'normal';
    const x = Math.random();
    return x < EGGS.ruin ? 'ruin' : x < EGGS.ruin + EGGS.figure ? 'figure' : 'normal';
  } catch (e) { return 'normal'; }
})();
const RUIN = MODE === 'ruin';
window.MODE = MODE;
if (MODE !== 'normal') document.documentElement.classList.add(MODE);
window.RUIN = RUIN;
const dev = /[?&]dev=1/.test(location.search);
let devAll = false, played = false, selId = null, typer = 0;
const FLAG = 'arg2020:finale';
const owned = () => { const s = new Set(Relic.all()); if (devAll) Relic.IDS.forEach(i => s.add(i)); return s; };

const NS = 'http://www.w3.org/2000/svg';
const mk = (t, at) => { const e = document.createElementNS(NS, t); for (const k in at) e.setAttribute(k, at[k]); return e; };
const P = (r, deg) => { const a = deg * Math.PI / 180; return [300 + r * Math.sin(a), 300 - r * Math.cos(a)]; };
for (let i = 0; i < 180; i++) {                      // red hatch band
  const [x1, y1] = P(274, i * 2), [x2, y2] = P(i % 5 ? 283 : 289, i * 2);
  $('#deco').appendChild(mk('line', { x1, y1, x2, y2, class: 'sb' }));
}
let seed = 2020; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
for (let r = 150; r >= 14; r -= 7) {                 // hypnotic centre stripes
  const k = ((150 - r) / 7) | 0;
  $('#stripes').appendChild(mk('circle', { cx: 300, cy: 300, r, fill: 'none', stroke: k % 2 ? '#7a0a1a' : '#2a0409', 'stroke-width': k % 2 ? 1.2 : 3.4 }));
}
for (let k = 0; k < 8; k++) {                        // sigil circles
  const [x, y] = P(128, 22.5 + 45 * k), S = $('#sat');
  S.appendChild(mk('circle', { cx: x, cy: y, r: 16, fill: '#050001', stroke: '#8a0014', 'stroke-width': 1.5 }));
  S.appendChild(mk('circle', { cx: x, cy: y, r: 12, fill: 'none', stroke: '#5a0a14', 'stroke-dasharray': '2 2' }));
  S.appendChild(mk('use', { href: '#sg' + (k % 4), x, y, fill: 'none', stroke: '#d1001f', 'stroke-width': 1.3 }));
}
{ const H = $('#hat');                              // crimson hatching on the skull
  for (let s = 0; s < 2; s++) for (let x = 117; x < 164; x += 3) {
    const X = s ? 360 - x : x, d = s ? -1 : 1, y0 = -78 + (x - 117) * .8;
    H.appendChild(mk('path', { d: 'M' + X + ' ' + y0 + 'Q' + (X - 7 * d) + ' ' + (y0 + 48) / 2 + ' ' + (X + 3 * d) + ' 48', class: 'ht', opacity: (.9 - (x - 117) / 55).toFixed(2) }));
  }
  for (let k = 0; k < 5; k++) H.appendChild(mk('path', { d: 'M' + (135 + k * 4) + ' ' + (-52 + k * 5) + 'Q180 ' + (-98 + k * 9) + ' ' + (225 - k * 4) + ' ' + (-52 + k * 5), class: 'ht', opacity: .5 - k * .08 }));
}
if (MODE === 'figure') {                             // face-on colossus: crown, eyes that sprout wings, masks
  const F = $('#figure'), add = (t, a, p = F) => p.appendChild(mk(t, a)), cx = 300, cy = 240;
  const eyes = [[212, 175], [388, 175]];
  eyes.forEach(([ex, ey], side) => {                 // wings: fans of curved blades growing out of each eye
    for (let i = 0; i < 11; i++) {
      const a = (side ? -85 + i * 17 : 95 + i * 17) * Math.PI / 180 + (side ? 0 : 0);
      const dir = side ? [Math.cos(a), -Math.sin(a)] : [Math.cos(a), -Math.sin(a)];
      let L = 200 + 70 * Math.cos((i - 5) * .32) + rnd() * 25;
      let tx = ex + dir[0] * L, ty = ey + dir[1] * L; tx = Math.max(-14, Math.min(614, tx)); ty = Math.max(-14, Math.min(612, ty));
      const dx = tx - ex, dy = ty - ey, ln = Math.hypot(dx, dy), px = -dy / ln, py = dx / ln, bow = ln * .17 * (side ? -1 : 1), w = 15;
      const mx = ex + dx / 2, my = ey + dy / 2;
      add('path', { d: 'M' + (ex + px * w) + ' ' + (ey + py * w) + 'Q' + (mx + px * (w + bow)) + ' ' + (my + py * (w + bow)) + ' ' + tx + ' ' + ty + 'Q' + (mx + px * (bow - w)) + ' ' + (my + py * (bow - w)) + ' ' + (ex - px * w) + ' ' + (ey - py * w) + 'Z', class: 'fgpath' });
      for (let k = 1; k < 5; k++) { const t = k / 5; add('path', { d: 'M' + (ex + dx * t + px * bow * 2 * t * (1 - t)) + ' ' + (ey + dy * t + py * bow * 2 * t * (1 - t)) + 'l' + px * 14 * (1 - t) + ' ' + py * 14 * (1 - t), class: 'fh' }); }
    }
  });
  let d = 'M' + (cx - 230) + ' ' + cy;                // spiky crown, then V-shaped torso
  for (let i = 0; i <= 34; i++) { const a = Math.PI + i / 34 * Math.PI, r = i % 2 ? 180 : 210 + rnd() * 42; d += 'L' + (cx + r * Math.cos(a)) + ' ' + (cy + r * Math.sin(a)); }
  d += 'L530 240L480 330L300 610L120 330L70 240Z';
  add('path', { d, class: 'fgpath' });
  for (const s of [-1, 1]) for (let i = 0; i < 24; i++) {  // long hair strands off the V
    const t = i / 23, x = 300 + s * 180 * (1 - t), y = 330 + t * 280, l = 36 + (i * 29 % 44);
    add('path', { d: 'M' + x + ' ' + y + 'q' + s * l * .6 + ' ' + (-l * .15) + ' ' + s * l + ' ' + (l * .1 * (i % 4 - 1)), class: 'fh' });
  }
  for (let x = -140; x <= 140; x += 14) add('path', { d: 'M' + (300 + x) + ' ' + (300 + (i2(x) % 20)) + 'V' + (600 - Math.abs(x) * 1.55), class: 'fh', opacity: .55 });
  eyes.forEach(([ex, ey]) => {
    const g = add('g', { transform: 'translate(' + ex + ' ' + ey + ')' });
    g.innerHTML = '<g class="ey"><path d="M-52 -14Q0 -60 52 -14" stroke="#8a0016" stroke-width="2.2"/><ellipse rx="44" ry="27" fill="#150002" stroke="#ff2a3d" stroke-width="3"/><ellipse rx="18" ry="18" fill="#c4001a"/><ellipse rx="3.5" ry="17" fill="#000"/></g>';
  });
  const M = [[300, 60], [150, 115], [215, 100], [385, 100], [450, 115], [128, 185], [472, 185], [108, 262], [492, 262], [148, 300], [452, 300], [140, 340], [268, 385], [332, 385], [240, 470], [300, 470], [360, 470], [265, 520], [335, 520], [300, 565]];
  M.forEach(([x, y], n) => {
    const g = add('g', { class: 'fm', 'data-id': Relic.IDS[n], transform: 'translate(' + x + ' ' + y + ') rotate(' + ((n * 37 % 17) - 8) + ')' });
    g.innerHTML = '<ellipse rx="12" ry="16"/><path d="M-7 -4h5M2 -4h5M-4 7h8M0 -12v4"/>';
  });
}
function i2(x) { return Math.abs(x * 7) | 0; }
const SEG = ['M0 -6V6', 'M0 -1L-4 -6', 'M0 1L4 6', 'M-4 0H4', 'M-4 -6Q4 -6 4 0', 'M4 6Q-4 6 -4 0', 'M-4 -6L4 -2', 'M-3 6L3 6'];
for (let i = 0; i < 72; i++) {                       // invented rune ring
  const a = i * 5, [x, y] = P(307, a); let d = '';
  for (let k = 0, n = 2 + (rnd() * 3 | 0); k < n; k++) d += SEG[rnd() * SEG.length | 0];
  $('#deco').appendChild(mk('path', { d, transform: 'translate(' + x + ' ' + y + ') rotate(' + a + ')', class: 'gl' + (rnd() < .18 ? ' hot' : '') }));
}
Relic.IDS.forEach((id, i) => {
  const ang = i * 18 + 9, [x1, y1] = P(158, ang), [x2, y2] = P(168, ang);
  $('#ticks').appendChild(mk('line', { x1, y1, x2, y2, class: 'tick', 'data-id': id }));
  const g = mk('g', { class: 'fg', 'data-id': id, transform: 'rotate(' + ang + ' 300 300)', tabindex: 0, role: 'button' });
  g.innerHTML = '<rect x="278" y="34" width="44" height="98" fill="transparent"/><use href="#finger" x="286.7" y="44" width="26.7" height="80"/>' +
    '<text x="300" y="36" text-anchor="middle" transform="rotate(' + (-ang) + ' 300 36)">' + (i + 1) + '</text>';
  g.onclick = () => select(id);
  g.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(id); } };
  $('#fingers').appendChild(g);
});

function type(el, text, ms) {                  // typewriter; returns when done
  const my = ++typer; el.textContent = '';
  return new Promise(res => {
    let i = 0;
    (function step() {
      if (my !== typer) return res();
      el.textContent = text.slice(0, ++i);
      i < text.length ? setTimeout(step, ms || 18) : res();
    })();
  });
}

function select(id) {
  selId = id;
  document.querySelectorAll('.fg').forEach(b => b.classList.toggle('sel', b.dataset.id === id));
  const r = $('#readout');
  if (owned().has(id)) {
    const t = Relic.when(id), d = t ? new Date(t).toISOString().slice(0, 10) : 'test';
    r.innerHTML = '<em></em><span></span>';
    r.firstChild.textContent = id + ' // recovered ' + d;
    type(r.lastChild, FRAGMENTS[Relic.IDS.indexOf(id)]);
  } else {
    typer++;
    r.innerHTML = '<em></em><span></span>';
    r.firstChild.textContent = id + ' // NO SIGNAL';
    r.lastChild.textContent = 'This relic is held in another room.';
    const b = document.querySelector('.fg[data-id="' + id + '"]');
    b.classList.remove('bad'); void b.offsetWidth; b.classList.add('bad');
  }
}

function update() {
  const s = owned(), n = s.size;
  document.querySelectorAll('.fg').forEach(b => {
    const on = s.has(b.dataset.id);
    b.classList.toggle('on', on);
    b.setAttribute('aria-label', 'Finger ' + b.dataset.id + (on ? ', recovered' : ', locked'));
  });
  document.querySelectorAll('.fm').forEach(t => t.classList.toggle('on', s.has(t.dataset.id)));
  document.querySelectorAll('.tick').forEach(t => t.classList.toggle('on', s.has(t.dataset.id)));
  $('.mandala').style.setProperty('--p', n / 20);
  $('#count').textContent = n + ' / 20';
  $('.sub').textContent = n === 20 ? 'The vessel is whole.' : RUIN ? 'Something got here first.' : MODE === 'figure' ? 'It was already here.' : 'The vessel is incomplete.';
  $('#bar').style.width = (n / 20 * 100) + '%';
  $('.meter').setAttribute('aria-valuenow', n);
  if (n === 20 && !played) {
    played = true;
    const seen = !dev && !devAll && localStorage.getItem(FLAG);
    seen ? showFinal(false) : rupture();
  }
  if (n < 20) { $('#final').hidden = true; played = false; }
}

function rupture() {
  document.body.classList.add('rupture');
  setTimeout(() => {
    document.body.classList.remove('rupture');
    if (!devAll) try { localStorage.setItem(FLAG, '1'); } catch (e) {}
    showFinal(true);
  }, 3200);
}

async function showFinal(animate) {
  const f = $('#final'), tx = $('#tx'); f.hidden = false; tx.innerHTML = '';
  $('#replay').hidden = true;
  if (animate) f.scrollIntoView({ behavior: 'smooth' });
  for (const [k, text] of FINALE) {
    const p = document.createElement('p'); if (k === 'k') p.className = 'k';
    tx.appendChild(p);
    if (animate) await type(p, text, 28), await new Promise(r => setTimeout(r, 700)); else p.textContent = text;
  }
  $('#replay').hidden = false;
}
$('#replay').onclick = () => showFinal(true);

Relic.onChange(update);
if (dev) {
  $('#dev').hidden = false;
  $('#d-all').onclick = () => { devAll = true; played = false; update(); };
  $('#d-lock').onclick = () => { devAll = false; played = false; update(); };
  $('#d-wipe').onclick = () => { Relic.reset(); try { localStorage.removeItem(FLAG); } catch (e) {} devAll = false; played = false; update(); };
}
update();
