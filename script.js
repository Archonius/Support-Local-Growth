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
  // a time via CSS). Each carries its own tier value. On click, we set the
  // hidden _next field to the matching live Stripe Payment Link before the
  // browser's native form submission fires, so FormSubmit emails the order
  // details and then sends the customer straight to checkout.
  var PAYMENT_LINKS = {
    "self-hosted": "https://buy.stripe.com/bJe6ozdtI1n5784g701Fe01",
    "standard": "https://buy.stripe.com/eVq14f9dsghZ4ZWdYS1Fe00",
    "pro": "https://buy.stripe.com/bJebITexM5Dl0JG4oi1Fe02"
  };

  var nextInput = document.getElementById('formsubmit-next');
  document.querySelectorAll('.tier-submit').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tier = btn.value;
      if (nextInput && tier && PAYMENT_LINKS[tier]) {
        nextInput.value = PAYMENT_LINKS[tier];
      }
      // No preventDefault — the click still submits the form normally to
      // FormSubmit, which emails the answers and then redirects to the
      // _next URL (the Payment Link just set above) automatically.
    });
  });
});
