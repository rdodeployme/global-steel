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
      var subject = 'The Metal Recycling Company enquiry: ' + (f.get('type') || 'General') + (f.get('company') ? ' | ' + f.get('company') : '');
      var href = 'mailto:nigel@junk.com.au?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
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
      document.getElementById('c-note').textContent = fmt(t) + ' t of metal recovered instead of made new. These are estimates; a statement uses weighed output.';
    };
    calc.addEventListener('input', run);
    calc.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    run();
  }
})();

// brand film: play when in view, button toggles
(function(){
  const v=document.getElementById('brand-film'); if(!v) return;
  const b=document.querySelector('[data-film]');
  const label=()=>{ if(b) b.textContent=v.paused?'Play':'Pause'; };
  v.addEventListener('play',label); v.addEventListener('pause',label);
  if(b) b.addEventListener('click',()=>{ v.paused?v.play():v.pause(); });
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    new IntersectionObserver((es)=>{es.forEach(e=>{ if(e.isIntersecting){ v.play().catch(()=>{}); } else { v.pause(); } });},{threshold:.5}).observe(v);
  }
})();

// contact: preselect enquiry type from the link (#partnership, #sample)
(function(){
  var sel=document.querySelector('#enquiry-form select[name="type"]'); if(!sel) return;
  var map={'#partnership':'Work together','#sample':'Request a sample of recycled steel','#processing':'Processing near my site'};
  var v=map[location.hash]; if(!v) return;
  for(var i=0;i<sel.options.length;i++){ if(sel.options[i].value===v){ sel.selectedIndex=i; break; } }
  if(location.hash==='#partnership'||location.hash==='#processing'){ var t=document.getElementById('sample'); if(t) setTimeout(function(){ t.scrollIntoView(); },50); }
})();

// in-body footage: play only while on screen
(function(){
  var vids=[].slice.call(document.querySelectorAll('video.inview')); if(!vids.length) return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){ var v=e.target; if(e.isIntersecting){ if(v.preload==='none'){ v.preload='auto'; } v.play().catch(function(){}); } else { v.pause(); } });},{threshold:.35});
  vids.forEach(function(v){ io.observe(v); });
})();

// booking form: pre-select sector from ?sector=, send as a pre-filled email
(function(){
  var form=document.getElementById('booking-form'); if(!form) return;
  var k=(new URLSearchParams(location.search)).get('sector');
  if(k){ var sel=form.querySelector('select[name="sector"]'); for(var i=0;i<sel.options.length;i++){ if(sel.options[i].getAttribute('data-k')===k){ sel.selectedIndex=i; break; } } }
  form.addEventListener('submit',function(ev){
    ev.preventDefault();
    var f=new FormData(form);
    var need=['organisation','name','email','site']; var miss=need.filter(function(n){return !(f.get(n)||'').trim();});
    if(miss.length){ var el=form.querySelector('[name="'+miss[0]+'"]'); if(el){ el.focus(); el.setAttribute('aria-invalid','true'); } return; }
    var items=f.getAll('items').join('; ')||'(not ticked)';
    var L=['BOOKING REQUEST: collection','',
      'Organisation: '+f.get('organisation'),'Sector: '+f.get('sector'),'Contact: '+f.get('name')+(f.get('role')?' ('+f.get('role')+')':''),
      'Email: '+f.get('email'),'Phone: '+(f.get('phone')||''),'',
      'Items: '+items,'Quantity: '+(f.get('quantity')||''),'',
      'Site: '+f.get('site'),'On site: '+f.get('access'),'Preferred dates: '+(f.get('dates')||''),'Hours: '+f.get('hours'),'',
      'Data-bearing devices: '+f.get('data'),'Medical/lab equipment cleared: '+f.get('cleared'),'Requirements: '+(f.get('requirements')||''),'',
      'Notes:',(f.get('notes')||''),'','(Photos attached if available.)'];
    var subject='Collection booking: '+f.get('organisation')+' | '+f.get('site');
    window.location.href='mailto:nigel@junk.com.au?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(L.join('\n'));
    var ok=document.getElementById('booking-ok'); if(ok){ ok.hidden=false; ok.focus(); }
  });
})();

