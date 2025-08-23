/**
 * Author: Shadow Themes
 * Author URL: https://shadow-themes.com
 * Modified for Frith Nightswan Enterprises: Form validation, Google Forms submission, and robust error handling
 */
"use strict";

// Ensure jQuery is available
if (typeof jQuery === 'undefined') {
  console.error('Bringer Error: jQuery is not loaded.');
} else {
  jQuery(document).ready(function($) {
    function Bringer_Contact_Form() {
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
          
          $form.on('submit', function(e) {
            e.preventDefault(); // Prevent page reload
            
            // Clear previous response
            $response.empty().removeClass('bringer-alert-success bringer-alert-danger').slideUp(200);
            
            // Get form input values
            const name = $form.find('#name').val().trim();
            const email = $form.find('#email').val().trim();
            const message = $form.find('#message').val().trim();
            
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
            
            // Display validation errors and stop submission if any
            if (nameError || emailError || messageError) {
              $response.addClass('bringer-alert-danger').slideDown(200);
              $response.html('<span>' + [nameError, emailError, messageError].filter(Boolean).join(' ') + '</span>');
              return; // Stop here; do not proceed to AJAX
            }
            
            // Show loading spinner
            $form.addClass('is-busy');
            $spinner.show();
            
            // Prepare form data
            const formData = $form.serialize();
            
            // Send AJAX request
            $.ajax({
                type: 'POST',
                url: $form.attr('action'),
                data: formData,
                dataType: 'text' // Google Forms returns text
              })
              .done(function(response, textStatus, jqXHR) {
                // Log full response
                console.log('Form submission response:', {
                  status: jqXHR.status,
                  statusText: jqXHR.statusText,
                  responseText: response || 'No response body (expected for Google Forms)',
                  headers: jqXHR.getAllResponseHeaders()
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
              .fail(function(jqXHR, textStatus, errorThrown) {
                // Log full error
                console.log('Form submission error:', {
                  status: jqXHR.status,
                  statusText: jqXHR.statusText,
                  responseText: jqXHR.responseText || 'No response body',
                  errorThrown: errorThrown,
                  headers: jqXHR.getAllResponseHeaders()
                });
                
                // Hide spinner
                $form.removeClass('is-busy');
                $spinner.hide();
                
                // Handle errors
                let errorMessage = 'An unexpected error occurred. Please try again later.';
                if (!navigator.onLine || errorThrown === 'Network Error') {
                  errorMessage = 'Network error: Unable to connect to the server. Please check your internet connection and try again.';
                } else if (jqXHR.status) {
                  errorMessage = `Submission failed: Server responded with status ${jqXHR.status}. Please try again later.`;
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