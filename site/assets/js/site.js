/* Cleve Jones Foundation — site behaviour
   Plain ES5-safe JavaScript. No dependencies, no build step. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------- land at the top
     Following a link should open the next page at its top. Browsers do that,
     and they deliberately restore the old position on a back or forward, which
     is also right. Some embedded viewers do neither: they keep the scroll
     position of the page you just left, so "Read Cleve's bio" clicked from the
     founders row near the foot of About opens the bio page near its foot.
     This only fires on a fresh navigation, only if something has already put
     us part-way down, and never once the visitor has started scrolling. */
  (function () {
    if (window.location.hash) { return; }
    var entries = window.performance && window.performance.getEntriesByType &&
                  window.performance.getEntriesByType('navigation');
    if (entries && entries[0] && entries[0].type === 'back_forward') { return; }

    var touched = false;
    function note() { touched = true; }
    window.addEventListener('wheel', note);
    window.addEventListener('touchstart', note);
    window.addEventListener('keydown', note);

    function toTop() {
      if (!touched && (window.scrollY || window.pageYOffset)) { window.scrollTo(0, 0); }
    }
    toTop();
    window.addEventListener('load', function () {
      toTop();
      window.setTimeout(toTop, 120);
    });
  }());

  /* ------------------------------------------------------------- mobile nav */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------------------------- hero
     Home page only. Eight full-screen photographs cross-fade behind the
     headline; the final word of the headline, the caption and the lit logo
     square change with each one. Each photograph also pushes slowly outward
     while it is on screen, and carries on pushing as it fades out. Mirrors "Home page, Option 2" in the
     design deck. */
  var hero = document.getElementById('hero');
  if (hero) {
    var SLIDES = [
      { verb: 'act.',      tag: 'Act',               square: null, caption: 'Advocacy · Art · Mentorship · HIV/AIDS' },
      { verb: 'speak up.', tag: 'LGBTQ+ equality',   square: 0,    caption: 'Cleve Jones marching under the rainbow flag in San Francisco' },
      { verb: 'organize.', tag: 'Civil rights',      square: 0,    caption: 'Marchers carry portraits of Harvey Milk and George Moscone, San Francisco' },
      { verb: 'create.',   tag: 'Free expression',   square: 1,    caption: 'The Parthenon of Books, built from banned books · Kassel, Germany, 2017' },
      { verb: 'teach.',    tag: 'Mentorship',        square: 2,    caption: 'Cleve Jones with students at a Quilt exhibition' },
      { verb: 'unite.',    tag: 'Community',         square: 1,    caption: 'A community mural of many faces' },
      { verb: 'heal.',     tag: 'Public health',     square: 1,    caption: 'En Memoria, a COVID-19 memorial · Tucson, 2024' },
      { verb: 'remember.', tag: 'Remembrance',       square: 3,    caption: 'A candlelight vigil' }
    ];

    var imgs    = hero.querySelectorAll('.hero-img');
    var verbEl  = document.getElementById('heroVerb');
    var tagEl   = document.getElementById('heroTag');
    var capEl   = document.getElementById('heroCap');
    var squares = hero.querySelectorAll('.hero-squares .sq');
    var dots    = hero.querySelectorAll('.hero-dots button');
    var index     = 0;
    var timer     = null;
    var fadeTimer = null;  /* clears the photograph that is on its way out */
    var deadline  = 0;     /* when the next photograph is due */
    var paused    = false; /* keyboard focus is inside the hero, or tab hidden */
    var AUTO      = 6000;  /* the photographs change every six seconds */
    var HOLD      = 15000; /* one the visitor picked holds for fifteen */
    var FADE      = 1400;  /* must match the opacity transition in site.css */
    var SETTLE    = 150;   /* a frame or two of margin before letting it go */

    function show(n) {
      var prev = index;
      index = (n + SLIDES.length) % SLIDES.length;
      var s = SLIDES[index];

      /* The photograph going out keeps a class of its own for the length of
         the dissolve, so it holds its place and carries on with its push
         underneath the one coming in. Dropping the class afterwards resets
         it, so next time round it starts its push from the beginning. */
      for (var i = 0; i < imgs.length; i++) {
        imgs[i].classList.toggle('is-active', i === index);
        imgs[i].classList.toggle('is-leaving', i === prev && prev !== index);
      }
      if (fadeTimer) { window.clearTimeout(fadeTimer); fadeTimer = null; }
      if (prev !== index) {
        (function (leaving) {
          fadeTimer = window.setTimeout(function () {
            leaving.classList.remove('is-leaving');
            fadeTimer = null;
          }, FADE + SETTLE);
        }(imgs[prev]));
      }
      for (var d = 0; d < dots.length; d++) {
        dots[d].setAttribute('aria-current', d === index ? 'true' : 'false');
      }
      for (var q = 0; q < squares.length; q++) {
        squares[q].classList.toggle('is-lit', s.square === null || s.square === q);
      }

      /* the verb and the tag take the colour of the program the photograph
         belongs to — the same colour as its lit square (red, green, plum,
         blue); the opening "act." slide, with every square lit, stays red */
      hero.setAttribute('data-theme', ['red', 'green', 'plum', 'blue'][s.square === null ? 0 : s.square]);

      verbEl.textContent = s.verb;
      tagEl.textContent = s.tag;
      capEl.textContent = s.caption;

      if (!reduceMotion) {
        verbEl.classList.remove('is-swapping');
        void verbEl.offsetWidth;          /* restart the animation */
        verbEl.classList.add('is-swapping');
      }

      /* warm the next photograph so the cross-fade has something to fade to */
      var next = imgs[(index + 1) % imgs.length];
      if (next && next.loading === 'lazy') { next.loading = 'eager'; }
    }

    /* One timeout at a time rather than a fixed interval, so a photograph the
       visitor picked can hold longer than the automatic six seconds. The
       deadline is kept apart from the timer: pausing drops the timer but
       keeps the deadline, so resuming carries on with the time that was left
       instead of starting the wait over. */
    function arm(ms) {
      clear();
      deadline = Date.now() + ms;
      if (reduceMotion || paused) { return; }
      timer = window.setTimeout(function () {
        show(index + 1);
        arm(AUTO);
      }, ms);
    }
    function clear() {
      if (timer) { window.clearTimeout(timer); timer = null; }
    }
    function pause() {
      if (paused) { return; }
      paused = true;
      clear();
    }
    function resume() {
      if (!paused) { return; }
      paused = false;
      var left = deadline - Date.now();
      arm(left > 0 ? left : AUTO);
    }

    /* Picking a photograph jumps straight to it and holds it for HOLD before
       the six-second rotation picks up again. Clicking a dot also focuses
       it, which fires the focusin pause below, so clear the pause first:
       choosing a photograph is a decision to watch it, not to stop. */
    for (var k = 0; k < dots.length; k++) {
      (function (n) {
        dots[n].addEventListener('click', function () {
          paused = false;
          show(n);
          arm(HOLD);
        });
      }(k));
    }

    /* The hero fills most of the window, so pausing on hover would stop the
       rotation almost any time the pointer was at rest. Keyboard focus still
       holds it — someone tabbing through the dots is reading them — and
       prefers-reduced-motion switches it off altogether. */
    hero.addEventListener('focusin', pause);
    hero.addEventListener('focusout', resume);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { pause(); } else { resume(); }
    });

    show(0);
    arm(AUTO);
  }

  /* --------------------------------------------------------- donation card
     Placeholder only. The live form is supplied by the fiscal sponsor
     (San Francisco Study Center) and replaces #donation-widget wholesale. */
  var donate = document.getElementById('donation-widget');
  if (donate) {
    var freq = donate.querySelectorAll('.toggle button');
    var amts = donate.querySelectorAll('.amounts button');
    var cta = document.getElementById('donateCta');
    var state = { freq: 'every month', amount: '40' };

    function paint() {
      cta.textContent = state.amount === 'Other'
        ? 'Continue'
        : 'Give $' + state.amount + ' ' + state.freq;
    }

    function group(nodes, cb) {
      for (var i = 0; i < nodes.length; i++) {
        (function (node) {
          node.addEventListener('click', function () {
            for (var j = 0; j < nodes.length; j++) {
              nodes[j].setAttribute('aria-pressed', 'false');
            }
            node.setAttribute('aria-pressed', 'true');
            cb(node);
            paint();
          });
        }(nodes[i]));
      }
    }

    group(freq, function (n) { state.freq = n.dataset.freq; });
    group(amts, function (n) { state.amount = n.dataset.amount; });
    paint();
  }

  /* --------------------------------------------------------- video embeds
     A card plays in page when it carries a YouTube id. Nothing is requested
     from YouTube until the visitor clicks, so the page stays fast and sets
     no third-party cookies before then. Cards without an id do nothing. */
  var players = document.querySelectorAll('.video-thumb[data-youtube]');
  for (var v = 0; v < players.length; v++) {
    (function (btn) {
      var id = (btn.getAttribute('data-youtube') || '').trim();
      if (!id) { btn.setAttribute('data-state', 'pending'); btn.disabled = true; return; }
      btn.removeAttribute('data-state');
      btn.disabled = false;

      /* use YouTube's poster frame unless the page supplies its own */
      var face = btn.querySelector('.face');
      if (!face.querySelector('img')) {
        var poster = new Image();
        poster.alt = '';
        poster.loading = 'lazy';
        poster.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
        poster.onerror = function () { poster.remove(); };
        face.insertBefore(poster, face.firstChild);
      }

      btn.addEventListener('click', function () {
        var frame = document.createElement('div');
        frame.className = 'frame';
        var f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + id +
                '?autoplay=1&rel=0&modestbranding=1';
        f.title = btn.getAttribute('data-title') || 'Video';
        f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture';
        f.referrerPolicy = 'strict-origin-when-cross-origin';
        f.allowFullscreen = true;
        frame.appendChild(f);
        btn.replaceWith(frame);
        f.focus();
      });
    }(players[v]));
  }

  /* ------------------------------------------------- forms without a backend
     Nothing is wired up yet, so say so rather than silently doing nothing. */
  var stubs = document.querySelectorAll('form[data-stub]');
  for (var f = 0; f < stubs.length; f++) {
    stubs[f].addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = this.querySelector('.form-status');
      if (msg) {
        msg.hidden = false;
        msg.textContent = this.dataset.stub;
      }
    });
  }
}());
