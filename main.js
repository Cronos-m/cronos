document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // GESTIÓN DE COOKIES
    // =========================================
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    // Comprobar si el usuario ya aceptó las cookies
    if (!localStorage.getItem('cookies_accepted')) {
        cookieBanner.style.display = 'flex';
    }

    acceptCookiesBtn.addEventListener('click', () => {
        // Guardar en localStorage que aceptó (expira al limpiar caché, 
        // para un entorno real se debería usar una cookie con fecha de expiración)
        localStorage.setItem('cookies_accepted', 'true');
        cookieBanner.style.display = 'none';
        
        // Aquí iría la lógica para cargar scripts de terceros (Analytics, etc.)
        // que estaban bloqueados hasta el consentimiento.
    });

    // =========================================
    // SEGURIDAD DEL FORMULARIO (HONEYPOT)
    // =========================================
    const contactForm = document.getElementById('contact-form');
    const honeypotField = document.getElementById('website');

    contactForm.addEventListener('submit', (e) => {
        // Validación frontend del honeypot
        // Si un bot rellena el campo oculto, cancelamos el envío.
        if (honeypotField.value !== '') {
            e.preventDefault();
            console.warn('Envío de formulario bloqueado: Bot detectado (Honeypot activado).');
            return false;
        }
        
        // Nota para el programador: 
        // La validación real y el saneamiento de datos (sanitization) 
        // deben hacerse estrictamente en el backend (PHP, Node, Python, etc.).
        // Nunca confíes solo en el frontend.
    });

    // =========================================
    // ANIMACIONES DE SCROLL (FADE IN)
    // =========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Aplicar a las secciones para que aparezcan suavemente
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // Clase CSS para el estado visible (se añade dinámicamente o se puede poner en CSS)
    const style = document.createElement('style');
    style.innerHTML = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);
});