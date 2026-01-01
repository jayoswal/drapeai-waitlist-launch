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

// Validate email field - only allow valid email characters
const emailInput = document.getElementById('modalEmail');

if (emailInput) {
  // Allow only valid email characters on keypress
  emailInput.addEventListener('keypress', (e) => {
    const char = String.fromCharCode(e.which || e.keyCode);
    // Allow: letters, numbers, @, ., -, _, +
    const validEmailChars = /^[a-zA-Z0-9@.\-_+]$/;
    
    if (!validEmailChars.test(char)) {
      e.preventDefault();
      return false;
    }
  });

  // Sanitize input - remove invalid characters
  emailInput.addEventListener('input', (e) => {
    const value = e.target.value;
    // Remove any characters not valid in email addresses
    const sanitized = value.replace(/[^a-zA-Z0-9@.\-_+]/g, '');
    
    if (value !== sanitized) {
      e.target.value = sanitized;
    }
  });

  // Visual feedback for valid/invalid email
  emailInput.addEventListener('blur', (e) => {
    const value = e.target.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (value && !emailRegex.test(value)) {
      emailInput.style.borderColor = '#ff6b6b';
      emailInput.style.backgroundColor = '#fff5f5';
    } else {
      emailInput.style.borderColor = '';
      emailInput.style.backgroundColor = '';
    }
  });

  // Clear error styling on focus
  emailInput.addEventListener('focus', (e) => {
    emailInput.style.borderColor = '';
    emailInput.style.backgroundColor = '';
  });
}

// Validate mobile number field - only allow numeric input
const phoneInput = document.getElementById('modalPhone');

if (phoneInput) {
  // Prevent non-numeric characters on keypress
  phoneInput.addEventListener('keypress', (e) => {
    // Allow only numbers (0-9)
    const charCode = e.which || e.keyCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
      return false;
    }
  });

  // Remove non-numeric characters on paste or input
  phoneInput.addEventListener('input', (e) => {
    const value = e.target.value;
    // Remove all non-numeric characters
    const numericOnly = value.replace(/[^0-9]/g, '');
    
    // Update the input value if it was modified
    if (value !== numericOnly) {
      e.target.value = numericOnly;
    }
  });

  // Prevent paste of non-numeric content
  phoneInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    const numericOnly = pastedText.replace(/[^0-9]/g, '');
    
    // Insert only numeric characters
    const input = e.target;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const currentValue = input.value;
    
    input.value = currentValue.substring(0, start) + numericOnly + currentValue.substring(end);
    
    // Set cursor position after pasted content
    const newPosition = start + numericOnly.length;
    input.setSelectionRange(newPosition, newPosition);
  });
}

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
