document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Questionnaire: toggle the "other" text field when relevant radio/checkbox chosen
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
    group.forEach ? group.forEach(function (el) { el.addEventListener('change', sync); }) :
      Array.prototype.forEach.call(group, function (el) { el.addEventListener('change', sync); });
    sync();
  });

  // Basic client-side required-field check with friendlier message than default browser popup clutter
  var form = document.querySelector('form.questionnaire');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('form-status');
      if (status) {
        status.textContent = 'Thanks — that\u2019s a demo submit for now. Wire this form up to your backend or form-handling service (e.g. Formspree, Netlify Forms) to receive real submissions.';
        status.style.display = 'block';
        status.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
});
