// Modal logic for waitlist
const modal = document.getElementById('waitlistModal');
const openBtn = document.getElementById('joinWaitlistBtn');
const form = document.getElementById('waitlistForm');
const successMsg = document.getElementById('modalSuccess');
const closeBtn = document.getElementById('modalCloseBtn');
const formSection = document.getElementById('modalFormSection');

function openModal() {
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  formSection.style.display = '';
  successMsg.style.display = 'none';
  closeBtn.style.display = 'none';
}
function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = '';
  form.reset();
  successMsg.style.display = 'none';
  closeBtn.style.display = 'none';
  formSection.style.display = '';
}

openBtn.addEventListener('click', openModal);

// Close modal on overlay click (not content)
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Simple email and phone validation
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('modalEmail').value.trim();
  const phone = document.getElementById('modalPhone').value.trim();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = /^\d{10,15}$/.test(phone);
  if (!emailValid) {
    alert('Please enter a valid email address.');
    return;
  }
  if (!phoneValid) {
    alert('Please enter a valid mobile number.');
    return;
  }
  // Mimic success
  formSection.style.display = 'none';
  successMsg.style.display = 'block';
  closeBtn.style.display = 'block';
  let timer = setTimeout(() => {
    closeModal();
    formSection.style.display = '';
    closeBtn.style.display = 'none';
  }, 10000);
  closeBtn.onclick = () => {
    clearTimeout(timer);
    closeModal();
    formSection.style.display = '';
    closeBtn.style.display = 'none';
  };
});

// Optional: ESC key closes modal
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
});
