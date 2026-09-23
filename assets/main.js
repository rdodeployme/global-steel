(function () {
  // Mobile menu
  var toggle = document.getElementById('menu-toggle');
  var body = document.body;
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    document.querySelectorAll('#site-nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1180 && body.classList.contains('nav-open')) {
        body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Enquiry form: composes an email (static hosting, no backend)
  var form = document.getElementById('enquiry-form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var f = new FormData(form);
      var lines = [
        'Enquiry type: ' + (f.get('type') || ''),
        'Name: ' + (f.get('name') || ''),
        'Company: ' + (f.get('company') || ''),
        'Phone: ' + (f.get('phone') || ''),
        'Email: ' + (f.get('email') || ''),
        'Location: ' + (f.get('location') || ''),
        'Material of interest: ' + (f.get('material') || ''),
        'Indicative volume: ' + (f.get('volume') || ''),
        '',
        'Message:',
        (f.get('message') || '')
      ];
      var subject = 'Global Steel enquiry — ' + (f.get('type') || 'General') + (f.get('company') ? ' — ' + f.get('company') : '');
      var href = 'mailto:info@recycle.net.au?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
      window.location.href = href;
      var ok = document.getElementById('form-ok');
      if (ok) { ok.hidden = false; ok.focus(); }
    });
  }

  // Count-up numbers
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var fmtN = function (n, d) { return n.toLocaleString('en-AU', { maximumFractionDigits: d }); };
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; cio.unobserve(el);
        var target = parseFloat(el.getAttribute('data-count')), d = parseInt(el.getAttribute('data-dp') || '0', 10);
        var pre = el.getAttribute('data-pre') || '', suf = el.getAttribute('data-suf') || '';
        var t0 = null, dur = 1400;
        var step = function (ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / dur); p = 1 - Math.pow(1 - p, 3);
          el.textContent = pre + fmtN(target * p, d) + suf;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  // Dropdown nav: tap to open on touch, Escape closes
  document.querySelectorAll('.site-nav .has-sub > a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (document.body.classList.contains('nav-open')) return; // mobile: plain link
      var li = a.parentElement;
      if (window.matchMedia('(hover: none)').matches && !li.classList.contains('open')) {
        e.preventDefault();
        document.querySelectorAll('.site-nav .has-sub.open').forEach(function (x) { x.classList.remove('open'); });
        li.classList.add('open'); li.querySelector('.sub').style.cssText = 'opacity:1;visibility:visible;transform:none';
      }
    });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') document.activeElement && document.activeElement.blur(); });

  // Isotype grid (impact page)
  var iso = document.getElementById('iso-containers');
  if (iso) {
    var html = '';
    for (var i = 1; i <= 120; i++) html += '<i class="' + (i <= 62 ? 'lo' : 'hi') + '" title="Container ' + i + '"></i>';
    iso.innerHTML = html;
  }

  // Calculator (impact page)
  var calc = document.getElementById('calc-form');
  if (calc) {
    var F = { steel: 1.5, copper: 5.2, aluminium: 7.9, mixed: 4.8 };
    var fmt = function (n, d) { return n.toLocaleString('en-AU', { maximumFractionDigits: d == null ? (n < 10 ? 1 : 0) : d }); };
    var run = function () {
      var fd = new FormData(calc), t = 0, co2 = 0;
      Object.keys(F).forEach(function (k) { var v = parseFloat(fd.get(k)) || 0; if (v < 0) v = 0; t += v; co2 += v * F[k]; });
      document.getElementById('c-co2').textContent = fmt(co2);
      document.getElementById('c-trees').textContent = fmt(co2 / 0.06, 0);
      document.getElementById('c-cars').textContent = fmt(co2 / 4.6);
      document.getElementById('c-steelcars').textContent = fmt(t / 0.9);
      document.getElementById('c-boxes').textContent = fmt(t / 25, t / 25 < 10 ? 1 : 0);
      document.getElementById('c-note').textContent = fmt(t) + ' t of metal recovered instead of made new. Estimates — a statement uses weighed output.';
    };
    calc.addEventListener('input', run);
    calc.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    run();
  }
})();
