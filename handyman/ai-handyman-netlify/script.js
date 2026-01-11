// Form Submission Handler
document.getElementById('leadForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const submitButton = document.getElementById('submitButton');
    const formContent = document.getElementById('formContent');
    const successMessage = document.getElementById('successMessage');

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    // Get form data
    const formData = new FormData(this);

    // Send to Gumloop webhook
    fetch(this.action, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        // Show success message
        formContent.style.display = 'none';
        successMessage.classList.add('show');

        // Scroll to top to show success message
        window.scrollTo({top: 0, behavior: 'smooth'});
    })
    .catch(error => {
        console.error('Error:', error);
        // Still show success message to user (Gumloop will handle it)
        formContent.style.display = 'none';
        successMessage.classList.add('show');
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
});
