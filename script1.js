const services = [
    {
        id: 1,
        name: "Chequeo General",
        price: 15000,
        description: "Inspección completa del motor, frenos, suspensión, dirección, neumáticos y sistema eléctrico.",
        image: "https://d3po9jkuwb69jo.cloudfront.net/media/uploads/2021/10/30/chequeo-general-del-vehiculo.png?w=828&q=75"
    },
    {
        id: 2,
        name: "Cambio de Aceite",
        price: 35000,
        description: "Cambio de aceite y filtros: aceite, aire, combustible y habitáculo.",
        image: "https://www.morepamotor.es/wp-content/uploads/2024/01/cambio-aceite.jpg"
    },
    {
        id: 3,
        name: "Sistema de Frenos",
        price: 50000,
        description: "Revisión completa, reparación y reemplazo de pastillas, discos y líquido de frenos.",
        image: "https://cdn.hashnode.com/res/hashnode/image/upload/v1716861031307/a992c0ea-b315-472c-842b-b6ffda913704.jpeg?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp"
    },
    {
        id: 4,
        name: "Diagnóstico Electrónico",
        price: 20000,
        description: "Escaneo completo del sistema, diagnóstico de códigos de error y sensores.",
        image: "https://grupo-chung.com/wp-content/uploads/2019/01/dianostio.jpg"
    },
    {
        id: 5,
        name: "Sistema Eléctrico",
        price: 30000,
        description: "Revisión, mantenimiento y reemplazo de batería y componentes eléctricos.",
        image: "https://www.comercialcaravaning.com/wp-content/uploads/2017/07/jumper-cables-926308_1280.jpg"
    },
    {
        id: 6,
        name: "Aire Acondicionado",
        price: 45000,
        description: "Servicio completo de climatización: revisión, recarga de gas, limpieza y filtros.",
        image: "https://dcdn-us.mitiendanube.com/stores/965/300/products/cdn-3-expansion-mx1-cf48df0beb1870004216064182116365-1024-1024.webp"
    }
];

let appointments = [];
let slideIndex = 0;
let currentUser = null;

