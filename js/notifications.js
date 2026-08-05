/* ============================================================
   MAX THE GURUKUL — notifications
   Reads data/notifications.json (written by the admin panel) and
   renders the announcement bar + the header bell dropdown.
   Read-only on the public site; no backend call needed.
   ============================================================ */
(function () {
  'use strict';

  var DATA_URL = 'data/notifications.json';
  var SEEN_KEY = 'mtg_notif_seen';       // ids the visitor has already read
  var BAR_KEY = 'mtg_notif_bar_closed';  // id of the dismissed bar item

  var CATEGORIES = {
    admission: 'Admission',
    event: 'Event',
    exam: 'Exam',
    holiday: 'Holiday',
    general: 'Notice'
  };

  function readStore(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function writeStore(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode */ }
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Only allow same-site relative links so a compromised JSON can't inject
  // javascript: or offsite URLs into the page.
  function safeLink(href) {
    var h = String(href || '').trim();
    if (!h) return '';
    if (/^(https?:)?\/\//i.test(h) || /^[a-z][a-z0-9+.-]*:/i.test(h)) return '';
    if (h.charAt(0) === '/') return '';
    return h;
  }

  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function sortItems(items) {
    return items.slice().sort(function (a, b) {
      if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
  }

  function buildBar(items) {
    var barItems = items.filter(function (n) { return n.showInBar; });
    if (!barItems.length) return;

    var top = barItems[0];
    if (String(readStore(BAR_KEY)) === String(top.id)) return;

    var bar = document.createElement('div');
    bar.className = 'announce-bar';
    var link = safeLink(top.link);
    bar.innerHTML =
      '<div class="wrap">' +
        '<span class="announce-tag">' + escapeHtml(CATEGORIES[top.category] || 'Notice') + '</span>' +
        '<div class="announce-track"><div class="announce-item">' +
          '<span>' + escapeHtml(top.title) + '</span>' +
          (link ? '<a href="' + escapeHtml(link) + '">' +
                    escapeHtml(top.linkText || 'Read more') + '</a>' : '') +
        '</div></div>' +
        '<button type="button" class="announce-close" aria-label="Dismiss announcement">&times;</button>' +
      '</div>';

    document.body.insertBefore(bar, document.body.firstChild);
    requestAnimationFrame(function () { bar.classList.add('show'); });

    bar.querySelector('.announce-close').addEventListener('click', function () {
      bar.style.transition = 'opacity .25s ease, transform .25s ease';
      bar.style.opacity = '0';
      bar.style.transform = 'translateY(-100%)';
      setTimeout(function () { bar.remove(); }, 250);
      writeStore(BAR_KEY, top.id);
    });
  }

  function buildBell(items) {
    var host = document.querySelector('.header-cta');
    if (!host) return;

    var seen = readStore(SEEN_KEY) || [];
    var unread = items.filter(function (n) { return seen.indexOf(n.id) === -1; });

    var wrap = document.createElement('div');
    wrap.className = 'notif';

    var rows = items.length
      ? items.map(function (n) {
          var isUnread = seen.indexOf(n.id) === -1;
          var link = safeLink(n.link);
          var date = formatDate(n.date);
          return '<div class="notif-row' + (isUnread ? ' unread' : '') + '">' +
            '<span class="dot"></span>' +
            '<div class="body">' +
              '<h5>' + escapeHtml(n.title) + '</h5>' +
              (n.body ? '<p>' + escapeHtml(n.body) + '</p>' : '') +
              '<div class="meta">' +
                '<span class="pill pill-' + escapeHtml(n.category || 'general') + '">' +
                  escapeHtml(CATEGORIES[n.category] || 'Notice') + '</span>' +
                (date ? '<span>' + escapeHtml(date) + '</span>' : '') +
              '</div>' +
              (link ? '<a class="notif-link" href="' + escapeHtml(link) + '">' +
                        escapeHtml(n.linkText || 'Read more') + ' &rarr;</a>' : '') +
            '</div>' +
          '</div>';
        }).join('')
      : '<div class="notif-empty">No announcements right now.</div>';

    wrap.innerHTML =
      '<button type="button" class="notif-btn' + (unread.length ? ' has-unread' : '') + '"' +
        ' aria-label="Announcements" aria-expanded="false" aria-haspopup="true">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>' +
          '<path d="M13.7 21a2 2 0 0 1-3.4 0"/>' +
        '</svg>' +
        '<span class="notif-count">' + (unread.length > 9 ? '9+' : unread.length) + '</span>' +
      '</button>' +
      '<div class="notif-panel" role="dialog" aria-label="Announcements">' +
        '<div class="notif-panel-head">' +
          '<h4>Announcements</h4>' +
          '<button type="button" class="notif-mark-read">Mark all read</button>' +
        '</div>' +
        '<div class="notif-list">' + rows + '</div>' +
      '</div>';

    // Sit the bell left of Apply Now / hamburger.
    host.insertBefore(wrap, host.firstChild);

    var btn = wrap.querySelector('.notif-btn');
    var panel = wrap.querySelector('.notif-panel');

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = !wrap.classList.contains('open');
      wrap.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      // Close the nav drawer if it happens to be open.
      if (willOpen && typeof window.__navClose === 'function') window.__navClose(false);
    });

    document.addEventListener('click', function (e) {
      if (!wrap.classList.contains('open')) return;
      if (wrap.contains(e.target)) return;
      wrap.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });

    function markAllRead() {
      writeStore(SEEN_KEY, items.map(function (n) { return n.id; }));
      btn.classList.remove('has-unread');
      wrap.querySelectorAll('.notif-row.unread').forEach(function (r) {
        r.classList.remove('unread');
      });
    }

    wrap.querySelector('.notif-mark-read').addEventListener('click', function (e) {
      e.stopPropagation();
      markAllRead();
    });

    // Opening the panel and reading it counts as seen.
    panel.addEventListener('mouseenter', function () {
      if (wrap.classList.contains('open')) setTimeout(markAllRead, 1200);
    });
  }

  function init(data) {
    var all = (data && Array.isArray(data.notifications)) ? data.notifications : [];
    var live = sortItems(all.filter(function (n) { return n.active !== false; }));
    buildBar(live);
    buildBell(live);
  }

  function load() {
    fetch(DATA_URL, { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) { if (data) init(data); })
      .catch(function () { /* file:// or missing JSON — bell simply not shown */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
