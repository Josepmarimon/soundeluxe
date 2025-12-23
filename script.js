// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');

navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Smooth Scroll for Navigation Links
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

// Navbar Background on Scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.8)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');

            // Trigger counter animation for statistics
            if (entry.target.classList.contains('stat-item')) {
                animateCounter(entry.target.querySelector('.stat-number'));
            }
        }
    });
}, observerOptions);

// Observe all animatable elements
document.querySelectorAll('.feature-card, .event-card, .benefit-item, .stat-item').forEach(el => {
    observer.observe(el);
});

// Counter Animation for Statistics
function animateCounter(element) {
    if (!element || element.dataset.animated) return;

    const target = parseInt(element.dataset.count);
    if (!target) return;

    element.dataset.animated = 'true';
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString() + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString() + '+';
        }
    };

    updateCounter();
}

// Add CSS for animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .feature-card,
    .event-card,
    .benefit-item,
    .stat-item {
        opacity: 0;
        transition: all 0.6s ease;
    }

    .animated {
        animation: fadeInUp 0.6s ease forwards;
    }

    .nav-menu.active {
        display: flex !important;
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background: rgba(10, 10, 10, 0.98);
        flex-direction: column;
        padding: var(--spacing-xl);
        gap: var(--spacing-xl);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
    }

    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }

    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
    }
`;
document.head.appendChild(style);

// Newsletter Form Handler
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;

    // Show success message
    const button = e.target.querySelector('button');
    const originalText = button.textContent;
    button.textContent = '¡Suscrito!';
    button.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';

    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        e.target.reset();
    }, 3000);
});

// Event Cards Click Handler
document.querySelectorAll('.event-card button:not([disabled])').forEach(button => {
    button.addEventListener('click', () => {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);

        // Simulate booking action
        console.log('Booking event...');
    });
});

// Add Ripple Effect CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Add Parallax Effect to Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-shapes .shape');
    const bokehElements = document.querySelectorAll('.bokeh-light');
    const heroBackground = document.querySelector('.hero-background::before');

    // Parallax for floating shapes
    parallaxElements.forEach((element, index) => {
        const speed = 0.3 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px) scale(${1 + scrolled * 0.0001})`;
    });

    // Parallax for bokeh lights
    bokehElements.forEach((element, index) => {
        const speed = 0.1 + (index * 0.02);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });

    // Slight zoom effect on background
    if (heroBackground) {
        const scale = 1.1 + (scrolled * 0.0002);
        heroBackground.style.transform = `scale(${Math.min(scale, 1.3)})`;
    }
});

// Button Hover Effects with Mouse Position
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
    });
});

// Add Dynamic Hover Effect CSS
const hoverStyle = document.createElement('style');
hoverStyle.textContent = `
    .btn::before {
        content: '';
        position: absolute;
        top: var(--y, 50%);
        left: var(--x, 50%);
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
        pointer-events: none;
    }

    .btn:hover::before {
        width: 300px;
        height: 300px;
    }
`;
document.head.appendChild(hoverStyle);

// Lazy Load Images (placeholder for actual images)
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            // In a real implementation, you would load actual images here
            img.style.opacity = '1';
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('.event-image').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s';
    imageObserver.observe(img);
});

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add initial animations to hero elements
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero .btn');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.8s ease';

        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });

    // Animate hero visual
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.style.opacity = '0';
        heroVisual.style.transform = 'scale(0.9)';
        heroVisual.style.transition = 'all 1s ease';

        setTimeout(() => {
            heroVisual.style.opacity = '1';
            heroVisual.style.transform = 'scale(1)';
        }, 500);
    }
});

// Create luxury bokeh lights effect
function createBokehLights() {
    const bokehContainer = document.createElement('div');
    bokehContainer.className = 'bokeh-container';
    bokehContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        z-index: 1;
    `;

    // Bokeh color palette for luxury feel
    const bokehColors = [
        { r: 255, g: 215, b: 0, a: 0.3 },    // Gold
        { r: 255, g: 255, b: 255, a: 0.4 },  // White
        { r: 139, g: 92, b: 246, a: 0.3 },   // Purple
        { r: 236, g: 72, b: 153, a: 0.3 },   // Pink
        { r: 251, g: 191, b: 36, a: 0.3 },   // Yellow
        { r: 16, g: 185, b: 129, a: 0.2 },   // Emerald
    ];

    // Create larger, more prominent bokeh lights
    for (let i = 0; i < 40; i++) {
        const bokeh = document.createElement('div');
        const color = bokehColors[Math.floor(Math.random() * bokehColors.length)];
        const size = Math.random() * 80 + 20; // Larger sizes for bokeh effect
        const blur = Math.random() * 30 + 10;

        bokeh.className = 'bokeh-light';
        bokeh.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle at center,
                rgba(${color.r}, ${color.g}, ${color.b}, ${color.a}) 0%,
                rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * 0.4}) 40%,
                rgba(${color.r}, ${color.g}, ${color.b}, 0) 100%);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            filter: blur(${blur}px);
            mix-blend-mode: screen;
            animation: bokeh-float ${Math.random() * 30 + 20}s infinite ease-in-out;
            animation-delay: ${Math.random() * 10}s;
        `;
        bokehContainer.appendChild(bokeh);
    }

    // Create smaller sparkle lights
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        const sparkleSize = Math.random() * 6 + 2;

        sparkle.className = 'sparkle-light';
        sparkle.style.cssText = `
            position: absolute;
            width: ${sparkleSize}px;
            height: ${sparkleSize}px;
            background: radial-gradient(circle at center,
                rgba(255, 255, 255, 0.9) 0%,
                rgba(255, 255, 255, 0) 100%);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: sparkle ${Math.random() * 4 + 2}s infinite ease-in-out;
            animation-delay: ${Math.random() * 2}s;
        `;
        bokehContainer.appendChild(sparkle);
    }

    document.querySelector('.hero-background')?.appendChild(bokehContainer);
}

