/* ==========================================================================
   Lab-47 - shared behaviour
   Deliberately small: a mobile nav, one scroll reveal, a lightbox, and a
   table-of-contents highlighter. Everything degrades to working HTML.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- theme toggle ------------------------------------------------------
     The initial theme is set by an inline script in <head> so there is no
     flash; this only wires the button and remembers the choice. */
  var toggle_ = document.querySelector('.theme-toggle');
  if (toggle_) {
    toggle_.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      toggle_.setAttribute('aria-label', next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
    // follow the OS while the visitor has not made an explicit choice
    var os = window.matchMedia('(prefers-color-scheme: dark)');
    os.addEventListener('change', function (e) {
      var stored = null;
      try { stored = localStorage.getItem('theme'); } catch (err) {}
      if (!stored) document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    });
  }

  /* --- mobile navigation ------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    var mq = window.matchMedia('(max-width: 760px)');
    var sync = function () {
      if (mq.matches) {
        nav.hidden = toggle.getAttribute('aria-expanded') !== 'true';
      } else {
        nav.hidden = false;
        toggle.setAttribute('aria-expanded', 'false');
      }
    };
    toggle.addEventListener('click', function () {
      toggle.setAttribute('aria-expanded', toggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
      sync();
    });
    mq.addEventListener('change', sync);
    sync();
  }

  /* --- studio clock in the rail ---------------------------------------- */
  var clock = document.querySelector('.clock');
  if (clock) {
    var tick = function () {
      var t = new Date().toLocaleTimeString('en-AU', {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Australia/Melbourne'
      });
      clock.textContent = t + ' AEST';
    };
    tick();
    setInterval(tick, 30000);
  }

  /* --- scroll reveal ----------------------------------------------------- */
  var revealed = document.querySelectorAll('.rv');
  if (revealed.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      revealed.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      // threshold 0 rather than a ratio: sections taller than the viewport
      // would otherwise never reach a percentage-based threshold.
      }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
      revealed.forEach(function (el) { io.observe(el); });
    }
  }

  /* --- lightbox for [data-full] figures ---------------------------------- */
  var shots = document.querySelectorAll('[data-full]');
  if (shots.length) {
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Enlarged image');
    box.innerHTML =
      '<button class="close" type="button" aria-label="Close">&#10005;</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(box);

    var img = box.querySelector('img');
    var cap = box.querySelector('figcaption');
    var closeBtn = box.querySelector('.close');
    var lastFocus = null;

    var open = function (el) {
      lastFocus = document.activeElement;
      img.src = el.getAttribute('data-full');
      img.alt = el.getAttribute('data-alt') || '';
      var text = el.getAttribute('data-caption') || '';
      cap.textContent = text;
      cap.hidden = !text;
      box.classList.add('open');
      closeBtn.focus();
    };
    var close = function () {
      box.classList.remove('open');
      img.removeAttribute('src');
      if (lastFocus) lastFocus.focus();
    };

    shots.forEach(function (el) {
      el.addEventListener('click', function () { open(el); });
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(el); }
      });
    });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target === closeBtn) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('open')) close();
    });
  }

  /* --- play looping clips only while they are on screen ------------------ */
  var clips = document.querySelectorAll('video[data-play-in-view]');
  if (clips.length) {
    if (reduced) {
      clips.forEach(function (v) { v.removeAttribute('autoplay'); v.pause(); if (!v.hasAttribute('data-bg')) v.controls = true; });
    } else if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.play().catch(function () {}); }
          else { e.target.pause(); }
        });
      }, { threshold: 0.25 });
      clips.forEach(function (v) { vio.observe(v); });
    }
  }

  /* --- table of contents highlighting ------------------------------------ */
  var tocLinks = document.querySelectorAll('.doc-toc a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var targets = [];
    tocLinks.forEach(function (a) {
      var t = document.getElementById(a.getAttribute('href').slice(1));
      if (t) targets.push({ link: a, el: t });
    });
    var setActive = function (link) {
      tocLinks.forEach(function (a) { a.classList.toggle('active', a === link); });
    };
    var tocIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var match = targets.filter(function (t) { return t.el === e.target; })[0];
          if (match) setActive(match.link);
        }
      });
    }, { rootMargin: '-90px 0px -65% 0px' });
    targets.forEach(function (t) { tocIO.observe(t.el); });
  }
})();
