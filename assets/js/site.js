(function () {
  var header = document.querySelector('.site-header');
  var links = Array.from(header.querySelectorAll('nav a'));
  var sections = links.map(function(link) { return document.getElementById(link.hash.slice(1)); });
  function updateLocation() {
    var edge = header.getBoundingClientRect().bottom + 48;
    var current = document.querySelector('.project-story') ? links.findIndex(function(link){return link.hash === '#projects';}) : null;
    sections.forEach(function(section, index) { if(section && section.getBoundingClientRect().top <= edge) current = index; });
    if (Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2) current = sections.length - 1;
    links.forEach(function(link, index) { if(index === current) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
  }
  function sizeHeader() { document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px'); updateLocation(); }
  if ('ResizeObserver' in window) new ResizeObserver(sizeHeader).observe(header);
  window.addEventListener('resize', sizeHeader);
  var queued = false;
  window.addEventListener('scroll', function() { if(queued) return; queued = true; requestAnimationFrame(function() { queued = false; updateLocation(); }); }, {passive:true});
  sizeHeader();
  function deepLink() { var id; try { id = decodeURIComponent(location.hash.slice(1)); } catch (_) {return;} var target = document.getElementById(id); if (!target) return; var details = target.matches('details') ? target : target.querySelector('details'); if(details && (id.indexOf('details-')===0 || id.indexOf('work-')===0)) { details.open=true; requestAnimationFrame(function(){ target.scrollIntoView(); }); } }
  document.querySelectorAll('details.work-details').forEach(function(details) { details.addEventListener('toggle',function(){if(!window.Fig)return;if(details.open) Fig.play(details);else Fig.pause(details);}); });
  document.querySelectorAll('a[href^="#details-"]').forEach(function(link) {
    link.addEventListener('click', function() {
      var details = document.getElementById(link.hash.slice(1));
      if (!details) return;
      details.open = true;
      // Reopening must also work when the URL already points to this work.
      requestAnimationFrame(function() { details.scrollIntoView(); });
    });
  });
  window.addEventListener('hashchange',deepLink); window.addEventListener('load',deepLink);
})();