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
  // within its name-group is checked.
  document.querySelectorAll('[data-reveal-trigger]').forEach(function (trigger) {
    var targetId = trigger.getAttribute('data-reveal-trigger');
    var target = document.getElementById(targetId);
    if (!target) return;
    var group = document.getElementsByName(trigger.name);
    function sync() {
      var show = Array.prototype.some.call(group, function (el) {
        return el.checked && el.dataset.revealTrigger !== undefined;
      });
      target.style.display = show ? 'block' : 'none';
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

  // Questionnaire: three "Confirm plan and submit" buttons at the bottom each
  // carry their own name/value (self-hosted / standard / pro). Before the form
  // submits to FormSubmit, we set the hidden _next field to the matching live
  // Stripe Payment Link, so FormSubmit emails the questionnaire answers to
  // robertcbowen@gmail.com and then sends the customer straight to checkout
  // for the plan they chose.
  var PAYMENT_LINKS = {
    "self-hosted": "https://buy.stripe.com/bJe6ozdtI1n5784g701Fe01",
    "standard": "https://buy.stripe.com/eVq14f9dsghZ4ZWdYS1Fe00",
    "pro": "https://buy.stripe.com/bJebITexM5Dl0JG4oi1Fe02"
  };

  var form = document.querySelector('form.questionnaire');
  if (form) {
    form.addEventListener('submit', function (e) {
      var chosenTier = e.submitter && e.submitter.value;
      var nextInput = document.getElementById('formsubmit-next');
      if (nextInput && chosenTier && PAYMENT_LINKS[chosenTier]) {
        nextInput.value = PAYMENT_LINKS[chosenTier];
      }
      // No preventDefault — the form submits normally to FormSubmit, which
      // emails the answers and then redirects the customer to the _next URL
      // (the Payment Link set above) automatically.
    });
  }
});
