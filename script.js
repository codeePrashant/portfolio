/* ==============================================
   PRASHANT KUSHWAHA — PORTFOLIO JAVASCRIPT
   script.js

   What this file does:
   1.  Navbar: adds a background when you scroll
   2.  Mobile menu: opens/closes the hamburger menu
   3.  Typewriter: types different role text in the hero
   4.  Scroll animations: fades elements in as you scroll
   5.  Skill bars: animates progress bars when visible
   6.  Active nav link: highlights the current section
   7.  Back-to-top button: shows/hides and scrolls up
   8.  Contact form: validates and gives feedback
   9.  Footer year: automatically shows the current year
============================================== */


/* =============================================
   WAIT FOR THE PAGE TO FULLY LOAD
   
   'DOMContentLoaded' fires when all HTML is parsed.
   We put everything inside here so our JavaScript
   can safely find HTML elements.
============================================= */
document.addEventListener('DOMContentLoaded', function () {


  /* =============================================
     1. NAVBAR — Add background when scrolled
     
     When the user scrolls more than 50px,
     we add the class 'scrolled' to the navbar.
     CSS then gives it a dark blurred background.
  ============================================= */

  // Get the navbar element from the HTML
  var navbar = document.getElementById('navbar');

  // This function runs every time the user scrolls
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      // User has scrolled more than 50px — add background
      navbar.classList.add('scrolled');
    } else {
      // User is near the top — remove background
      navbar.classList.remove('scrolled');
    }
  }

  // Listen for scroll events on the window
  window.addEventListener('scroll', handleNavbarScroll);

  // Run once immediately so navbar is correct on page load
  handleNavbarScroll();


  /* =============================================
     2. MOBILE MENU — Hamburger open/close
     
     When the hamburger button is clicked,
     toggle the 'open' class on both the button
     and the nav links list.
  ============================================= */

  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('nav-links');

  // Click the hamburger → open or close the menu
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');  // animate the X
    navLinks.classList.toggle('open');   // slide menu in/out
  });

  // Click any nav link → close the menu
  // (So menu closes after user taps a link on mobile)
  var allNavLinks = document.querySelectorAll('.nav-link');

  allNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });


  /* =============================================
     3. TYPEWRITER EFFECT
     
     This makes different text appear to be
     "typed" in the hero section, one character
     at a time.
     
     How it works:
     - We have an array of role strings
     - We type each character with a delay
     - When done, we pause, then delete each character
     - Then move to the next role string
  ============================================= */

  // The element where text will appear
  var typedRole = document.getElementById('typed-role');

  // List of roles to cycle through
  var roles = [
    'Frontend Developer',
    'HTML & CSS Enthusiast',
    'JavaScript Learner',
    'Responsive Design Lover',
    'Open Source Contributor'
  ];

  var roleIndex    = 0;   // Which role we are currently on
  var charIndex    = 0;   // Which character of the role we are on
  var isDeleting   = false; // Are we currently deleting text?
  var typingSpeed  = 100;   // Milliseconds between each character

  function typeEffect() {
    // Get the current role string
    var currentRole = roles[roleIndex];

    if (!isDeleting) {
      // --- TYPING: add one character ---
      typedRole.textContent = currentRole.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        // We've typed the full word — pause before deleting
        isDeleting = true;
        setTimeout(typeEffect, 1500); // Wait 1.5 seconds
        return;
      }
    } else {
      // --- DELETING: remove one character ---
      typedRole.textContent = currentRole.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // All deleted — move to next role
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length; // Loop back to 0 at the end
      }
    }

    // Schedule the next character
    setTimeout(typeEffect, isDeleting ? 50 : typingSpeed);
  }

  // Start the typewriter
  typeEffect();


  /* =============================================
     4. SCROLL ANIMATIONS (Intersection Observer)
     
     Intersection Observer watches elements and
     calls a function when they enter the viewport.
     
     This is more efficient than listening to the
     scroll event, because it only fires when
     elements actually become visible.
  ============================================= */

  // Select all elements that should animate in
  var fadeTargets = document.querySelectorAll('.fade-target');

  // Options for the observer:
  var observerOptions = {
    threshold: 0.12,  // Trigger when 12% of the element is visible
    rootMargin: '0px 0px -40px 0px'  // Trigger slightly before the element reaches the bottom of the viewport
  };

  // Create the observer
  var observer = new IntersectionObserver(function (entries) {

    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Element is now visible — add animation class
        entry.target.classList.add('animate-in');
        // Stop observing this element (no need to animate twice)
        observer.unobserve(entry.target);
      }
    });

  }, observerOptions);

  // Tell the observer to watch each fade target
  fadeTargets.forEach(function (target) {
    observer.observe(target);
  });


  /* =============================================
     5. SKILL BARS — Animate width on scroll
     
     Each skill bar fill element has a
     data-width attribute (e.g. data-width="80").
     
     When the bar becomes visible, we set its
     CSS width to that value, triggering the
     CSS transition animation.
  ============================================= */

  // Get all the bar fill elements
  var skillBars = document.querySelectorAll('.skill-bar-fill');

  // Create a separate observer for skill bars
  var skillObserver = new IntersectionObserver(function (entries) {

    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var bar = entry.target;
        // Read the target width from the HTML attribute
        var targetWidth = bar.getAttribute('data-width');
        // Animate to that width (CSS transition handles the smoothness)
        bar.style.width = targetWidth + '%';
        // Stop watching once animated
        skillObserver.unobserve(bar);
      }
    });

  }, { threshold: 0.3 });

  // Watch each skill bar
  skillBars.forEach(function (bar) {
    skillObserver.observe(bar);
  });


  /* =============================================
     6. ACTIVE NAV LINK
     
     As the user scrolls, highlight the nav link
     that matches the section currently on screen.
     
     How it works:
     - We get all sections with an id
     - On scroll, we find which section's top is
       closest to the top of the viewport
     - We add the 'active' class to the matching link
  ============================================= */

  var sections = document.querySelectorAll('section[id]');
  var navLinksList = document.querySelectorAll('.nav-link');

  function highlightActiveLink() {
    var scrollPosition = window.scrollY + 120; // 120px offset for navbar height

    sections.forEach(function (section) {
      var sectionTop    = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      var sectionId     = section.getAttribute('id');

      // Check if our scroll position is inside this section
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove 'active' from all links first
        navLinksList.forEach(function (link) {
          link.classList.remove('active');
        });
        // Add 'active' to the link that points to this section
        var activeLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', highlightActiveLink);
  highlightActiveLink(); // Run once on page load


  /* =============================================
     7. BACK-TO-TOP BUTTON
     
     Show the button when user has scrolled down.
     Hide it when near the top.
     Clicking it smoothly scrolls back to the top.
  ============================================= */

  var backToTopBtn = document.getElementById('back-to-top');

  // Show/hide button on scroll
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  // Scroll to top when button is clicked
  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scroll
    });
  });


  /* =============================================
     8. CONTACT FORM — Validation & Feedback
     
     Before "submitting", we:
     1. Check that all fields are filled in
     2. Check that the email looks valid
     3. Show a success or error message
     
     NOTE: This does NOT actually send an email.
     To send real emails, use Formspree:
     https://formspree.io (free plan available)
  ============================================= */

  var contactForm   = document.getElementById('contact-form');
  var formFeedback  = document.getElementById('form-feedback');

  contactForm.addEventListener('submit', function (event) {
    // Prevent the default form submission (which would reload the page)
    event.preventDefault();

    // Get the values from each input field
    var name    = document.getElementById('name').value.trim();
    var email   = document.getElementById('email').value.trim();
    var subject = document.getElementById('subject').value.trim();
    var message = document.getElementById('message').value.trim();

    // --- Validation ---

    // Check if any field is empty
    if (!name || !email || !subject || !message) {
      showFeedback('⚠️ Please fill in all fields.', 'error');
      return; // Stop here — don't submit
    }

    // Simple email format check using a regular expression
    // This checks that the email has text, an @, more text, a dot, and more text
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback('⚠️ Please enter a valid email address.', 'error');
      return;
    }

    // --- If validation passed, show success ---
    // In a real project, you would send the form data to a server here.


// Form data Formspree ko bhejo
var formData = new FormData(contactForm);
fetch(contactForm.action, {
  method: 'POST',
  body: formData,
  headers: { 'Accept': 'application/json' }
}).then(function(response) {
  if (response.ok) {
    showFeedback('✅ Message sent! I will get back to you soon.', 'success');
    contactForm.reset();
  } else {
    showFeedback('❌ Something went wrong. Try again!', 'error');
  }
});
return; // Purana code nahi chalega


    showFeedback('✅ Message sent! I will get back to you soon.', 'success');

    // Reset all the fields to empty
    contactForm.reset();
  });

  // Helper function to show a feedback message
  function showFeedback(message, type) {
    formFeedback.textContent = message;
    // Remove both classes first, then add the correct one
    formFeedback.classList.remove('success', 'error');
    formFeedback.classList.add(type);

    // Automatically clear the message after 5 seconds
    setTimeout(function () {
      formFeedback.textContent = '';
      formFeedback.classList.remove('success', 'error');
    }, 5000);
  }


  /* =============================================
     9. FOOTER YEAR — Automatically updates
     
     Instead of hardcoding "2024" in the HTML,
     we use JavaScript to always show the
     current year. So you never need to update it.
  ============================================= */

  var footerYear = document.getElementById('footer-year');
  var currentYear = new Date().getFullYear(); // Gets the current year from the user's device
  footerYear.textContent = currentYear;


  /* =============================================
     10. ADD FADE-TARGET CLASS TO ELEMENTS
         (so they animate in on scroll)
     
     Instead of adding 'fade-target' to every
     element in the HTML, we add it here with JS.
     This keeps the HTML clean and readable.
  ============================================= */

  // List of selectors we want to animate in
  var animateSelectors = [
    '.about-avatar',
    '.about-text',
    '.skills-column',
    '.project-card',
    '.github-card',
    '.contact-info',
    '.contact-form-wrapper',
    '.section-header'
  ];

  animateSelectors.forEach(function (selector) {
    var elements = document.querySelectorAll(selector);
    elements.forEach(function (el) {
      el.classList.add('fade-target');
      observer.observe(el);
    });
  });


}); // End of DOMContentLoaded
