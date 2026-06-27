const isIndexPage = document.getElementById("demoForm") !== null;
const isThankYouPage = document.getElementById("confetti-canvas") !== null;
const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbwU9ZvslFdpNbq-otAp5XZtBPBIpemX_ZBJGHWkWELweltjnJ5j_Vf75QI6HwxAGXSE/exec";
// ↑ paste your Google Apps Script deployed URL here

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

// ─────────────────────────────────────────────
// // navbar scroll behavior
// ─────────────────────────────────────────────

const navWrapper = document.querySelector(".nav-wrapper");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const scrollThreshold = 80;

function updateNavScroll() {
  if (window.scrollY > scrollThreshold) {
    navWrapper.classList.add("scrolled");
  } else {
    navWrapper.classList.remove("scrolled");
  }
}

function toggleMobileNav() {
  if (!navToggle || !navMenu) return;
  const isOpen = navToggle.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  navMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");
  navToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu",
  );
  navMenu.classList.toggle("open", isOpen);
  if (isOpen) {
    // Move focus into menu
    const firstLink = navMenu.querySelector("a, button");
    firstLink?.focus();
  }
}

function closeMobileNav(returnFocus = true) {
  if (!navToggle || !navMenu) return;
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navMenu.setAttribute("aria-hidden", "true");
  navMenu.classList.remove("open");
  if (returnFocus) navToggle.focus();
}

document.querySelectorAll(".nav-center a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) closeMobileNav(false);
  });
});

// Add Escape key to close
// Focus trap for mobile nav
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navMenu?.classList.contains("open")) {
    closeMobileNav();
  }
});

// Mobile nav focus trap
navMenu?.addEventListener("keydown", (e) => {
  // Run only when menu is open
  if (!navMenu.classList.contains("open")) return;

  // Only handle TAB key
  if (e.key !== "Tab") return;

  const focusable = navMenu.querySelectorAll(
    'a, button, [tabindex]:not([tabindex="-1"])',
  );

  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  // SHIFT + TAB on first item
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  }

  // TAB on last item
  else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

window.addEventListener("scroll", updateNavScroll, { passive: true });
// Add to scroll handler — highlight nav link matching current section
window.addEventListener(
  "scroll",
  () => {
    const sections = ["features", "pricing", "integration"];
    const current = sections.find((id) => {
      const el = document.getElementById(id);
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top <= 100 && rect.bottom > 100;
    });
    document.querySelectorAll(".nav-center a").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  },
  { passive: true },
);

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeMobileNav();
  }
});

if (navToggle) {
  navToggle.addEventListener("click", toggleMobileNav);
}

updateNavScroll();

