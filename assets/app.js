// 사진 확대 보기 + 목차 현재 위치 표시
(function () {
  'use strict';

  /* ── Lightbox ─────────────────────────────── */
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML =
    '<button class="close" type="button" aria-label="닫기">&times;</button>' +
    '<img alt="">' +
    '<div class="cap"></div>';
  document.body.appendChild(box);

  var boxImg = box.querySelector('img');
  var boxCap = box.querySelector('.cap');

  function open(src, cap) {
    boxImg.src = src;
    boxImg.alt = cap || '';
    boxCap.textContent = cap || '';
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    box.classList.remove('open');
    document.body.style.overflow = '';
    boxImg.src = '';
  }

  document.addEventListener('click', function (e) {
    var img = e.target.closest('.shot img, .look-item img, .prop img, .pairing-item img');
    if (img) {
      var fig = img.closest('figure');
      var cap = fig && fig.querySelector('figcaption');
      open(img.currentSrc || img.src, cap ? cap.textContent : img.alt);
      return;
    }
    if (e.target.closest('.lightbox')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  /* ── Nav highlight ────────────────────────── */
  var links = [].slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  if (!links.length) return;
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function sync() {
    var y = window.scrollY + 90;
    var current = sections[0];
    sections.forEach(function (s) { if (s.offsetTop <= y) current = s; });
    links.forEach(function (a) {
      var on = current && a.getAttribute('href') === '#' + current.id;
      a.classList.toggle('is-active', on);
      if (on && a.parentNode.parentNode.scrollWidth > a.parentNode.parentNode.clientWidth) {
        a.scrollIntoView({ block: 'nearest', inline: 'center' });
      }
    });
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { sync(); ticking = false; });
  }, { passive: true });
  sync();
})();
