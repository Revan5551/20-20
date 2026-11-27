/* 20:20 operator entrance. This is an ARG gate, not security authentication. */
(function () {
  const gate = document.getElementById('gate');
  const logo = document.getElementById('gate-logo');
  const terminal = document.getElementById('gate-terminal');
  const input = document.getElementById('gate-key');
  const status = document.getElementById('gate-status');
  const error = document.getElementById('gate-error');

  if (!gate || !logo || !terminal || !input) return;

  const SESSION = 'arg2020:operator-session';
  const PASSPHRASE = 'pour your curse into the vessel';

  let clicks = 0;
  let resetClickTimer = null;

  function unlock() {
    try {
      sessionStorage.setItem(SESSION, '1');
    } catch (e) {}

    gate.classList.add('gate-exit');

    window.setTimeout(() => {
      gate.hidden = true;
    }, 650);
  }

  try {
    if (sessionStorage.getItem(SESSION) === '1') {
      gate.hidden = true;
      return;
    }
  } catch (e) {}

  // Hold Shift and click the 20:20 title three times.
    // Open the operator terminal.
  function openTerminal() {
    if (gate.hidden || !terminal.hidden) return;

    terminal.hidden = false;
    status.textContent = 'OPERATOR CHANNEL OPEN';
    error.textContent = '';
    input.value = '';

    window.setTimeout(() => input.focus(), 30);
  }

  // Desktop: hold Shift and click the 20:20 title three times.
  logo.addEventListener('click', function (event) {
    if (!event.shiftKey || gate.hidden) return;

    clicks++;

    window.clearTimeout(resetClickTimer);

    resetClickTimer = window.setTimeout(() => {
      clicks = 0;
    }, 4500);

    if (clicks >= 3) {
      clicks = 0;
      openTerminal();
    }
  });

  // Mobile: hold the subtitle for four seconds.
  const subtitle = gate.querySelector('.gate-subtitle');
  let holdTimer = null;

  if (subtitle) {
    subtitle.style.touchAction = 'none';

    subtitle.addEventListener('pointerdown', function (event) {
      if (event.pointerType !== 'touch' || gate.hidden || !terminal.hidden) return;

      holdTimer = window.setTimeout(() => {
        holdTimer = null;

        subtitle.style.textShadow =
          '0 0 5px #ff3048, 0 0 14px #c4001a';

        window.setTimeout(() => {
          subtitle.style.textShadow = '';
        }, 450);

        openTerminal();
      }, 4000);
    });

    ['pointerup', 'pointercancel', 'pointerleave'].forEach(eventName => {
      subtitle.addEventListener(eventName, () => {
        if (holdTimer !== null) {
          window.clearTimeout(holdTimer);
          holdTimer = null;
        }
      });
    });

    subtitle.addEventListener('contextmenu', event => {
      event.preventDefault();
    });
  }
  terminal.addEventListener('submit', function (event) {
    event.preventDefault();

    const entered = input.value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

    if (entered === PASSPHRASE) {
      status.textContent =
        'OPERATOR VERIFIED // RESTORING SESSION';

      error.textContent = '';
      unlock();
    } else {
      status.textContent = 'AUTHORIZATION REJECTED';
      error.textContent = 'PASSPHRASE NOT RECOGNIZED.';

      input.value = '';
      input.focus();
    }
  });

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      terminal.hidden = true;
      status.textContent = 'AWAITING AUTHORIZATION';
      error.textContent = '';
    }
  });
})();
