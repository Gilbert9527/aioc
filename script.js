// Enhanced smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced card hover effects with 3D transform
const cards = document.querySelectorAll('.tool-card, .experiment-card, .session-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        this.style.transition = 'transform 0.1s ease';
    });
    
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        this.style.transition = 'transform 0.3s ease';
    });
});

// Enhanced button click handlers with ripple effect
const buttons = document.querySelectorAll('.tool-btn, .experiment-btn, .session-btn, .cta-btn, .hero-btn');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            ripple.remove();
        }, 300);
        
        // Enhanced demo functionality
        const toolName = this.closest('.tool-card, .experiment-card, .session-card')?.querySelector('h3')?.textContent || 
                        this.textContent || 'AI 工具';
        
        // Create custom notification instead of alert
        showNotification(`正在启动 ${toolName}...`, 'success');
    });
});

// Custom notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Enhanced Intersection Observer for staggered animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Staggered animation delay
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                entry.target.classList.add('animate-in');
            }, index * 100);
        }
    });
}, observerOptions);

// Observe all animated elements
const animatedElements = document.querySelectorAll('.tool-card, .experiment-card, .session-card, .featured-item');
animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px) scale(0.95)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// Filter functionality for experiments
const filterTabs = document.querySelectorAll('.filter-tab');
const experimentCards = document.querySelectorAll('.experiment-card');

filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active class from all tabs
        filterTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        
        experimentCards.forEach((card, index) => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                setTimeout(() => {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, index * 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px) scale(0.95)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Mobile menu toggle (if needed)
const navBtn = document.querySelector('.nav-btn');
navBtn.addEventListener('click', function() {
    // Add sign-in functionality here
    alert('Sign in functionality would be implemented here');
});

// Video placeholder interactions
const videoPlaceholders = document.querySelectorAll('.video-placeholder');
videoPlaceholders.forEach(placeholder => {
    placeholder.addEventListener('click', function() {
        this.style.background = '#1a73e8';
        this.style.color = 'white';
        this.textContent = 'Playing...';
        
        setTimeout(() => {
            this.style.background = '#e8eaed';
            this.style.color = '#5f6368';
            this.textContent = this.textContent.replace('Playing...', 'Video Preview');
        }, 2000);
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Enhanced dynamic text animation for hero title
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.innerHTML = '';
    
    // Split text into characters and wrap each in a span
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        heroTitle.appendChild(span);
    });
    
    // Animate characters in
    setTimeout(() => {
        heroTitle.querySelectorAll('span').forEach(span => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
        });
    }, 500);
}

// Parallax scrolling effect for hero section
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroElements = document.querySelectorAll('.element');
    
    if (hero) {
        const rate = scrolled * -0.3;
        hero.style.transform = `translateY(${rate}px)`;
    }
    
    // Move floating elements at different speeds
    heroElements.forEach((element, index) => {
        const speed = 0.2 + (index * 0.1);
        const yPos = scrolled * speed;
        element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
    });
    
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// Search functionality (placeholder)
function initSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '搜索 AI 工具...';
    searchInput.className = 'search-input';
    
    const navRight = document.querySelector('.nav-right');
    navRight.insertBefore(searchInput, navRight.firstChild);
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        const allCards = document.querySelectorAll('.tool-card, .experiment-card');
        
        allCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(query) || description.includes(query)) {
                card.style.display = 'block';
                card.style.opacity = '1';
            } else if (query.length > 0) {
                card.style.opacity = '0.3';
            } else {
                card.style.opacity = '1';
            }
        });
    });
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', initSearch);