const elements = {
    bookingForm: document.getElementById('bookingForm'),
    serviceSelect: document.getElementById('service'),
    timeSelect: document.getElementById('time'),
    dateInput: document.getElementById('date'),
    servicesGrid: document.getElementById('servicesGrid'),
    appointmentsTableBody: document.getElementById('appointmentsTableBody'),
    menuToggle: document.querySelector('.menu-toggle'),
    navLinks: document.querySelector('.nav-links'),
    joinModal: document.getElementById('joinModal'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm')
};

class CarsServiceApp {
    // Agregar después del setupEventListeners en la clase CarsServiceApp

setupFormDependencies() {
    const serviceSelect = document.getElementById('service');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');

    // Deshabilitar fecha y hora hasta que se seleccione un servicio
    if (dateInput) dateInput.disabled = true;
    if (timeSelect) timeSelect.disabled = true;

    // Cuando se selecciona un servicio, habilitar la fecha
    serviceSelect?.addEventListener('change', (e) => {
        if (e.target.value) {
            dateInput.disabled = false;
            dateInput.focus();
        } else {
            dateInput.disabled = true;
            timeSelect.disabled = true;
            timeSelect.value = '';
        }
    });

    // Cuando se selecciona una fecha, habilitar la hora
    dateInput?.addEventListener('change', (e) => {
        if (e.target.value) {
            timeSelect.disabled = false;
            this.updateAvailableTimes();
        } else {
            timeSelect.disabled = true;
            timeSelect.value = '';
        }
    });
}

// En el método init(), agregar después de setupDatePicker():
// this.setupFormDependencies();
    constructor() {
        this.init();
    }

    init() {
        this.loadAppointments();
        this.setupEventListeners();
        this.loadServices();
        this.setupDatePicker();
        this.setupFormDependencies();
        this.setupCarousel();
        this.setupNavigation();
        this.setupModal();
        this.setupDarkMode();
        this.updateStats();
    }

    setupEventListeners() {
        elements.menuToggle?.addEventListener('click', () => {
            elements.navLinks.classList.toggle('active');
        });

        elements.navLinks?.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                elements.navLinks.classList.remove('active');
            }
        });

        elements.bookingForm?.addEventListener('submit', (e) => this.handleBookingSubmit(e));
        elements.servicesGrid?.addEventListener('click', (e) => this.handleServiceSelection(e));
        elements.dateInput?.addEventListener('change', () => this.updateAvailableTimes());
        document.getElementById('mercadoPagoBtn')?.addEventListener('click', () => {
            alert('Próximamente: Integración con Mercado Pago');
        });
    }

    loadServices() {
        if (elements.serviceSelect) {
            elements.serviceSelect.innerHTML = '<option value="">Seleccione un servicio</option>';
            services.forEach(service => {
                const option = document.createElement('option');
                option.value = service.id;
                option.textContent = `${service.name}`;
                elements.serviceSelect.appendChild(option);
            });
        }

        if (elements.servicesGrid) {
            elements.servicesGrid.innerHTML = '';
            services.forEach(service => {
                const card = this.createServiceCard(service);
                elements.servicesGrid.appendChild(card);
            });
        }
    }

    createServiceCard(service) {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.dataset.id = service.id;
        
        const whatsappMessage = `Hola! Me interesa el servicio de ${service.name}. Quisiera consultar la cotización.`;
        const whatsappLink = `https://wa.me/5493415598208?text=${encodeURIComponent(whatsappMessage)}`;
        
        card.innerHTML = `
            <img src="${service.image}" alt="${service.name}" loading="lazy">
            <div class="service-info">
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <div class="service-buttons">
                    <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" class="btn-consult">
                        <i class="fab fa-whatsapp"></i> Consultar Cotización
                    </a>
                </div>
            </div>
        `;
        
        return card;
    }

    setupDatePicker() {
        if (elements.dateInput) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            elements.dateInput.min = tomorrow.toISOString().split('T')[0];
        }
    }

    updateAvailableTimes() {
        if (!elements.timeSelect) return;
        elements.timeSelect.innerHTML = '<option value="">Seleccione una hora</option>';
        const hours = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
        hours.forEach(hour => {
            const option = document.createElement('option');
            option.value = hour;
            option.textContent = hour;
            elements.timeSelect.appendChild(option);
        });
    }

    handleServiceSelection(e) {
        const card = e.target.closest('.service-card');
        if (!card) return;
        document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        if (elements.serviceSelect) {
            elements.serviceSelect.value = card.dataset.id;
        }
        document.getElementById('solicita-tu-turno')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    handleBookingSubmit(e) {
        e.preventDefault();
        const formData = this.getFormData();
        if (!this.validateFormData(formData)) return;
        const appointment = this.createAppointment(formData);
        this.saveAppointment(appointment);
        this.resetForm();
        this.showSuccessMessage();
    }

    getFormData() {
        return {
            name: document.getElementById('name')?.value,
            email: document.getElementById('email')?.value,
            phone: document.getElementById('phone')?.value,
            date: elements.dateInput?.value,
            time: elements.timeSelect?.value,
            serviceId: elements.serviceSelect?.value,
            notes: document.getElementById('notes')?.value
        };
    }

    validateFormData(data) {
        const required = ['name', 'email', 'phone', 'date', 'time', 'serviceId'];
        const missing = required.filter(field => !data[field]);
        if (missing.length > 0) {
            alert('Por favor complete todos los campos obligatorios');
            return false;
        }
        if (!this.isValidEmail(data.email)) {
            alert('Por favor ingrese un email válido');
            return false;
        }
        return true;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    createAppointment(formData) {
        const service = services.find(s => s.id == formData.serviceId);
        return {
            id: Date.now(),
            ...formData,
            service: service.name,
            price: service.price,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
    }

    saveAppointment(appointment) {
        appointments.push(appointment);
        this.saveToStorage();
        this.loadAppointments();
        this.updateStats();
    }

    resetForm() {
        elements.bookingForm?.reset();
        document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
    }

    showSuccessMessage() {
        alert('¡Turno reservado exitosamente! Recibirá un email de confirmación.');
    }

    loadAppointments() {
        const stored = localStorage.getItem('appointments');
        appointments = stored ? JSON.parse(stored) : [];
        this.renderAppointments();
    }

    saveToStorage() {
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }

    renderAppointments() {
        if (!elements.appointmentsTableBody) return;
        elements.appointmentsTableBody.innerHTML = '';
        appointments.forEach(appointment => {
            const row = this.createAppointmentRow(appointment);
            elements.appointmentsTableBody.appendChild(row);
        });
    }

    createAppointmentRow(appointment) {
        const row = document.createElement('tr');
        const statusClass = appointment.status === 'confirmed' ? 'status-confirmed' : 'status-cancelled';
        row.innerHTML = `
            <td>${appointment.name}</td>
            <td>${appointment.service}</td>
            <td>${new Date(appointment.date).toLocaleDateString()}</td>
            <td>${appointment.time}</td>
            <td><span class="${statusClass}">${appointment.status}</span></td>
            <td>
                ${appointment.status === 'confirmed' ? 
                    `<button class="btn-danger" onclick="app.cancelAppointment(${appointment.id})">Cancelar</button>` : 
                    '--'}
            </td>
        `;
        return row;
    }

    cancelAppointment(id) {
        if (!confirm('¿Está seguro de cancelar esta cita?')) return;
        appointments = appointments.map(a => 
            a.id === id ? { ...a, status: 'cancelled' } : a
        );
        this.saveToStorage();
        this.renderAppointments();
        this.updateStats();
    }

    updateStats() {
        const total = appointments.length;
        const confirmed = appointments.filter(a => a.status === 'confirmed').length;
        const cancelled = total - confirmed;
        const revenue = appointments
            .filter(a => a.status === 'confirmed')
            .reduce((sum, a) => sum + (a.price || 0), 0);

        document.getElementById('totalAppointments').textContent = total;
        document.getElementById('confirmedAppointments').textContent = confirmed;
        document.getElementById('cancelledAppointments').textContent = cancelled;
        document.getElementById('revenue').textContent = `${revenue.toLocaleString()}`;
    }

    setupCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        if (slides.length === 0) return;
        slides[0].style.opacity = '1';
        setInterval(() => {
            slides[slideIndex].style.opacity = '0';
            slideIndex = (slideIndex + 1) % slides.length;
            slides[slideIndex].style.opacity = '1';
        }, 5000);
    }

    setupNavigation() {
        const sections = {
            '#servicios': document.getElementById('servicios'),
            '#solicita-tu-turno': document.getElementById('solicita-tu-turno'),
            '#sobre-nosotros': document.getElementById('sobre-nosotros'),
            '#appointmentsSection': document.getElementById('appointmentsSection')
        };

        sections['#sobre-nosotros'].style.display = 'none';
        sections['#appointmentsSection'].style.display = 'none';

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#') && targetId !== '#') {
                    e.preventDefault();
                    this.showSection(targetId, sections);
                }
            });
        });
    }

    showSection(targetId, sections) {
        Object.values(sections).forEach(section => {
            if (section) section.style.display = 'none';
        });
        if (sections[targetId]) {
            sections[targetId].style.display = 'block';
            if (targetId === '#solicita-tu-turno') {
                document.querySelector('.services-section').style.display = 'block';
            }
        }
        document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }

    setupModal() {
        const joinBtn = document.getElementById('joinBtn');
        const closeBtn = document.querySelector('.close-modal');
        const showRegisterBtn = document.getElementById('showRegisterBtn');

        joinBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.openLoginForm();
        });

        closeBtn?.addEventListener('click', () => this.closeModal());

        window.addEventListener('click', (e) => {
            if (e.target === elements.joinModal) this.closeModal();
        });

        showRegisterBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchToRegister();
        });

        elements.loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
        elements.registerForm?.addEventListener('submit', (e) => this.handleRegister(e));
    }

    openLoginForm() {
        elements.joinModal.style.display = 'flex';
        elements.loginForm?.classList.add('active');
        elements.registerForm?.classList.remove('active');
    }

    switchToRegister() {
        elements.loginForm?.classList.remove('active');
        elements.registerForm?.classList.add('active');
    }

    switchToLogin() {
        elements.registerForm?.classList.remove('active');
        elements.loginForm?.classList.add('active');
    }

    closeModal() {
        elements.joinModal.style.display = 'none';
        elements.loginForm?.classList.remove('active');
        elements.registerForm?.classList.remove('active');
        elements.loginForm?.reset();
        elements.registerForm?.reset();
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;

        if (email && password) {
            currentUser = { email, name: email.split('@')[0] };
            document.getElementById('appointmentsSection').style.display = 'block';
            this.closeModal();
            alert(`¡Bienvenido ${currentUser.name}!`);
        } else {
            alert('Complete todos los campos');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('joinName')?.value;
        const email = document.getElementById('joinEmail')?.value;
        const password = document.getElementById('joinPassword')?.value;

        if (name && email && password) {
            alert(`Cuenta creada exitosamente para ${name}`);
            elements.registerForm?.reset();
            this.switchToLogin();
            if (document.getElementById('loginEmail')) {
                document.getElementById('loginEmail').value = email;
            }
        } else {
            alert('Complete todos los campos de registro');
        }
    }

    setupDarkMode() {
        const toggle = document.getElementById('darkModeToggle');
        const body = document.body;

        if (localStorage.getItem('dark-mode') === 'enabled') {
            body.classList.add('dark-mode');
        }

        toggle?.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('dark-mode', isDark ? 'enabled' : 'disabled');
        });
    }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new CarsServiceApp();
});

