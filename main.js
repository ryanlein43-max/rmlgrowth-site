/* RML Growth Partners — minimal vanilla JS */
(function () {
  document.documentElement.classList.add("js");

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
  }

  // Footer year
  var yearEls = document.querySelectorAll("[data-year]");
  for (var i = 0; i < yearEls.length; i++) yearEls[i].textContent = new Date().getFullYear();

  // Subtle reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  // Forms (FormSubmit AJAX)
  var forms = document.querySelectorAll("form[data-ajax-form]");
  forms.forEach(function (form) {
    var status = form.querySelector(".form-status");
    var submitBtn = form.querySelector('button[type="submit"]');
    var success = document.getElementById(form.getAttribute("data-success"));

    function setError(field, msg) {
      var wrap = field.closest(".field");
      if (!wrap) return;
      wrap.classList.add("has-error");
      field.setAttribute("aria-invalid", "true");
      var err = wrap.querySelector(".field-error");
      if (err) err.textContent = msg;
    }
    function clearError(field) {
      var wrap = field.closest(".field");
      if (!wrap) return;
      wrap.classList.remove("has-error");
      field.removeAttribute("aria-invalid");
    }
    function validate() {
      var firstBad = null;
      var fields = form.querySelectorAll("input, select, textarea");
      fields.forEach(function (f) {
        if (f.type === "hidden" || f.closest(".hp")) return;
        clearError(f);
        var val = (f.value || "").trim();
        if (f.required && !val) {
          setError(f, "This field is required.");
          firstBad = firstBad || f;
        } else if (val && f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          setError(f, "Please enter a valid email address.");
          firstBad = firstBad || f;
        } else if (val && f.type === "tel" && val.replace(/\D/g, "").length < 7) {
          setError(f, "Please enter a valid phone number.");
          firstBad = firstBad || f;
        } else if (val && f.type === "url" && !/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(val)) {
          setError(f, "Please enter a valid website (e.g. example.com).");
          firstBad = firstBad || f;
        }
      });
      return firstBad;
    }

    form.addEventListener("input", function (e) {
      if (e.target.closest(".field.has-error")) clearError(e.target);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (status) { status.className = "form-status"; status.textContent = ""; }

      var bad = validate();
      if (bad) { bad.focus(); return; }

      // Honeypot: silently pretend success for bots
      var honey = form.querySelector('input[name="_honey"]');
      if (honey && honey.value) { showSuccess(); return; }

      var data = new FormData(form);
      // Combine multi-select checkboxes into a single readable value
      var interests = data.getAll("Primary interest");
      if (interests.length > 1) { data.delete("Primary interest"); data.append("Primary interest", interests.join(", ")); }

      var original = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }

      fetch(form.action, { method: "POST", headers: { Accept: "application/json" }, body: data })
        .then(function (res) { return res.json().catch(function () { return {}; }).then(function (json) { return { ok: res.ok, json: json }; }); })
        .then(function (r) {
          var flag = r.json && r.json.success;
          if (r.ok && flag !== false && flag !== "false") { showSuccess(); }
          else { throw new Error((r.json && r.json.message) || "Request failed"); }
        })
        .catch(function () {
          if (status) {
            status.className = "form-status is-error";
            status.innerHTML = "Sorry — something went wrong sending your message. Please try again in a moment, or email us directly at <a href=\"mailto:ryan@rmlgrowth.com\">ryan@rmlgrowth.com</a>.";
          }
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = original; }
        });
    });

    function showSuccess() {
      form.hidden = true;
      if (success) {
        success.classList.add("is-visible");
        success.setAttribute("tabindex", "-1");
        success.focus();
      }
    }
  });
})();
