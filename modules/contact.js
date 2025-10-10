const $ = (selector, node = document) => node.querySelector(selector);
const $$ = (selector, node = document) => node.querySelectorAll(selector);

export const init = () => initContactForm();

/*************************************
  Form validation
 *************************************/

function initContactForm() {
  // Initialize EmailJS
  emailjs.init({ publicKey: "jjgCuUf-CTyPT9cHj" });

  const form = $('#contact-form');
  const required = $$('input[required], select[required], textarea[required]', form);

  // Submit request
  form.addEventListener('submit', e => onSubmit(e));
  const onSubmit = e => {
    e.preventDefault();

    if (validateForm()) {
      const submit = $('button[type="submit"]', form);
      const origText = submit.textContent;

      submit.textContent = 'Sending...';
      submit.disabled = true;

      // Prepare email data
      const fields = new FormData(form);
      const values = {
        'name': fields.get('full-name'),
        'email': fields.get('email'),
        'phone': fields.get('phone'),
        'service': fields.get('service-type') || 'Not specified',
        'property': fields.get('property-size') || 'Not specified',
        'message': fields.get('message') || 'No message provided'
      };

      const succeed = (response) => {
        console.log('Email sent successfully:', response);
        submit.textContent = 'Message Sent!';
        submit.classList.add('bg-green-600');
        submit.classList.remove('bg-green-700', 'hover:bg-green-800');

        setTimeout(
          () => {
            submit.textContent = origText;
            submit.disabled = false;
            submit.classList.remove('bg-green-600');
            submit.classList.add('bg-green-700', 'hover:bg-green-800');
            form.reset();
            clearFormErrors();
          }, 2000
        );
      }

      const failed = (error) => {
        console.error('Email sending failed:', error);
        submit.textContent = 'Send Failed - Try Again';
        submit.classList.add('bg-red-600');
        submit.classList.remove('bg-green-700', 'hover:bg-green-800');
        submit.disabled = false;

        setTimeout(
          () => {
            submit.textContent = origText;
            submit.classList.remove('bg-red-600');
            submit.classList.add('bg-green-700', 'hover:bg-green-800');
          }, 3000
        );
      }

      // Send email
      emailjs.send(
        'swarmag_website', 
        'swarmag_website_contact', 
        values
      ).then(succeed).catch(failed);
    }
  }

  // Add asterisks to required field labels
  required.forEach(field => {
    const label = $(`label[for="${field.id}"]`, form);
    if (label && !label.textContent.includes('*')) {
      label.innerHTML += ' <span class="text-red-500">*</span>';
    }
  });

  // Real-time validation - attach to all form fields
  const inputs = $$('input, select, textarea', form);
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('border-red-500')) {
        validateField(input);
      }
    });
  });

  function validateForm() {
    for (let i = 0; i < required.length; i++) {
      if (!validateField(required[i])) return false;
    }
    return true;
  }

  function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let errorElement = document.getElementById(`${field.id}-error`);

    // Create error element dynamically if it doesn't exist
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = `${field.id}-error`;
      errorElement.className = 'text-red-500 text-sm mt-1 hidden';
      errorElement.setAttribute('role', 'alert');
      field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    // Clear previous error
    errorElement.textContent = '';
    errorElement.classList.add('hidden');
    field.classList.remove('border-red-500');
    field.classList.add('border-gray-300');

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      showError(field, errorElement, `${fieldName} is required`);
      return false;
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showError(field, errorElement, 'Please enter a valid email address');
        return false;
      }
    }

    // Minimum length validation
    if (field.hasAttribute('minlength') && value.length < field.getAttribute('minlength')) {
      showError(field, errorElement, `${fieldName} must be at least ${field.getAttribute('minlength')} characters`);
      return false;
    }

    return true;
  }

  function showError(field, element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
    field.classList.remove('border-gray-300');
    field.classList.add('border-red-500');
  }

  function clearFormErrors() {
    const errors = $$('[id$="-error"]', form);
    errors.forEach(e => {
      e.textContent = '';
      e.classList.add('hidden');
    });

    const inputs = $$('input, select, textarea', form);
    inputs.forEach(i => {
      i.classList.remove('border-red-500');
      i.classList.add('border-gray-300');
    });
  }
}
