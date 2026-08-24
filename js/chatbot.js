(function () {
  'use strict';

  var BUSINESS_NAME = 'Max The Gurukul';
  var WHATSAPP_NUMBER = '919053635600';
  var PHONE_NUMBER = '+91 90536 35600';
  var EMAIL = 'info@maxthegurukul.com';
  var ADDRESS = 'Max The Gurukul, NH 709A, Karnal-Assandh Main Road, District Karnal, Haryana';

  /* Edit labels, keywords and answers here whenever school information changes. */
  var FAQS = [
    {
      id: 'admission',
      label: 'Admission Process',
      keys: ['admission', 'apply', 'application', 'register', 'join', 'dakhila', 'documents'],
      ans: 'The admission process has four steps: submit the enquiry form or call the admissions office, complete document verification, attend the student assessment and parent interaction, and finish fee payment to confirm the seat. Required documents include the previous mark sheet, transfer certificate, Aadhaar and passport-size photographs.'
    },
    {
      id: 'fees',
      label: 'Fees & Scholarship',
      keys: ['fee', 'fees', 'pricing', 'price', 'cost', 'charges', 'scholarship', 'discount'],
      ans: 'The fee covers tuition, residential boarding, meals, co-curricular activities and NCC/defence training. The current class-wise fee breakup is shared directly by the admissions team. Merit scholarship on tuition fee is listed as 90% for marks above 90%, 60% for marks above 85%, and 40% for marks above 75%. Please contact the school for current-session terms.'
    },
    {
      id: 'timings',
      label: 'School Timings',
      keys: ['timing', 'timings', 'time', 'hours', 'open', 'schedule', 'routine', 'visit'],
      ans: 'The daily Gurukul routine includes morning prayer and hawan, academics, supervised study, sports and evening activities. Office and campus-visit timings can change by session or holiday, so please call ' + PHONE_NUMBER + ' before visiting.'
    },
    {
      id: 'transport',
      label: 'Transport & Hostel',
      keys: ['transport', 'bus', 'pickup', 'drop', 'route', 'hostel', 'boarding', 'residential', 'stay'],
      ans: 'Max The Gurukul offers a fully air-conditioned residential hostel, mess, laundry and 24x7 surveillance. School transport depends on the student location and available route; please share your area with the admissions team on WhatsApp for confirmation.'
    },
    {
      id: 'courses',
      label: 'Courses & Training',
      keys: ['course', 'courses', 'class', 'classes', 'nda', 'sainik', 'neet', 'pw', 'sports', 'games', 'training', 'facility', 'facilities', 'coaching'],
      ans: 'The school serves Pre-Primary and Classes 1-12, with regular academics plus NDA and Sainik School preparation, NEET and competitive-exam support through the PW programme, NCC/defence training, smart classes, science and computer labs, a library, specialised doubt classes, weekly assessments and professional training for 13 games.'
    },
    {
      id: 'contact',
      label: 'Contact & Location',
      keys: ['contact', 'phone', 'call', 'mobile', 'email', 'location', 'address', 'where', 'map', 'karnal'],
      ans: BUSINESS_NAME + ' is located at ' + ADDRESS + '. Phone: ' + PHONE_NUMBER + ' or +91 90537 35600. Email: ' + EMAIL + '.'
    }
  ];

  var WHATSAPP_URL = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent('Hello ' + BUSINESS_NAME + ', I need some information.');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var typingTimer = null;
  var lastFocus = null;

  function icon(path, className) {
    return '<svg class="' + (className || '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + path + '</svg>';
  }

  function buildWidget() {
    if (document.querySelector('.faq-chatbot')) return;

    var root = document.createElement('div');
    root.className = 'faq-chatbot';
    root.innerHTML =
      '<button class="chatbot-launcher" type="button" aria-label="Open help options" aria-haspopup="menu" aria-controls="chatbot-choice-menu" aria-expanded="false" title="Chat with us">' +
        icon('<path d="M21 12a8 8 0 0 1-9 8 9 9 0 0 1-4-.9L3 21l1.8-4A8 8 0 1 1 21 12Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>', 'chatbot-launcher-icon') +
        '<span class="chatbot-launcher-label">Help</span>' +
      '</button>' +
      '<div class="chatbot-choice-menu" id="chatbot-choice-menu" role="menu" aria-label="Choose chat option" hidden>' +
        '<a class="chatbot-choice chatbot-choice-whatsapp" href="' + WHATSAPP_URL + '" target="_blank" rel="noopener" role="menuitem">' +
          icon('<path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.4-4.7A8.5 8.5 0 1 1 20.5 11.7Z"/><path d="M8.5 7.8c.2-.4.4-.4.7-.4h.4c.1 0 .3 0 .4.3l.9 2.1c.1.3.1.5-.1.7l-.7.8c-.2.2-.2.4 0 .7.8 1.4 1.9 2.4 3.3 3.1.3.1.5.1.7-.1l.9-1.1c.2-.2.4-.3.7-.2l2 .9c.3.1.4.3.4.5 0 .3-.2 1.4-.9 2-.6.6-1.5.8-2.4.5-1.4-.4-3.2-1.1-5.2-2.9-1.6-1.4-2.7-3.2-3-4.5-.3-1 .1-1.8.4-2.4Z"/>') +
          '<span><strong>WhatsApp Chat</strong><small>Talk to our admissions team</small></span>' +
        '</a>' +
        '<button class="chatbot-choice chatbot-choice-ai" type="button" role="menuitem">' +
          icon('<path d="M12 3a7 7 0 0 0-7 7v3a4 4 0 0 0 4 4h1v-5H7v-2a5 5 0 0 1 10 0v2h-3v5h1a4 4 0 0 0 4-4v-3a7 7 0 0 0-7-7Z"/><path d="M9 21h6"/>') +
          '<span><strong>AI Assistant</strong><small>Get instant FAQ answers</small></span>' +
        '</button>' +
      '</div>' +
      '<section class="chatbot-panel" role="dialog" aria-modal="false" aria-labelledby="chatbot-title" hidden>' +
        '<header class="chatbot-header">' +
          '<span class="chatbot-avatar" aria-hidden="true">MG</span>' +
          '<span class="chatbot-heading"><strong id="chatbot-title">' + BUSINESS_NAME + '</strong><small>FAQ Assistant</small></span>' +
          '<button class="chatbot-close" type="button" aria-label="Close AI Assistant" title="Close">' + icon('<path d="m6 6 12 12M18 6 6 18"/>') + '</button>' +
        '</header>' +
        '<div class="chatbot-messages" role="log" aria-live="polite" aria-relevant="additions" aria-label="Chat messages"></div>' +
        '<form class="chatbot-composer">' +
          '<label class="visually-hidden" for="chatbot-input">Ask a question</label>' +
          '<input id="chatbot-input" class="chatbot-input" type="text" autocomplete="off" maxlength="240" placeholder="Type your question..." aria-label="Type your question">' +
          '<button class="chatbot-send" type="submit" aria-label="Send message" title="Send">' + icon('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>') + '</button>' +
        '</form>' +
      '</section>';

    document.body.appendChild(root);
    initialise(root);
  }

  function initialise(root) {
    var launcher = root.querySelector('.chatbot-launcher');
    var choiceMenu = root.querySelector('.chatbot-choice-menu');
    var aiChoice = root.querySelector('.chatbot-choice-ai');
    var panel = root.querySelector('.chatbot-panel');
    var closeButton = root.querySelector('.chatbot-close');
    var messages = root.querySelector('.chatbot-messages');
    var form = root.querySelector('.chatbot-composer');
    var input = root.querySelector('.chatbot-input');

    function scrollToLatest() {
      requestAnimationFrame(function () {
        messages.scrollTop = messages.scrollHeight;
      });
    }

    function setMenu(open) {
      choiceMenu.hidden = !open;
      launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
      root.classList.toggle('menu-open', open);
      if (open) {
        lastFocus = document.activeElement;
        setTimeout(function () { choiceMenu.querySelector('a,button').focus(); }, 0);
      }
    }

    function addMessage(type, text, options) {
      var row = document.createElement('div');
      row.className = 'chatbot-message chatbot-message-' + type;

      var bubble = document.createElement('div');
      bubble.className = 'chatbot-bubble';
      bubble.textContent = text;
      row.appendChild(bubble);

      if (options && options.fallback) {
        var fallback = document.createElement('a');
        fallback.className = 'chatbot-inline-action chatbot-whatsapp-fallback';
        fallback.href = WHATSAPP_URL;
        fallback.target = '_blank';
        fallback.rel = 'noopener';
        fallback.textContent = 'Ask on WhatsApp';
        row.appendChild(fallback);
      }

      if (options && options.back) {
        var back = document.createElement('button');
        back.className = 'chatbot-inline-action chatbot-back';
        back.type = 'button';
        back.textContent = 'Back to menu';
        back.addEventListener('click', function () {
          showFaqMenu('What else would you like to know?');
        });
        row.appendChild(back);
      }

      messages.appendChild(row);
      scrollToLatest();
      return row;
    }

    function addQuickReplies() {
      var group = document.createElement('div');
      group.className = 'chatbot-quick-replies';
      group.setAttribute('role', 'group');
      group.setAttribute('aria-label', 'Frequently asked questions');

      FAQS.forEach(function (faq) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'chatbot-quick-reply';
        button.textContent = faq.label;
        button.addEventListener('click', function () {
          askFaq(faq);
        });
        group.appendChild(button);
      });

      messages.appendChild(group);
      scrollToLatest();
    }

    function showFaqMenu(prompt) {
      addMessage('bot', prompt);
      addQuickReplies();
      setTimeout(function () {
        var first = messages.querySelector('.chatbot-quick-replies:last-child .chatbot-quick-reply');
        if (first) first.focus();
      }, 0);
    }

    function showTyping(callback) {
      var row = document.createElement('div');
      row.className = 'chatbot-message chatbot-message-bot chatbot-typing-row';
      row.setAttribute('aria-label', 'Assistant is typing');
      row.innerHTML = '<div class="chatbot-bubble chatbot-typing"><span></span><span></span><span></span></div>';
      messages.appendChild(row);
      scrollToLatest();

      clearTimeout(typingTimer);
      typingTimer = setTimeout(function () {
        row.remove();
        callback();
      }, reduceMotion ? 80 : 650);
    }

    function askFaq(faq) {
      addMessage('user', faq.label);
      showTyping(function () {
        addMessage('bot', faq.ans, { back: true });
      });
    }

    function normalise(value) {
      return String(value || '').toLowerCase().replace(/[^a-z0-9\s&-]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function matchFaq(question) {
      var text = normalise(question);
      var best = null;
      var bestScore = 0;

      FAQS.forEach(function (faq) {
        var score = faq.keys.reduce(function (total, key) {
          return total + (text.indexOf(normalise(key)) !== -1 ? 1 : 0);
        }, 0);
        if (score > bestScore) {
          best = faq;
          bestScore = score;
        }
      });

      return best;
    }

    function sendQuestion(value) {
      var question = String(value || '').trim();
      if (!question) return;

      addMessage('user', question);
      input.value = '';
      var faq = matchFaq(question);

      showTyping(function () {
        if (faq) {
          addMessage('bot', faq.ans, { back: true });
        } else {
          addMessage('bot', 'I could not find an exact answer. Our admissions team can help you directly on WhatsApp.', { fallback: true, back: true });
        }
      });
    }

    function openPanel() {
      setMenu(false);
      panel.hidden = false;
      root.classList.add('panel-open');
      launcher.setAttribute('aria-expanded', 'true');
      lastFocus = launcher;

      if (!messages.children.length) {
        addMessage('bot', 'Namaste! Welcome to ' + BUSINESS_NAME + '. I can help with admissions, fees, timings, hostel, training and contact details.');
        addQuickReplies();
      }

      setTimeout(function () { input.focus(); }, 0);
      scrollToLatest();
    }

    function closePanel(returnFocus) {
      clearTimeout(typingTimer);
      panel.hidden = true;
      root.classList.remove('panel-open');
      launcher.setAttribute('aria-expanded', 'false');
      if (returnFocus) launcher.focus();
    }

    launcher.addEventListener('click', function () {
      if (!panel.hidden) {
        closePanel(false);
        setMenu(true);
      } else {
        setMenu(choiceMenu.hidden);
      }
    });

    aiChoice.addEventListener('click', openPanel);
    closeButton.addEventListener('click', function () { closePanel(true); });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      sendQuestion(input.value);
    });

    document.addEventListener('click', function (event) {
      if (!choiceMenu.hidden && !root.contains(event.target)) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        if (!panel.hidden) {
          event.preventDefault();
          closePanel(true);
        } else if (!choiceMenu.hidden) {
          event.preventDefault();
          setMenu(false);
          launcher.focus();
        }
      }
    });

    panel.addEventListener('keydown', function (event) {
      if (event.key !== 'Tab') return;
      var focusable = Array.prototype.filter.call(panel.querySelectorAll('button:not([disabled]),input:not([disabled]),a[href]'), function (element) {
        return !element.hidden && element.offsetParent !== null;
      });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }
})();
