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
  // carry their own name/value so we know which tier was chosen on submit.
  var form = document.querySelector('form.questionnaire');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('form-status');
      var chosenTier = e.submitter && e.submitter.value ? e.submitter.value : null;
      if (status) {
        var tierLabel = {
          'self-hosted': 'Self-Hosted',
          'standard': 'Standard',
          'pro': 'Pro'
        }[chosenTier] || null;
        status.textContent = (tierLabel ? 'Plan selected: ' + tierLabel + '. ' : '') +
          'This is a demo submit for now. Wire this form up to your backend or a form-handling service (e.g. Formspree, Netlify Forms) to receive real submissions and trigger payment.';
        status.style.display = 'block';
        status.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
});
