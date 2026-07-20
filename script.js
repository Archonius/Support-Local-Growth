document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Reveal a target field when a specific radio/checkbox (carrying data-reveal-trigger)
  // is itself checked. Each trigger only controls its own target, even when
  // other options in the same name-group also carry a reveal-trigger.
  document.querySelectorAll('[data-reveal-trigger]').forEach(function (trigger) {
    var targetId = trigger.getAttribute('data-reveal-trigger');
    var target = document.getElementById(targetId);
    if (!target) return;
    var group = document.getElementsByName(trigger.name);
    function sync() {
      target.style.display = trigger.checked ? 'block' : 'none';
    }
    Array.prototype.forEach.call(group, function (el) { el.addEventListener('change', sync); });
    sync();
  });

  // Reveal a target field when a <select> carrying data-reveal-select equals a
  // specific value (data-reveal-value on the select itself).
  document.querySelectorAll('select[data-reveal-select]').forEach(function (select) {
    var targetId = select.getAttribute('data-reveal-select');
    var revealValue = select.getAttribute('data-reveal-value');
    var target = document.getElementById(targetId);
    if (!target) return;
    function sync() {
      target.style.display = (select.value === revealValue) ? 'block' : 'none';
    }
    select.addEventListener('change', sync);
    sync();
  });

  // Get-started page: six "Confirm & pay" buttons exist (three in the desktop
  // table, three duplicated in the mobile cards — only one set is visible at
  // a time via CSS). Each carries its own tier value.
  //
  // We no longer rely on FormSubmit's "_next" redirect feature — it doesn't
  // reliably redirect to a different domain (Stripe), and instead shows
  // FormSubmit's own generic "Thanks!" page. Instead, we submit the order in
  // the background via FormSubmit's AJAX endpoint, then drive the redirect
  // to Stripe ourselves with plain JavaScript. This way the payment redirect
  // no longer depends on FormSubmit cooperating at all — we control it directly.
  var PAYMENT_LINKS = {
    "self-hosted": "https://buy.stripe.com/bJe6ozdtI1n5784g701Fe01",
    "standard": "https://buy.stripe.com/eVq14f9dsghZ4ZWdYS1Fe00",
    // *** ACTION NEEDED ***: this Pro link still charges the old £250 build
    // fee + £30/mo. Pro's build fee is now FREE under the subsidised scheme
    // — this URL must be replaced with a new Stripe Payment Link containing
    // ONLY the £30/mo recurring price (no one-time £250 line item) before
    // this goes live, or customers will be wrongly charged £250 despite the
    // "free website" marketing. Not changed here since a new Payment Link
    // must be created in the Stripe Dashboard first — see chat for details.
    "pro": "https://buy.stripe.com/bJebITexM5Dl0JG4oi1Fe02"
  };
  var FORMSUBMIT_EMAIL = "robertcbowen@gmail.com";

  var tierButtons = document.querySelectorAll('.tier-submit');
  if (tierButtons.length) {
    tierButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var tier = btn.value;

        // Pro carries a 12-month minimum term in exchange for a waived build
        // fee, so we require explicit consent before proceeding — this check
        // only applies to Pro; Self-Hosted and Standard are unaffected.
        if (tier === 'pro') {
          var consent = document.getElementById('pro-consent');
          if (consent && !consent.checked) {
            consent.scrollIntoView({ behavior: 'smooth', block: 'center' });
            consent.focus();
            alert('Please tick the box confirming you understand the Pro 12-month minimum term before continuing.');
            return;
          }
        }

        var paymentUrl = PAYMENT_LINKS[tier];
        var orderForm = btn.closest('form');

        function goToPayment() {
          if (paymentUrl) {
            window.location.href = paymentUrl;
          }
        }

        if (orderForm) {
          var formData = new FormData(orderForm);
          formData.set('tier', tier);
          fetch('https://formsubmit.co/ajax/' + FORMSUBMIT_EMAIL, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          }).then(goToPayment).catch(goToPayment);
          // We still redirect even if the background email fails — losing a
          // copy of the order details is far better than stranding a
          // paying customer on a broken page.
        } else {
          goToPayment();
        }
      });
    });
  }
});
