/**
 * 4change — Pop-up "Widzę, że się zastanawiasz"
 * Pokazuje się po 60 s aktywnego przeglądania strony. Raz na 30 dni.
 * Dołącz <script src="diagnosis-popup.js"></script> przed </body>
 */
(function () {
  'use strict';
  if (window.location.pathname.includes('kontakt')) return;
  if (window.matchMedia && window.matchMedia('print').matches) return;

  var KEY = '4c_diag_popup';
  var DELAY = 60000;
  try {
    var seen = localStorage.getItem(KEY);
    if (seen && Date.now() - Number(seen) < 30 * 24 * 3600 * 1000) return;
  } catch (e) {}

  var CSS = ".dp-back{position:fixed;inset:0;z-index:10050;background:rgba(10,14,32,.62);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;transition:opacity .28s ease}.dp-back.dp-on{opacity:1}.dp-box{position:relative;width:100%;max-width:520px;background:#fff;border-radius:14px;padding:42px 40px 34px;font-family:'Inter',system-ui,sans-serif;color:#111;box-shadow:0 30px 80px rgba(0,0,0,.35);transform:translateY(18px) scale(.98);transition:transform .32s cubic-bezier(.2,.8,.3,1);max-height:90vh;overflow:auto}.dp-back.dp-on .dp-box{transform:none}.dp-box *{box-sizing:border-box}.dp-close{position:absolute;top:14px;right:14px;width:34px;height:34px;border:none;border-radius:50%;background:#f1f2f6;color:#555;font-size:18px;line-height:1;cursor:pointer;transition:background .18s ease}.dp-close:hover{background:#e4e6ee;color:#111}.dp-kicker{display:inline-flex;align-items:center;gap:8px;font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#3447d3;margin:0 0 14px}.dp-kicker i{width:7px;height:7px;border-radius:50%;background:#3447d3;display:block}.dp-title{font-size:1.6rem;line-height:1.2;font-weight:700;margin:0 0 16px;letter-spacing:-.02em}.dp-box p{font-size:.95rem;line-height:1.62;color:#4a4f60;margin:0 0 14px}.dp-label{display:block;font-size:.8rem;font-weight:600;color:#111;margin:22px 0 8px}.dp-row{display:flex;gap:10px;flex-wrap:wrap}.dp-row input{flex:1 1 220px;min-width:0;padding:13px 15px;border:1.5px solid #dcdfe8;border-radius:8px;font-family:inherit;font-size:.92rem;color:#111;background:#fff;transition:border-color .18s ease}.dp-row input:focus{outline:none;border-color:#3447d3}.dp-row button{flex:0 0 auto;padding:13px 24px;border:none;border-radius:8px;background:#111;color:#fff;font-family:inherit;font-size:.82rem;font-weight:700;letter-spacing:.04em;cursor:pointer;transition:background .18s ease}.dp-row button:hover{background:#3447d3}.dp-note{font-size:.8rem;line-height:1.55;color:#7a8095;margin:18px 0 0}.dp-ok{font-size:.95rem;line-height:1.6;color:#111;margin:18px 0 0;font-weight:600}@media(max-width:560px){.dp-box{padding:34px 24px 26px}.dp-title{font-size:1.32rem}}";

  var HTML = '<div class="dp-box" role="dialog" aria-modal="true" aria-labelledby="dp-title">' +
    '<button class="dp-close" type="button" aria-label="Zamknij">&times;</button>' +
    '<p class="dp-kicker"><i></i>Diagnoza</p>' +
    '<h2 class="dp-title" id="dp-title">Widzę, że się zastanawiasz.</h2>' +
    '<p>Być może wiesz, że coś w firmie wymaga zmiany, ale jeszcze nie masz pewności, od czego zacząć.</p>' +
    '<p>Zostaw nam swój e-mail. Wyślemy Ci 10 prostych pytań, które pomogą Ci uporządkować sytuację, nazwać najważniejsze wyzwanie i określić, o czym warto z nami porozmawiać.</p>' +
    '<form class="dp-form"><label class="dp-label" for="dp-email">zostaw swój email:</label>' +
    '<div class="dp-row"><input id="dp-email" type="email" required placeholder="twoj@email.pl" autocomplete="email"/>' +
    '<button type="submit">Wyślij pytania</button></div></form>' +
    '<p class="dp-note">Bez zobowiązań. Najpierw diagnoza, potem decyzja, czy potrzebujesz naszego wsparcia.</p>' +
    '</div>';

  function build() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var back = document.createElement('div');
    back.className = 'dp-back'; back.innerHTML = HTML;
    document.body.appendChild(back);
    requestAnimationFrame(function () { back.classList.add('dp-on'); });
    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function close() {
      back.classList.remove('dp-on');
      document.body.style.overflow = prevOverflow;
      setTimeout(function () { back.remove(); }, 300);
      document.removeEventListener('keydown', onKey);
      try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    back.querySelector('.dp-close').addEventListener('click', close);
    back.addEventListener('click', function (e) { if (e.target === back) close(); });
    back.querySelector('.dp-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var box = back.querySelector('.dp-box');
      box.querySelector('.dp-form').remove();
      box.querySelector('.dp-note').insertAdjacentHTML('beforebegin', '<p class="dp-ok">Dziękujemy. Pytania wyślemy na podany adres w ciągu kilku minut.</p>');
      try { localStorage.setItem(KEY, String(Date.now())); } catch (e2) {}
      setTimeout(close, 3500);
    });
    setTimeout(function () { var i = back.querySelector('#dp-email'); if (i) i.focus(); }, 340);
  }

  // Licz tylko czas, gdy karta jest widoczna
  var elapsed = 0, last = Date.now();
  var tick = setInterval(function () {
    var now = Date.now();
    if (document.visibilityState === 'visible') elapsed += now - last;
    last = now;
    if (elapsed >= DELAY) { clearInterval(tick); build(); }
  }, 1000);
})();
