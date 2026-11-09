// Casual preview gate: the password is visible in source and is not authentication.
const previewPassword = 'maps-preview-2026';
const gateForm = document.getElementById('site-gate-form');
if (gateForm) {
  gateForm.addEventListener('submit', event => {
    event.preventDefault();
    const input = document.getElementById('site-gate-password');
    const error = document.getElementById('site-gate-error');
    if (input.value === previewPassword) {
      try { sessionStorage.setItem('maps-preview-unlocked', 'yes'); } catch (e) {}
      document.documentElement.classList.add('site-unlocked');
      input.value = '';
    } else {
      error.hidden = false;
      input.value = '';
      input.focus();
    }
  });
}
