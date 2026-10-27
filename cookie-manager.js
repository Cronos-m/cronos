/**
 * Gestor de Cookies para Cronos Magia
 * Maneja el consentimiento (Aceptar/Rechazar) y la creación de cookies HTTP.
 */

const CookieManager = {
    CONSENT_COOKIE_NAME: 'cronos_cookie_consent',
    CONSENT_EXPIRY_DAYS: 180, // 6 meses

    setCookie: function(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        // Secure y SameSite=Lax para la cookie de consentimiento (necesaria para JS)
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    },

    getCookie: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    hasConsented: function() {
        // Devuelve true si la cookie existe (ya sea 'accepted' o 'rejected')
        return this.getCookie(this.CONSENT_COOKIE_NAME) !== null;
    },

    getConsentStatus: function() {
        return this.getCookie(this.CONSENT_COOKIE_NAME);
    },

    acceptConsent: function() {
        this.setCookie(this.CONSENT_COOKIE_NAME, 'accepted', this.CONSENT_EXPIRY_DAYS);
    },

    rejectConsent: function() {
        // Guardamos el rechazo para no volver a molestar al usuario
        this.setCookie(this.CONSENT_COOKIE_NAME, 'rejected', this.CONSENT_EXPIRY_DAYS);
    }
};

// =========================================
// INICIALIZACIÓN AL CARGAR EL DOM
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');
    const farewellBanner = document.getElementById('cookie-farewell');

    // 1. Mostrar banner si no hay decisión previa
    if (!CookieManager.hasConsented() && cookieBanner) {
        // Usamos un pequeño timeout para que la animación CSS se ejecute correctamente
        setTimeout(() => {
            cookieBanner.style.display = 'block';
        }, 500);
    } else if (CookieManager.getConsentStatus() === 'accepted') {
        // Si aceptó, aquí cargarías scripts de terceros (Analytics, etc.)
        // loadThirdPartyScripts();
    }

    // 2. Manejar botón Aceptar
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            CookieManager.acceptConsent();
            if (cookieBanner) cookieBanner.style.display = 'none';
            // loadThirdPartyScripts();
        });
    }

    // 3. Manejar botón Rechazar
    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            CookieManager.rejectConsent();
            
            // Ocultar el banner principal
            if (cookieBanner) {
                cookieBanner.style.display = 'none';
            }
            
            // Mostrar el banner de despedida triste
            if (farewellBanner) {
                farewellBanner.style.display = 'block';
                
                // Después de 3 segundos, iniciar la animación de salida
                setTimeout(() => {
                    farewellBanner.classList.add('fade-out');
                    
                    // Después de que termine la animación (0.5s), ocultar completamente
                    setTimeout(() => {
                        farewellBanner.style.display = 'none';
                        farewellBanner.classList.remove('fade-out');
                    }, 500);
                }, 3000);
            }
        });
    }

    // =========================================
    // SEGURIDAD DEL FORMULARIO (HONEYPOT)
    // =========================================
    const contactForm = document.getElementById('contact-form');
    const honeypotField = document.getElementById('website');

    if (contactForm && honeypotField) {
        contactForm.addEventListener('submit', (e) => {
            if (honeypotField.value !== '') {
                e.preventDefault();
                console.warn('Envío bloqueado: Bot detectado.');
                return false;
            }
        });
    }

    // =========================================
    // ANIMACIONES DE SCROLL (FADE IN)
    // =========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    const style = document.createElement('style');
    style.innerHTML = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);
});