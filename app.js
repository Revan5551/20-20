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
{ const H = $('#hat');                              // crimson hatching + coronal suture on the skull
  for (let s = 0; s < 2; s++) for (let x = 119; x < 164; x += 3) {
    const X = s ? 360 - x : x, d = s ? -1 : 1, y0 = -80 + (x - 119) * .85;
    H.appendChild(mk('path', { d: 'M' + X + ' ' + y0 + 'Q' + (X - 7 * d) + ' ' + (y0 + 50) / 2 + ' ' + (X + 3 * d) + ' 50', class: 'ht', opacity: (.9 - (x - 119) / 55).toFixed(2) }));
  }
  let d = '';
  for (let i = 0; i <= 24; i++) { const t = i / 24; d += (i ? 'L' : 'M') + (131 + 98 * t + (i % 2 ? 2 : -2)) + ' ' + (-54 - 26 * Math.sin(Math.PI * t) + (i % 2 ? 2.2 : -1.6)); }
  H.appendChild(mk('path', { d, class: 'ht', opacity: .8 }));
}
if (MODE === 'figure') {                             // THE WORLD: a colossus standing over the shrine
  $('.mandala').setAttribute('viewBox', '-170 -130 890 790');   // extra room so nothing is cramped
  const F = $('#figure'), add = (t, a, p = F) => p.appendChild(mk(t, a));
  const T0 = [-40, 40], T1 = [300, -70], T2 = [620, 30];          // spine curve
  const tor = t => { const u = 1 - t, x = u * u * T0[0] + 2 * u * t * T1[0] + t * t * T2[0], y = u * u * T0[1] + 2 * u * t * T1[1] + t * t * T2[1];
    const dx = 2 * u * (T1[0] - T0[0]) + 2 * t * (T2[0] - T1[0]), dy = 2 * u * (T1[1] - T0[1]) + 2 * t * (T2[1] - T1[1]), m = Math.hypot(dx, dy);
    return { x, y, nx: -dy / m, ny: dx / m, rot: Math.atan2(dy, dx) * 180 / Math.PI }; };
  const eyes = [[34, 165], [114, 165]];                          // eye sockets on the face, buried under the wings
  const blade = (bx, by, tx, ty, w, bow, barbs, out) => {
    const dx = tx - bx, dy = ty - by, ln = Math.hypot(dx, dy) || 1, px = -dy / ln, py = dx / ln, mx = bx + dx / 2, my = by + dy / 2;
    if (out) bow = Math.abs(bow) * (((mx - 300) * px + (my - 60) * py) >= 0 ? 1 : -1);
    add('path', { d: 'M' + (bx + px * w) + ' ' + (by + py * w) + 'Q' + (mx + px * (w + bow)) + ' ' + (my + py * (w + bow)) + ' ' + tx + ' ' + ty + 'Q' + (mx + px * (bow - w)) + ' ' + (my + py * (bow - w)) + ' ' + (bx - px * w) + ' ' + (by - py * w) + 'Z', class: 'fgpath' });
    for (let k = 1; k <= barbs; k++) { const t = k / (barbs + 1), qx = bx + dx * t + px * bow * 2 * t * (1 - t), qy = by + dy * t + py * bow * 2 * t * (1 - t), l = w * (1 - t) + 3;
      add('path', { d: 'M' + qx + ' ' + qy + 'l' + px * l + ' ' + py * l + 'M' + qx + ' ' + qy + 'l' + -px * l + ' ' + -py * l, class: 'fh' }); }
  };
  const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const limbs = [
    ['M612 35C690 70 700 160 664 250', 38],                       // 0 tail
    ['M25 30C-5 100 -30 190 -20 290', 58], ['M-20 290C-45 380 -10 470 -34 585', 32],        // 1-2 far-left leg
    ['M170 40C215 130 200 240 168 335', 66], ['M168 335C140 410 175 500 150 592', 36],      // 3-4 inner-left
    ['M430 40C385 130 400 240 432 335', 66], ['M432 335C460 410 425 500 450 592', 36],      // 5-6 inner-right
    ['M580 30C625 110 630 200 598 292', 58], ['M598 292C575 380 635 470 648 585', 32],      // 7-8 far-right
    ['M-40 40Q300 -70 620 30', 134],                              // 9 torso
    ['M40 -5Q170 -95 300 -55', 90],                               // 10 shoulder hump
    ['M30 -30C10 40 40 110 50 170', 104],                         // 11 head
    ['M42 120C46 160 56 190 60 218', 66],                         // 12 drooping jaw
    ['M34 160L112 160', 62]];                                     // 13 broad face (carries the wing-eyes)
  const ps = limbs.map(([d, w]) => add('path', { d, 'stroke-width': w + 5, stroke: '#c4001a' }));
  limbs.forEach(([d, w]) => add('path', { d, 'stroke-width': w, stroke: 'url(#fp)' }));
  const fur = (p, half, n, len, up) => {
    const L = p.getTotalLength();
    for (let i = 0; i < n; i++) {
      const t = i / n * L, a = p.getPointAtLength(t), q = p.getPointAtLength(Math.min(L, t + 2));
      const dx = q.x - a.x, dy = q.y - a.y, m = Math.hypot(dx, dy) || 1, nx = -dy / m, ny = dx / m, s = up ? -1 : (rnd() < .5 ? -1 : 1);
      const l = len * (.5 + rnd()), x = a.x + nx * half * s, y = a.y + ny * half * s;
      add('path', { d: 'M' + x + ' ' + y + 'q' + (nx * l * s * .5 + dx / m * 8) + ' ' + (ny * l * s * .5 + dy / m * 8) + ' ' + nx * l * s + ' ' + ny * l * s, class: 'fh2' });
    }
  };
  fur(ps[9], 67, 120, 52, true); fur(ps[9], 67, 90, 24); fur(ps[10], 45, 50, 40, true);
  fur(ps[11], 52, 50, 28); fur(ps[12], 33, 24, 20); fur(ps[13], 31, 24, 22); fur(ps[0], 19, 26, 22);
  [1, 3, 5, 7].forEach(i => fur(ps[i], 29, 36, 26)); [2, 4, 6, 8].forEach(i => fur(ps[i], 16, 30, 20));
  for (const [fx, fy, claws] of [[-34, 585, 1], [150, 592, 0], [450, 592, 0], [648, 585, 0]]) for (let k = 0; k < 20; k++) {   // paws
    const a = (k / 19 - .5) * 2.6, l = (claws ? 28 : 18) + rnd() * 32;
    add('path', { d: 'M' + (fx + (k - 9.5) * 2.4) + ' ' + (fy - 10) + 'l' + Math.sin(a) * l + ' ' + Math.cos(a) * l, class: 'fh2' });
  }
  for (const dx of [-10, 0, 9]) { add('path', { d: 'M' + (60 + dx) + ' 220v' + (18 + (dx + 10) * 1.5), class: 'fh2' }); add('circle', { cx: 60 + dx, cy: 242 + (dx + 10) * 1.5, r: 2.4, fill: '#c4001a' }); }
  { const p = ps[9], L = p.getTotalLength();                      // long hair hanging off the belly
    for (let i = 0; i < 64; i++) { const s = (.06 + .88 * i / 63) * L, a = p.getPointAtLength(s), q = p.getPointAtLength(Math.min(L, s + 2));
      const dx = q.x - a.x, dy = q.y - a.y, m = Math.hypot(dx, dy) || 1, l = 16 + rnd() * 56;
      add('path', { d: 'M' + (a.x - dy / m * 65) + ' ' + (a.y + dx / m * 65) + 'q' + (rnd() * 8 - 4) + ' ' + l * .5 + ' ' + (rnd() * 10 - 5) + ' ' + l, class: 'fh2' }); } }
  add('ellipse', { cx: 60, cy: 212, rx: 26, ry: 10, fill: '#000', stroke: '#c4001a', 'stroke-width': 1.4 });   // gaping mouth full of teeth
  { let td = ''; for (let k = 0; k < 10; k++) { const x = 37 + k * 5.1; td += 'M' + x + ' 205l2.3 7 2.3-7M' + x + ' 219l2.3-7 2.3 7'; } add('path', { d: td, class: 'tt' }); }
  [[1, .4], [1, .75], [3, .35], [3, .7], [5, .35], [5, .7], [7, .4], [7, .75], [2, .5], [4, .5], [6, .5], [8, .5], [0, .6], [12, .5]].forEach(([i, t], k) => {   // small watching eyes in the fur
    const p = ps[i], pt = p.getPointAtLength(p.getTotalLength() * t), g = add('g', { class: 'te', transform: 'translate(' + pt.x + ' ' + pt.y + ') rotate(' + (k * 29 % 50 - 25) + ')' });
    g.innerHTML = '<ellipse rx="8" ry="4.4"/><ellipse class="tp" rx="1.6" ry="3.6"/>';
  });
  const reach = (ex, ey, c, s) => Math.min(c < 0 ? (ex + 164) / -c : c > 0 ? (714 - ex) / c : 1e9, s < 0 ? (ey + 124) / -s : s > 0 ? (650 - ey) / s : 1e9);
  { const [ex, ey] = eyes[0];                                     // left wing: grows out of the left socket and fans to the right, tips curling like a bracket
    for (let i = 0; i < 11; i++) { const deg = -30 + i * 6, al = deg * Math.PI / 180, c = Math.cos(al), s = Math.sin(al), L = Math.min(reach(ex, ey, c, s), 330 + 90 * Math.cos(deg * Math.PI / 60) + rnd() * 24);
      blade(ex, ey, ex + c * L, ey + s * L, 21, -L * .12 * Math.sign(deg), 9, false); } }
  { const [ex, ey] = eyes[1];                                     // right wing: grows out of the right socket and rises over the shoulders
    for (let i = 0; i < 11; i++) { const al = (-150 + i * 10.5) * Math.PI / 180, c = Math.cos(al), s = Math.sin(al), L = Math.min(reach(ex, ey, c, s), 300 + rnd() * 40);
      blade(ex, ey, ex + c * L, ey + s * L, 21, L * .12, 10, true); } }
  for (const [ex, ey] of eyes) {                                  // overlapping feather roots: wings, not eyes
    for (let i = 0; i < 26; i++) { const al = i / 26 * Math.PI * 2, L = 46 + rnd() * 26; blade(ex, ey, ex + Math.cos(al) * L, ey + Math.sin(al) * L, 11, L * .2, 3); }
    for (let i = 0; i < 14; i++) { const al = (i / 14 + .03) * Math.PI * 2, L = 28 + rnd() * 12; blade(ex, ey, ex + Math.cos(al) * L, ey + Math.sin(al) * L, 8, L * .2, 1); }
    for (let i = 0; i < 12; i++) { const al = (i / 12 + .05) * Math.PI * 2, L = 15 + rnd() * 6; blade(ex, ey, ex + Math.cos(al) * L, ey + Math.sin(al) * L, 6, L * .2, 0); }
  }
  let n = 0;                                                      // 20 masks across the back, three rows
  [[-36, 7, .22, .11], [0, 7, .275, .1], [36, 6, .33, .095]].forEach(([off, c, t0, st]) => { for (let k = 0; k < c; k++) {
    const p = tor(t0 + k * st), g = add('g', { class: 'fm', 'data-id': Relic.IDS[n++], transform: 'translate(' + (p.x + p.nx * off) + ' ' + (p.y + p.ny * off) + ') rotate(' + (p.rot + (n * 7 % 9 - 4)) + ')' });
    g.innerHTML = '<ellipse rx="17" ry="10"/><ellipse rx="9.5" ry="4.8"/><path d="M-6.5 0H6.5"/><ellipse class="pu" rx="1.8" ry="4.4"/>';
  } });
}
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
