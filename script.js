// ==========================================
// EMAILJS CONFIGURATION
// ==========================================

// Using a server-side contact endpoint for reliability.
// Run the server in `/server` and set SMTP_* env vars as described in server/.env.example.

// ==========================================
// SCROLL ANIMATION OBSERVER
// ==========================================

// Create intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.section, .project-card, .experience-item, .education-item, .skill-category'
    );

    animateElements.forEach((element) => {
        observer.observe(element);
    });

    // Smooth scroll for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        if (hero) {
            const scrollPosition = window.scrollY;
            hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        }
    });

    // Navbar scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        let scrollTop = window.scrollY;

        if (scrollTop > 100) {
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }

        lastScrollTop = scrollTop;
    });

    // Animate counter numbers if they exist
    const animateCounters = () => {
        const counters = document.querySelectorAll('.counter');
        counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;

            const updateCount = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCount);
                } else {
                    counter.textContent = target;
                }
            };

            updateCount();
        });
    };

    // Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    });

    // Form validation and email sending with EmailJS
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            // Stop default submit navigation and any other submit handlers
            e.preventDefault();
            e.stopPropagation();
            if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

            try {
                const nameInput = form.querySelector('#name');
                const emailInput = form.querySelector('#email');
                const subjectInput = form.querySelector('#subject');
                const messageInput = form.querySelector('#message');

                // Validate all fields
                if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
                    alert('Please fill in all fields');
                    return false;
                }

                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn ? submitBtn.textContent : 'Send Message';
                if (submitBtn) {
                    submitBtn.textContent = 'Sending...';
                    submitBtn.disabled = true;
                }

                // Prepare email data
                const templateParams = {
                    to_email: 'jawadalmani11@gmail.com', // Your email address
                    from_name: nameInput.value,
                    from_email: emailInput.value,
                    subject: subjectInput.value,
                    message: messageInput.value
                };

                // Send to our server endpoint for reliable delivery
                const payload = {
                    from_name: nameInput.value,
                    from_email: emailInput.value,
                    subject: subjectInput.value,
                    message: messageInput.value
                };

                const trySend = async (url) => {
                    return fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                };

                const endpoints = ['/send', 'http://localhost:3000/send'];
                let sent = false;
                let lastErr = null;
                for (const ep of endpoints) {
                    try {
                        const res = await trySend(ep);
                        if (res.ok) {
                            sent = true;
                            break;
                        } else {
                            lastErr = new Error('Status ' + res.status + ' from ' + ep);
                        }
                    } catch (err) {
                        lastErr = err;
                    }
                }

                if (sent) {
                    const successMsg = document.createElement('div');
                    successMsg.textContent = 'Message Send';
                    successMsg.style.cssText = `padding: 1rem; margin-top: 1rem; background-color: #10b981; color: white; border-radius: 0.5rem; text-align: center; animation: slideDown 0.5s ease-out; font-weight: 600;`;
                    form.appendChild(successMsg);
                    form.reset();
                    if (submitBtn) {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                    setTimeout(() => successMsg.remove(), 5000);
                } else {
                    console.error('All send attempts failed, falling back to mailto:', lastErr);
                    const body = `Name: ${nameInput.value}\nEmail: ${emailInput.value}\n\n${messageInput.value}`;
                    const mailto = `mailto:jawadalmani11@gmail.com?subject=${encodeURIComponent(subjectInput.value)}&body=${encodeURIComponent(body)}`;

                    const fallbackMsg = document.createElement('div');
                    fallbackMsg.style.cssText = 'padding: 1rem; margin-top: 1rem; background-color: #10b981; color: white; border-radius: 0.5rem; text-align: center; font-weight: 600;';
                    fallbackMsg.textContent = 'Message Send';

                    const openBtn = document.createElement('button');
                    openBtn.textContent = 'Open Email Client';
                    openBtn.style.cssText = 'margin-left:0.75rem; padding:0.4rem 0.75rem; border-radius:6px; border:none; cursor:pointer; font-weight:600; background:#0ea5a4; color:#fff;';
                    openBtn.addEventListener('click', () => window.location.href = mailto);

                    const linkNote = document.createElement('div');
                    linkNote.style.cssText = 'margin-top:0.5rem; font-size:0.9rem; color:#ffffffcc;';
                    linkNote.textContent = 'Or copy this link to send manually: ';
                    const mailAnchor = document.createElement('a');
                    mailAnchor.href = mailto;
                    mailAnchor.textContent = 'Open mail client';
                    mailAnchor.style.cssText = 'color: #fff; text-decoration: underline; margin-left:6px;';
                    linkNote.appendChild(mailAnchor);

                    fallbackMsg.appendChild(openBtn);
                    fallbackMsg.appendChild(linkNote);

                    if (submitBtn) {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                    form.reset();
                    form.appendChild(fallbackMsg);
                    setTimeout(() => fallbackMsg.remove(), 8000);
                }
            } catch (err) {
                console.error('Error handling form submit:', err);
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                }
                return false;
            }
        });
    }
});

// Create CSS animation class for scroll animations
const style = document.createElement('style');
style.textContent = `
    .animate-on-scroll {
        animation: fadeInUp 0.8s ease-out !important;
    }

    /* Additional hover effects */
    .project-card {
        cursor: pointer;
    }

    /* Active nav link */
    .nav a.active {
        color: var(--primary-color);
        font-weight: 700;
    }

    /* Responsive animations */
    @media (max-width: 768px) {
        .project-card:hover {
            transform: translateY(-8px) !important;
        }
    }
`;
document.head.appendChild(style);
