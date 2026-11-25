/* relic.js: shared finger registry. Copy this file UNCHANGED into every ARG site.
   Works because all sites share one GitHub Pages origin (username.github.io).
   Progress is stored in localStorage (2 keys) plus a path=/ cookie, then merged
   as a union, so wiping one store does not lose progress. NOT secure: anyone can
   edit it in DevTools. That is fine for an ARG.
   API:  Relic.collect("F07") -> "new" | "dup" | "invalid"
         Relic.has(id)  Relic.all()  Relic.count()  Relic.when(id)  Relic.onChange(fn) */
(function (g) {
  var KEY = 'arg2020:fingers', BAK = KEY + '.bak', CK = 'arg2020f', IDS = [];
  for (var i = 1; i <= 20; i++) IDS.push('F' + ('0' + i).slice(-2));

  function norm(id) {
    id = String(id).toUpperCase().trim().replace(/^F?(\d{1,2})$/, function (_, n) { return 'F' + ('0' + n).slice(-2); });
    return IDS.indexOf(id) > -1 ? id : null;
  }
  function parse(s) { try { var o = JSON.parse(s); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; } }
  function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function cookie() {
    var m = document.cookie.match(new RegExp('(?:^|; )' + CK + '=([^;]*)'));
    return m ? parse(decodeURIComponent(m[1])) : {};
  }
  function load() {                       // union of all stores; keep earliest timestamp
    var out = {};
    [parse(ls(KEY)), parse(ls(BAK)), cookie()].forEach(function (o) {
      for (var k in o) { var id = norm(k); if (id && (!out[id] || o[k] < out[id])) out[id] = Number(o[k]) || 1; }
    });
    return out;
  }
  function save(o) {
    var s = JSON.stringify(o);
    try { localStorage.setItem(KEY, s); localStorage.setItem(BAK, s); } catch (e) {}
    try { document.cookie = CK + '=' + encodeURIComponent(s) + ';path=/;max-age=63072000;SameSite=Lax'; } catch (e) {}
  }

  g.Relic = {
    IDS: IDS,
    collect: function (id) {
      id = norm(id); if (!id) return 'invalid';
      var o = load();                     // re-read right before writing: safe across tabs
      if (o[id]) { save(o); return 'dup'; }
      o[id] = Date.now(); save(o);
      return 'new';
    },
    has: function (id) { return !!load()[norm(id)]; },
    all: function () { return Object.keys(load()).sort(); },
    count: function () { return Object.keys(load()).length; },
    when: function (id) { return load()[norm(id)] || null; },
    reset: function () { try { localStorage.removeItem(KEY); localStorage.removeItem(BAK); } catch (e) {} document.cookie = CK + '=;path=/;max-age=0'; },
    onChange: function (fn) { addEventListener('storage', function (e) { if (!e.key || e.key.indexOf(KEY) === 0) fn(); }); }
  };
  save(load());                           // heal: re-sync all stores on every page load
})(window);