// collection directory: search, counts and opening a category from the URL
(function(){
  var input=document.getElementById('dir-search'); if(!input) return;
  var cats=[].slice.call(document.querySelectorAll('.dir-cat'));
  var count=document.getElementById('dir-count'), empty=document.getElementById('dir-empty');
  var total=document.querySelectorAll('.dir-list li').length;
  function norm(s){ return (s||'').toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim(); }
  var SYN={'fridge':['refrigerat'],'fridges':['refrigerat'],'aircon':['air condition'],'air con':['air condition'],'ac':['air condition'],
    'washer':['washing machine','dishwasher','glasswasher'],'xray':['x ray'],'guard rail':['guardrail'],'computer':['computer','laptop'],'laptop':['computer'],
    'cable':['cable','wire','wiring'],'wire':['wire','cable'],'stove':['stove','oven','cooktop'],'oven':['oven','stove'],'trolley':['trolley','cart'],'car':['car ','cars','vehicle'],
    'ute':['utility vehicle'],'panel':['panel'],'solar':['solar'],'hot water':['hot water'],'heater':['hot water'],'bin':['bin']};
  function terms(q){ var t=[q]; if(SYN[q]) t=t.concat(SYN[q]); if(q.length>3 && q.slice(-1)==='s') t.push(q.slice(0,-1)); return t; }
  // short words match from the start of a word, so 'bins' finds bins but not cabinets
  function hit(tx,w){ return w.length<5 ? (' '+tx).indexOf(' '+w)>-1 : tx.indexOf(w)>-1; }
  function run(){
    var q=norm(input.value), hits=0, tq=terms(q);
    cats.forEach(function(c){
      var title=norm(c.querySelector('.dir-t b').textContent), n=0;
      [].forEach.call(c.querySelectorAll('.dir-list li'),function(li){
        var tx=norm(li.textContent); var m=!q || title.indexOf(q)>-1 || tq.some(function(w){ return hit(tx,w); });
        li.hidden=!m; li.classList.toggle('hit', !!q && m); if(m) n++;
      });
      c.hidden = !!q && n===0;
      if(q){ c.open = n>0; }
      hits+=n;
    });
    if(count) count.textContent = q ? (hits+' of '+total+' items match') : (total+' items across '+cats.length+' categories');
    if(empty) empty.hidden = !(q && hits===0);
  }
  input.addEventListener('input',run);
  function openHash(){
    var id=(location.hash||'').slice(1); if(!id) return;
    var el=document.getElementById(id);
    if(el && el.classList.contains('dir-cat')){ el.open=true; }
  }
  window.addEventListener('hashchange',openHash);
  var q0=(new URLSearchParams(location.search)).get('q'); if(q0) input.value=q0;
  openHash(); run();
})();

// home hero carousel: crossfade, progress steps, pause on hover/focus/offscreen
(function(){
  var reel=document.getElementById('reel'), bar=document.getElementById('reel-bar');
  if(!reel||!bar) return;
  var slides=[].slice.call(reel.querySelectorAll('.reel-slide'));
  var steps=[].slice.call(bar.querySelectorAll('.reel-steps button'));
  var num=bar.querySelector('.reel-n b'), title=bar.querySelector('.reel-title'), meta=bar.querySelector('.reel-meta');
  var pauseBtn=bar.querySelector('[data-reel="pause"]');
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var i=0, held=still, hover=false, focus=false, away=false, hid=false;
  function pad(n){ return (n<10?'0':'')+n; }
  function load(k){ var im=slides[k]&&slides[k].querySelector('img[data-src]'); if(im){ im.src=im.getAttribute('data-src'); im.removeAttribute('data-src'); } }
  function sync(){
    var stop=held||hover||focus||away||hid;
    bar.classList.toggle('is-paused',stop);
    bar.classList.toggle('is-held',held&&!still);
    if(pauseBtn) pauseBtn.setAttribute('aria-label',held?'Play slideshow':'Pause slideshow');
  }
  function show(k,user){
    k=(k+slides.length)%slides.length; if(k===i&&!user) return;
    load(k); load((k+1)%slides.length);
    slides.forEach(function(s,n){ var on=n===k; s.classList.toggle('is-on',on); if(on) s.removeAttribute('inert'); else s.setAttribute('inert',''); });
    steps.forEach(function(b,n){
      b.classList.toggle('seen',n<k);
      if(n===k){ b.removeAttribute('aria-current'); void b.offsetWidth; b.setAttribute('aria-current','true'); }
      else b.removeAttribute('aria-current');
    });
    i=k;
    num.textContent=pad(k+1);
    title.innerHTML=slides[k].getAttribute('data-title');
  }
  steps.forEach(function(b,n){
    b.setAttribute('aria-label','Show '+slides[n].getAttribute('data-title').replace(/&amp;/g,'&'));
    b.addEventListener('click',function(){ meta.setAttribute('aria-live','polite'); show(n,true); });
    b.querySelector('span').addEventListener('animationend',function(){ if(!held&&!still) show(i+1); });
  });
  bar.addEventListener('click',function(e){
    var t=e.target.closest('[data-reel]'); if(!t) return;
    var a=t.getAttribute('data-reel');
    if(a==='pause'){ held=!held; sync(); return; }
    meta.setAttribute('aria-live','polite');
    show(i+(a==='next'?1:-1),true);
  });
  bar.addEventListener('mouseenter',function(){ hover=true; sync(); });
  bar.addEventListener('mouseleave',function(){ hover=false; sync(); });
  reel.addEventListener('mouseover',function(e){ if(e.target.closest('a')){ hover=true; sync(); } });
  reel.addEventListener('mouseout',function(e){ if(e.target.closest('a')){ hover=false; sync(); } });
  [reel,bar].forEach(function(el){
    el.addEventListener('focusin',function(){ focus=true; sync(); });
    el.addEventListener('focusout',function(e){ if(!el.contains(e.relatedTarget)){ focus=false; sync(); } });
  });
  var x0=null;
  reel.addEventListener('touchstart',function(e){ x0=e.touches[0].clientX; },{passive:true});
  reel.addEventListener('touchend',function(e){
    if(x0===null) return; var dx=e.changedTouches[0].clientX-x0; x0=null;
    if(Math.abs(dx)>40){ show(i+(dx<0?1:-1),true); }
  },{passive:true});
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(en){ away=!en[0].isIntersecting; sync(); },{threshold:.25}).observe(reel);
  }
  document.addEventListener('visibilitychange',function(){ hid=document.hidden; sync(); });
  if(still) bar.classList.add('is-static');
  bar.hidden=false;
  steps[0].setAttribute('aria-current','true');
  sync();
  if(document.readyState==='complete') load(1); else window.addEventListener('load',function(){ load(1); });
})();
