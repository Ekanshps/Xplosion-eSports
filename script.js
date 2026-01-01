// ========================================
// XPLOSION eSPORTS - JAVASCRIPT
// ========================================

// ========================================
// NAVBAR SCROLL & MOBILE TOGGLE
// ========================================

const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
    });
});

// ========================================
// SMOOTH SCROLLING
// ========================================

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
});

// ========================================
// ACTIVE SECTION HIGHLIGHTING
// ========================================

const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.player-card, .tournament-card, .stat-item, .about-content, .about-visual');
animateElements.forEach(element => observer.observe(element));

// ========================================
// FORM SUBMISSION HANDLER
// ========================================

const joinForm = document.getElementById('joinForm');

joinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form element
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const originalBtnText = submitBtn.innerHTML;
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    try {
        // Send form data using fetch API
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Success - show notification
            showNotification('Application Submitted!', 'Your application has been received. We will contact you soon.');
            // Reset form
            form.reset();
        } else {
            // Error from server
            showNotification('Submission Error', 'There was a problem submitting your application. Please try again or contact us directly.');
        }
    } catch (error) {
        // Network error or other issue
        console.error('Form submission error:', error);
        showNotification('Submission Error', 'Unable to submit form. Please check your internet connection and try again.');
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});

// ========================================
// NOTIFICATION SYSTEM
// ========================================

