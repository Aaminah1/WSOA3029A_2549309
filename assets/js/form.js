document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("formModal");
    const openFormBtn = document.getElementById("openFormBtn");
    const closeBtn = document.getElementsByClassName("closeBtn")[0];
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const passwordStrength = document.getElementById('passwordStrength');
    const successMessage = document.getElementById('successMessage');

    // Initialize intl-tel-input on phone input
    const phoneInputField = document.querySelector("#phone");
    const phoneInput = window.intlTelInput(phoneInputField, {
        initialCountry: "us", // Default country code
        preferredCountries: ["us", "gb", "za", "in"], // Preferred country codes
        separateDialCode: true, // Show country code separately
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js", // Utility script for validation
    });

    // Open Modal
    openFormBtn.onclick = function () {
        modal.style.display = "block";
    }

    // Close Modal and reset the form
    closeBtn.onclick = function () {
        modal.style.display = "none";
        resetForm(); // Reset form when modal is closed
    }

    // Close Modal on outside click and reset the form
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            resetForm(); // Reset form when clicking outside modal
        }
    }

    // Reset form fields and success message
    function resetForm() {
        form.reset(); // Reset the form fields
        successMessage.style.display = 'none'; // Hide success message
        submitBtn.disabled = true; // Disable submit button again
        // Hide all error messages
        hideError('nameError');
        hideError('emailError');
        hideError('passwordError');
        hideError('phoneError');
        hideError('messageError');

        // Reset the password strength meter
        if (passwordStrength) {
            passwordStrength.firstElementChild.style.width = '0%'; // Reset password strength bar
        }
    }

    // Form input event to enable or disable the submit button based on validation
    form.addEventListener('input', function () {
        let valid = validateForm();
        submitBtn.disabled = !valid; // Enable submit button only when the form is valid
    });

    // Form validation logic
    function validateForm() {
        let valid = true;

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const message = document.getElementById('message').value;

        // Extract the local part of the phone number (excluding country code)
        const phoneNumber = phoneInput.getNumber(intlTelInputUtils.numberFormat.E164);
        const localNumber = phoneInputField.value.replace(/\D/g, ''); // Remove any non-digit characters

        // Validate Name
        if (!/^[a-zA-Z\s]+$/.test(name) || name.trim() === '') {
            showError('nameError', 'Name must contain only letters and spaces.');
            valid = false;
        } else {
            hideError('nameError');
        }

        // Validate Email
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            showError('emailError', 'Please enter a valid email address.');
            valid = false;
        } else {
            hideError('emailError');
        }

        // Validate Password (real-time strength check)
        const strength = checkPasswordStrength(password);
        if (passwordStrength) {
            passwordStrength.firstElementChild.style.width = strength.percent + '%';
            passwordStrength.firstElementChild.style.backgroundColor = strength.color;
        }

        if (strength.percent < 50) {
            showError('passwordError', 'Password is too weak.');
            valid = false;
        } else {
            hideError('passwordError');
        }

        // Validate Phone Number (local part must be between 8 and 12 digits)
        if (phoneInput.isValidNumber() && localNumber.length >= 8 && localNumber.length <= 12) {
            hideError('phoneError');
        } else {
            showError('phoneError', 'Please enter a valid phone number.');
            valid = false;
        }

        // Validate Message (Check for empty and length)
        if (message.trim() === '') {
            showError('messageError', 'Message cannot be empty.');
            valid = false;
        } else if (message.length > 200) {
            showError('messageError', 'Message cannot exceed 200 characters.');
            valid = false;
        } else {
            hideError('messageError');
        }

        return valid;
    }

    // Password strength checker
    function checkPasswordStrength(password) {
        let strength = { percent: 0, color: 'red' };

        if (password.length >= 8) strength.percent += 30;
        if (/\d/.test(password)) strength.percent += 30;
        if (/[!@#$%^&*]/.test(password)) strength.percent += 40;

        if (strength.percent >= 80) {
            strength.color = 'green';
        } else if (strength.percent >= 50) {
            strength.color = 'orange';
        }

        return strength;
    }

    // Show and hide error functions
    function showError(id, message) {
        const errorElement = document.getElementById(id);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function hideError(id) {
        const errorElement = document.getElementById(id);
        errorElement.style.display = 'none';
    }

    // On form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (validateForm()) {
            const fullPhoneNumber = phoneInput.getNumber(); // Get the full phone number with country code
            successMessage.style.display = 'block'; // Show success message
            console.log("Submitted phone number:", fullPhoneNumber); // Log the full phone number to the console
            form.reset(); // Reset the form fields after submission
            submitBtn.disabled = true; // Disable the submit button again
        }
    });
});
