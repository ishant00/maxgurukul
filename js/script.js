document.addEventListener('DOMContentLoaded', function () {
  var MOBILE_BP = 760;
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

  // Simple enquiry form handler (front-end only placeholder)
  document.querySelectorAll('form.enquiry-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-note');
      if (note) note.textContent = 'Thank you! Our admissions team will contact you shortly.';
    });
  });
});
