/**
 * Author: Shadow Themes
 * Author URL: https://shadow-themes.com
 * Modified for Frith Nightswan Enterprises: Form validation, Google Forms submission with fetch, and robust error handling
 */
"use strict";

// Ensure jQuery is available
if (typeof jQuery === 'undefined') {
  console.error('Bringer Error: jQuery is not loaded.');
} else {
  jQuery(document).ready(function($) {
    function Bringer_Contact_Form() {
      console.log('Bringer_Contact_Form initialized'); // Debug: Confirm initialization
      
      // Form Fields: Focus/Blur Effects
      if ($('input[name]:not(.is-init), textarea[name]:not(.is-init)').length) {
        $('input[name]:not(.is-init), textarea[name]:not(.is-init)').each(function() {
          let $this = $(this);
          $this.addClass('is-init');
          $this.on('focus', function() {
            $('label[for="' + $this.attr('name') + '"]').addClass('in-focus');
          }).on('blur', function() {
            $('label[for="' + $this.attr('name') + '"]').removeClass('in-focus');
          });
        });
      }
      
      // Contact Form
      if ($('.bringer-contact-form:not(.is-init)').length) {
        $('.bringer-contact-form:not(.is-init)').each(function() {
          let $form = $(this),
            $response = $form.find('.bringer-contact-form__response'),
            $spinner = $form.find('.bringer-form-spinner');
          
          $response.slideUp(1);
          $form.addClass('is-init');
          console.log('Form initialized:', $form.attr('id')); // Debug: Confirm form setup
          
          $form.off('submit').on('submit', function(e) {
            e.preventDefault(); // Prevent page reload
            console.log('Form submit event triggered'); // Debug: Confirm event
            
            // Clear previous response
            $response.empty().removeClass('bringer-alert-success bringer-alert-danger').slideUp(200);
            
            // Get form input values
            const name = $form.find('#name').val().trim();
            const email = $form.find('#email').val().trim();
            const message = $form.find('#message').val().trim();
            console.log('Input values:', { name, email, message }); // Debug: Log inputs
            
            // Validation functions
            const validateName = (name) => {
              if (name.length < 3) {
                return 'Name must be at least 3 characters long.';
              }
              if (!/^[a-zA-Z\s]+$/.test(name)) {
                return 'Name can only contain letters and spaces.';
              }
              return '';
            };
            
            const validateEmail = (email) => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(email)) {
                return 'Please enter a valid email address.';
              }
              return '';
            };
            
            const validateMessage = (message) => {
              if (message.length < 30) {
                return 'Message must be at least 30 characters long.';
              }
              return '';
            };
            
            // Perform validations
            const nameError = validateName(name);
            const emailError = validateEmail(email);
            const messageError = validateMessage(message);
            console.log('Validation results:', { nameError, emailError, messageError }); // Debug: Log validation
            
            // Display validation errors and stop submission
            if (nameError || emailError || messageError) {
              $response.addClass('bringer-alert-danger').slideDown(200);
              $response.html('<span>' + [nameError, emailError, messageError].filter(Boolean).join(' ') + '</span>');
              console.log('Validation failed, submission aborted'); // Debug: Confirm no submission
              return; // Stop here; do not proceed to fetch
            }
            
            // Show loading spinner
            $form.addClass('is-busy');
            $spinner.show();
            console.log('Validation passed, proceeding to submission'); // Debug: Confirm submission start
            
            // Prepare form data
            const formData = new FormData($form[0]);
            const urlEncodedData = new URLSearchParams(formData).toString();
            
            // Send fetch request with no-cors
            fetch($form.attr('action'), {
                method: 'POST',
                mode: 'no-cors', // Bypass CORS restrictions
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: urlEncodedData
              })
              .then(response => {
                // Log request details (no-cors limits response data)
                console.log('Form submission sent:', {
                  url: $form.attr('action'),
                  data: urlEncodedData,
                  response: 'No response body due to no-cors mode'
                });
                
                // Hide spinner
                $form.removeClass('is-busy');
                $spinner.hide();
                
                // Show success message
                $response.empty().removeClass('bringer-alert-danger').addClass('bringer-alert-success').slideDown(200);
                $response.html('<span>Thank you! Your message has been sent successfully.</span>');
                $form.find('input:not([type="submit"]), textarea').val(''); // Clear form
                
                // Hide success message after 5 seconds
                setTimeout(function() {
                  $response.slideUp(200, function() {
                    $(this).empty();
                  });
                }, 5000);
              })
              .catch(error => {
                // Log error
                console.log('Form submission error:', {
                  error: error.message,
                  url: $form.attr('action'),
                  data: urlEncodedData
                });
                
                // Hide spinner
                $form.removeClass('is-busy');
                $spinner.hide();
                
                // Handle network errors
                let errorMessage = 'An unexpected error occurred. Please try again later.';
                if (!navigator.onLine || error.message.includes('network')) {
                  errorMessage = 'Network error: Unable to connect to the server. Please check your internet connection and try again.';
                }
                
                // Show error message
                $response.empty().removeClass('bringer-alert-success').addClass('bringer-alert-danger').slideDown(200);
                $response.html('<span>' + errorMessage + '</span>');
                $form.addClass('is-error');
                setTimeout(function() {
                  $form.removeClass('is-error');
                }, 5000);
              });
          });
        });
      }
    }
    
    // Initialize contact form
    try {
      Bringer_Contact_Form();
    } catch (e) {
      console.error('Bringer Error: Failed to initialize contact form:', e);
    }
  });
}