// ─────────────────────────────────────────────
// index.html only
// ─────────────────────────────────────────────
if (isIndexPage) {
  // ─────────────────────────────────────────────
  //  Hero chart animation
  // ─────────────────────────────────────────────

  (function () {
    const revPath = document.getElementById("revPath");
    const expPath = document.getElementById("expPath");
    const dot1 = document.getElementById("dot1");
    const dot2 = document.getElementById("dot2");
    const dot3 = document.getElementById("dot3");
    const runwayEl = document.getElementById("runwayNum");
    const frCard = document.querySelector(".fr-card");

    if (!frCard) return;

    const chartObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          chartObs.unobserve(frCard);

          // Line draw
          setTimeout(() => {
            if (revPath) {
              revPath.style.transition = `stroke-dashoffset var(--dur-chart) var(--ease-out)`;
              revPath.style.strokeDashoffset = "0";
            }
            if (expPath) {
              expPath.style.transition = `stroke-dashoffset 2s var(--ease-out) 0.3s`;
              expPath.style.strokeDashoffset = "0";
            }
          }, 200);

          // Dots
          setTimeout(() => {
            [dot1, dot2, dot3].forEach((d, i) => {
              if (!d) return;
              setTimeout(() => {
                const start = performance.now();
                const dur = 400;
                const targetR = 4;
                function animR(now) {
                  const t = Math.min((now - start) / dur, 1);
                  const ease = 1 - Math.pow(1 - t, 3);
                  d.setAttribute("r", Math.max(0, targetR * ease).toFixed(2));
                  if (t < 1) requestAnimationFrame(animR);
                  else {
                    d.setAttribute("r", targetR);
                    d.style.animation = `dotPulse var(--dur-dot-pulse) var(--ease-pulse) infinite`;
                  }
                }
                requestAnimationFrame(animR);
              }, i * 160);
            });

            setTimeout(() => {
              if (tooltip) {
                tooltip.style.transition = `opacity var(--dur-slow) var(--ease-standard)`;
                tooltip.setAttribute("opacity", "1");
              }
            }, 600);
          }, 1800);

          // Runway counter
          if (runwayEl) {
            if (reduceMotion) {
              runwayEl.textContent = 18;
              return;
            }
            let count = 0;
            const step = () => {
              count += 1;
              runwayEl.textContent = count;
              if (count < 18) setTimeout(step, 55);
            };
            setTimeout(step, 500);
          }
        });
      },
      { threshold: 0.3 },
    );

    chartObs.observe(frCard);
  })();
  // ─────────────────────────────────────────────
  //// Terminal lines definition
  // ─────────────────────────────────────────────

  const lines = [
    { text: "$ fluroxa connect --source tally", cls: "tk", delay: 300 },
    { text: "  ✓ Tally connected (OAuth)", cls: "ts", delay: 700 },
    { text: "$ fluroxa connect --source zoho-books", cls: "tk", delay: 1100 },
    { text: "  ✓ Zoho Books connected", cls: "ts", delay: 1500 },
    { text: "$ fluroxa connect --source razorpay", cls: "tk", delay: 1900 },
    { text: "  ✓ Razorpay connected", cls: "ts", delay: 2300 },
    {
      text: "  # Tools connected. Dashboard build starting..",
      cls: "tc1",
      delay: 2500,
    },

    { text: "$ fluroxa sync --all", cls: "tk", delay: 2700 },
    { text: "  ⟳ Pulling 18,432 transactions...", cls: "tp", delay: 3100 },
    { text: "  ⟳ Normalising & reconciling...", cls: "tp", delay: 3600 },
    { text: "  ✓ Reconciliation complete. 0 errors.", cls: "ts", delay: 4400 },
    { text: "", cls: "tc1", delay: 4600 },
    { text: "  Ready. Tools connected: 14m 22s", cls: "tg", delay: 4800 },
    { text: "", cls: "tc1", delay: 5000 },
    { text: "  ✓ Dashboard go-live: within 48hrs", cls: "ts", delay: 5300 },
    { text: "  ✓ Live at app.fluroxa.com/dashboard", cls: "tg", delay: 5700 },
  ];

  const termBody = document.getElementById("termBody");
  const termProgress = document.getElementById("termProgress");

  // Inject all lines as hidden, then reveal them
  lines.forEach((l, i) => {
    const div = document.createElement("div");
    div.className = `term-line ${l.cls}`;
    div.textContent = l.text;

    if (i === lines.length - 1) {
      const cursor = document.createElement("span");
      cursor.className = "term-cursor";
      div.appendChild(cursor);
    }
    termBody.appendChild(div);
  });

  // ─────────────────────────────────────────────
  // Use IntersectionObserver to start animation when terminal is visible
  // ─────────────────────────────────────────────

  const allLines = termBody.querySelectorAll(".term-line");

  if (reduceMotion) {
    allLines.forEach((line) => line.classList.add("show"));
  }
  //  else {
  //   lines.forEach((l, i) => {
  //     setTimeout(() => {
  //       allLines[i].classList.add("show");
  //     }, l.delay);
  //   });
  // }

  const termEl = document.querySelector(".terminal");
  let started = false;

  function startTerminal() {
    if (started) return;
    started = true;

    lines.forEach((l, i) => {
      setTimeout(() => {
        allLines[i].classList.add("show");
      }, l.delay);
    });

    // Progress bar
    setTimeout(() => {
      termProgress.style.width = "100%";
    }, 5900);
  }

  // ─────────────────────────────────────────────
  // Scroll reveal - all setions with .reveal class will fade+slide in when scrolled into view
  // ─────────────────────────────────────────────

  document.documentElement.classList.add("js");

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;

        const el = e.target;
        // Generic reveal
        if (el.classList.contains("reveal")) {
          el.classList.add("in");
        }

        // Terminal animation
        if (el.classList.contains("terminal")) {
          startTerminal();
        }

        // Feature card animations
        if (el.classList.contains("fc")) {
          // Feature card animations

          el.classList.add("in");

          // Scenario bars
          el.querySelectorAll(".sc-fill[data-w]").forEach((bar, i) => {
            bar.style.width = "0%";
            requestAnimationFrame(() =>
              requestAnimationFrame(() => {
                setTimeout(
                  () => {
                    bar.style.width = bar.dataset.w + "%";
                  },
                  500 + i * 120,
                );
              }),
            );
          });

          // Cash flow bars
          el.querySelectorAll(".cf-bar[data-h]").forEach((bar, i) => {
            bar.style.height = "0px";
            requestAnimationFrame(() =>
              requestAnimationFrame(() => {
                setTimeout(
                  () => {
                    bar.style.height = bar.dataset.h + "px";
                  },
                  500 + i * 100,
                );
              }),
            );
          });
        }
        // Metrics count-up
        if (el.classList.contains("sp-metrics")) {
          el.querySelectorAll(".sp-metric-num[data-target]").forEach(
            (num, i) => {
              setTimeout(
                () => {
                  countUp(num);
                },
                200 + i * 120,
              );
            },
          );
        }
        revealObs.unobserve(el);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -50px 0px" },
  );

  document
    .querySelectorAll(".reveal, .terminal, .fc, .sp-metrics")
    .forEach((el) => revealObs.observe(el));

  // ─────────────────────────────────────────────
  // Steps scroll state
  // ─────────────────────────────────────────────

  const steps = document.querySelectorAll(".step");

  let ticking = false;

  function updateActiveStep() {
    let closestStep = null;
    let closestDistance = Infinity;

    steps.forEach((step) => {
      const rect = step.getBoundingClientRect();

      const center = rect.top + rect.height / 2;

      const distance = Math.abs(window.innerHeight / 2 - center);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestStep = step;
      }
    });

    steps.forEach((step) => {
      step.classList.remove("active");
    });

    closestStep?.classList.add("active");

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveStep();
      });

      ticking = true;
    }
  });

  updateActiveStep();

  // ─────────────────────────────────────────────
  // Count-up animation for metrics
  // ─────────────────────────────────────────────

  function countUp(el) {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const decimals = parseInt(el.dataset.decimals) || 0;

    if (prefersReduced) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }

    const dur = 1800;
    let start = null;

    const ease = (t) => 1 - Math.pow(1 - t, 3);

    function step(ts) {
      if (!start) start = ts;

      const p = Math.min((ts - start) / dur, 1);
      const val = target * ease(p);

      el.textContent = val.toFixed(decimals) + suffix;

      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  // ─────────────────────────────────────────────
  // Pricing toggle
  // ─────────────────────────────────────────────

  const prices = {
    monthly: {
      p1: "2,499",
      p2: "6,999",
      n1: "",
      n2: "",
    },

    annual: {
      p1: "1,999",
      p2: "5,599",

      n1: "₹23,988 billed annually — save ₹6,000",
      n2: "₹67,188 billed annually — save ₹16,800",
    },
  };

  function setBilling(mode) {
    const d = prices[mode];

    document.getElementById("price1").textContent = d.p1;
    document.getElementById("price2").textContent = d.p2;

    document.getElementById("note1").textContent = d.n1;
    document.getElementById("note2").textContent = d.n2;

    document
      .getElementById("btnMonthly")
      .classList.toggle("active", mode === "monthly");

    document
      .getElementById("btnMonthly")
      .setAttribute("aria-checked", mode === "monthly" ? "true" : "false");

    document
      .getElementById("btnAnnual")
      .classList.toggle("active", mode === "annual");

    document
      .getElementById("btnAnnual")
      .setAttribute("aria-checked", mode === "annual" ? "true" : "false");
  }

  // Default pricing state
  setBilling("monthly");

  document
    .getElementById("btnMonthly")
    .addEventListener("click", () => setBilling("monthly"));
  document
    .getElementById("btnAnnual")
    .addEventListener("click", () => setBilling("annual"));

  // ─────────────────────────────────────────────
  // FAQ accordion
  // ─────────────────────────────────────────────

  function toggleFaq(el) {
    const isOpen = el.classList.contains("open");
    const button = el.querySelector(".pr-faq-q");
    const answer = el.querySelector(".pr-faq-a");

    document.querySelectorAll(".pr-faq-item").forEach((item) => {
      item.classList.remove("open");
      item.querySelector(".pr-faq-q").setAttribute("aria-expanded", "false");
      item.querySelector(".pr-faq-a").setAttribute("aria-hidden", "true");
    });

    if (!isOpen) {
      el.classList.add("open");
      button.setAttribute("aria-expanded", "true");
      answer.setAttribute("aria-hidden", "false");
    }
  }
  document.querySelectorAll(".pr-faq-q").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFaq(btn.closest(".pr-faq-item"));
    }),
  );

  // ─────────────────────────────────────────────
  // Form validation
  // ─────────────────────────────────────────────

  const form = document.getElementById("demoForm");
  const submitBtn = document.getElementById("formSubmit");

  const requiredFields = [
    { id: "fullName", type: "text" },
    { id: "workEmail", type: "email" },
    { id: "company", type: "text" },
  ];

  // WITH THIS — only validates email format, no domain blocking
  function validateField(field) {
    const el = document.getElementById(field.id);
    const errorEl = document.getElementById(`${field.id}-error`);
    const val = el.value.trim();
    let valid = val.length > 0;

    if (field.type === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      valid = emailPattern.test(val);
    }

    let message = "";

    if (field.type === "email") {
      message = "Use format: name@company.com";
    } else {
      const labelText =
        document
          .querySelector(`label[for="${field.id}"]`)
          ?.textContent.replace("*", "")
          .trim() || "This field";
      message = `${labelText} is required`;
    }

    if (!valid) {
      el.classList.add("error");
      el.setAttribute("aria-invalid", "true");
      errorEl.classList.add("show");
      errorEl.textContent = message;
    } else {
      el.classList.remove("error");
      el.setAttribute("aria-invalid", "false");
      errorEl.classList.remove("show");
      errorEl.textContent = "";
    }
    return valid;
  }

  requiredFields.forEach((f) => {
    const el = document.getElementById(f.id);
    el.addEventListener("blur", () => validateField(f));
    el.addEventListener("input", () => {
      if (el.classList.contains("error")) validateField(f);
    });
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const honeypot = document.getElementById("website");
    if (honeypot && honeypot.value.length > 0) return; // bot detected, silent exit

    const allValid = requiredFields.every((f) => validateField(f));
    if (!allValid) {
      const firstInvalid = document.querySelector(
        '.form-input[aria-invalid="true"]',
      );
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    submitBtn.classList.add("loading");
    submitBtn.setAttribute("aria-busy", "true");
    submitBtn.setAttribute("aria-label", "Booking your demo, please wait");
    submitBtn.disabled = true;

    submitBtn.querySelector(".btn-text").textContent = "Booking your demo...";

    document.getElementById("form-live").textContent =
      "Submitting your demo request...";

    const formData = {
      fullName: document.getElementById("fullName").value.trim(),
      email: document.getElementById("workEmail").value.trim(),
      company: document.getElementById("company").value.trim(),
      companySize: document.getElementById("companySize").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      source: "landing_page_demo_form",
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.result !== "success") {
        throw new Error(result.message || "Sheet write failed");
      }

      document.getElementById("form-live").textContent =
        "Demo request submitted successfully.";

      window.location.href = "/thank-you.html";
    } catch (err) {
      submitBtn.classList.remove("loading");

      submitBtn.setAttribute("aria-busy", "false");
      document.getElementById("form-live").textContent =
        "Submission failed. Please try again.";
      submitBtn.setAttribute("aria-label", "Book my demo");
      submitBtn.disabled = false;
      submitBtn.querySelector(".btn-text").textContent =
        "Something went wrong — try again";

      const statusEl = document.getElementById("form-status");
      statusEl.textContent =
        "Something went wrong. Please try again or email us directly.";
      statusEl.classList.remove("sr-only");

      statusEl.style.color = "var(--status-danger)";
      statusEl.style.fontSize = "var(--fs-caption)";
      statusEl.style.marginTop = "var(--sp-8)";

      setTimeout(() => {
        statusEl.textContent = "";
        statusEl.classList.add("sr-only");
        submitBtn.querySelector(".btn-text").textContent = "Book my demo";
      }, 5000);

      console.error("Form submission error:", err);
    }
  }

  form.addEventListener("submit", handleSubmit);

  // ─────────────────────────────────────────────
  // Smooth scroll to form
  // ─────────────────────────────────────────────

  document.querySelectorAll('a[href="#lead-form"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document
        .getElementById("lead-form")
        .scrollIntoView({ behavior: "smooth", block: "start" });
      const firstField = document.getElementById("fullName");
      firstField.scrollIntoView({ behavior: "smooth", block: "start" });
      firstField.focus({ preventScroll: true });
    });
  });
} // end isIndexPage

