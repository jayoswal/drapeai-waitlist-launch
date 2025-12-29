// Contact Us Modal Logic
const contactUsLink = document.getElementById('contactUsLink');
const contactModal = document.getElementById('contactModal');
const contactModalCloseBtn = document.getElementById('contactModalCloseBtn');

if (contactUsLink && contactModal && contactModalCloseBtn) {
  contactUsLink.addEventListener('click', function(e) {
    e.preventDefault();
    contactModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });
  contactModalCloseBtn.addEventListener('click', function() {
    contactModal.style.display = 'none';
    document.body.style.overflow = '';
  });
  contactModal.addEventListener('click', function(e) {
    if (e.target === contactModal) {
      contactModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
}
