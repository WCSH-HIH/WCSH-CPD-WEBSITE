/* ========================================
   WCSH CPD CENTER - MAIN JAVASCRIPT
   General functionality & navigation
   Email: cpdwcsh@gmail.com
   Phone: +251-91-615-4691
   ======================================== */

// ========================================
// 1. MOBILE MENU TOGGLE
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
});

// ========================================
// 2. SMOOTH SCROLLING FOR ANCHOR LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#!') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ========================================
// 3. CONTACT FORM HANDLING
// ========================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // Form will submit to Web3Forms
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Web3Forms will handle the actual submission
        // The form will redirect or show success message automatically
    });
}

// ========================================
// 4. DOWNLOAD BUTTONS (Resources Page)
// ========================================

document.querySelectorAll('.download-btn, .view-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the Google Drive link from data attribute
        const driveLink = this.getAttribute('data-drive-link');
        
        if (driveLink && driveLink !== 'YOUR_GOOGLE_DRIVE_LINK') {
            // Open Google Drive link in new tab
            window.open(driveLink, '_blank');
        } else {
            alert('Resource link not configured yet.\n\nPlease contact CPD Office:\nEmail: cpdwcsh@gmail.com\nPhone: +251-91-615-4691');
        }
    });
});

// ========================================
// 5. BACK TO TOP BUTTON
// ========================================

// Create back to top button dynamically
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '↑';
backToTopBtn.className = 'back-to-top';
backToTopBtn.setAttribute('aria-label', 'Back to top');
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 55px;
    height: 55px;
    background: linear-gradient(135deg, var(--secondary-blue), var(--primary-blue));
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 26px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
`;

document.body.appendChild(backToTopBtn);

// Show/hide back to top button on scroll
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
});

// Scroll to top when clicked
backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

backToTopBtn.addEventListener('mouseenter', function() {
    this.style.background = 'linear-gradient(135deg, var(--primary-orange), #EA580C)';
    this.style.transform = 'scale(1.1)';
});

backToTopBtn.addEventListener('mouseleave', function() {
    this.style.background = 'linear-gradient(135deg, var(--secondary-blue), var(--primary-blue))';
    this.style.transform = 'scale(1)';
});

// ========================================
// 6. LAZY LOADING IMAGES
// ========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// 7. ACTIVE PAGE HIGHLIGHTING
// ========================================

// Automatically highlight current page in navigation
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// ========================================
// 8. FORM VALIDATION ENHANCEMENT
// ========================================

// Add real-time validation feedback
document.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
    field.addEventListener('blur', function() {
        if (!this.value.trim()) {
            this.style.borderColor = '#EF4444';
        } else {
            this.style.borderColor = '#10B981';
        }
    });
    
    field.addEventListener('input', function() {
        if (this.value.trim()) {
            this.style.borderColor = '#E5E7EB';
        }
    });
});

// Email validation
document.querySelectorAll('input[type="email"]').forEach(emailField => {
    emailField.addEventListener('blur', function() {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailPattern.test(this.value)) {
            this.style.borderColor = '#EF4444';
            if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('error-message')) {
                const errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                errorMsg.style.cssText = 'color: #EF4444; font-size: 0.85rem; margin-top: 0.25rem; display: block;';
                errorMsg.textContent = 'Please enter a valid email address';
                this.parentNode.appendChild(errorMsg);
            }
        } else {
            this.style.borderColor = this.value ? '#10B981' : '#E5E7EB';
            const errorMsg = this.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }
    });
});

// ========================================
// 9. PRINT PAGE FUNCTIONALITY
// ========================================

// Add keyboard shortcut for printing (Ctrl+P)
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
    }
});

// ========================================
// 10. LOADING ANIMATION FOR LINKS
// ========================================

// Add subtle loading animation when clicking navigation links
document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener('click', function(e) {
        // Only apply to internal links
        if (this.hostname === window.location.hostname) {
            // Add loading indicator
            const loader = document.createElement('div');
            loader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: linear-gradient(90deg, var(--secondary-blue), var(--primary-orange));
                z-index: 9999;
                animation: loading 1s ease-in-out;
            `;
            document.body.appendChild(loader);
            
            // Remove after navigation
            setTimeout(() => loader.remove(), 1000);
        }
    });
});

// Loading animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes loading {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
`;
document.head.appendChild(style);

// ========================================
// 11. CONSOLE WELCOME MESSAGE
// ========================================

console.log('%c WCSH CPD Center Website ', 'background: #3B82F6; color: white; font-size: 18px; padding: 12px; font-weight: bold;');
console.log('%c Advancing healthcare excellence through continuous professional development ', 'color: #6B7280; font-size: 13px; font-weight: 600;');
console.log('%c Contact: cpdwcsh@gmail.com | +251-91-615-4691 ', 'color: #10B981; font-size: 12px; font-weight: 600;');
console.log('%c Website loaded successfully! ✨ ', 'color: #F97316; font-size: 14px; font-weight: bold;');

// ========================================
// END OF MAIN.JS
// ========================================