// ─────────────────────────────────────────────
// thank-you.html only
// ─────────────────────────────────────────────

if (isThankYouPage) {
  // ── Lightweight confetti burst on load

  const canvas = document.getElementById("confetti-canvas");

  if (canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // const colors = ["#0b17c0", "#4080ff", "#15803d", "#b45309", "#dc2626"];

    const _cs = getComputedStyle(document.documentElement);
    const colors = [
      _cs.getPropertyValue("--accent-primary").trim() || "#0b17c0",
      _cs.getPropertyValue("--chart-primary").trim() || "#4080ff",
      _cs.getPropertyValue("--status-success").trim() || "#15803d",
      _cs.getPropertyValue("--status-warning").trim() || "#b45309",
      _cs.getPropertyValue("--status-danger").trim() || "#dc2626",
    ];

    const pieces = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 80,
      w: 6 + Math.random() * 6,
      h: 3 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 2.5,
      vy: 2 + Math.random() * 3,
      vr: (Math.random() - 0.5) * 0.15,
      opacity: 1,
    }));

    let frame = 0;
    const MAX_FRAMES = 120;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.vy += 0.06;
        p.opacity = Math.max(0, 1 - frame / MAX_FRAMES);
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < MAX_FRAMES) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Small delay so page paints first
    setTimeout(draw, 300);

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }
} // end isThankYouPage

