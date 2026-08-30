document.addEventListener('DOMContentLoaded', function () {
  var MOBILE_BP = 760;

  /* Keep the logo and admission action in a masthead above the sticky nav. */
  var siteHeader = document.querySelector('header.site-header');
  var navRow = siteHeader ? siteHeader.querySelector('.nav-row') : null;
  var brand = navRow ? navRow.querySelector('.brand') : null;
  var headerCta = navRow ? navRow.querySelector('.header-cta') : null;
  var applyButton = headerCta ? headerCta.querySelector('.btn') : null;

  if (siteHeader && brand && applyButton && !document.querySelector('.brand-bar')) {
    var brandBar = document.createElement('div');
    brandBar.className = 'brand-bar';

    var brandRow = document.createElement('div');
    brandRow.className = 'brand-row wrap';
    brandRow.appendChild(brand);
    brandRow.appendChild(applyButton);
    brandBar.appendChild(brandRow);
    siteHeader.parentNode.insertBefore(brandBar, siteHeader);
  }

  /* ---------- Shared footer ---------- */
  var siteFooter = document.querySelector('footer.site-footer');
  if (siteFooter) {
    siteFooter.innerHTML =
      '<svg class="footer-icon-sprite" aria-hidden="true">' +
        '<symbol id="fi-user" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></symbol>' +
        '<symbol id="fi-cap" viewBox="0 0 24 24"><path d="m2 10 10-5 10 5-10 5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/><path d="M22 10v6"/></symbol>' +
        '<symbol id="fi-trophy" viewBox="0 0 24 24"><path d="M8 4h8v4a4 4 0 0 1-8 0Z"/><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 12v5M8 21h8M9 17h6"/></symbol>' +
        '<symbol id="fi-building" viewBox="0 0 24 24"><path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-4h6v4M8 10h1M15 10h1M8 13h1M15 13h1"/></symbol>' +
        '<symbol id="fi-image" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 15-5-5L5 20"/></symbol>' +
        '<symbol id="fi-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20a6 6 0 0 1 12 0M14 15a5 5 0 0 1 7 5"/></symbol>' +
        '<symbol id="fi-mic" viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></symbol>' +
        '<symbol id="fi-calendar" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></symbol>' +
        '<symbol id="fi-star" viewBox="0 0 24 24"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/></symbol>' +
        '<symbol id="fi-pin" viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></symbol>' +
        '<symbol id="fi-phone" viewBox="0 0 24 24"><path d="M5 3h4l2 5-3 2a16 16 0 0 0 6 6l2-3 5 2v4c0 1-1 2-2 2C10 21 3 14 3 5c0-1 1-2 2-2Z"/></symbol>' +
        '<symbol id="fi-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></symbol>' +
        '<symbol id="fi-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-5"/></symbol>' +
        '<symbol id="fi-landmark" viewBox="0 0 24 24"><path d="m3 10 9-6 9 6M5 10h14M6 10v7M10 10v7M14 10v7M18 10v7M4 17h16M3 21h18"/></symbol>' +
      '</svg>' +
      '<div class="footer-wave" aria-hidden="true"><svg viewBox="0 0 1440 110" preserveAspectRatio="none"><path class="wave-orange" d="M0 62C245-10 485 78 755 72C1032 66 1268 39 1440 0V110H0Z"/><path class="wave-navy" d="M0 73C245 1 485 89 755 83C1032 77 1268 50 1440 11V110H0Z"/></svg></div>' +
      '<div class="wrap footer-wrap">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand-col">' +
            '<a class="fbrand" href="index.html" aria-label="Max The Gurukul home">' +
              '<picture>' +
                '<source type="image/webp" srcset="images/optimized/logo-240.webp 240w, images/optimized/logo-320.webp 320w, images/optimized/logo-480.webp 480w" sizes="250px">' +
                '<img src="images/optimized/logo-320.png" srcset="images/optimized/logo-240.png 240w, images/optimized/logo-320.png 320w, images/optimized/logo-480.png 480w" sizes="250px" width="250" height="167" alt="Max The Gurukul logo" decoding="async">' +
              '</picture>' +
            '</a>' +
            '<p>International education with traditional values - a modern Gurukul nurturing NDA, Sainik School and competitive-exam aspirants alongside strong character and discipline.</p>' +
            '<span class="footer-rule" aria-hidden="true"></span>' +
          '</div>' +
          '<div class="footer-nav-col">' +
            '<h5>Explore</h5>' +
            '<ul class="footer-link-list">' +
              '<li><a href="about.html"><span class="footer-link-icon"><svg><use href="#fi-user"/></svg></span><span>About Us</span></a></li>' +
              '<li><a href="admissions.html"><span class="footer-link-icon"><svg><use href="#fi-cap"/></svg></span><span>Admissions</span></a></li>' +
              '<li><a href="results.html"><span class="footer-link-icon"><svg><use href="#fi-trophy"/></svg></span><span>Results</span></a></li>' +
              '<li><a href="facilities.html"><span class="footer-link-icon"><svg><use href="#fi-building"/></svg></span><span>Facilities &amp; Features</span></a></li>' +
              '<li><a href="gallery.html"><span class="footer-link-icon"><svg><use href="#fi-image"/></svg></span><span>Gallery</span></a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-nav-col">' +
            '<h5>Student Life</h5>' +
            '<ul class="footer-link-list">' +
              '<li><a href="student-leaders.html"><span class="footer-link-icon"><svg><use href="#fi-users"/></svg></span><span>Student Leaders</span></a></li>' +
              '<li><a href="voices.html"><span class="footer-link-icon"><svg><use href="#fi-mic"/></svg></span><span>Voices of Gurukul</span></a></li>' +
              '<li><a href="day-at-gurukul.html"><span class="footer-link-icon"><svg><use href="#fi-calendar"/></svg></span><span>A Day at Gurukul</span></a></li>' +
              '<li><a href="why-max-gurukul.html"><span class="footer-link-icon"><svg><use href="#fi-star"/></svg></span><span>Why Max The Gurukul</span></a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-contact-col">' +
            '<h5>Contact</h5>' +
            '<ul class="footer-contact-list">' +
              '<li><span class="footer-contact-icon"><svg><use href="#fi-pin"/></svg></span><span>Max The Gurukul, NH 709A,<br>Karnal-Assandh Main Road,<br>District Karnal, Haryana</span></li>' +
              '<li><span class="footer-contact-icon"><svg><use href="#fi-phone"/></svg></span><a href="tel:+919053635600">+91 90536 35600</a></li>' +
              '<li><span class="footer-contact-icon"><svg><use href="#fi-phone"/></svg></span><a href="tel:+919053735600">+91 90537 35600</a></li>' +
              '<li><span class="footer-contact-icon"><svg><use href="#fi-mail"/></svg></span><a href="mailto:info@maxthegurukul.com">info@maxthegurukul.com</a></li>' +
              '<li><span class="footer-contact-icon"><svg><use href="#fi-mail"/></svg></span><a href="mailto:principal@maxthegurukul.com">principal@maxthegurukul.com</a></li>' +
            '</ul>' +
            '<div class="footer-socials">' +
              '<a href="https://www.instagram.com/maxthegurukul" target="_blank" rel="noopener" aria-label="Instagram"></a>' +
              '<a href="https://www.facebook.com/maxthegurukul" target="_blank" rel="noopener" aria-label="Facebook"></a>' +
              '<a href="https://www.youtube.com/@MaxTheGurukul" target="_blank" rel="noopener" aria-label="YouTube"></a>' +
              '<a href="https://wa.me/919053635600" target="_blank" rel="noopener" aria-label="WhatsApp"></a>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<div class="footer-bottom-item"><span class="footer-bottom-icon"><svg><use href="#fi-shield"/></svg></span><span>&copy; 2026 Max The Gurukul.<br>All rights reserved.</span></div>' +
          '<div class="footer-bottom-item"><span class="footer-bottom-icon"><svg><use href="#fi-landmark"/></svg></span><span>To Be Affiliated to CBSE, New Delhi<br>| Assandh, Karnal</span></div>' +
          '<div class="footer-bottom-item footer-motto"><span>Honoring Tradition.<strong>Inspiring Tomorrow.</strong></span></div>' +
        '</div>' +
      '</div>';
  }

  var burger = document.querySelector('.hamburger');
  var nav = document.querySelector('.primary-nav');

  function isMobile() { return window.innerWidth <= MOBILE_BP; }

  /* ---------- Mobile drawer ---------- */
  if (burger && nav) {
    var backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      // Must live inside the header, not on <body>. The header is
      // position:sticky with a z-index, so it forms a stacking context and the
      // drawer's z-index only ranks it against its header siblings. A backdrop
      // on <body> would outrank the whole header and tint the drawer itself.
      // Inside the header both sit in one context: backdrop 150 < drawer 200.
      var header = document.querySelector('header.site-header');
      (header || document.body).appendChild(backdrop);
    }

    // Drawer header with the close button, injected so all 15 pages get it
    // without touching each file.
    if (!nav.querySelector('.nav-drawer-head')) {
      var head = document.createElement('div');
      head.className = 'nav-drawer-head';
      head.innerHTML =
        '<span class="drawer-title">Menu</span>' +
        '<button type="button" class="nav-close" aria-label="Close menu"></button>';
      nav.insertBefore(head, nav.firstChild);
    }
    var closeBtn = nav.querySelector('.nav-close');

    // Apply Now + quick contact at the foot of the drawer. Injected here so the
    // markup stays in one place rather than repeated across every page.
    if (!nav.querySelector('.drawer-cta')) {
      var cta = document.createElement('div');
      cta.className = 'drawer-cta';
      cta.innerHTML = '<a href="admissions.html#apply" class="btn btn-primary">Apply Now</a>';
      nav.appendChild(cta);

      var contact = document.createElement('div');
      contact.className = 'drawer-contact';
      contact.innerHTML =
        '<a href="tel:+919053635600">📞 +91 90536 35600</a>' +
        '<a href="tel:+919053735600">📞 +91 90537 35600</a>' +
        '<a href="mailto:info@maxthegurukul.com">✉ info@maxthegurukul.com</a>';
      nav.appendChild(contact);
    }

    function openNav() {
      nav.classList.add('open');
      backdrop.classList.add('show');
      document.body.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      nav.removeAttribute('aria-hidden');
      if (closeBtn) closeBtn.focus();
    }

    function closeNav(returnFocus) {
      if (!nav.classList.contains('open')) return;
      nav.classList.remove('open');
      backdrop.classList.remove('show');
      document.body.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
      // Collapse any open accordions so the drawer reopens in a clean state.
      nav.querySelectorAll('li.has-dropdown.open').forEach(function (li) {
        li.classList.remove('open');
        var a = li.querySelector('a.nav-link');
        var d = li.querySelector('.dropdown');
        if (a) a.setAttribute('aria-expanded', 'false');
        if (d) d.setAttribute('aria-hidden', 'true');
      });
      if (returnFocus) burger.focus();
    }

    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-controls', 'primary-nav-menu');
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (nav.classList.contains('open')) closeNav(true); else openNav();
    });

    if (closeBtn) closeBtn.addEventListener('click', function () { closeNav(true); });
    backdrop.addEventListener('click', function () { closeNav(false); });

    // Tap anywhere outside the drawer closes it (covers taps on page content
    // when the backdrop is mid-transition).
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('open')) return;
      if (nav.contains(e.target) || burger.contains(e.target)) return;
      closeNav(false);
    });

    // Swipe right on the drawer to dismiss.
    var touchX = null, touchY = null;
    nav.addEventListener('touchstart', function (e) {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    }, { passive: true });
    nav.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      var dy = e.changedTouches[0].clientY - touchY;
      if (dx > 60 && Math.abs(dx) > Math.abs(dy)) closeNav(false);
      touchX = touchY = null;
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' && e.key !== 'Esc') return;
      closeNav(true);
      var openNotif = document.querySelector('.notif.open');
      if (openNotif) {
        openNotif.classList.remove('open');
        var nb = openNotif.querySelector('.notif-btn');
        if (nb) { nb.setAttribute('aria-expanded', 'false'); nb.focus(); }
      }
    });

    // Keep focus inside the open drawer.
    nav.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !nav.classList.contains('open')) return;
      var focusables = nav.querySelectorAll('a[href], button:not([disabled])');
      var visible = Array.prototype.filter.call(focusables, function (el) {
        return el.offsetParent !== null;
      });
      if (!visible.length) return;
      var first = visible[0], last = visible[visible.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });

    // Closing a tapped link feels better than leaving the drawer open behind
    // the new page during navigation.
    nav.querySelectorAll('.dropdown a').forEach(function (link) {
      link.addEventListener('click', function () { if (isMobile()) closeNav(false); });
    });
    nav.querySelectorAll('li:not(.has-dropdown) > a.nav-link').forEach(function (link) {
      link.addEventListener('click', function () { if (isMobile()) closeNav(false); });
    });

    // Reset drawer state when resizing up to desktop.
    var lastWasMobile = isMobile();
    window.addEventListener('resize', function () {
      var nowMobile = isMobile();
      if (lastWasMobile !== nowMobile) {
        closeNav(false);
        lastWasMobile = nowMobile;
      }
    });

    window.__navClose = closeNav;
  }

  /* ---------- Dropdowns ---------- */
  document.querySelectorAll('.primary-nav li.has-dropdown').forEach(function (li) {
    var anchor = li.querySelector('a');
    var dropdown = li.querySelector('.dropdown');

    if (dropdown) {
      anchor.setAttribute('aria-expanded', 'false');
      dropdown.setAttribute('aria-hidden', 'true');
    }

    li.addEventListener('mouseenter', function () {
      if (!isMobile()) {
        this.classList.add('open');
        anchor.setAttribute('aria-expanded', 'true');
        if (dropdown) dropdown.setAttribute('aria-hidden', 'false');
      }
    });

    li.addEventListener('mouseleave', function () {
      if (!isMobile()) {
        this.classList.remove('open');
        anchor.setAttribute('aria-expanded', 'false');
        if (dropdown) dropdown.setAttribute('aria-hidden', 'true');
      }
    });

    // On mobile the arrow zone toggles the accordion; the rest of the link
    // still navigates to the section page.
    anchor.addEventListener('click', function (e) {
      if (!dropdown || !isMobile()) return;
      var rect = anchor.getBoundingClientRect();
      var inArrowZone = e.clientX >= rect.right - 56;
      if (!inArrowZone && e.clientX !== 0) return;
      e.preventDefault();
      var willOpen = !li.classList.contains('open');
      // accordion: only one section expanded at a time
      var parentUl = li.parentElement;
      Array.prototype.forEach.call(parentUl.children, function (sib) {
        if (sib !== li && sib.classList.contains('open')) {
          sib.classList.remove('open');
          var sa = sib.querySelector('a.nav-link');
          var sd = sib.querySelector('.dropdown');
          if (sa) sa.setAttribute('aria-expanded', 'false');
          if (sd) sd.setAttribute('aria-hidden', 'true');
        }
      });
      li.classList.toggle('open', willOpen);
      anchor.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      dropdown.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
    });
  });

  document.addEventListener('click', function (e) {
    if (isMobile()) return;
    document.querySelectorAll('.primary-nav li.has-dropdown.open').forEach(function (li) {
      if (!li.contains(e.target)) {
        li.classList.remove('open');
        var anchor = li.children[0];
        var dropdown = li.querySelector('.dropdown');
        if (anchor) anchor.setAttribute('aria-expanded', 'false');
        if (dropdown) dropdown.setAttribute('aria-hidden', 'true');
      }
    });
  });

  function initNavOverflow() {
    var nav = document.querySelector('.primary-nav');
    if (!nav) return;
    var ul = nav.querySelector('ul');
    if (!ul) return;
    var moreItem = ul.querySelector('.more-item');
    if (!moreItem) {
      moreItem = document.createElement('li');
      moreItem.className = 'has-dropdown more-item';
      moreItem.innerHTML = '<button type="button" class="nav-link more-toggle">More</button><div class="dropdown"></div>';
      ul.appendChild(moreItem);
      var moreButton = moreItem.querySelector('.more-toggle');
      moreButton.setAttribute('aria-expanded', 'false');
      moreButton.addEventListener('click', function (e) {
        e.preventDefault();
        var isOpen = moreItem.classList.toggle('open');
        moreButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
      document.addEventListener('click', function (e) {
        if (!moreItem.contains(e.target)) {
          moreItem.classList.remove('open');
          moreButton.setAttribute('aria-expanded', 'false');
        }
      });
    }

    var moreDropdown = moreItem.querySelector('.dropdown');

    function rebuildMoreList(overflowItems) {
      moreDropdown.innerHTML = '';
      overflowItems.forEach(function (li) {
        var anchor = li.querySelector('a.nav-link');
        if (!anchor) return;
        var link = document.createElement('a');
        link.className = 'dropdown-link';
        link.href = anchor.href;
        link.textContent = anchor.textContent;
        if (anchor.target) link.target = anchor.target;

        // Preserve the item's own submenu (e.g. Admissions, Facilities, More about Gurukul)
        var sub = li.querySelector('.dropdown');
        if (sub && sub.children.length) {
          var wrapper = document.createElement('div');
          wrapper.className = 'more-sub has-dropdown';

          var nested = document.createElement('div');
          nested.className = 'dropdown';
          Array.prototype.forEach.call(sub.querySelectorAll('a'), function (childA) {
            var child = document.createElement('a');
            child.href = childA.href;
            child.textContent = childA.textContent;
            if (childA.target) child.target = childA.target;
            nested.appendChild(child);
          });

          var toggle = document.createElement('button');
          toggle.type = 'button';
          toggle.className = 'more-sub-toggle';
          toggle.setAttribute('aria-label', 'Open ' + anchor.textContent + ' submenu');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.textContent = '▸';
          toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var willOpen = !wrapper.classList.contains('open');
            // close sibling submenus so only one flyout shows at a time
            Array.prototype.forEach.call(moreDropdown.querySelectorAll('.more-sub.open'), function (other) {
              if (other !== wrapper) {
                other.classList.remove('open');
                var t = other.querySelector('.more-sub-toggle');
                if (t) t.setAttribute('aria-expanded', 'false');
              }
            });
            wrapper.classList.toggle('open', willOpen);
            toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
          });

          wrapper.appendChild(link);
          wrapper.appendChild(toggle);
          wrapper.appendChild(nested);
          moreDropdown.appendChild(wrapper);
        } else {
          moreDropdown.appendChild(link);
        }
      });
    }

    function navGap() {
      var cs = getComputedStyle(ul);
      var g = parseFloat(cs.columnGap);
      if (isNaN(g)) { g = parseFloat(cs.gap); }
      return isNaN(g) ? 0 : g;
    }

    // ul.scrollWidth is useless here: the absolutely-positioned .dropdown panels
    // hang past the end of the row and inflate it by ~200px, which made the loop
    // below hide items that actually fit. Measure the laid-out row instead.
    function rowWidth(list, gap) {
      var total = 0, shown = 0;
      for (var i = 0; i < list.length; i++) {
        var w = list[i].offsetWidth;
        if (!w) { continue; }
        total += w;
        shown++;
      }
      return total + (shown > 1 ? gap * (shown - 1) : 0);
    }

    function adjustOverflow() {
      var isMobileNow = window.innerWidth <= MOBILE_BP;
      var items = Array.from(ul.children).filter(function (li) { return !li.classList.contains('more-item'); });

      if (isMobileNow) {
        // In the drawer every item is shown in full; clear inline styles so the
        // stylesheet's block layout and stagger animation apply.
        moreItem.style.display = 'none';
        moreDropdown.innerHTML = '';
        items.forEach(function (li) {
          li.classList.remove('overflowed');
          li.style.display = '';
        });
        return;
      }

      items.forEach(function (li) {
        li.classList.remove('overflowed');
        li.style.display = 'inline-flex';
      });
      moreItem.style.display = 'inline-flex';
      moreDropdown.innerHTML = '';

      var gap = navGap();
      var available = nav.clientWidth - moreItem.offsetWidth - gap;
      var overflow = [];

      while (items.length && rowWidth(items, gap) > available) {
        var last = items.pop();
        last.classList.add('overflowed');
        last.style.display = 'none';
        overflow.unshift(last);
      }

      if (overflow.length) {
        rebuildMoreList(overflow);
        moreItem.style.display = 'inline-flex';
      } else {
        moreItem.style.display = 'none';
      }
    }

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(adjustOverflow, 120);
    });
    window.addEventListener('load', adjustOverflow);
    requestAnimationFrame(adjustOverflow);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(adjustOverflow);
    }
    adjustOverflow();
  }

  initNavOverflow();

  /* ---------- Social icons ----------
     The topbar links shipped as bare words ("Instagram", "Facebook", …) and the
     footer carried hand-drawn approximations of the marks. Both are replaced here
     with the real brand glyphs, injected once for all 14 pages rather than pasted
     into each file. The network is derived from the href, so adding a link to the
     markup is enough — no icon markup required at the call site. */
  var SOCIAL_ICONS = {
    instagram: {
      label: 'Instagram',
      path: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z'
    },
    facebook: {
      label: 'Facebook',
      path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
    },
    youtube: {
      label: 'YouTube',
      path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
    },
    whatsapp: {
      label: 'WhatsApp',
      path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z'
    }
  };

  function socialKeyFromHref(href) {
    var h = (href || '').toLowerCase();
    if (h.indexOf('instagram.') > -1) return 'instagram';
    if (h.indexOf('facebook.') > -1 || h.indexOf('fb.com') > -1) return 'facebook';
    if (h.indexOf('youtube.') > -1 || h.indexOf('youtu.be') > -1) return 'youtube';
    if (h.indexOf('whatsapp') > -1 || h.indexOf('wa.me') > -1) return 'whatsapp';
    return null;
  }

  function makeGlyph(key) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('class', 'social-ico');
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', SOCIAL_ICONS[key].path);
    svg.appendChild(p);
    return svg;
  }

  document.querySelectorAll('.topbar .socials, .footer-socials').forEach(function (group) {
    if (group.querySelector('a[href*="wa.me"], a[href*="whatsapp"]')) return;
    var whatsappLink = document.createElement('a');
    whatsappLink.href = 'https://wa.me/919053635600';
    whatsappLink.target = '_blank';
    whatsappLink.rel = 'noopener';
    whatsappLink.setAttribute('aria-label', 'WhatsApp');
    whatsappLink.setAttribute('title', 'WhatsApp');
    group.appendChild(whatsappLink);
  });

  document.querySelectorAll('.topbar .socials a, .footer-socials a').forEach(function (link) {
    var key = socialKeyFromHref(link.getAttribute('href'));
    if (!key || !SOCIAL_ICONS[key]) return;

    var meta = SOCIAL_ICONS[key];
    link.setAttribute('data-social', key);
    if (!link.getAttribute('aria-label')) link.setAttribute('aria-label', meta.label);
    if (!link.getAttribute('title')) link.setAttribute('title', meta.label);

    // Drop whatever was there — the old outline approximations in the footer, the
    // bare network name in the topbar — and rebuild from the real mark.
    link.innerHTML = '';
    link.appendChild(makeGlyph(key));
  });

  /* ---------- Scroll reveal ----------
     Elements marked .reveal fade up as they enter the viewport. Siblings inside a
     shared parent stagger so a grid resolves row by row instead of all at once.
     The CSS hides .reveal only under `scripting: enabled`, and the failsafe below
     unhides everything if IntersectionObserver never fires — nothing can end up
     permanently invisible. */

  /* Repeating card/list components that should reveal on every page that uses them.
     Tagged here rather than in the markup so all 14 pages stay in sync from one
     place — the same reason the social icons and drawer chrome are injected. */

  // Card-level components. These are the good reveal targets: small, repeated, and
  // they stagger into a grid nicely.
  var REVEAL_CARDS = [
    '.tile',
    '.gallery-tile',
    '.leader-card',
    '.timeline-item',
    '.message-block',
    '.result-card'
  ].join(',');

  // Big section wrappers. Only worth revealing when they hold no cards — otherwise
  // the wrapper would swallow its children's stagger and fade the block as one slab.
  var REVEAL_WRAPPERS = [
    '.about-section',
    '.disc-block',
    '.facility-group'
  ].join(',');

  function markReveals() {
    // Cards first, so a wrapper can see whether its children already claimed the
    // animation before deciding to claim it itself.
    document.querySelectorAll(REVEAL_CARDS).forEach(function (el) {
      // Tab panels are display:none until selected, so an observer would never see
      // them. Those animate via the CSS keyframe on .tab-panel.active instead.
      if (el.closest('.tab-panel')) return;
      // Nested cards (a tile inside a message-block, say) would fade inside an
      // already-fading parent; the outer one carries it.
      if (el.parentElement && el.parentElement.closest(REVEAL_CARDS)) return;
      el.classList.add('reveal');
    });

    document.querySelectorAll(REVEAL_WRAPPERS).forEach(function (el) {
      if (el.closest('.tab-panel')) return;
      if (el.querySelector('.reveal')) return;          // children animate instead
      if (el.parentElement && el.parentElement.closest('.reveal')) return;
      el.classList.add('reveal');
    });
  }

  function initReveal() {
    markReveals();

    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    function showAll() {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
    }

    if (!('IntersectionObserver' in window)) { showAll(); return; }

    // Stagger is per-parent so each grid/row counts from its own first child.
    var seen = new Map();
    targets.forEach(function (el) {
      var parent = el.parentElement;
      var n = (seen.get(parent) || 0);
      seen.set(parent, n + 1);
      el.style.setProperty('--reveal-delay', Math.min(n, 7) * 80 + 'ms');
    });

    var fired = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        fired = true;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    targets.forEach(function (el) { io.observe(el); });

    // Belt and braces: if the observer never reported a single intersection,
    // something is wrong — show everything rather than leave a blank page.
    // Once it has fired even once we trust it, so below-fold items keep animating.
    setTimeout(function () { if (!fired) showAll(); }, 2600);
  }

  initReveal();

  /* ---------- Photo fade-in ----------
     Every photo on the site is served from images/optimized/ through <picture>,
     with loading="lazy" on everything below the first row. Each one fades in as
     it finishes decoding so a slow connection resolves tile by tile rather than
     flashing half-painted images.

     The CSS hides these only under `scripting: enabled`, so a no-JS visitor sees
     the photos outright. `complete` catches anything already in the cache before
     this ran — without it a warm reload would leave tiles permanently at
     opacity 0. */
  (function initPhotoFade() {
    var photos = document.querySelectorAll(
      '.photo-gallery img, .photo-figure img, .campus-photo-row img, .gallery-tile img'
    );
    if (!photos.length) return;

    function show(img) { img.classList.add('is-loaded'); }

    photos.forEach(function (img) {
      if (img.complete && img.naturalWidth) { show(img); return; }
      img.addEventListener('load', function () { show(img); }, { once: true });
      // A 404 or decode failure must not leave a permanently invisible box — the
      // browser's own broken-image affordance is more useful than a blank tile.
      img.addEventListener('error', function () { show(img); }, { once: true });
    });
  })();

  // Tabs (Results page)
  document.querySelectorAll('.tabs-nav').forEach(function (tabsNav) {
    var buttons = tabsNav.querySelectorAll('button');
    var panels = tabsNav.parentElement.querySelectorAll('.tab-panel');
    buttons.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        panels[i].classList.add('active');
      });
    });
  });

  // Scroll-spy for About Us side nav
  var sideLinks = document.querySelectorAll('.side-nav a');
  if (sideLinks.length) {
    var sections = Array.prototype.map.call(sideLinks, function (l) {
      return document.querySelector(l.getAttribute('href'));
    });
    window.addEventListener('scroll', function () {
      var pos = window.scrollY + 130;
      var current = 0;
      sections.forEach(function (sec, i) {
        if (sec && sec.offsetTop <= pos) current = i;
      });
      sideLinks.forEach(function (l) { l.classList.remove('active'); });
      sideLinks[current].classList.add('active');
    });
  }

  // Store enquiries in the Hostinger-compatible PHP JSON backend.
  document.querySelectorAll('form.enquiry-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-note');
      var data = new FormData(form);
      fetch('backend/form_submit.php', {method:'POST', body:data})
        .then(function(r){ return r.json().then(function(x){ if(!r.ok) throw new Error(x.error || 'Unable to send'); return x; }); })
        .then(function(){ if(note) note.textContent = 'Thank you! Our admissions team will contact you shortly.'; form.reset(); })
        .catch(function(err){ if(note) note.textContent = err.message || 'Unable to send your enquiry right now.'; });
    });
  });
});
