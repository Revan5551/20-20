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
const dev = /[?&]dev=1/.test(location.search);
let devAll = false, played = false, selId = null, typer = 0;
const FLAG = 'arg2020:finale';
const owned = () => { const s = new Set(Relic.all()); if (devAll) Relic.IDS.forEach(i => s.add(i)); return s; };

const T = $('#ticks'), NS = 'http://www.w3.org/2000/svg';
Relic.IDS.forEach((id, i) => {
  const a = (i * 18 - 90) * Math.PI / 180, l = document.createElementNS(NS, 'line');
  [['x1', 50], ['x2', 59]].forEach(([k, r]) => l.setAttribute(k, 180 + r * Math.cos(a)));
  [['y1', 50], ['y2', 59]].forEach(([k, r]) => l.setAttribute(k, 281 + r * Math.sin(a)));
  l.setAttribute('class', 'tick'); l.dataset.id = id; T.appendChild(l);
});
const grid = $('#grid');
Relic.IDS.forEach(id => {
  const b = document.createElement('button');
  b.className = 'fg'; b.dataset.id = id;
  b.innerHTML = '<svg viewBox="0 0 30 90"><use href="#finger"/></svg><span>' + id + '</span>';
  b.onclick = () => select(id);
  grid.appendChild(b);
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
  document.querySelectorAll('.tick').forEach(t => t.classList.toggle('on', s.has(t.dataset.id)));
  $('.shrine').style.setProperty('--p', n / 20);
  $('#count').textContent = n + ' / 20';
  $('.sub').textContent = n === 20 ? 'The vessel is whole.' : 'The vessel is incomplete.';
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