//COMMON JS

// ─────────────────────────────────────────────
// Skip to top button behavior
// ─────────────────────────────────────────────

const scrollBtn = document.getElementById("scrollToTop");
if (scrollBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > window.innerHeight) {
      scrollBtn.classList.add("show-btn");
      scrollBtn.classList.remove("hidden-btn");
    } else {
      scrollBtn.classList.add("hidden-btn");
      scrollBtn.classList.remove("show-btn");
    }
  });
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================================
   CHECKLIST MODAL
========================================= */

const checklistModal = document.getElementById("checklistModal");
const openChecklistModal = document.getElementById("openChecklistModal");
const closeChecklistModal = document.getElementById("closeChecklistModal");
const continueChecklist = document.getElementById("continueChecklist");
const step1 = document.getElementById("checklistStep1");
const step2 = document.getElementById("checklistStep2");

function resetChecklistModal() {
  step2.classList.remove("active");
  step1.classList.add("active");
  const emailEl = document.getElementById("checklistEmail");
  const errEl = document.getElementById("checklistEmailErr");
  if (emailEl) {
    emailEl.value = "";
    emailEl.setAttribute("aria-invalid", "false");
    emailEl.style.borderColor = "";
  }
  if (errEl) {
    errEl.textContent = "";
    errEl.classList.remove("show");
  }
}

