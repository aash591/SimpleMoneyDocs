(function () {
  // Landing: type out the rotating second line of the headline.
  var typed = document.getElementById('typed');
  if (typed) {
    var lines = JSON.parse(typed.getAttribute('data-lines'));
    var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) {
      typed.textContent = lines[0];
    } else {
      var i = 0, n = 0, erasing = false;
      (function tick() {
        var line = lines[i];
        n += erasing ? -1 : 1;
        typed.textContent = line.slice(0, n);
        var wait = erasing ? 22 : 48;
        if (!erasing && n === line.length) { erasing = true; wait = 2300; }
        else if (erasing && n === 0) { erasing = false; i = (i + 1) % lines.length; wait = 350; }
        setTimeout(tick, wait);
      })();
    }
  }

  // Home: reveal on scroll, header edge, and the SMS -> entry demo.
  var still0 = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rv = [].slice.call(document.querySelectorAll('.rv'));
  if (rv.length) {
    if (still0 || !('IntersectionObserver' in window)) {
      rv.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      rv.forEach(function (el) { io.observe(el); });
    }
  }

  // Home: endless, draggable, pausable screens carousel.
  (function () {
    var track = document.querySelector('.tour-track');
    if (!track) return;
    var btn = document.querySelector('.tour-pause');
    [].slice.call(track.children).forEach(function (f) {
      var c = f.cloneNode(true); c.setAttribute('aria-hidden', 'true');
      c.querySelector('img').setAttribute('alt', ''); track.appendChild(c);
    });
    var userPaused = false;
    var hold = false, dragging = false, x0 = 0, s0 = 0, moved = 0, resumeAt = 0, pos = 0, last = 0;
    var SPEED = 70; // px per second
    function half() { return track.scrollWidth / 2; }
    function wrap() { var h = half(); if (track.scrollLeft >= h) track.scrollLeft -= h; else if (track.scrollLeft <= 0) track.scrollLeft += h; }
    function label() { if (btn) { btn.textContent = userPaused ? 'Play' : 'Pause'; btn.setAttribute('aria-pressed', userPaused); btn.setAttribute('aria-label', userPaused ? 'Resume scrolling' : 'Pause scrolling'); } }
    label();
    if (btn) btn.addEventListener('click', function () { userPaused = !userPaused; label(); });
    function touchHold() { resumeAt = performance.now() + 2500; }
    track.addEventListener('mouseenter', function () { hold = true; });
    track.addEventListener('mouseleave', function () { hold = false; });
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      dragging = true; moved = 0; x0 = e.clientX; s0 = track.scrollLeft; track.classList.add('drag');
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', function (e) {
      if (!dragging) return; moved = Math.abs(e.clientX - x0);
      track.scrollLeft = s0 - (e.clientX - x0); wrap();
    });
    function end() { dragging = false; track.classList.remove('drag'); touchHold(); }
    track.addEventListener('pointerup', end); track.addEventListener('pointercancel', end);
    ['touchstart', 'wheel'].forEach(function (n) { track.addEventListener(n, touchHold, { passive: true }); });
    track.addEventListener('scroll', function () { if (!dragging) wrap(); }, { passive: true });
    document.addEventListener('visibilitychange', function () { last = 0; });
    function tick(t) {
      if (last) {
        var dt = Math.min(t - last, 64) / 1000;
        if (!userPaused && !hold && !dragging && t > resumeAt) {
          if (Math.abs(track.scrollLeft - pos) > 2) pos = track.scrollLeft;
          pos += SPEED * dt; if (pos >= half()) pos -= half();
          track.scrollLeft = pos;
        }
      }
      last = t; requestAnimationFrame(tick);
    }
    track.scrollLeft = 1;
    requestAnimationFrame(tick);
  })();
  var hbar = document.querySelector('.home .bar');
  if (hbar) {
    var onScroll = function () { hbar.classList.toggle('scrolled', window.scrollY > 8); };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  var flow = document.getElementById('how');
  if (flow && !still0 && 'IntersectionObserver' in window) {
    var step = 0, timer = null;
    var run = function () {
      flow.setAttribute('data-step', String(step));
      var wait = step === 2 ? 3200 : 1800;
      step = (step + 1) % 3;
      timer = setTimeout(run, wait);
    };
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { if (!timer) { step = 0; run(); } }
      else { clearTimeout(timer); timer = null; flow.setAttribute('data-step', '2'); }
    }, { threshold: 0.35 }).observe(flow);
  }

  // Mobile navigation drawer toggle for home
  var bar = document.querySelector('.home .bar');
  var toggle = document.querySelector('.home .menu-toggle');
  if (bar && toggle) {
    toggle.addEventListener('click', function () {
      var open = bar.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!bar.contains(e.target) && bar.classList.contains('menu-open')) {
        bar.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && bar.classList.contains('menu-open')) {
        bar.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
    var menuLinks = bar.querySelectorAll('.menu a');
    for (var m = 0; m < menuLinks.length; m++) {
      menuLinks[m].addEventListener('click', function () {
        bar.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  }

  // Guides: counts on the chips, search, and opening the guide named in the URL.
  var search = document.getElementById('search');
  if (!search) return;
  var groups = [].slice.call(document.querySelectorAll('.group'));
  var items = [].slice.call(document.querySelectorAll('.group details'));
  var none = document.getElementById('none');

  groups.forEach(function (g) {
    var chip = document.querySelector('.chips a[href="#' + g.id + '"]');
    if (chip) chip.textContent += ' (' + g.querySelectorAll('details').length + ')';
  });

  function unmark(root) {
    [].slice.call(root.querySelectorAll('mark')).forEach(function (m) {
      m.replaceWith(document.createTextNode(m.textContent));
    });
    root.normalize();
  }
  function mark(root, q) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [], node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(function (t) {
      var at = t.nodeValue.toLowerCase().indexOf(q);
      if (at < 0) return;
      var hit = t.splitText(at);
      hit.splitText(q.length);
      var m = document.createElement('mark');
      m.textContent = hit.nodeValue;
      hit.replaceWith(m);
    });
  }

  search.addEventListener('input', function () {
    var q = search.value.trim().toLowerCase();
    var shown = 0;
    items.forEach(function (d) {
      unmark(d);
      var hit = !q || d.textContent.toLowerCase().indexOf(q) >= 0;
      d.hidden = !hit;
      if (hit) shown++;
      if (q.length > 1 && hit) { d.open = true; mark(d, q); }
      else if (!q) d.open = false;
    });
    groups.forEach(function (g) {
      g.hidden = !g.querySelector('details:not([hidden])');
    });
    none.style.display = shown ? 'none' : 'block';
  });

  function openFromHash() {
    var el = location.hash && document.getElementById(location.hash.slice(1));
    if (el && el.tagName === 'DETAILS') { el.open = true; el.scrollIntoView(); }
  }
  addEventListener('hashchange', openFromHash);
  openFromHash();

  // Keep the URL pointing at whichever guide was opened, so it can be shared.
  items.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open && d.id) history.replaceState(null, '', '#' + d.id);
    });
  });
})();