document.getElementById('joinModal').style.display = 'none';

(function() {
    const container = document.getElementById('logo3d');
    if (!container) return;
    
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(20, 6, 0.2, 1000);
    camera.position.set(0, 0, 4);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 8.6);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 8.10);
    dir.position.set(6, 1, 25);
    scene.add(dir);

    let mesh;

    function resizeRenderer() {
        const width = container.clientWidth;
        const height = width * 0.75;
        renderer.setSize(width, height);
        container.style.height = `${height}px`;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', resizeRenderer);

    const loader = new THREE.TextureLoader();
    loader.load('imagenes/logo.png', (tex) => {
        tex.encoding = THREE.sRGBEncoding;
        const aspect = tex.image.height / tex.image.width;
        const geometry = new THREE.PlaneGeometry(2, 5 * aspect);
        const material = new THREE.MeshStandardMaterial({
            map: tex,
            transparent: true,
            alphaTest: 0.20,
            metalness: 0.10,
            roughness: 0.10
        });

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        resizeRenderer();

        function animate() {
            requestAnimationFrame(animate);
            mesh.rotation.y = Math.sin(Date.now() * 0.002) * 0.4;
            dir.intensity = 0.8 + Math.sin(Date.now() * 0.005) * 0.2;
            renderer.render(scene, camera);
        }
        animate();
    });
})();