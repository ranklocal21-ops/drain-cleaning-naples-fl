/**
 * Drain Cleaning Advisor - Interactive Frontend Logic
 * Naples, FL | +1 (239) 688-0557
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // 1. Sticky Header Elevation
  var header = document.querySelector('.site-header');
  if (header) {
    var checkScroll = function () {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  // 2. Mobile Navigation Menu Toggle
  var mobileToggle = document.querySelector('.mobile-nav-toggle');
  var navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function () {
      var isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-active');
      document.body.classList.toggle('nav-open');
    });

    // Close when clicking nav links on mobile
    var navLinks = navMenu.querySelectorAll('a:not(.dropdown-trigger)');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      });
    });
  }

  // 3. Estimate & Contact Forms Handling
  var forms = document.querySelectorAll('form[data-lead-form]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
      var notificationBox = form.querySelector('.form-notification');

      // Basic field checks
      var phoneInput = form.querySelector('input[type="tel"]');
      var nameInput = form.querySelector('input[name="name"]');

      if (phoneInput && phoneInput.value.trim().length < 7) {
        if (notificationBox) {
          notificationBox.className = 'form-notification error';
          notificationBox.textContent = 'Please enter a valid phone number so our Naples dispatch team can reach you.';
          notificationBox.style.display = 'block';
        } else {
          alert('Please enter a valid phone number.');
        }
        phoneInput.focus();
        return;
      }

      // Show processing state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Sending Dispatch Request...';
      }

      // Analytics event if gtag available
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'lead_form_submitted', {
          'event_category': 'Engagement',
          'event_label': form.getAttribute('id') || 'estimate_form'
        });
      }

      // Simulate network dispatch call & redirect to thank you page
      setTimeout(function () {
        // Store name if present in sessionStorage for thank you page
        if (nameInput && nameInput.value) {
          try {
            sessionStorage.setItem('naples_lead_name', nameInput.value.trim());
          } catch (err) {}
        }

        // Determine correct path to thank you page based on directory depth
        var currentPath = window.location.pathname;
        var thankYouUrl = '/thank-you/';
        if (window.location.protocol === 'file:') {
          // If viewing locally via file://, navigate relatively
          var depth = (currentPath.match(/\//g) || []).length;
          thankYouUrl = currentPath.includes('/services/') || currentPath.includes('/service-areas/') ? '../../thank-you/index.html' : 'thank-you/index.html';
        }
        
        window.location.href = thankYouUrl;
      }, 700);
    });
  });

  // 4. Track Click-to-Call Conversions
  var phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'click_to_call', {
          'event_category': 'Conversion',
          'event_label': link.getAttribute('href')
        });
      }
    });
  });

  // 5. Enhance Accordions for Smooth Keyboard Navigation
  var faqs = document.querySelectorAll('.faq-item summary');
  faqs.forEach(function (summary) {
    summary.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        // standard summary behavior works, but smooth visual feedback can be added here
      }
    });
  });
});
