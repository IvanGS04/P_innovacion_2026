// FUNCIONALIDAD DEL FORMUALRIO DEL LOGIN
class CreativeLoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.submitButton = this.form.querySelector('.login-btn');
        this.successMessage = document.getElementById('successMessage');
        this.socialButtons = document.querySelectorAll('.social-btn');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupPasswordToggle();
        this.setupSocialButtons();
        this.setupCreativeEffects();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));
        
        // INPUTS PARA AGREGAR EL EMAIL Y EL PASSWORD
        this.emailInput.addEventListener('focus', () => this.addInputFocus('email'));
        this.passwordInput.addEventListener('focus', () => this.addInputFocus('password'));
        this.emailInput.addEventListener('blur', () => this.removeInputFocus('email'));
        this.passwordInput.addEventListener('blur', () => this.removeInputFocus('password'));
    }
    
    setupPasswordToggle() {
        this.passwordToggle.addEventListener('click', () => {
            const type = this.passwordInput.type === 'password' ? 'text' : 'password';
            this.passwordInput.type = type;
            
            const icon = this.passwordToggle.querySelector('.toggle-icon');
            icon.classList.toggle('show-password', type === 'text');
            
            // EFFECTO DE ANIMACIÓN 
            this.passwordToggle.style.transform = 'translateY(-50%) scale(1.2)';
            setTimeout(() => {
                this.passwordToggle.style.transform = 'translateY(-50%) scale(1)';
            }, 150);
        });
    }
    
    setupSocialButtons() {
        this.socialButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const platform = button.classList.contains('behance-btn') ? 'Behance' : 'Dribbble';
                this.handleSocialLogin(platform, button);
            });
        });
    }
    
    setupCreativeEffects() {
        // EFFECTO DE ANIMACION CON EL MOUSE
        document.addEventListener('mousemove', (e) => {
            this.updateFloatingShapes(e);
        });
        
        // ANIMACION DE LA CARD
        const card = document.querySelector('.login-card');
        card.addEventListener('mousemove', (e) => {
            this.addCardTilt(e, card);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    }
    
    updateFloatingShapes(e) {
        const shapes = document.querySelectorAll('.shape');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 20;
            const y = (mouseY - 0.5) * speed * 20;
            
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
    
    addCardTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        const rotateX = (mouseY / rect.height) * -10;
        const rotateY = (mouseX / rect.width) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    addInputFocus(field) {
        const inputWrapper = document.getElementById(field).closest('.input-wrapper');
        inputWrapper.classList.add('focused');
        
    
        this.createSparkles(inputWrapper);
    }
    
    removeInputFocus(field) {
        const inputWrapper = document.getElementById(field).closest('.input-wrapper');
        inputWrapper.classList.remove('focused');
    }
    
    createSparkles(element) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                sparkle.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: #667eea;
                    border-radius: 50%;
                    pointer-events: none;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    animation: sparkleFloat 1s ease-out forwards;
                    z-index: 10;
                `;
                
                element.appendChild(sparkle);
                
                setTimeout(() => {
                    sparkle.remove();
                }, 1000);
            }, i * 100);
        }
        
        if (!document.querySelector('#sparkle-keyframes')) {
            const style = document.createElement('style');
            style.id = 'sparkle-keyframes';
            style.textContent = `
                @keyframes sparkleFloat {
                    0% { opacity: 1; transform: translateY(0) scale(0); }
                    50% { opacity: 1; transform: translateY(-20px) scale(1); }
                    100% { opacity: 0; transform: translateY(-40px) scale(0); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showError('email', 'Tu correo es incorrecto');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showError('email', 'Porfavor ingrese un correo valido');
            return false;
        }
        
        this.clearError('email');
        return true;
    }
    
    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.showError('password', 'La contraseña es incorrecta');
            return false;
        }
        
        if (password.length < 6) {
            this.showError('password', 'La contraseña necesita al menos 6 caracteres');
            return false;
        }
        
        this.clearError('password');
        return true;
    }
    
    showError(field, message) {
        const formGroup = document.getElementById(field).closest('.form-group');
        const errorElement = document.getElementById(`${field}Error`);
        
        formGroup.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        // ALTERNATIVA SI HAY UN ERROR EN LA ANIMACION POR CONEXION WIFI
        const input = document.getElementById(field);
        input.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    }
    
    clearError(field) {
        const formGroup = document.getElementById(field).closest('.form-group');
        const errorElement = document.getElementById(`${field}Error`);
        
        formGroup.classList.remove('error');
        errorElement.classList.remove('show');
        setTimeout(() => {
            errorElement.textContent = '';
        }, 300);
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {

            this.addFailureEffect();
            return;
        }
        
        this.setLoading(true);
        
        try {
            // TIMER 
            await new Promise(resolve => setTimeout(resolve, 2500));
            
            // SUCCESS 
            this.showCreativeSuccess();
        } catch (error) {
            this.showError('password', 'No se pudo crear la cuenta.');
        } finally {
            this.setLoading(false);
        }
    }
    
    async handleSocialLogin(platform, button) {
        console.log(`Initiating login with ${platform}...`);
        
        button.style.transform = 'scale(0.95)';
        button.style.opacity = '0.7';
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log(`Redirecting to ${platform} for creative authentication...`);
            // window.location.href = `/auth/${platform.toLowerCase()}`;
        } catch (error) {
            console.error(`Creative ${platform} authentication failed: ${error.message}`);
        } finally {
            button.style.transform = 'scale(1)';
            button.style.opacity = '1';
        }
    }
    
    addFailureEffect() {
        const card = document.querySelector('.login-card');
        card.style.animation = 'shake 0.5s ease-in-out';
        
        card.style.boxShadow = '0 25px 50px rgba(229, 62, 62, 0.3), 0 0 0 1px rgba(229, 62, 62, 0.2)';
        
        setTimeout(() => {
            card.style.animation = '';
            card.style.boxShadow = '';
        }, 500);
    }
    
    setLoading(loading) {
        this.submitButton.classList.toggle('loading', loading);
        this.submitButton.disabled = loading;
        
        // BOTONES DE REDES SOCIALES
        this.socialButtons.forEach(button => {
            button.style.pointerEvents = loading ? 'none' : 'auto';
            button.style.opacity = loading ? '0.6' : '1';
        });
        
        if (loading) {
            // CARGA LA ANIMACION DE LA CARD
            const card = document.querySelector('.login-card');
            card.style.animation = 'pulse 2s ease-in-out infinite';
        }
    }
    
    showCreativeSuccess() {

        this.form.style.transform = 'translateY(-20px)';
        this.form.style.opacity = '0';
        
        setTimeout(() => {
            this.form.style.display = 'none';
            document.querySelector('.creative-social').style.display = 'none';
            document.querySelector('.signup-link').style.display = 'none';
            
      
            this.successMessage.classList.add('show');
            
           
            this.createCelebrationParticles();
            
        }, 300);
        
        
        setTimeout(() => {
            console.log('Entering your creative dimension...');
            window.location.href= 'inicio.html'
        }, 3500);
    }
    
    createCelebrationParticles() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#6c5ce7', '#feca57'];
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 8px;
                    height: 8px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    top: 50%;
                    left: 50%;
                    z-index: 1000;
                    animation: explode ${Math.random() * 2 + 1}s ease-out forwards;
                `;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 3000);
            }, i * 50);
        }
        

        if (!document.querySelector('#explosion-keyframes')) {
            const style = document.createElement('style');
            style.id = 'explosion-keyframes';
            style.textContent = `
                @keyframes explode {
                    0% { 
                        opacity: 1; 
                        transform: translate(-50%, -50%) scale(0); 
                    }
                    50% { 
                        opacity: 1; 
                        transform: translate(${Math.random() * 400 - 200}px, ${Math.random() * 400 - 200}px) scale(1); 
                    }
                    100% { 
                        opacity: 0; 
                        transform: translate(${Math.random() * 600 - 300}px, ${Math.random() * 600 - 300}px) scale(0); 
                    }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// USO DEL DOM
document.addEventListener('DOMContentLoaded', () => {
    new CreativeLoginForm();
});