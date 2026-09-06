(function () {
  "use strict";

  var SCHEDULE_URL = "https://calendly.com/wir3ddifferent/30min"; // Paste a Calendly / Cal.com link here to show the "pick a time" button on /consultation.

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
    if (!href) return;
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
    var action = form.getAttribute("action") || "";
    var usesPlaceholder = action.indexOf("YOUR_FORM_ID") !== -1;

    form.addEventListener("submit", function (event) {
      if (usesPlaceholder) {
        event.preventDefault();
        var data = new FormData(form);
        var lines = [];
        ["name", "email", "phone", "company", "needs", "message"].forEach(function (key) {
          var val = data.get(key);
          if (val) lines.push(key.charAt(0).toUpperCase() + key.slice(1) + ": " + val);
        });
        var body = encodeURIComponent(lines.join("\n"));
        var subject = encodeURIComponent("Consultation request — Wired Different");
        window.location.href = "mailto:hello@wireddifferent.io?subject=" + subject + "&body=" + body;
        if (window.fbq) { window.fbq('track', 'Lead'); }
        showStatus();
        return;
      }

      // Real Formspree endpoint: submit via fetch, show the same inline message.
      event.preventDefault();
      var payload = new FormData(form);
      fetch(action, {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            if (window.fbq) { window.fbq('track', 'Lead'); }
            showStatus();
            form.reset();
          } else {
            showStatus("Something went wrong. Please email hello@wireddifferent.io directly.");
          }
        })
        .catch(function () {
          showStatus("Something went wrong. Please email hello@wireddifferent.io directly.");
        });
    });

    function showStatus(message) {
      if (!statusBox) return;
      statusBox.textContent = message || "Thanks — we'll be in touch.";
      if (!message && SCHEDULE_URL) {
        statusBox.appendChild(document.createTextNode(" Want to lock in a time now? "));
        var pick = document.createElement("a");
        pick.href = SCHEDULE_URL;
        pick.target = "_blank";
        pick.rel = "noopener";
        pick.textContent = "Open the calendar";
        statusBox.appendChild(pick);
      }
      statusBox.hidden = false;
      statusBox.setAttribute("role", "status");
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
        lightboxImg.src = img.currentSrc || img.src;
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

  if (scheduleBlock && scheduleLink && SCHEDULE_URL) {
    scheduleLink.href = SCHEDULE_URL;
    scheduleBlock.hidden = false;

    if (scheduleEmbed && /calendly\.com/.test(SCHEDULE_URL)) {
      // Inline Calendly widget, themed to the site. Fires a Meta "Schedule" event on booking.
      var joiner = SCHEDULE_URL.indexOf("?") > -1 ? "&" : "?";
      var themed = SCHEDULE_URL + joiner + "hide_gdpr_banner=1&background_color=0b1220&text_color=f2f5fa&primary_color=ff6b1a";
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
        if (event.data.event === "calendly.event_scheduled" && window.fbq) {
          window.fbq("track", "Schedule");
        }
      });
    }
  }
})();
