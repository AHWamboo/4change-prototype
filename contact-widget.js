/**
 * 4change — Floating Contact Widget
 * Samodzielny widget formularza kontaktowego.
 * Dołącz <script src="contact-widget.js"></script> przed </body>
 */
(function () {
  'use strict';

  // Nie pokazuj na stronie kontaktowej — ma już pełny formularz
  if (window.location.pathname.includes('kontakt')) return;

  /* ─────────────────────────────────────────
     STYLES
  ───────────────────────────────────────── */
  const CSS = `
    .cw-wrap * { box-sizing: border-box; }

    /* Trigger button */
    .cw-trigger {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9990;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: #111;
      color: #fff;
      border: none;
      border-radius: 999px;
      padding: 13px 22px 13px 16px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      cursor: pointer;
      box-shadow: 0 6px 24px rgba(0,0,0,0.28);
      transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
      white-space: nowrap;
    }
    .cw-trigger:hover {
      background: #222;
      transform: translateY(-3px);
      box-shadow: 0 12px 36px rgba(0,0,0,0.32);
    }
    .cw-trigger.cw-is-open {
      background: #333;
    }

    /* Top-left "Bezpłatna konsultacja" trigger */
    .cw-trigger-tl {
      position: fixed;
      top: 88px;
      left: 28px;
      z-index: 9990;
      display: inline-flex;
      align-items: center;
      gap: 9px;
      background: #42c441;
      color: #fff;
      border: none;
      border-radius: 999px;
      padding: 12px 20px 12px 15px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      cursor: pointer;
      box-shadow: 0 6px 22px rgba(66,196,65,0.34);
      transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
      white-space: nowrap;
    }
    .cw-trigger-tl:hover {
      background: #00af11;
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(66,196,65,0.4);
    }
    .cw-trigger-tl.cw-is-open { background: #2f8016; }
    .cw-trigger-tl svg { flex-shrink: 0; }

    /* Panel repositioned to top-left when opened from consultation button */
    .cw-panel.cw-tl {
      top: 140px;
      left: 28px;
      bottom: auto;
      right: auto;
      transform-origin: top left;
      transform: scale(0.86) translateY(-14px);
    }
    .cw-panel.cw-tl.cw-is-open {
      transform: scale(1) translateY(0);
    }

    @media (max-width: 640px) {
      .cw-trigger-tl { top: 74px; left: 14px; padding: 10px 15px 10px 13px; font-size: 0.72rem; }
      .cw-panel.cw-tl { left: 12px; top: 120px; width: calc(100vw - 24px); max-width: 340px; }
    }

    /* Pulsing green dot */
    .cw-dot {
      width: 9px; height: 9px;
      border-radius: 50%;
      background: #42c441;
      flex-shrink: 0;
      position: relative;
    }
    .cw-dot::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: rgba(66,196,65,0.25);
      animation: cw-pulse 2.2s ease-in-out infinite;
    }
    @keyframes cw-pulse {
      0%, 100% { transform: scale(0.8); opacity: 0.8; }
      50%       { transform: scale(1.4); opacity: 0; }
    }

    /* Attention bounce (fired once after delay) */
    @keyframes cw-attention {
      0%  { transform: translateY(0); }
      20% { transform: translateY(-8px); }
      40% { transform: translateY(-2px); }
      60% { transform: translateY(-5px); }
      80% { transform: translateY(-1px); }
      100%{ transform: translateY(0); }
    }
    .cw-trigger.cw-bounce { animation: cw-attention 0.7s ease; }

    /* Panel */
    .cw-panel {
      position: fixed;
      bottom: 84px;
      right: 28px;
      z-index: 9989;
      width: 320px;
      background: #fff;
      border-radius: 18px;
      box-shadow:
        0 2px 4px rgba(0,0,0,0.04),
        0 8px 24px rgba(0,0,0,0.1),
        0 24px 64px rgba(0,0,0,0.14);
      overflow: hidden;
      transform-origin: bottom right;
      transform: scale(0.86) translateY(14px);
      opacity: 0;
      pointer-events: none;
      transition:
        transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1),
        opacity 200ms ease;
    }
    .cw-panel.cw-is-open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    /* Panel header */
    .cw-header {
      background: #111;
      padding: 22px 22px 20px;
      position: relative;
      overflow: hidden;
    }
    .cw-header::before {
      content: '';
      position: absolute;
      bottom: -40px; right: -40px;
      width: 160px; height: 160px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(66,196,65,0.18) 0%, transparent 70%);
      pointer-events: none;
    }
    .cw-header-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #42c441;
      margin-bottom: 8px;
    }
    .cw-header-title {
      font-family: 'Fraunces', Georgia, serif;
      font-weight: 600;
      font-size: 1.32rem;
      color: #fff;
      margin: 0;
      line-height: 1.2;
      position: relative;
    }
    .cw-close {
      position: absolute;
      top: 14px; right: 14px;
      width: 30px; height: 30px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.65);
      transition: background 140ms, color 140ms;
    }
    .cw-close:hover {
      background: rgba(255,255,255,0.2);
      color: #fff;
    }

    /* Form */
    .cw-form { padding: 20px 20px 22px; }
    .cw-field {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-bottom: 13px;
    }
    .cw-label {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.64rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #999;
    }
    .cw-label em {
      font-style: normal;
      color: #42c441;
      margin-left: 2px;
    }
    .cw-input, .cw-textarea {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.88rem;
      padding: 10px 12px;
      border: 1.5px solid #e4e4e0;
      border-radius: 9px;
      background: #fafafa;
      color: #111;
      outline: none;
      transition: border-color 140ms, background 140ms, box-shadow 140ms;
      width: 100%;
    }
    .cw-input:focus, .cw-textarea:focus {
      border-color: #42c441;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(66,196,65,0.1);
    }
    .cw-input.cw-error, .cw-textarea.cw-error {
      border-color: #e53e3e;
      box-shadow: 0 0 0 3px rgba(229,62,62,0.08);
    }
    .cw-textarea {
      resize: none;
      min-height: 78px;
      line-height: 1.5;
    }
    .cw-input::placeholder, .cw-textarea::placeholder {
      color: #bbb;
    }

    /* Submit */
    .cw-submit {
      width: 100%;
      background: #42c441;
      color: #fff;
      border: none;
      border-radius: 999px;
      padding: 13px 20px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      transition: background 140ms, transform 120ms, box-shadow 140ms;
      margin-top: 4px;
    }
    .cw-submit:hover {
      background: #00af11;
      box-shadow: 0 4px 16px rgba(66,196,65,0.35);
    }
    .cw-submit:active { transform: scale(0.98); }

    /* Success */
    .cw-success {
      padding: 36px 22px 32px;
      text-align: center;
      display: none;
    }
    .cw-success.cw-visible { display: block; }
    .cw-success-icon {
      width: 54px; height: 54px;
      border-radius: 50%;
      background: #e8f7e0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      animation: cw-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes cw-pop {
      from { transform: scale(0.5); opacity: 0; }
      to   { transform: scale(1);   opacity: 1; }
    }
    .cw-success-title {
      font-family: 'Fraunces', Georgia, serif;
      font-weight: 600;
      font-size: 1.22rem;
      color: #111;
      margin: 0 0 8px;
    }
    .cw-success-sub {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.84rem;
      color: #888;
      line-height: 1.55;
      margin: 0;
    }

    /* Note */
    .cw-note {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.66rem;
      color: #bbb;
      text-align: center;
      padding: 0 20px 16px;
      margin: -4px 0 0;
    }

    /* Mobile */
    @media (max-width: 480px) {
      .cw-trigger { padding: 13px 16px; bottom: 20px; right: 20px; }
      .cw-trigger-label { display: none; }
      .cw-panel { right: 12px; bottom: 76px; width: calc(100vw - 24px); max-width: 340px; }
    }
  `;

  /* ─────────────────────────────────────────
     HTML
  ───────────────────────────────────────── */
  const HTML = `
    <div class="cw-wrap">

      <button class="cw-trigger" id="cw-trigger" aria-expanded="false" aria-controls="cw-panel" aria-label="Otwórz formularz kontaktowy">
        <span class="cw-dot"></span>
        <span class="cw-trigger-label">Napisz do nas</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2"/>
          <path d="M3 7l9 6 9-6"/>
        </svg>
      </button>

      <div class="cw-panel" id="cw-panel" role="dialog" aria-modal="true" aria-label="Formularz kontaktowy" aria-hidden="true">

        <div class="cw-header">
          <p class="cw-header-tag">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="#42c441"><circle cx="4.5" cy="4.5" r="4.5"/></svg>
            4change
          </p>
          <h3 class="cw-header-title">Jak możemy<br/>Ci pomóc?</h3>
          <button class="cw-close" id="cw-close" aria-label="Zamknij">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M6 6l12 12M18 6L6 18"/>
            </svg>
          </button>
        </div>

        <form class="cw-form" id="cw-form" novalidate>
          <div class="cw-field">
            <label class="cw-label" for="cw-name">Imię i nazwisko</label>
            <input class="cw-input" type="text" id="cw-name" name="name"
              placeholder="Jan Kowalski" autocomplete="name" />
          </div>
          <div class="cw-field">
            <label class="cw-label" for="cw-email">E-mail<em>*</em></label>
            <input class="cw-input" type="email" id="cw-email" name="email"
              placeholder="jan@firma.pl" required autocomplete="email" />
          </div>
          <div class="cw-field">
            <label class="cw-label" for="cw-msg">Wiadomość<em>*</em></label>
            <textarea class="cw-textarea" id="cw-msg" name="message"
              placeholder="Opisz krótko, z czym możemy pomóc…" required></textarea>
          </div>
          <button class="cw-submit" type="submit">
            Wyślij wiadomość
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </button>
        </form>

        <p class="cw-note">Odpowiadamy w ciągu 24h w dni robocze.</p>

        <div class="cw-success" id="cw-success" role="status">
          <div class="cw-success-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#42c441" stroke-width="2.5">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <p class="cw-success-title">Wiadomość wysłana!</p>
          <p class="cw-success-sub">Dziękujemy — odezwiemy się<br/>w ciągu 24&nbsp;godzin roboczych.</p>
        </div>

      </div>
    </div>
  `;

  /* ─────────────────────────────────────────
     INIT
  ───────────────────────────────────────── */
  function init() {
    // Styles
    const styleEl = document.createElement('style');
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);

    // Markup
    const wrapper = document.createElement('div');
    wrapper.innerHTML = HTML.trim();
    document.body.appendChild(wrapper);

    const trigger = document.getElementById('cw-trigger');
    const panel   = document.getElementById('cw-panel');
    const closeBtn= document.getElementById('cw-close');
    const form    = document.getElementById('cw-form');
    const success = document.getElementById('cw-success');
    const emailEl = document.getElementById('cw-email');
    const msgEl   = document.getElementById('cw-msg');

    let interacted = false;

    function openPanel() {
      panel.classList.add('cw-is-open');
      panel.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      trigger.classList.add('cw-is-open');
      interacted = true;
      setTimeout(() => emailEl.focus(), 280);
    }

    function closePanel() {
      panel.classList.remove('cw-is-open');
      panel.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.classList.remove('cw-is-open');
    }

    trigger.addEventListener('click', () =>
      panel.classList.contains('cw-is-open') ? closePanel() : openPanel()
    );
    closeBtn.addEventListener('click', closePanel);

    // Click outside to close
    document.addEventListener('click', e => {
      if (panel.classList.contains('cw-is-open') &&
          !panel.contains(e.target) &&
          !trigger.contains(e.target)) {
        closePanel();
      }
    });

    // Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && panel.classList.contains('cw-is-open')) closePanel();
    });

    // Validation helpers
    function clearError(el) {
      el.classList.remove('cw-error');
      el.addEventListener('input', () => el.classList.remove('cw-error'), { once: true });
    }

    // Form submit
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      if (!emailEl.value.trim() || !/\S+@\S+\.\S+/.test(emailEl.value)) {
        emailEl.classList.add('cw-error'); clearError(emailEl); valid = false;
      }
      if (!msgEl.value.trim()) {
        msgEl.classList.add('cw-error'); clearError(msgEl); valid = false;
      }
      if (!valid) return;

      // Show success
      form.style.display = 'none';
      const noteEl = panel.querySelector('.cw-note');
      if (noteEl) noteEl.style.display = 'none';
      success.classList.add('cw-visible');

      // Reset after 4s
      setTimeout(() => {
        success.classList.remove('cw-visible');
        form.style.display = '';
        if (noteEl) noteEl.style.display = '';
        form.reset();
        closePanel();
      }, 4200);
    });

    // Attention bounce after 6s if not yet interacted
    setTimeout(() => {
      if (!interacted) {
        trigger.classList.add('cw-bounce');
        trigger.addEventListener('animationend', () => trigger.classList.remove('cw-bounce'), { once: true });
      }
    }, 6000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