function showNotification(title, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles dynamically
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #1a1a1a;
        border: 2px solid #ff0033;
        border-radius: 8px;
        padding: 1.5rem;
        max-width: 400px;
        z-index: 10000;
        box-shadow: 0 10px 40px rgba(255, 0, 51, 0.4);
        animation: slideInRight 0.5s ease;
    `;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Close button handler
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }
    }, 5000);
}

// Add notification animations to CSS dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content h4 {
        font-family: 'Orbitron', sans-serif;
        color: #ff0033;
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
    }
    
    .notification-content p {
        color: #b0b0b0;
        font-size: 0.95rem;
        margin: 0;
    }
    
    .notification-close {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        color: #b0b0b0;
        font-size: 1.5rem;
        cursor: pointer;
        transition: color 0.2s;
    }
    
    .notification-close:hover {
        color: #ff0033;
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(400px);
        }
    }
`;
document.head.appendChild(notificationStyles);

// ========================================
// PLAYER CARD TILT EFFECT
// ========================================

const playerCards = document.querySelectorAll('.player-card');

playerCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ========================================
// COUNTER ANIMATION FOR STATS
// ========================================

function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const suffix = element.textContent.replace(/[0-9]/g, '');
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Observe stats for counter animation
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = parseInt(entry.target.textContent);
            animateCounter(entry.target, target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

// ========================================
// VIDEO CONTAINER LOADING
// ========================================

const videoContainers = document.querySelectorAll('.video-container');

videoContainers.forEach(container => {
    const iframe = container.querySelector('iframe');
    
    iframe.addEventListener('load', () => {
        container.classList.add('loaded');
    });
});

// ========================================
// PARALLAX EFFECT FOR HERO
// ========================================

const heroBackground = document.querySelector('.hero-background');

window.addEventListener('scroll', () => {
    if (heroBackground) {
        const scrollPosition = window.pageYOffset;
        heroBackground.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    }
});

// ========================================
// CURSOR GLOW EFFECT (OPTIONAL ENHANCEMENT)
// ========================================

// Create cursor glow element
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
cursorGlow.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, rgba(255, 0, 51, 0.6) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
    display: none;
`;
document.body.appendChild(cursorGlow);

// Only show on desktop
if (window.innerWidth > 992) {
    cursorGlow.style.display = 'block';
    
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX - 10 + 'px';
        cursorGlow.style.top = e.clientY - 10 + 'px';
    });
    
    // Scale up on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .player-card, .tournament-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorGlow.style.transform = 'scale(3)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorGlow.style.transform = 'scale(1)';
        });
    });
}

// ========================================
// PRELOADER (OPTIONAL)
// ========================================

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// ========================================
// TOURNAMENT CARD ANIMATIONS
// ========================================

const tournamentCards = document.querySelectorAll('.tournament-card');

tournamentCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// ========================================
// FORM VALIDATION
// ========================================

const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '' && input.hasAttribute('required')) {
            input.style.borderColor = '#ff0033';
        } else {
            input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    });
    
    input.addEventListener('focus', () => {
        input.style.borderColor = '#ff0033';
    });
});

// ========================================
// RESPONSIVE VIDEO EMBEDS
// ========================================

function adjustVideoEmbeds() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const iframe = container.querySelector('iframe');
        if (iframe) {
            iframe.style.width = '100%';
            iframe.style.height = '100%';
        }
    });
}

window.addEventListener('resize', adjustVideoEmbeds);
adjustVideoEmbeds();

// ========================================
// CONSOLE MESSAGE (EASTER EGG)
// ========================================

console.log('%c🎮 XPLOSION eSPORTS 🎮', 'color: #ff0033; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px rgba(255, 0, 51, 0.5);');
console.log('%cWelcome to the official XPLOSION eSPORTS website!', 'color: #b0b0b0; font-size: 14px;');
console.log('%cInterested in joining our team? Visit the Join section!', 'color: #ff0033; font-size: 12px;');

// ========================================
// PREVENT CONTEXT MENU ON IMAGES (OPTIONAL)
// ========================================

const images = document.querySelectorAll('img');

images.forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});

// ========================================
// SCROLL TO TOP BUTTON
// ========================================

const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #ff0033;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 5px 20px rgba(255, 0, 51, 0.4);
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.pointerEvents = 'auto';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.pointerEvents = 'none';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.background = '#cc0029';
    scrollToTopBtn.style.transform = 'translateY(-5px)';
    scrollToTopBtn.style.boxShadow = '0 10px 30px rgba(255, 0, 51, 0.6)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.background = '#ff0033';
    scrollToTopBtn.style.transform = 'translateY(0)';
    scrollToTopBtn.style.boxShadow = '0 5px 20px rgba(255, 0, 51, 0.4)';
});

// ========================================
// KEYBOARD NAVIGATION ENHANCEMENT
// ========================================

document.addEventListener('keydown', (e) => {
    // Press 'H' to go to home
    if (e.key === 'h' || e.key === 'H') {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Lazy load images
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========================================
// AUTO SLIDER FOR ROSTER & TOURNAMENTS
// ========================================

class AutoSlider {
    constructor(sliderId, prevBtnId, nextBtnId, autoPlayInterval = 4500) {
        this.slider = document.getElementById(sliderId);
        this.prevBtn = document.getElementById(prevBtnId);
        this.nextBtn = document.getElementById(nextBtnId);
        this.currentIndex = 0;
        this.autoPlayInterval = autoPlayInterval;
        this.autoPlayTimer = null;
        this.itemsToShow = 3;
        
        if (!this.slider) return;
        
        this.cards = Array.from(this.slider.children);
        this.totalCards = this.cards.length;
        
        this.init();
    }
    
    init() {
        this.updateItemsToShow();
        this.setupEventListeners();
        this.startAutoPlay();
        
        // Update on window resize
        window.addEventListener('resize', () => {
            this.updateItemsToShow();
            this.updateSliderPosition(false);
        });
    }
    
    updateItemsToShow() {
        const width = window.innerWidth;
        if (width <= 768) {
            this.itemsToShow = 1;
        } else if (width <= 1200) {
            this.itemsToShow = 2;
        } else {
            this.itemsToShow = 3;
        }
    }
    
    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => {
            this.stopAutoPlay();
            this.prevSlide();
            this.startAutoPlay();
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.stopAutoPlay();
            this.nextSlide();
            this.startAutoPlay();
        });
        
        // Pause on hover
        this.slider.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });
        
        this.slider.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }
    
    nextSlide() {
        const maxIndex = this.totalCards - this.itemsToShow;
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0; // Loop back to start
        }
        this.updateSliderPosition();
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.totalCards - this.itemsToShow; // Loop to end
        }
        this.updateSliderPosition();
    }
    
    updateSliderPosition(animate = true) {
        const cardWidth = this.cards[0].offsetWidth;
        const gap = parseInt(getComputedStyle(this.slider).gap);
        const offset = -(this.currentIndex * (cardWidth + gap));
        
        if (!animate) {
            this.slider.style.transition = 'none';
        }
        
        this.slider.style.transform = `translateX(${offset}px)`;
        
        if (!animate) {
            // Force reflow
            this.slider.offsetHeight;
            this.slider.style.transition = '';
        }
        
        this.updateButtons();
    }
    
    updateButtons() {
        // Enable/disable buttons based on position (optional)
        // For infinite loop, we can keep them always enabled
        this.prevBtn.disabled = false;
        this.nextBtn.disabled = false;
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayTimer = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayInterval);
    }
    
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }
}

// Initialize sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Roster slider - auto slides every 4.5 seconds
    const rosterSlider = new AutoSlider('rosterSlider', 'rosterPrev', 'rosterNext', 4500);
    
    // Tournament slider - auto slides every 5 seconds
    const tournamentSlider = new AutoSlider('tournamentSlider', 'tournamentPrev', 'tournamentNext', 5000);
});

// ========================================
// INITIALIZATION MESSAGE
// ========================================

console.log('%c✓ XPLOSION eSPORTS Website Loaded Successfully', 'color: #00ff00; font-size: 12px; font-weight: bold;');