// Add bokeh and sparkle animation CSS
const bokehStyle = document.createElement('style');
bokehStyle.textContent = `
    @keyframes bokeh-float {
        0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.3;
        }
        25% {
            transform: translateY(-30px) translateX(20px) scale(1.1);
            opacity: 0.5;
        }
        50% {
            transform: translateY(20px) translateX(-30px) scale(0.9);
            opacity: 0.4;
        }
        75% {
            transform: translateY(-20px) translateX(-20px) scale(1.05);
            opacity: 0.6;
        }
    }

    @keyframes sparkle {
        0%, 100% {
            opacity: 0;
            transform: scale(0);
        }
        50% {
            opacity: 1;
            transform: scale(1);
        }
    }

    .bokeh-light {
        will-change: transform, opacity;
    }

    .sparkle-light {
        will-change: transform, opacity;
    }
`;
document.head.appendChild(bokehStyle);

// Initialize bokeh lights
createBokehLights();

// Card flip interaction for mobile and desktop - Hero Card
const cardFlipContainer = document.querySelector('.card-flip-container');
let isFlipped = false;

if (cardFlipContainer) {
    // Click/touch to flip on mobile
    cardFlipContainer.addEventListener('click', (e) => {
        // Prevent flip if clicking the button on the back
        if (e.target.classList.contains('btn-reserve') || e.target.closest('.btn-reserve')) {
            return;
        }

        isFlipped = !isFlipped;
        if (isFlipped) {
            cardFlipContainer.classList.add('flipped');
        } else {
            cardFlipContainer.classList.remove('flipped');
        }
    });

    // Prevent hover on mobile devices
    if (window.matchMedia('(hover: none)').matches) {
        cardFlipContainer.style.pointerEvents = 'auto';
    }
}

// Event Cards Flip Interaction
const eventCardFlips = document.querySelectorAll('.event-card-flip');

eventCardFlips.forEach(cardContainer => {
    let cardFlipped = false;

    cardContainer.addEventListener('click', (e) => {
        // Prevent flip if clicking the button on the back
        if (e.target.classList.contains('btn-reserve-event') || e.target.closest('.btn-reserve-event')) {
            return;
        }

        cardFlipped = !cardFlipped;
        if (cardFlipped) {
            cardContainer.classList.add('flipped');
        } else {
            cardContainer.classList.remove('flipped');
        }
    });

    // On mobile, enable click to flip
    if (window.matchMedia('(hover: none)').matches) {
        cardContainer.style.pointerEvents = 'auto';
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers
const debouncedScroll = debounce(() => {
    // Handle scroll events
}, 10);

window.addEventListener('scroll', debouncedScroll, { passive: true });

// Genre Filter System
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card-flip');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.dataset.filter;

            // Filter cards
            eventCards.forEach(card => {
                if (filterValue === 'all' || card.dataset.genre === filterValue) {
                    // Show card with animation
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    // Hide card with animation
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 400);
                }
            });

            // Update results count
            const visibleCards = filterValue === 'all' ?
                eventCards.length :
                document.querySelectorAll(`.event-card-flip[data-genre="${filterValue}"]`).length;

            // Optional: Show a message if no results
            const eventsGrid = document.querySelector('.events-grid');
            const noResultsMsg = document.getElementById('no-results-message');

            if (visibleCards === 0) {
                if (!noResultsMsg) {
                    const message = document.createElement('div');
                    message.id = 'no-results-message';
                    message.className = 'no-results';
                    message.innerHTML = `
                        <i class="fas fa-search"></i>
                        <p>No hay sesiones disponibles en este género</p>
                        <button class="btn btn-outline" onclick="document.querySelector('[data-filter="all"]').click()">
                            Ver todas las sesiones
                        </button>
                    `;
                    message.style.cssText = `
                        grid-column: 1 / -1;
                        text-align: center;
                        padding: var(--spacing-3xl);
                        color: var(--color-gray-400);
                    `;
                    eventsGrid.appendChild(message);
                }
            } else {
                if (noResultsMsg) {
                    noResultsMsg.remove();
                }
            }
        });
    });

    // Initialize with all cards visible
    document.querySelector('[data-filter="all"]').click();
});