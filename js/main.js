(function () {
  "use strict";

  /* ==========================================================================
     CONFIG — the only place to edit when the pending inputs arrive.
     Everything below degrades gracefully: an empty string means the related
     UI is simply not rendered, so nothing ever ships half-finished.
     ========================================================================== */

  var CONFIG = {
    // Calendly / Cal.com booking link. Empty = the "Pick a time" block and the
    // post-submit calendar prompt stay hidden.
    // 2026-09-07: calendly.com/wir3ddifferent/30min was deleted on Calendly
    // (the embed showed "URL is not valid"). Paste the replacement event link.
    SCHEDULE_URL: "",

    // Business phone. Empty = no click-to-call anywhere on the site.
    // Format: PHONE_DISPLAY is what people read, PHONE_HREF is what dials.
    PHONE_DISPLAY: "",
    PHONE_HREF: "",

    // Published price floors. Empty = the price-floor row stays hidden and the
    // "How pricing works" block still renders without numbers.
    PRICE_SITE_FROM: "",
    PRICE_CRM_FROM: "",
    PRICE_AI_FROM: "",
  };

  // Tells the inline <head> boot script that the JS layer is alive, so it does
  // not fall back to "show everything" mode.
  window.__wdReady = true;

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Click-to-call: only rendered once a number is configured ---- */
  if (CONFIG.PHONE_DISPLAY && CONFIG.PHONE_HREF) {
    var telHref = "tel:" + CONFIG.PHONE_HREF;

    document.querySelectorAll(".nav-tel, .footer-tel, .mobile-menu__tel").forEach(function (el) {
      el.href = telHref;
      el.textContent = el.classList.contains("mobile-menu__tel")
        ? "Call " + CONFIG.PHONE_DISPLAY
        : CONFIG.PHONE_DISPLAY;
      el.classList.add("tel-link");
      el.hidden = false;
      el.addEventListener("click", function () {
        if (window.fbq) window.fbq("track", "Contact");
        if (window.gtag) window.gtag("event", "click_to_call");
      });
    });
  }

  /* ---- Published price floors: hidden until numbers exist ---- */
  var priceFloor = document.getElementById("price-floor");

  if (priceFloor && (CONFIG.PRICE_SITE_FROM || CONFIG.PRICE_CRM_FROM || CONFIG.PRICE_AI_FROM)) {
    var rows = [
      ["Websites", CONFIG.PRICE_SITE_FROM],
      ["Custom CRM", CONFIG.PRICE_CRM_FROM],
      ["AI assistants", CONFIG.PRICE_AI_FROM],
    ].filter(function (pair) { return pair[1]; });

    var row = priceFloor.querySelector(".price-floor__row");
    if (row) {
      rows.forEach(function (pair) {
        var item = document.createElement("p");
        item.className = "price-floor__item";
        item.textContent = pair[0] + " from ";
        var amount = document.createElement("span");
        amount.textContent = pair[1];
        item.appendChild(amount);
        row.appendChild(item);
      });
    }
    priceFloor.hidden = false;
  }

  /* ---- Founder photo: swaps itself in the moment the file exists ---- */
  var monogram = document.querySelector(".about-block__mono");

  if (monogram) {
    var probe = new Image();
    probe.onload = function () {
      var photo = document.createElement("img");
      photo.src = "/assets/jake.webp";
      photo.alt = "Jake, founder of Wired Different";
      photo.width = 200;
      photo.height = 200;
      photo.className = "about-block__photo";
      photo.loading = "lazy";
      if (monogram.parentNode) monogram.parentNode.replaceChild(photo, monogram);
    };
    probe.src = "/assets/jake.webp";
  }

  /* ---- Active nav link ---- */
  function normalizePath(p) {
    p = p.replace(/\/+$/, "");
    p = p.replace(/\.html$/, "");
    if (p === "" || p === "/index") return "/";
    return p;
  }

  var currentPath = normalizePath(location.pathname);

  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#") return;
    var hrefPath = normalizePath(href);
    if (hrefPath === currentPath) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---- Consultation form: chip toggles ---- */
  var chipGroup = document.querySelector(".chip-group");
  var needsInput = document.getElementById("needs");

  if (chipGroup && needsInput) {
    var chips = chipGroup.querySelectorAll(".chip");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var pressed = chip.getAttribute("aria-pressed") === "true";
        chip.setAttribute("aria-pressed", pressed ? "false" : "true");
        var selected = [];
        chips.forEach(function (c) {
          if (c.getAttribute("aria-pressed") === "true") {
            selected.push(c.dataset.value || c.textContent.trim());
          }
        });
        needsInput.value = selected.join(", ");
      });
    });
  }

  /* ---- Consultation form: submit handling ---- */
  var form = document.getElementById("consultation-form");

  if (form) {
    var statusBox = document.getElementById("form-status");
    var submitBtn = form.querySelector(".form-submit");
    var action = form.getAttribute("action") || "";
    var submitting = false;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (submitting) return;
      submitting = true;

      if (submitBtn) {
        submitBtn.setAttribute("aria-busy", "true");
        submitBtn.dataset.label = submitBtn.textContent;
        submitBtn.textContent = "Sending…";
      }

      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (!response.ok) throw new Error("bad status");
          if (window.fbq) window.fbq("track", "Lead");
          if (window.gtag) window.gtag("event", "generate_lead");
          form.reset();
          form.querySelectorAll(".chip").forEach(function (c) {
            c.setAttribute("aria-pressed", "false");
          });
          showSuccess();
        })
        .catch(function () {
          showError();
        })
        .then(function () {
          submitting = false;
          if (submitBtn) {
            submitBtn.removeAttribute("aria-busy");
            submitBtn.textContent = submitBtn.dataset.label || "Book my free consult";
          }
        });
    });

    function resetStatus() {
      if (!statusBox) return null;
      statusBox.textContent = "";
      statusBox.hidden = false;
      statusBox.setAttribute("role", "status");
      return statusBox;
    }

    function showSuccess() {
      var box = resetStatus();
      if (!box) return;
      box.classList.remove("is-error");

      var head = document.createElement("strong");
      head.textContent = "Got it — your request is in.";
      box.appendChild(head);

      var next = document.createElement("span");
      next.textContent =
        " Jake reads these himself and replies within one business day" +
        (CONFIG.PHONE_DISPLAY ? ", usually sooner." : ".") +
        " Nothing else is needed from you right now.";
      box.appendChild(next);

      if (CONFIG.SCHEDULE_URL) {
        box.appendChild(document.createElement("br"));
        var pick = document.createElement("a");
        pick.href = CONFIG.SCHEDULE_URL;
        pick.target = "_blank";
        pick.rel = "noopener";
        pick.textContent = "Skip the wait — pick a time now →";
        box.appendChild(pick);
      }
    }

    function showError() {
      var box = resetStatus();
      if (!box) return;
      box.classList.add("is-error");
      box.textContent = "That didn't go through. Email ";
      var mail = document.createElement("a");
      mail.href = "mailto:wir3ddifferent@gmail.com?subject=Consultation%20request";
      mail.textContent = "wir3ddifferent@gmail.com";
      box.appendChild(mail);
      box.appendChild(document.createTextNode(
        CONFIG.PHONE_DISPLAY
          ? " or call " + CONFIG.PHONE_DISPLAY + " and it gets handled."
          : " and it gets handled."
      ));
    }
  }

  /* ---- Services pillar tabs ---- */
  var pillarTabs = document.querySelectorAll(".pillar-tab");
  var pillarPanels = document.querySelectorAll(".pillar-panel");

  if (pillarTabs.length && pillarPanels.length) {
    pillarTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("data-tab");
        if (!target) return;

        pillarTabs.forEach(function (t) {
          var selected = t === tab;
          t.classList.toggle("is-active", selected);
          t.setAttribute("aria-selected", selected ? "true" : "false");
        });

        pillarPanels.forEach(function (panel) {
          var match = panel.getAttribute("data-tab") === target;
          panel.classList.toggle("is-active", match);
          if (match) {
            panel.removeAttribute("hidden");
          } else {
            panel.setAttribute("hidden", "");
          }
        });
      });
    });
  }

  /* ---- Reveal on scroll ---- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el) { observer.observe(el); });
    }
  }

  /* ---- Screenshot lightbox (Work page) ---- */
  var lightbox = document.getElementById("lightbox");

  if (lightbox && typeof lightbox.showModal === "function") {
    var lightboxImg = lightbox.querySelector("img");
    var lightboxClose = lightbox.querySelector(".lightbox-close");
    var lastOpener = null;

    document.querySelectorAll(".screen-row__open").forEach(function (opener) {
      opener.addEventListener("click", function () {
        var img = opener.querySelector("img");
        if (!img || !lightboxImg) return;
        // Prefer the full-resolution original when the thumbnail is a crop.
        lightboxImg.src = opener.dataset.full || img.currentSrc || img.src;
        lightboxImg.alt = img.alt || "";
        lastOpener = opener;
        lightbox.showModal();
      });
    });

    function closeLightbox() {
      lightbox.close();
    }

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener("close", function () {
      if (lastOpener) lastOpener.focus();
    });
  }

  /* ---- Scheduler (Consultation page) ---- */
  var scheduleBlock = document.getElementById("schedule-block");
  var scheduleLink = document.getElementById("schedule-link");
  var scheduleEmbed = document.getElementById("schedule-embed");

  if (scheduleBlock && scheduleLink && CONFIG.SCHEDULE_URL) {
    scheduleLink.href = CONFIG.SCHEDULE_URL;
    scheduleBlock.hidden = false;

    if (scheduleEmbed && /calendly\.com/.test(CONFIG.SCHEDULE_URL)) {
      // Inline Calendly widget, themed to the site. Fires a Meta "Schedule" event on booking.
      var joiner = CONFIG.SCHEDULE_URL.indexOf("?") > -1 ? "&" : "?";
      var themed = CONFIG.SCHEDULE_URL + joiner +
        "hide_gdpr_banner=1&background_color=0b1220&text_color=f2f5fa&primary_color=ff6b1a";
      var css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(css);
      var js = document.createElement("script");
      js.src = "https://assets.calendly.com/assets/external/widget.js";
      js.async = true;
      js.onload = function () {
        if (window.Calendly) {
          window.Calendly.initInlineWidget({ url: themed, parentElement: scheduleEmbed });
        }
      };
      document.head.appendChild(js);
      window.addEventListener("message", function (event) {
        if (event.origin !== "https://calendly.com" || !event.data) return;
        if (event.data.event === "calendly.event_scheduled") {
          if (window.fbq) window.fbq("track", "Schedule");
          if (window.gtag) window.gtag("event", "schedule");
        }
      });
    }
  }

  /* ---- Hide the floating consult CTA while the form is on screen ---- */
  var stickyCta = document.querySelector(".consult-sticky");
  var bookCard = document.getElementById("book");

  if (stickyCta && bookCard && "IntersectionObserver" in window) {
    var stickyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        stickyCta.classList.toggle("is-hidden", entry.isIntersecting);
      });
    }, { threshold: 0.35 });
    stickyObserver.observe(bookCard);
  }
})();