function closeModal() {
  checklistModal.classList.remove("active");
  document.body.style.overflow = "";
  resetChecklistModal();
  openChecklistModal.focus();
}

openChecklistModal.addEventListener("click", (e) => {
  e.preventDefault();
  checklistModal.classList.add("active");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.querySelector(".checklist-modal").focus(), 50);
});

closeChecklistModal.addEventListener("click", closeModal);

checklistModal.addEventListener("click", (e) => {
  if (e.target === checklistModal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && checklistModal.classList.contains("active"))
    closeModal();
});

continueChecklist.addEventListener("click", () => {
  step1.classList.remove("active");
  step2.classList.add("active");
  document.querySelector(".checklist-modal").scrollTop = 0;
  setTimeout(() => document.getElementById("checklistEmail").focus(), 50);
});

const checklistForm = document.querySelector(".checklist-form");
checklistForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const emailEl = document.getElementById("checklistEmail");
  const errEl = document.getElementById("checklistEmailErr");
  const val = emailEl.value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!pattern.test(val)) {
    emailEl.setAttribute("aria-invalid", "true");
    emailEl.style.borderColor = "var(--status-danger)";
    errEl.textContent = "Enter a valid email address";
    errEl.classList.add("show");
    emailEl.focus();
    return;
  }

  const btn = checklistForm.querySelector(".modal-submit-btn");
  btn.textContent = "Sending…";
  btn.disabled = true;

  try {
    await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        email: val,
        source: "checklist_modal",
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (_) {}

  document.querySelector(".checklist-modal-content").innerHTML = `
    <div style="text-align:center; padding: var(--sp-40) var(--sp-24);">
      <div style="font-size:2.5rem; margin-bottom:var(--sp-16);">✅</div>
      <h3 style="font-family:var(--font-display); font-size:var(--fs-body-lg); font-weight:700; margin-bottom:var(--sp-8); color:var(--text-primary);">Check your inbox</h3>
      <p style="color:var(--text-muted); font-size:var(--fs-label); line-height:var(--lh-body); margin-bottom:var(--sp-16);">
  Checklist sent to <strong style="color:var(--text-primary);">${val}</strong>.<br>No spam — just the checklist.
</p>
<a href="https://drive.google.com/your-file-link"
   target="_blank"
   rel="noopener"
   class="modal-submit-btn"
   style="display:block; text-align:center; text-decoration:none; margin-bottom:var(--sp-12);">
  ⬇ Download Checklist Now
</a>
      <button type="button" class="modal-submit-btn" onclick="document.getElementById('checklistModal').classList.remove('active'); document.body.style.overflow='';">Done →</button>
    </div>`;
});

checklistModal.addEventListener("keydown", (e) => {
  if (!checklistModal.classList.contains("active")) return;
  if (e.key !== "Tab") return;
  const focusable = checklistModal.querySelectorAll(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});
