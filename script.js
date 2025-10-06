// Add this function at the global level, before the DataManager class
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu if open
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }
}

// Add at the top of the file, before DataManager class
class AuthenticationManager {
    constructor() {
        this.currentUser = null;
        this.initializeAuth();
    }

    initializeAuth() {
        const savedSession = sessionStorage.getItem('beautyspa_session');
        if (savedSession) {
            this.currentUser = JSON.parse(savedSession);
            this.showContentBasedOnRole();
        } else {
            this.showLoginSection();
        }
    }

    login(username, password, role) {
        // Admin credentials
        if (role === 'admin' && username === 'admin' && password === 'BeautySPA2025') {
            const session = {
                username: username,
                role: role,
                loginTime: Date.now()
            };
            this.currentUser = session;
            sessionStorage.setItem('beautyspa_session', JSON.stringify(session));
            this.showContentBasedOnRole();
            return { success: true, message: 'Login exitoso' };
        }
        
        // User role - any credentials allowed
        if (role === 'user') {
            const session = {
                username: username,
                role: role,
                loginTime: Date.now()
            };
            this.currentUser = session;
            sessionStorage.setItem('beautyspa_session', JSON.stringify(session));
            this.showContentBasedOnRole();
            return { success: true, message: 'Login exitoso' };
        }
        
        return { success: false, message: 'Credenciales incorrectas' };
    }

    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('beautyspa_session');
        this.showLoginSection();
    }

    showLoginSection() {
        document.getElementById('login').style.display = 'block';
        document.getElementById('inicio').style.display = 'none';
        document.querySelector('.services').style.display = 'none';
        document.querySelector('.zones').style.display = 'none';
        document.querySelector('.products').style.display = 'none';
        document.querySelector('.booking').style.display = 'none';
        document.querySelector('.contact').style.display = 'none';
        document.querySelector('.footer').style.display = 'none';
        
        // Hide admin button
        document.querySelector('.admin-btn').style.display = 'none';
    }

    showContentBasedOnRole() {
        document.getElementById('login').style.display = 'none';
        document.getElementById('inicio').style.display = 'block';
        document.querySelector('.services').style.display = 'block';
        document.querySelector('.zones').style.display = 'block';
        document.querySelector('.products').style.display = 'block';
        document.querySelector('.booking').style.display = 'block';
        document.querySelector('.contact').style.display = 'block';
        document.querySelector('.footer').style.display = 'block';
        
        if (this.currentUser.role === 'admin') {
            // Show admin button
            document.querySelector('.admin-btn').style.display = 'block';
            this.enableAdminFeatures();
        } else {
            // Hide admin button
            document.querySelector('.admin-btn').style.display = 'none';
            this.disableAdminFeatures();
        }
        
        this.addSessionInfo();
    }

    enableAdminFeatures() {
        // Habilitar todas las funciones para administradores
        document.querySelectorAll('.service-card, .product-card, .zone-card li').forEach(element => {
            element.style.pointerEvents = 'auto';
            element.style.opacity = '1';
            element.onclick = null; // Remover cualquier restricción previa
        });
    }

    disableAdminFeatures() {
        // Los usuarios regulares pueden comprar productos y reservar citas
        // No se restringen las funciones de compra
        this.enableUserFeatures();
    }

    enableUserFeatures() {
        // Habilitar clic en servicios para reservar citas
        document.querySelectorAll('.service-card').forEach(element => {
            element.style.pointerEvents = 'auto';
            element.style.opacity = '1';
            element.onclick = null; // Remover el bloqueo de click
        });
        
        // Habilitar clic en productos para agregar al carrito
        document.querySelectorAll('.product-card').forEach(element => {
            element.style.pointerEvents = 'auto';
            element.style.opacity = '1';
            element.onclick = null; // Remover el bloqueo de click
        });
        
        // Habilitar clic en zonas para navegar
        document.querySelectorAll('.zone-card li').forEach(element => {
            element.style.pointerEvents = 'auto';
            element.style.opacity = '1';
            element.onclick = null; // Remover el bloqueo de click
        });
        
        // Asegurar que el carrito esté disponible
        const cartWidget = document.querySelector('.cart-widget');
        if (cartWidget) {
            cartWidget.style.display = 'block';
        }
    }

    addSessionInfo() {
        // Remove existing session info
        const existingInfo = document.querySelector('.session-info');
        if (existingInfo) existingInfo.remove();
        
        // Add session info
        const sessionInfo = document.createElement('div');
        sessionInfo.className = 'session-info';
        sessionInfo.innerHTML = `
            <strong>Usuario:</strong> ${this.currentUser.username} (${this.currentUser.role}) 
            <button class="logout-btn" onclick="authManager.logout()">Cerrar Sesión</button>
        `;
        document.body.appendChild(sessionInfo);
    }

    showAdminModal() {
        if (this.currentUser && this.currentUser.role === 'admin') {
            document.getElementById('adminModal').style.display = 'block';
        } else {
            alert('No tienes permisos de administrador');
        }
    }
}

// Initialize authentication manager
const authManager = new AuthenticationManager();

// Handle login form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            
            const result = authManager.login(username, password, role);
            
            if (result.success) {
                // Clear form fields after successful login
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
                document.getElementById('role').value = '';
                
                alert(result.message);
            } else {
                alert('Error: ' + result.message);
            }
        });
    }
});

// Update admin modal functions to use auth manager
window.showAdminModal = function() {
    authManager.showAdminModal();
};

// Update the original showAdminModal function
function showAdminModal() {
    authManager.showAdminModal();
}

// Add CSS for session feedback
const authStyle = document.createElement('style');
authStyle.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(authStyle);

// Update the original module click handlers to respect user role
let originalHandleModuleClick;

// Data Management
class DataManager {
    constructor() {
        this.data = this.loadData();
    }

    loadData() {
        const saved = localStorage.getItem('beautyspa_data');
        return saved ? JSON.parse(saved) : this.getDefaultData();
    }

    getDefaultData() {
        return {
            services: [
                { id: 1, name: 'Corte de Cabello', price: 5000, duration: '45 min', category: 'unisex' },
                { id: 2, name: 'Masaje Relajante', price: 15000, duration: '60 min', category: 'unisex' },
                { id: 3, name: 'Manicura', price: 8000, duration: '30 min', category: 'female' },
                { id: 4, name: 'Barba', price: 3000, duration: '30 min', category: 'male' }
            ],
            products: [
                { id: 1, name: 'Shampoo Premium', price: 12000, category: 'capilar', stock: 50 },
                { id: 2, name: 'Crema Hidratante', price: 8000, category: 'piel', stock: 30 }
            ],
            contact: {
                phone: '+240 222 123456',
                email: 'info@beautyspa.com',
                address: 'Malabo, Guinea Ecuatorial'
            },
            general: {
                currency: 'XAF',
                businessHours: 'Lunes a Sábado: 8:00 - 20:00'
            }
        };
    }

    saveData() {
        localStorage.setItem('beautyspa_data', JSON.stringify(this.data));
    }

    updateData(section, data) {
        this.data[section] = data;
        this.saveData();
    }

    getData(section) {
        return this.data[section] || null;
    }
}

// Cart Management System
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.updateCartUI();
    }

    loadCart() {
        const saved = localStorage.getItem('beautyspa_cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('beautyspa_cart', JSON.stringify(this.cart));
        this.updateCartUI();
    }

    addProduct(product) {
        const products = dataManager.getData('products');
        const productInStock = products.find(p => p.id === product.id);
        
        if (!productInStock || productInStock.stock <= 0) {
            const feedback = document.createElement('div');
            feedback.textContent = 'Producto sin stock disponible';
            feedback.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #dc3545;
                color: white;
                padding: 1rem 2rem;
                border-radius: 25px;
                z-index: 3000;
                animation: fadeInOut 2s ease;
            `;
            document.body.appendChild(feedback);
            setTimeout(() => feedback.remove(), 2000);
            return;
        }
        
        const existingItem = this.cart.find(item => item.id === product.id);
        const currentQuantity = existingItem ? existingItem.quantity : 0;
        const availableStock = productInStock.stock;
        
        if (currentQuantity >= availableStock) {
            const feedback = document.createElement('div');
            feedback.textContent = `Stock insuficiente. Solo hay ${availableStock} unidades disponibles`;
            feedback.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #ffc107;
                color: #212529;
                padding: 1rem 2rem;
                border-radius: 25px;
                z-index: 3000;
                animation: fadeInOut 2s ease;
            `;
            document.body.appendChild(feedback);
            setTimeout(() => feedback.remove(), 2000);
            return;
        }
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }
        this.saveCart();
    }

    removeProduct(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }
        if (cartTotal) {
            cartTotal.textContent = formatCurrency(this.getTotal());
        }
    }
}

// Initialize data manager
const dataManager = new DataManager();

// Initialize cart manager
const cartManager = new CartManager();

// UI Functions
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Load and display services
function loadServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    const services = dataManager.getData('services');
    
    servicesGrid.innerHTML = services.map(service => {
        const imageKey = `service_${service.id}_image`;
        const storedImage = localStorage.getItem(imageKey);
        const imageSrc = storedImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjBmMGYwIi8+CjxwYXRoIGQ9Ik0zNSA0MEw1MCA1NUw2NSA0MEg1MFYzNUg2NVY0MEw2MCA0NUw1NSAzNUg2NVY0MEw2MCA0NUw1MCA1NUwzNSA0MFoiIGZpbGw9IiNjY2MiLz4KPC9zdmc+';
        
        return `
            <div class="service-card" onclick="selectService(${service.id})" style="cursor: pointer; transition: all 0.3s ease;">
                <div class="service-icon" style="background-image: url('${imageSrc}'); background-size: cover; background-position: center; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 1rem; transition: transform 0.3s ease;"></div>
                <h3>${service.name}</h3>
                <p>Duración: ${service.duration}</p>
                <p class="service-price">${formatCurrency(service.price)}</p>
                <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--primary-color); font-weight: 500;">
                    💅 Haz clic para reservar este servicio
                </div>
            </div>
        `;
    }).join('');
}

// Load zones
function loadZones() {
    const maleServices = document.getElementById('maleServices');
    const femaleServices = document.getElementById('femaleServices');
    const services = dataManager.getData('services');
    
    const maleServicesList = services.filter(s => s.category === 'male' || s.category === 'unisex');
    const femaleServicesList = services.filter(s => s.category === 'female' || s.category === 'unisex');
    
    maleServices.innerHTML = maleServicesList.map(service => 
        `<li onclick="selectService(${service.id})" style="cursor: pointer; padding: 0.5rem; border-radius: 5px; transition: all 0.3s ease;">
            ${service.name} - ${formatCurrency(service.price)}
            <div style="font-size: 0.7rem; color: var(--primary-color); margin-top: 2px;">Click para reservar</div>
        </li>`
    ).join('');
    
    femaleServices.innerHTML = femaleServicesList.map(service => 
        `<li onclick="selectService(${service.id})" style="cursor: pointer; padding: 0.5rem; border-radius: 5px; transition: all 0.3s ease;">
            ${service.name} - ${formatCurrency(service.price)}
            <div style="font-size: 0.7rem; color: var(--primary-color); margin-top: 2px;">Click para reservar</div>
        </li>`
    ).join('');
}

// Load products
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const products = dataManager.getData('products');
    
    // Check if productsGrid exists before trying to access it
    if (!productsGrid) {
        return;
    }
    
    productsGrid.innerHTML = products.map(product => {
        const imageKey = `product_${product.id}_image`;
        const storedImage = localStorage.getItem(imageKey);
        const imageSrc = storedImage || `product-${product.id}.png`;
        const stockStatus = product.stock <= 10 ? 'low-stock' : product.stock <= 20 ? 'medium-stock' : 'high-stock';
        
        return `
            <div class="product-card ${stockStatus}" onclick="selectProduct(${product.id})" style="cursor: pointer; position: relative; overflow: hidden;">
                <div class="product-image" style="background-image: url('${imageSrc}'); background-size: cover; background-position: center; height: 200px;"></div>
                <div class="product-info">
                    <h4 class="product-name">${product.name}</h4>
                    <p class="product-price">${formatCurrency(product.price)}</p>
                    <p class="product-stock ${stockStatus}">
                        📦 Stock: ${product.stock} unidades disponibles
                    </p>
                    <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--primary-color); font-weight: 500;">
                        🛍️ Haz clic para agregar al carrito
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Check for stock alerts only if alertsContainer exists
    const alertsContainer = document.getElementById('stockAlerts');
    if (alertsContainer) {
        checkStockAlerts();
    }
}

// Load contact info
function loadContactInfo() {
    const contactInfo = document.getElementById('contactInfo');
    const contact = dataManager.getData('contact');
    
    contactInfo.innerHTML = `
        <div class="contact-item" style="cursor: pointer; transition: all 0.3s ease;" onclick="copyToClipboard('${contact.phone}')">
            <strong>Teléfono:</strong> ${contact.phone} 📞
            <div style="font-size: 0.8rem; color: var(--primary-color); margin-top: 2px;">Click para copiar</div>
        </div>
        <div class="contact-item" style="cursor: pointer; transition: all 0.3s ease;" onclick="copyToClipboard('${contact.email}')">
            <strong>Email:</strong> ${contact.email} ✉️
            <div style="font-size: 0.8rem; color: var(--primary-color); margin-top: 2px;">Click para copiar</div>
        </div>
        <div class="contact-item" style="cursor: pointer; transition: all 0.3s ease;" onclick="copyToClipboard('${contact.address}')">
            <strong>Dirección:</strong> ${contact.address} 📍
            <div style="font-size: 0.8rem; color: var(--primary-color); margin-top: 2px;">Click para copiar</div>
        </div>
        <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-light);">
            💡 Haz clic en cualquier contacto para copiarlo al portapapeles
        </div>
    `;
}

// Load booking services
function loadBookingServices() {
    const serviceSelect = document.getElementById('service');
    const services = dataManager.getData('services');
    
    serviceSelect.innerHTML = '<option value="">Selecciona un servicio</option>' +
        services.map(service => 
            `<option value="${service.id}">${service.name} - ${formatCurrency(service.price)}</option>`
        ).join('');
}

// Generate time slots
function generateTimeSlots() {
    const timeSelect = document.getElementById('time');
    const slots = [];
    
    for (let hour = 8; hour <= 19; hour++) {
        for (let minute of ['00', '30']) {
            if (hour === 19 && minute === '30') continue;
            const time = `${hour.toString().padStart(2, '0')}:${minute}`;
            slots.push(time);
        }
    }
    
    timeSelect.innerHTML = '<option value="">Selecciona una hora</option>' +
        slots.map(slot => `<option value="${slot}">${slot}</option>`).join('');
    
    // Add validation when date changes
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            validateDateAndTime(this.value);
        });
    }
    
    const timeInput = document.getElementById('time');
    if (timeInput) {
        timeInput.addEventListener('change', function() {
            const date = document.getElementById('date').value;
            validateDateAndTime(date);
        });
    }
}

// Format currency
function formatCurrency(amount) {
    const currency = dataManager.getData('general').currency;
    return new Intl.NumberFormat('es-GQ', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// Admin modal functions
function showAdminModal() {
    authManager.showAdminModal();
}

function closeAdminModal() {
    document.getElementById('adminModal').style.display = 'none';
}

function showConfigSection(section) {
    const configSection = document.getElementById('configSection');
    let content = '';
    
    switch(section) {
        case 'services':
            content = createServicesConfig();
            break;
        case 'products':
            content = createProductsConfig();
            break;
        case 'contact':
            content = createContactConfig();
            break;
        case 'general':
            content = createGeneralConfig();
            break;
        case 'appointments':
            content = createAppointmentsHistory();
            break;
        case 'sales':
            content = createSalesHistory();
            break;
    }
    
    configSection.innerHTML = content;
    
    // Add click-to-edit functionality
    setTimeout(() => {
        const inputs = configSection.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('click', function() {
                if (typeof this.select === 'function') {
                    this.select();
                } else if (this.tagName.toLowerCase() === 'input') {
                    this.focus();
                    this.setSelectionRange(0, this.value.length);
                }
            });
        });
    }, 100);
}

// Create configuration forms
function createServicesConfig() {
    const services = dataManager.getData('services');
    return `
        <h3>Gestionar Servicios</h3>
        <div style="margin-bottom: 1rem; font-size: 0.9rem; color: var(--text-light);">
            💡 Haz clic en "Seleccionar archivo" para subir una imagen de servicio
        </div>
        <div class="config-form">
            ${services.map(service => {
                const imageKey = `service_${service.id}_image`;
                const storedImage = localStorage.getItem(imageKey);
                const previewSrc = storedImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjBmMGYwIi8+CjxwYXRoIGQ9Ik0xMiAxMkwxNiAxNlYyMFYxNkgyMFYxNkwxNiAxMlYxMkEyIDIgMCAwIDEgMTYgMTZIMTJWMTJIMTZWMTJIMTJaIiBmaWxsPSIjY2NjIi8+Cjwvc3ZnPg==';
                
                return `
                    <div class="service-item">
                        <input type="text" value="${service.name}" placeholder="Nombre del servicio" data-field="name" data-id="${service.id}" title="Nombre del servicio">
                        <input type="number" value="${service.price}" placeholder="Precio" data-field="price" data-id="${service.id}" title="Precio en ${dataManager.getData('general').currency}">
                        <input type="text" value="${service.duration}" placeholder="Duración" data-field="duration" data-id="${service.id}" title="Duración del servicio">
                        <select data-field="category" data-id="${service.id}" title="Categoría del servicio">
                            <option value="unisex" ${service.category === 'unisex' ? 'selected' : ''}>Unisex</option>
                            <option value="male" ${service.category === 'male' ? 'selected' : ''}>Masculino</option>
                            <option value="female" ${service.category === 'female' ? 'selected' : ''}>Femenino</option>
                        </select>
                        <div class="image-preview-container">
                            <input type="file" accept="image/*" data-field="image" data-id="${service.id}" onchange="handleImageUpload(this, 'service', ${service.id})" title="Seleccionar imagen del servicio">
                            ${storedImage ? 
                                `<img src="${storedImage}" alt="${service.name}" class="image-preview">` : 
                                `<div class="image-preview-placeholder">📷</div>`
                            }
                            <div class="image-upload-feedback">Subiendo...</div>
                        </div>
                        <button onclick="deleteService(${service.id})" title="Eliminar servicio">🗑️</button>
                    </div>
                `;
            }).join('')}
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button onclick="addService()" style="flex: 1;">+ Agregar Servicio</button>
                <button onclick="saveServices()" style="flex: 1; background: var(--primary-color); color: white;">💾 Guardar Cambios</button>
            </div>
        </div>
    `;
}

function createProductsConfig() {
    const products = dataManager.getData('products');
    return `
        <h3>Gestionar Productos y Stock</h3>
        <div style="margin-bottom: 1rem; font-size: 0.9rem; color: var(--text-light);">
            🛍️ Haz clic en "Seleccionar archivo" para subir una imagen de producto
        </div>
        <div class="config-form">
            ${products.map(product => {
                const imageKey = `product_${product.id}_image`;
                const storedImage = localStorage.getItem(imageKey);
                const previewSrc = storedImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjBmMGYwIi8+CjxwYXRoIGQ9Ik0xMiAxMkwxNiAxNlYyMFYxNkgyMFYxNkwxNiAxMlYxMkEyIDIgMCAwIDEgMTYgMTZIMTJWMTJIMTZWMTJIMTJaIiBmaWxsPSIjY2NjIi8+Cjwvc3ZnPg==';
                const stockStatus = product.stock <= 10 ? 'low-stock' : product.stock <= 20 ? 'medium-stock' : 'high-stock';
                
                return `
                    <div class="product-item ${stockStatus}">
                        <input type="text" value="${product.name}" placeholder="Nombre del producto" data-field="name" data-id="${product.id}" title="Nombre del producto">
                        <input type="number" value="${product.price}" placeholder="Precio" data-field="price" data-id="${product.id}" title="Precio en ${dataManager.getData('general').currency}">
                        <input type="text" value="${product.category}" placeholder="Categoría" data-field="category" data-id="${product.id}" title="Categoría del producto">
                        <div class="stock-control">
                            <label>Stock:</label>
                            <div class="stock-input-group">
                                <input type="number" value="${product.stock}" data-field="stock" data-id="${product.id}" title="Stock disponible" min="0">
                                <button onclick="updateStock(${product.id}, -1)" class="stock-btn decrease" title="Reducir stock">-</button>
                                <button onclick="updateStock(${product.id}, 1)" class="stock-btn increase" title="Aumentar stock">+</button>
                            </div>
                            <span class="stock-indicator ${stockStatus}" title="${getStockMessage(product.stock)}">
                                ${product.stock}
                            </span>
                        </div>
                        <div class="image-preview-container">
                            <input type="file" accept="image/*" data-field="image" data-id="${product.id}" onchange="handleImageUpload(this, 'product', ${product.id})" title="Seleccionar imagen del producto">
                            ${storedImage ? 
                                `<img src="${storedImage}" alt="${product.name}" class="image-preview">` : 
                                `<div class="image-preview-placeholder">📷</div>`
                            }
                            <div class="image-upload-feedback">Subiendo...</div>
                        </div>
                        <button onclick="deleteProduct(${product.id})" title="Eliminar producto">🗑️</button>
                    </div>
                `;
            }).join('')}
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button onclick="addProduct()" style="flex: 1;">+ Agregar Producto</button>
                <button onclick="saveProducts()" style="flex: 1; background: var(--primary-color); color: white;">💾 Guardar Cambios</button>
            </div>
            <div class="stock-alerts" id="stockAlerts"></div>
        </div>
    `;
}

function createContactConfig() {
    const contact = dataManager.getData('contact');
    return `
        <h3>Configurar Contacto</h3>
        <div class="config-form">
            <input type="text" id="phone" value="${contact.phone}" placeholder="Teléfono">
            <input type="email" id="email" value="${contact.email}" placeholder="Email">
            <input type="text" id="address" value="${contact.address}" placeholder="Dirección">
            <button onclick="saveContact()">Guardar Contacto</button>
        </div>
    `;
}

function createGeneralConfig() {
    const general = dataManager.getData('general');
    const currentLogo = localStorage.getItem('business_logo') || '';
    
    return `
        <h3>Configuración General</h3>
        <div class="config-form">
            <label>Logotipo del Negocio</label>
            <input type="file" id="businessLogo" accept="image/*" onchange="handleLogoUpload(this)">
            <div style="margin: 1rem 0; text-align: center;">
                ${currentLogo ? 
                    `<img src="${currentLogo}" alt="Logo actual" style="max-width: 100px; max-height: 100px; border-radius: 50%; border: 2px solid var(--primary-color);">` : 
                    '<div style="width: 100px; height: 100px; background: var(--primary-color); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 2rem;">B</div>'
                }
            </div>
            <label>Moneda</label>
            <select id="currency">
                <option value="XAF" ${general.currency === 'XAF' ? 'selected' : ''}>Franco CFA (XAF)</option>
            </select>
            <label>Horario de Atención</label>
            <input type="text" id="businessHours" value="${general.businessHours}" placeholder="Horario de atención">
            <button onclick="saveGeneral()">Guardar Configuración</button>
        </div>
    `;
}

function createAppointmentsHistory() {
    return `
        <h3>Historial de Citas</h3>
        <div class="appointments-history">
            <div class="appointments-section">
                <h4>Citas No Confirmadas ⏳</h4>
                <div id="unconfirmedAppointments" class="appointments-list">
                    ${renderAppointmentsByStatus('unconfirmed')}
                </div>
            </div>
            <div class="appointments-section">
                <h4>Citas Confirmadas - A la espera 📋</h4>
                <div id="waitingAppointments" class="appointments-list">
                    ${renderAppointmentsByStatus('waiting')}
                </div>
            </div>
            <div class="appointments-section">
                <h4>Citas Ejecutadas ✅</h4>
                <div id="completedAppointments" class="appointments-list">
                    ${renderAppointmentsByStatus('completed')}
                </div>
            </div>
        </div>
        <style>
            .appointments-history { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
            .appointments-section { background: var(--bg-light); padding: 1.5rem; border-radius: 10px; }
            .appointments-list { max-height: 300px; overflow-y: auto; }
            .appointment-item { background: white; margin: 0.5rem 0; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
            .appointment-item:hover { transform: translateY(-2px); transition: var(--transition); }
            .btn-confirm { background: #28a745; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 15px; cursor: pointer; font-size: 0.8rem; margin-right: 0.3rem; }
            .btn-complete { background: #007bff; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 15px; cursor: pointer; font-size: 0.8rem; margin-right: 0.3rem; }
            .btn-pdf { background: #dc3545; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 15px; cursor: pointer; font-size: 0.8rem; margin-right: 0.3rem; }
            .btn-delete { background: #6c757d; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 15px; cursor: pointer; font-size: 0.8rem; }
            .btn-view { background: #17a2b8; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 15px; cursor: pointer; font-size: 0.8rem; margin-right: 0.3rem; }
        </style>
    `;
}

function renderAppointmentsByStatus(status) {
    const bookings = JSON.parse(localStorage.getItem('beautyspa_bookings') || '[]');
    const filtered = bookings.filter(b => b.status === status);
    
    if (filtered.length === 0) {
        const statusText = {
            'unconfirmed': 'sin confirmar',
            'waiting': 'confirmadas a la espera',
            'completed': 'ejecutadas'
        };
        return `<p style="text-align: center; color: var(--text-light); margin: 2rem 0;">No hay citas ${statusText[status]}</p>`;
    }
    
    return filtered.map(apt => {
        const buttons = [];
        
        if (status === 'unconfirmed') {
            buttons.push(`<button onclick="confirmAppointment(${apt.id}, event)" class="btn-confirm">Confirmar</button>`);
            buttons.push(`<button onclick="deleteAppointment(${apt.id}, event)" class="btn-delete">Eliminar</button>`);
        } else if (status === 'waiting') {
            buttons.push(`<button onclick="completeAppointment(${apt.id}, event)" class="btn-complete">Marcar como ejecutada</button>`);
            buttons.push(`<button onclick="deleteAppointment(${apt.id}, event)" class="btn-delete">Eliminar</button>`);
        } else if (status === 'completed') {
            buttons.push(`<button onclick="viewInvoice(${apt.id})" class="btn-view">Ver Factura</button>`);
            buttons.push(`<button onclick="printInvoice(${apt.id})" class="btn-pdf">Imprimir</button>`);
            buttons.push(`<button onclick="deleteAppointment(${apt.id}, event)" class="btn-delete">Eliminar</button>`);
        }
        
        return `
            <div class="appointment-item">
                <strong>${apt.name}</strong><br>
                📱 ${apt.phone}<br>
                💅 ${getServiceName(apt.service)}<br>
                📅 ${apt.date} ⏰ ${apt.time}<br>
                <small style="color: var(--text-light);">Reservado el: ${new Date(apt.id).toLocaleString()}</small><br>
                ${buttons.join('')}
            </div>
        `;
    }).join('');
}

function getServiceName(serviceId) {
    const services = dataManager.getData('services');
    const service = services.find(s => s.id == serviceId);
    return service ? service.name : 'Servicio no encontrado';
}

// Info modal functions
function showInfoModal() {
    const infoContent = document.getElementById('infoContent');
    infoContent.innerHTML = `
        <h3>Acerca de BeautySPA</h3>
        <p><strong>¿Para qué sirve?</strong></p>
        <p>BeautySPA es una aplicación web completa para la gestión de un centro de belleza y spa, permitiendo administrar servicios, productos, citas y configuraciones de manera intuitiva y profesional.</p>
        
        <h3>¿Cómo se utiliza?</h3>
        <ul>
            <li><strong>Clientes:</strong> Navega por los servicios, productos y reserva citas online. Puedes agregar productos al carrito y realizar compras.</li>
            <li><strong>Usuario Estándar:</strong> Solo tiene permisos de lectura, puede ver la información de todos los módulos pero no puede realizar cambios.</li>
            <li><strong>Administrador:</strong> Accede al panel de administración para configurar servicios, productos, contacto, generar facturas y gestionar citas y ventas.</li>
        </ul>
        
        <h3>Funcionalidades del Sistema</h3>
        <ul>
            <li><strong>Gestión de Citas:</strong> Sistema completo de reserva con validación de horarios según el horario establecido (Lunes a Sábado: 8:00 - 20:00).</li>
            <li><strong>Confirmación de Citas:</strong> Las citas nuevas quedan en estado "no confirmadas" hasta ser aprobadas por el administrador.</li>
            <li><strong>Restricción de Ejecución:</strong> Una cita solo puede marcarse como ejecutada después de haber pasado la fecha y hora programadas.</li>
            <li><strong>Carrito de Compras:</strong> Agrega productos al carrito, gestiona cantidades y realiza ventas con factura.</li>
            <li><strong>Historial de Ventas:</strong> Visualiza todas las ventas realizadas con facturas imprimibles.</li>
            <li><strong>Imágenes Personalizadas:</strong> Sube imágenes personalizadas para servicios y productos.</li>
            <li><strong>Logo del Negocio:</strong> Personaliza el logo de BeautySPA desde la configuración general.</li>
            <li><strong>Facturas PDF:</strong> Genera facturas en formato PDF para citas y ventas de productos.</li>
        </ul>
        
        <h3>Seguridad y Permisos</h3>
        <ul>
            <li><strong>Usuario Regular:</strong> Cualquier usuario/contraseña - Solo permisos de lectura y visualización.</li>
            <li><strong>Control de Acceso:</strong> El sistema verifica credenciales y roles antes de permitir acciones críticas.</li>
        </ul>
        
        <h3>Información del Desarrollador</h3>
        <p><strong>Nombre:</strong> Tarciano ENZEMA NCHAMA</p>
        <p><strong>Formación académica:</strong> Finalista universitario de la UNGE</p>
        <p><strong>Facultad:</strong> Ciencias económicas, gestión y administración</p>
        <p><strong>Departamento:</strong> Informática de gestión empresarial</p>
        <p><strong>Contacto:</strong> enzemajr@gmail.com</p>
        <p><strong>Prácticas externas:</strong> FÉNIX GE</p>
        <p><strong>Fecha de desarrollo:</strong> 25/09/2025</p>
    `;
    document.getElementById('infoModal').style.display = 'block';
}

function closeInfoModal() {
    document.getElementById('infoModal').style.display = 'none';
}

// Form handling
document.getElementById('bookingForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const booking = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        status: 'unconfirmed' // New bookings default to unconfirmed
    };
    
    // Validate business hours before saving
    if (!isWithinBusinessHours(booking.date, booking.time)) {
        alert('La hora seleccionada está fuera del horario de atención. El horario es: ' + dataManager.getData('general').businessHours);
        return;
    }
    
    // Save booking (in real app, this would go to a server)
    let bookings = JSON.parse(localStorage.getItem('beautyspa_bookings') || '[]');
    bookings.push({...booking, id: Date.now()});
    localStorage.setItem('beautyspa_bookings', JSON.stringify(bookings));
    
    alert('Cita reservada con éxito. Te contactaremos para confirmar.');
    e.target.reset();
});

// Add new function to confirm appointments
function confirmAppointment(appointmentId, event) {
    event.stopPropagation();
    
    const bookings = JSON.parse(localStorage.getItem('beautyspa_bookings') || '[]');
    const appointmentIndex = bookings.findIndex(b => b.id === appointmentId);
    
    if (appointmentIndex !== -1) {
        // Cambiar estado a 'waiting' (confirmada a la espera)
        bookings[appointmentIndex].status = 'waiting';
        bookings[appointmentIndex].confirmedAt = Date.now();
        localStorage.setItem('beautyspa_bookings', JSON.stringify(bookings));
        
        // Refresh the appointments view
        showConfigSection('appointments');
        
        // Show success message
        const feedback = document.createElement('div');
        feedback.textContent = '¡Cita confirmada! Ahora está en lista de espera para ejecución.';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #28a745;
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 3000;
            animation: fadeInOut 2s ease;
        `;
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    }
}

// Add new function to delete appointments
function deleteAppointment(appointmentId, event) {
    event.stopPropagation(); // Prevent event bubbling
    
    if (confirm('¿Estás seguro de eliminar esta cita?')) {
        const bookings = JSON.parse(localStorage.getItem('beautyspa_bookings') || '[]');
        const filtered = bookings.filter(b => b.id !== appointmentId);
        localStorage.setItem('beautyspa_bookings', JSON.stringify(filtered));
        
        // Refresh the appointments view
        showConfigSection('appointments');
        
        // Show success message
        const feedback = document.createElement('div');
        feedback.textContent = '¡Cita eliminada con éxito!';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #dc3545;
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 3000;
            animation: fadeInOut 2s ease;
        `;
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    }
}

// Add new function to complete appointments
function completeAppointment(appointmentId, event) {
    event.stopPropagation();
    
    const bookings = JSON.parse(localStorage.getItem('beautyspa_bookings') || '[]');
    const appointmentIndex = bookings.findIndex(b => b.id === appointmentId);
    
    if (appointmentIndex === -1) return;
    
    const appointment = bookings[appointmentIndex];
    
    // Verify that the appointment cannot be completed before the scheduled date and time
    const now = new Date();
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    
    if (now < appointmentDateTime) {
        alert('No se puede completar la cita antes de la fecha y hora programadas.\n\nFecha y hora de la cita: ' + 
              appointmentDateTime.toLocaleString() + '\nFecha y hora actual: ' + now.toLocaleString());
        return;
    }
    
    // Change status to 'completed' and generate invoice
    bookings[appointmentIndex].status = 'completed';
    bookings[appointmentIndex].completedAt = Date.now();
    bookings[appointmentIndex].invoiceNumber = `INV-${Date.now()}`;
    
    localStorage.setItem('beautyspa_bookings', JSON.stringify(bookings));
    
    // Generate PDF invoice
    generateInvoicePDF(appointmentId);
    
    showConfigSection('appointments');
    
    const feedback = document.createElement('div');
    feedback.textContent = '¡Cita marcada como ejecutada! Factura generada.';
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #007bff;
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        z-index: 3000;
        animation: fadeInOut 2s ease;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 2000);
}

function viewInvoice(appointmentId) {
    generateInvoicePDF(appointmentId, false); // Ver sin imprimir
}

function printInvoice(appointmentId) {
    generateInvoicePDF(appointmentId, true); // Ver con opción de imprimir
}

function generateInvoicePDF(appointmentId, enablePrint = false) {
    const bookings = JSON.parse(localStorage.getItem('beautyspa_bookings') || '[]');
    const appointment = bookings.find(b => b.id === appointmentId);
    
    if (!appointment) return;
    
    const serviceName = getServiceName(appointment.service);
    const servicePrice = getServicePrice(appointment.service);
    const contact = dataManager.getData('contact');
    const general = dataManager.getData('general');
    
    // Use stored logo or default
    const logoData = localStorage.getItem('business_logo') || '';
    
    // Crear el contenido de la factura optimizado para una sola hoja A4
    const invoiceContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Factura - ${appointment.invoiceNumber || 'INV-' + appointmentId}</title>
            <style>
                @page { 
                    margin: 1cm 0.5cm 0.5cm 0.5cm; 
                    size: A4; 
                }
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    margin: 0; 
                    padding: 10px; 
                    background: white;
                    color: #333;
                    line-height: 1.3;
                    font-size: 12px;
                }
                .invoice-header {
                    text-align: center;
                    margin-bottom: 15px;
                    border-bottom: 2px solid #d4af37;
                    padding-bottom: 10px;
                }
                .logo {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    margin: 0 auto 8px;
                    display: block;
                    object-fit: cover;
                    border: 2px solid #d4af37;
                }
                .company-name {
                    color: #d4af37;
                    font-size: 20px;
                    font-weight: bold;
                    margin: 0;
                }
                .company-subtitle {
                    color: #666;
                    font-size: 11px;
                    margin: 3px 0;
                }
                .invoice-title {
                    color: #2c1810;
                    font-size: 18px;
                    margin: 10px 0 5px 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .invoice-info {
                    background: #f8f9fa;
                    padding: 8px;
                    border-radius: 5px;
                    margin: 8px 0;
                    border-left: 3px solid #d4af37;
                    font-size: 10px;
                }
                .section {
                    margin: 12px 0;
                    background: white;
                    border-radius: 6px;
                    box-shadow: 0 1px 5px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .section-header {
                    background: linear-gradient(135deg, #d4af37, #f4e4bc);
                    color: white;
                    padding: 8px;
                    font-weight: bold;
                    font-size: 12px;
                }
                .section-content {
                    padding: 10px;
                }
                .service-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px;
                    border-bottom: 1px solid #eee;
                    background: linear-gradient(90deg, transparent, #f8f9fa);
                }
                .service-name {
                    font-weight: 600;
                    color: #2c1810;
                    font-size: 11px;
                }
                .service-price {
                    font-size: 14px;
                    font-weight: bold;
                    color: #d4af37;
                }
                .total-row {
                    background: linear-gradient(135deg, #2c1810, #4a3728);
                    color: white;
                    padding: 10px;
                    text-align: right;
                    border-radius: 0 0 5px 5px;
                }
                .total-amount {
                    font-size: 16px;
                    font-weight: bold;
                    color: #d4af37;
                }
                .footer {
                    text-align: center;
                    margin-top: 15px;
                    padding-top: 8px;
                    border-top: 1px solid #d4af37;
                    font-size: 9px;
                    color: #666;
                }
                .no-print {
                    position: fixed;
                    bottom: 15px;
                    right: 15px;
                    background: #d4af37;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 11px;
                    box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
                }
                @media print {
                    .no-print { display: none !important; }
                    body { padding: 5px; font-size: 11px; }
                    .section { box-shadow: none; border: 1px solid #ddd; }
                }
                p { margin: 4px 0; }
                strong { color: #2c1810; }
            </style>
        </head>
        <body>
            <div class="invoice-header">
                ${logoData ? `<img src="${logoData}" alt="BeautySPA" class="logo">` : '<div class="logo" style="background: #d4af37; display: flex; align-items: center; justify-content: center; color: white; font-size: 36px; font-weight: bold;">B</div>'}
                <h1 class="company-name">BeautySPA</h1>
                <p class="company-subtitle">Belleza & Bienestar</p>
                <h2 class="invoice-title">FACTURA</h2>
                <div class="invoice-info">
                    <strong>Factura:</strong> ${appointment.invoiceNumber || 'INV-' + appointmentId}<br>
                    <strong>Fecha:</strong> ${new Date(appointment.completedAt || Date.now()).toLocaleDateString()}<br>
                    <strong>Horario:</strong> ${general.businessHours}
                </div>
            </div>

            <div class="section">
                <div class="section-header">Datos del Cliente</div>
                <div class="section-content">
                    <p><strong>Cliente:</strong> ${appointment.name}</p>
                    <p><strong>Teléfono:</strong> ${appointment.phone}</p>
                    <p><strong>Fecha cita:</strong> ${appointment.date} <strong>Hora:</strong> ${appointment.time}</p>
                </div>
            </div>

            <div class="section">
                <div class="section-header">Servicio Prestado</div>
                <div class="service-row">
                    <div class="service-name">${serviceName}</div>
                    <div class="service-price">${formatCurrency(servicePrice)}</div>
                </div>
                <div class="total-row">
                    <div style="font-size: 12px; margin-bottom: 2px;">TOTAL A PAGAR</div>
                    <div class="total-amount">${formatCurrency(servicePrice)}</div>
                    <div style="font-size: 9px; margin-top: 2px; opacity: 0.8;">Moneda: ${general.currency}</div>
                </div>
            </div>

            <div class="footer">
                <p><strong>BeautySPA - Tu centro de belleza y bienestar</strong></p>
                <p>${contact.address} | Tel: ${contact.phone} | ${contact.email}</p>
                <p>Emitida el ${new Date().toLocaleString()} - Gracias por confiar en nosotros</p>
            </div>
            
            ${enablePrint ? '<button class="no-print" onclick="window.print()">📄 Imprimir</button>' : ''}
        </body>
        </html>
    `;
    
    // Abrir la factura en una nueva ventana
    const invoiceWindow = window.open('', '_blank', 'width=800,height=700');
    invoiceWindow.document.write(invoiceContent);
    invoiceWindow.document.close();
    
    if (!enablePrint) {
        invoiceWindow.focus();
    }
}

// Add new function to handle image uploads
function handleImageUpload(input, type, id) {
    const file = input.files[0];
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecciona un archivo de imagen válido');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen no puede pesar más de 5MB');
            return;
        }
        
        // Show loading state
        const container = input.closest('.service-item, .product-item');
        const previewContainer = container.querySelector('.image-preview-container');
        if (previewContainer) {
            previewContainer.classList.add('uploading');
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            // Store image in localStorage with a unique key
            const imageKey = `${type}_${id}_image`;
            localStorage.setItem(imageKey, e.target.result);
            
            // Update preview
            updateImagePreview(input, e.target.result);
            
            // Visual feedback
            input.style.backgroundColor = 'var(--primary-color)';
            input.style.color = 'white';
            setTimeout(() => {
                input.style.backgroundColor = '';
                input.style.color = '';
                if (previewContainer) {
                    previewContainer.classList.remove('uploading');
                }
            }, 1000);
            
            // Refresh the display
            setTimeout(() => {
                if (type === 'service') {
                    loadServices();
                } else if (type === 'product') {
                    loadProducts();
                }
            }, 500);
        };
        reader.readAsDataURL(file);
    }
}

// Update image preview
function updateImagePreview(input, imageData) {
    const container = input.parentElement;
    const preview = container.querySelector('.image-preview');
    const placeholder = container.querySelector('.image-preview-placeholder');
    
    if (imageData) {
        if (preview) {
            preview.src = imageData;
        } else if (placeholder) {
            const img = document.createElement('img');
            img.src = imageData;
            img.className = 'image-preview';
            placeholder.replaceWith(img);
        }
    }
}

// Add new function to handle logo upload
function handleLogoUpload(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            localStorage.setItem('business_logo', e.target.result);
            showConfigSection('general');
            updateLogoDisplay();
        };
        reader.readAsDataURL(file);
    }
}

// Add function to update logo display throughout the app
function updateLogoDisplay() {
    const logoData = localStorage.getItem('business_logo');
    const logoElements = document.querySelectorAll('.nav-brand h1, .company-logo');
    
    logoElements.forEach(element => {
        if (logoData) {
            element.style.backgroundImage = `url(${logoData})`;
            element.style.backgroundSize = 'contain';
            element.style.backgroundRepeat = 'no-repeat';
            element.style.backgroundPosition = 'center';
            element.textContent = '';
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Store original function reference
    originalHandleModuleClick = window.handleModuleClick;
    
    loadServices();
    loadZones();
    loadProducts();
    loadContactInfo();
    loadBookingServices();
    generateTimeSlots();
    
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.min = new Date().toISOString().split('T')[0];
    }
    
    // Fix admin menu button clicks
    setTimeout(() => {
        const adminMenuButtons = document.querySelectorAll('.admin-menu button');
        adminMenuButtons.forEach((button, index) => {
            button.onclick = function(e) {
                e.preventDefault();
                const sections = ['services', 'products', 'contact', 'general', 'appointments', 'sales'];
                showConfigSection(sections[index]);
            };
        });
    }, 500);
    
    // Ensure cart is visible for authenticated users
    if (authManager.currentUser) {
        const cartWidget = document.querySelector('.cart-widget');
        if (cartWidget) {
            cartWidget.style.display = 'block';
        }
    }
});

// Close modals when clicking outside
window.onclick = function(event) {
    const adminModal = document.getElementById('adminModal');
    const infoModal = document.getElementById('infoModal');
    
    if (event.target === adminModal) {
        adminModal.style.display = 'none';
    }
    if (event.target === infoModal) {
        infoModal.style.display = 'none';
    }
}

// Add CSS animation for feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);

// Add selection functionality
function selectService(serviceId) {
    const services = dataManager.getData('services');
    const service = services.find(s => s.id === serviceId);
    if (service) {
        // Auto-fill booking form
        document.getElementById('service').value = serviceId;
        
        // Smooth scroll to booking section with enhanced animation
        scrollToSection('citas');
        
        // Enhanced visual feedback
        const serviceCard = event.currentTarget;
        serviceCard.style.transform = 'scale(0.95)';
        serviceCard.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.5)';
        serviceCard.style.border = '3px solid var(--primary-color)';
        
        setTimeout(() => {
            serviceCard.style.transform = '';
            serviceCard.style.boxShadow = '';
            serviceCard.style.border = '';
        }, 1000);
        
        // Auto-focus on the date field for better UX
        setTimeout(() => {
            const dateInput = document.getElementById('date');
            if (dateInput) {
                dateInput.focus();
            }
        }, 800);
        
        // Validate current date/time if already selected
        const selectedDate = document.getElementById('date').value;
        if (selectedDate) {
            validateDateAndTime(selectedDate);
        }
    }
}

function selectProduct(productId) {
    const products = dataManager.getData('products');
    const product = products.find(p => p.id === productId);
    if (product) {
        // Add to cart with enhanced feedback
        cartManager.addProduct(product);
        
        // Enhanced visual feedback with ripple effect
        const productCard = event.currentTarget;
        
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(212, 175, 55, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${event.offsetX}px;
            top: ${event.offsetY}px;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
            z-index: 1000;
        `;
        
        productCard.style.position = 'relative';
        productCard.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => ripple.remove(), 600);
        
        // Scale animation
        productCard.style.transform = 'scale(0.95)';
        productCard.style.boxShadow = '0 0 25px rgba(212, 175, 55, 0.7)';
        
        setTimeout(() => {
            productCard.style.transform = '';
            productCard.style.boxShadow = '';
        }, 300);
        
        // Auto-open cart with enhanced animation
        setTimeout(() => {
            toggleCart();
            
            // Highlight cart button
            const cartButton = document.querySelector('.cart-button');
            if (cartButton) {
                cartButton.style.animation = 'pulse 0.5s ease-in-out';
                setTimeout(() => {
                    cartButton.style.animation = '';
                }, 500);
            }
        }, 500);
    }
}

// Product detail modal
function showProductModal(product) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h3>${product.name}</h3>
            <img src="product-${product.id}.png" alt="${product.name}" style="width: 100%; max-width: 300px; margin: 1rem auto; display: block;">
            <p><strong>Precio:</strong> ${formatCurrency(product.price)}</p>
            <p><strong>Categoría:</strong> ${product.category}</p>
            <button class="cta-button" onclick="this.parentElement.parentElement.remove(); scrollToSection('citas'); document.getElementById('service').value='';" style="margin-top: 1rem;">
                Reservar cita
            </button>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close on outside click
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    };
}

function selectServiceFromZone(serviceId) {
    const eventTarget = event.currentTarget;
    selectService(serviceId);
    // Visual feedback
    eventTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.3)';
    setTimeout(() => {
        eventTarget.style.backgroundColor = '';
    }, 1000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show feedback
        const feedback = document.createElement('div');
        feedback.textContent = '¡Copiado al portapapeles!';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--primary-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 3000;
            animation: fadeInOut 2s ease;
        `;
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    });
}

// Reemplazar la función handleModuleClick con esta versión corregida:
function handleModuleClick(moduleType, moduleId = null) {
    // Prevent infinite recursion with a flag
    if (window.handlingModuleClick) return;
    window.handlingModuleClick = true;
    
    try {
        // Check authentication
        if (!authManager.currentUser) {
            alert('Por favor, inicia sesión primero');
            return;
        }
        
        // Admin user - full permissions
        if (authManager.currentUser.role === 'admin') {
            if (moduleType === 'service' && moduleId) {
                selectService(moduleId);
            } else if (moduleType === 'zone') {
                // Navigate to zones section
                scrollToSection('zonas');
            } else if (moduleType === 'booking') {
                scrollToSection('citas');
            } else if (['home', 'services', 'products', 'contact'].includes(moduleType)) {
                const sectionMap = {
                    'home': 'inicio',
                    'services': 'servicios', 
                    'products': 'productos',
                    'contact': 'contacto'
                };
                const targetSection = sectionMap[moduleType];
                if (targetSection && typeof scrollToSection === 'function') {
                    scrollToSection(targetSection);
                }
            }
        } else {
            // Regular user - allow purchases and bookings
            if (moduleType === 'service' && moduleId) {
                // Allow booking appointments
                selectService(moduleId);
            } else if (moduleType === 'product') {
                // Allow adding products to cart
                // This is already handled by the onclick of products
            } else if (moduleType === 'zone') {
                // Allow navigation between zones
                scrollToSection('zonas');
            } else if (moduleType === 'booking') {
                // Allow access to booking form
                scrollToSection('citas');
            } else if (['home', 'services', 'products', 'contact'].includes(moduleType)) {
                // Normal navigation between sections
                const sectionMap = {
                    'home': 'inicio',
                    'services': 'servicios',
                    'products': 'productos', 
                    'contact': 'contacto'
                };
                const targetSection = sectionMap[moduleType];
                if (targetSection && typeof scrollToSection === 'function') {
                    scrollToSection(targetSection);
                }
            }
        }
        
    } finally {
        // Clear the flag
        window.handlingModuleClick = false;
    }
}

// Define missing functions
function saveServices() {
    const serviceItems = document.querySelectorAll('.service-item');
    const services = [];
    
    serviceItems.forEach(item => {
        const id = parseInt(item.querySelector('[data-field="name"]').dataset.id);
        const name = item.querySelector('[data-field="name"]').value;
        const price = parseInt(item.querySelector('[data-field="price"]').value);
        const duration = item.querySelector('[data-field="duration"]').value;
        const category = item.querySelector('[data-field="category"]').value;
        
        services.push({ id, name, price, duration, category });
    });
    
    dataManager.updateData('services', services);
    alert('Servicios guardados con éxito');
}

function saveProducts() {
    const productItems = document.querySelectorAll('.product-item');
    const products = [];
    
    productItems.forEach(item => {
        const id = parseInt(item.querySelector('[data-field="name"]').dataset.id);
        const name = item.querySelector('[data-field="name"]').value;
        const price = parseInt(item.querySelector('[data-field="price"]').value);
        const category = item.querySelector('[data-field="category"]').value;
        const stock = parseInt(item.querySelector('[data-field="stock"]').value) || 0;
        
        products.push({ id, name, price, category, stock });
    });
    
    dataManager.updateData('products', products);
    alert('Productos y stock guardados con éxito');
    checkStockAlerts();
}

function saveContact() {
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    
    dataManager.updateData('contact', { phone, email, address });
    alert('Información de contacto guardada');
}

function saveGeneral() {
    const currency = document.getElementById('currency').value;
    const businessHours = document.getElementById('businessHours').value;
    
    dataManager.updateData('general', { currency, businessHours });
    alert('Configuración general guardada');
}

function addService() {
    const services = dataManager.getData('services');
    const newService = {
        id: Date.now(),
        name: 'Nuevo Servicio',
        price: 0,
        duration: '30 min',
        category: 'unisex'
    };
    services.push(newService);
    dataManager.updateData('services', services);
    showConfigSection('services');
}

function addProduct() {
    const products = dataManager.getData('products');
    const newProduct = {
        id: Date.now(),
        name: 'Nuevo Producto',
        price: 0,
        category: 'general',
        stock: 0
    };
    products.push(newProduct);
    dataManager.updateData('products', products);
    showConfigSection('products');
}

function deleteService(id) {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
        const services = dataManager.getData('services');
        const filtered = services.filter(s => s.id !== id);
        dataManager.updateData('services', filtered);
        showConfigSection('services');
    }
}

function deleteProduct(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        const products = dataManager.getData('products');
        const filtered = products.filter(p => p.id !== id);
        dataManager.updateData('products', filtered);
        showConfigSection('products');
    }
}

function getServicePrice(serviceId) {
    const services = dataManager.getData('services');
    const service = services.find(s => s.id == serviceId);
    return service ? service.price : 0;
}

// Toggle cart modal
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'block';
    renderCart();
}

function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

// Render cart content
function renderCart() {
    const cartContent = document.getElementById('cartContent');
    const checkoutSection = document.getElementById('checkoutSection');
    
    if (cartManager.cart.length === 0) {
        cartContent.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                <p style="font-size: 3rem; margin-bottom: 1rem;">🛒</p>
                <p>Tu carrito está vacío</p>
                <button onclick="closeCartModal()" class="cta-button" style="margin-top: 1rem;">
                    Seguir comprando
                </button>
            </div>
        `;
        checkoutSection.style.display = 'none';
        return;
    }
    
    cartContent.innerHTML = `
        <div class="cart-items">
            ${cartManager.cart.map(item => {
                const imageKey = `product_${item.id}_image`;
                const storedImage = localStorage.getItem(imageKey);
                const imageSrc = storedImage || `product-${item.id}.png`;
                
                return `
                    <div class="cart-item">
                        <img src="${imageSrc}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>${item.category}</p>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1}); renderCart();">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1}); renderCart();">+</button>
                        </div>
                        <div class="cart-item-price">${formatCurrency(item.price * item.quantity)}</div>
                        <button class="remove-item-btn" onclick="cartManager.removeProduct(${item.id}); renderCart();">
                            🗑️
                        </button>
                    </div>
                `;
            }).join('')}
        </div>
        <div class="cart-total">
            Total: ${formatCurrency(cartManager.getTotal())}
        </div>
    `;
    
    checkoutSection.style.display = 'block';
    checkoutSection.innerHTML = createCheckoutForm();
}

// Create checkout form
function createCheckoutForm() {
    return `
        <div class="checkout-form">
            <h3>💳 Finalizar Compra</h3>
            <form id="checkoutForm" onsubmit="processSale(event)">
                <div style="display: grid; gap: 1rem;">
                    <input type="text" id="customerName" placeholder="Nombre completo" required>
                    <input type="tel" id="customerPhone" placeholder="Teléfono" required>
                    <input type="email" id="customerEmail" placeholder="Email (opcional)">
                    <select id="paymentMethod" required onchange="updatePaymentFields()">
                        <option value="">Método de pago</option>
                        <option value="cash">💵 Efectivo</option>
                        <option value="card">💳 Tarjeta</option>
                        <option value="transfer">🏦 Transferencia</option>
                    </select>
                    
                    <!-- Card Payment Fields -->
                    <div id="cardFields" style="display: none; gap: 1rem;">
                        <input type="text" id="cardNumber" placeholder="Número de tarjeta (16 dígitos)" maxlength="19">
                        <input type="text" id="cardHolder" placeholder="Nombre del titular">
                        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem;">
                            <input type="text" id="expiryDate" placeholder="MM/AA" maxlength="5">
                            <input type="text" id="cvv" placeholder="CVV" maxlength="4">
                        </div>
                        <select id="cardType">
                            <option value="">Tipo de tarjeta</option>
                            <option value="visa">Visa</option>
                            <option value="mastercard">Mastercard</option>
                            <option value="amex">American Express</option>
                        </select>
                    </div>
                    
                    <!-- Transfer Payment Fields -->
                    <div id="transferFields" style="display: none; gap: 1rem;">
                        <input type="text" id="bankName" placeholder="Nombre del banco">
                        <input type="text" id="accountNumber" placeholder="Número de cuenta">
                        <input type="text" id="accountHolder" placeholder="Nombre del titular">
                        <input type="text" id="transferReference" placeholder="Referencia de transferencia">
                        <input type="date" id="transferDate" placeholder="Fecha de transferencia">
                        <input type="number" id="transferAmount" placeholder="Monto transferido" step="0.01">
                    </div>
                    
                    <textarea id="notes" placeholder="Notas adicionales (opcional)" rows="2"></textarea>
                </div>
                <button type="submit" class="submit-btn" style="margin-top: 1rem;">
                    Procesar Pago
                </button>
            </form>
        </div>
    `;
}

function updatePaymentFields() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const cardFields = document.getElementById('cardFields');
    const transferFields = document.getElementById('transferFields');
    
    // Hide all payment-specific fields
    cardFields.style.display = 'none';
    transferFields.style.display = 'none';
    
    // Show relevant fields based on payment method
    if (paymentMethod === 'card') {
        cardFields.style.display = 'grid';
    } else if (paymentMethod === 'transfer') {
        transferFields.style.display = 'grid';
    }
}

// Add new function to save sale to history
function saveSaleToHistory(saleData) {
    let salesHistory = JSON.parse(localStorage.getItem('beautyspa_sales_history') || '[]');
    salesHistory.unshift(saleData); // Add to beginning
    localStorage.setItem('beautyspa_sales_history', JSON.stringify(salesHistory));
}

// Fix the processSale function - add proper validation for payment method
function processSale(event) {
    event.preventDefault();
    
    if (cartManager.cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    // Get payment method with proper validation
    const paymentMethodSelect = document.getElementById('paymentMethod');
    if (!paymentMethodSelect) {
        alert('Error: método de pago no encontrado');
        return;
    }
    
    const paymentMethod = paymentMethodSelect.value;
    if (!paymentMethod) {
        alert('Por favor, selecciona un método de pago');
        return;
    }
    
    // Validate payment method specific fields
    if (paymentMethod === 'card') {
        if (!validateCardPayment()) {
            return;
        }
    } else if (paymentMethod === 'transfer') {
        if (!validateTransferPayment()) {
            return;
        }
    }
    
    // Validate stock before processing sale
    const products = dataManager.getData('products');
    let canProcess = true;
    let outOfStockItems = [];
    
    for (const cartItem of cartManager.cart) {
        const product = products.find(p => p.id === cartItem.id);
        if (!product || product.stock < cartItem.quantity) {
            canProcess = false;
            outOfStockItems.push(product ? product.name : 'Producto no encontrado');
        }
    }
    
    if (!canProcess) {
        alert('Los siguientes productos no tienen stock suficiente: ' + outOfStockItems.join(', '));
        return;
    }
    
    // Reduce stock for each product
    for (const cartItem of cartManager.cart) {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            product.stock -= cartItem.quantity;
        }
    }
    
    // Save updated products data
    dataManager.updateData('products', products);
    
    const saleData = {
        customerName: document.getElementById('customerName').value,
        customerPhone: document.getElementById('customerPhone').value,
        customerEmail: document.getElementById('customerEmail').value,
        paymentMethod: paymentMethod,
        paymentDetails: getPaymentDetails(paymentMethod),
        notes: document.getElementById('notes').value,
        items: [...cartManager.cart],
        total: cartManager.getTotal(),
        date: new Date().toISOString(),
        invoiceNumber: `VENTA-${Date.now()}`,
        status: 'completed'
    };
    
    // Save sale to history
    saveSaleToHistory(saleData);
    
    // Generate PDF invoice
    generateSalesInvoice(saleData);
    
    // Clear cart
    cartManager.clearCart();
    
    // Close cart modal
    closeCartModal();
    
    // Show success message
    const feedback = document.createElement('div');
    feedback.textContent = '¡Venta realizada con éxito! Stock actualizado y factura generada.';
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #28a745;
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        z-index: 3000;
        animation: fadeInOut 3s ease;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 3000);
    
    // Check for stock alerts after sale
    checkStockAlerts();
}

function validateCardPayment() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardHolder = document.getElementById('cardHolder').value.trim();
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const cardType = document.getElementById('cardType').value;
    
    // Validate card number (16 digits)
    if (!/^\d{16}$/.test(cardNumber)) {
        alert('El número de tarjeta debe tener 16 dígitos');
        return false;
    }
    
    // Validate card holder name
    if (cardHolder.length < 3) {
        alert('El nombre del titular debe tener al menos 3 caracteres');
        return false;
    }
    
    // Validate expiry date (MM/YY format)
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        alert('La fecha de expiración debe estar en formato MM/AA');
        return false;
    }
    
    // Check if card is expired
    const [month, year] = expiryDate.split('/');
    const expiry = new Date(`20${year}`, month - 1);
    const now = new Date();
    if (expiry < now) {
        alert('La tarjeta está vencida');
        return false;
    }
    
    // Validate CVV (3-4 digits)
    if (!/^\d{3,4}$/.test(cvv)) {
        alert('El CVV debe tener 3 o 4 dígitos');
        return false;
    }
    
    // Validate card type
    if (!cardType) {
        alert('Por favor, selecciona el tipo de tarjeta');
        return false;
    }
    
    return true;
}

function validateTransferPayment() {
    const bankName = document.getElementById('bankName').value.trim();
    const accountNumber = document.getElementById('accountNumber').value.trim();
    const accountHolder = document.getElementById('accountHolder').value.trim();
    const transferReference = document.getElementById('transferReference').value.trim();
    const transferDate = document.getElementById('transferDate').value;
    const transferAmount = parseFloat(document.getElementById('transferAmount').value);
    
    // Validate bank name
    if (bankName.length < 3) {
        alert('El nombre del banco debe tener al menos 3 caracteres');
        return false;
    }
    
    // Validate account number (minimum 8 digits)
    if (!/^\d{8,}$/.test(accountNumber)) {
        alert('El número de cuenta debe tener al menos 8 dígitos');
        return false;
    }
    
    // Validate account holder
    if (accountHolder.length < 3) {
        alert('El nombre del titular debe tener al menos 3 caracteres');
        return false;
    }
    
    // Validate transfer reference
    if (transferReference.length < 5) {
        alert('La referencia de transferencia debe tener al menos 5 caracteres');
        return false;
    }
    
    // Validate transfer date
    if (!transferDate) {
        alert('Por favor, selecciona la fecha de transferencia');
        return false;
    }
    
    // Validate transfer amount
    const expectedAmount = cartManager.getTotal();
    if (Math.abs(transferAmount - expectedAmount) > 0.01) {
        alert(`El monto transferido (${formatCurrency(transferAmount)}) debe ser igual al total de la compra (${formatCurrency(expectedAmount)})`);
        return false;
    }
    
    return true;
}

function getPaymentDetails(paymentMethod) {
    if (paymentMethod === 'card') {
        return {
            cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
            cardHolder: document.getElementById('cardHolder').value,
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value,
            cardType: document.getElementById('cardType').value
        };
    } else if (paymentMethod === 'transfer') {
        return {
            bankName: document.getElementById('bankName').value,
            accountNumber: document.getElementById('accountNumber').value,
            accountHolder: document.getElementById('accountHolder').value,
            transferReference: document.getElementById('transferReference').value,
            transferDate: document.getElementById('transferDate').value,
            transferAmount: parseFloat(document.getElementById('transferAmount').value)
        };
    }
    return null;
}

// Enhanced sales invoice generation
function generateSalesInvoice(saleData, enablePrint = false) {
    const contact = dataManager.getData('contact');
    const general = dataManager.getData('general');
    const logoData = localStorage.getItem('business_logo') || '';
    
    let paymentInfo = '';
    if (saleData.paymentMethod === 'card') {
        paymentInfo = `
            <div style="background: #e3f2fd; padding: 10px; border-radius: 5px; margin: 10px 0;">
                <strong>Pago con Tarjeta:</strong><br>
                Tipo: ${saleData.paymentDetails.cardType.toUpperCase()}<br>
                Titular: ${saleData.paymentDetails.cardHolder}<br>
                Últimos 4 dígitos: ****${saleData.paymentDetails.cardNumber.slice(-4)}<br>
                Estado: Aprobado ✓
            </div>
        `;
    } else if (saleData.paymentMethod === 'transfer') {
        paymentInfo = `
            <div style="background: #e8f5e8; padding: 10px; border-radius: 5px; margin: 10px 0;">
                <strong>Pago por Transferencia:</strong><br>
                Banco: ${saleData.paymentDetails.bankName}<br>
                Cuenta: ****${saleData.paymentDetails.accountNumber.slice(-4)}<br>
                Referencia: ${saleData.paymentDetails.transferReference}<br>
                Fecha: ${new Date(saleData.paymentDetails.transferDate).toLocaleDateString()}<br>
                Estado: Verificado ✓
            </div>
        `;
    } else if (saleData.paymentMethod === 'cash') {
        paymentInfo = `
            <div style="background: #fff3e0; padding: 10px; border-radius: 5px; margin: 10px 0;">
                <strong>Pago en Efectivo:</strong><br>
                Monto: ${formatCurrency(saleData.total)}<br>
                Estado: Recibido ✓
            </div>
        `;
    }
    
    const invoiceContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Factura de Venta - ${saleData.invoiceNumber}</title>
            <style>
                @page { 
                    margin: 1cm 0.5cm 0.5cm 0.5cm; 
                    size: A4; 
                }
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    margin: 0; 
                    padding: 10px; 
                    background: white;
                    color: #333;
                    line-height: 1.3;
                    font-size: 12px;
                }
                .invoice-header {
                    text-align: center;
                    margin-bottom: 15px;
                    border-bottom: 2px solid #d4af37;
                    padding-bottom: 10px;
                }
                .logo {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    margin: 0 auto 8px;
                    display: block;
                    object-fit: cover;
                    border: 2px solid #d4af37;
                }
                .company-name {
                    color: #d4af37;
                    font-size: 20px;
                    font-weight: bold;
                    margin: 0;
                }
                .invoice-title {
                    color: #2c1810;
                    font-size: 18px;
                    margin: 10px 0 5px 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .invoice-info {
                    background: #f8f9fa;
                    padding: 8px;
                    border-radius: 5px;
                    margin: 8px 0;
                    border-left: 3px solid #d4af37;
                    font-size: 10px;
                }
                .section {
                    margin: 12px 0;
                    background: white;
                    border-radius: 6px;
                    box-shadow: 0 1px 5px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .section-header {
                    background: linear-gradient(135deg, #d4af37, #f4e4bc);
                    color: white;
                    padding: 8px;
                    font-weight: bold;
                    font-size: 12px;
                }
                .section-content {
                    padding: 10px;
                }
                .product-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px;
                    border-bottom: 1px solid #eee;
                    background: linear-gradient(90deg, transparent, #f8f9fa);
                }
                .product-name {
                    font-weight: 600;
                    color: #2c1810;
                    font-size: 11px;
                }
                .product-quantity {
                    color: #666;
                    font-size: 10px;
                }
                .product-price {
                    font-size: 14px;
                    font-weight: bold;
                    color: #d4af37;
                }
                .total-row {
                    background: linear-gradient(135deg, #2c1810, #4a3728);
                    color: white;
                    padding: 10px;
                    text-align: right;
                    border-radius: 0 0 5px 5px;
                }
                .total-amount {
                    font-size: 16px;
                    font-weight: bold;
                    color: #d4af37;
                }
                .footer {
                    text-align: center;
                    margin-top: 15px;
                    padding-top: 8px;
                    border-top: 1px solid #d4af37;
                    font-size: 9px;
                    color: #666;
                }
                .no-print {
                    position: fixed;
                    bottom: 15px;
                    right: 15px;
                    background: #d4af37;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 11px;
                    box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
                }
                @media print {
                    .no-print { display: none !important; }
                    body { padding: 5px; font-size: 11px; }
                    .section { box-shadow: none; border: 1px solid #ddd; }
                }
                p { margin: 4px 0; }
                strong { color: #2c1810; }
            </style>
        </head>
        <body>
            <div class="invoice-header">
                ${logoData ? `<img src="${logoData}" alt="BeautySPA" class="logo">` : '<div class="logo" style="background: #d4af37; display: flex; align-items: center; justify-content: center; color: white; font-size: 36px; font-weight: bold;">B</div>'}
                <h1 class="company-name">BeautySPA</h1>
                <p class="company-subtitle">Belleza & Bienestar</p>
                <h2 class="invoice-title">FACTURA DE VENTA</h2>
                <div class="invoice-info">
                    <strong>Factura:</strong> ${saleData.invoiceNumber}<br>
                    <strong>Fecha:</strong> ${new Date(saleData.date).toLocaleDateString()}<br>
                    <strong>Cliente:</strong> ${saleData.customerName}
                </div>
            </div>

            <div class="section">
                <div class="section-header">Productos Vendidos</div>
                <div class="section-content">
                    ${saleData.items.map(item => `
                        <div class="product-row">
                            <div>
                                <div class="product-name">${item.name}</div>
                                <div class="product-quantity">Cantidad: ${item.quantity}</div>
                            </div>
                            <div class="product-price">${formatCurrency(item.price * item.quantity)}</div>
                        </div>
                    `).join('')}
                    <div class="total-row">
                        <div style="font-size: 12px; margin-bottom: 2px;">TOTAL A PAGAR</div>
                        <div class="total-amount">${formatCurrency(saleData.total)}</div>
                        <div style="font-size: 9px; margin-top: 2px; opacity: 0.8;">Método: ${saleData.paymentMethod.toUpperCase()}</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-header">Información del Cliente</div>
                <div class="section-content">
                    <p><strong>Nombre:</strong> ${saleData.customerName}</p>
                    <p><strong>Teléfono:</strong> ${saleData.customerPhone}</p>
                    ${saleData.customerEmail ? `<p><strong>Email:</strong> ${saleData.customerEmail}</p>` : ''}
                    ${saleData.notes ? `<p><strong>Notas:</strong> ${saleData.notes}</p>` : ''}
                </div>
            </div>

            <div class="section">
                <div class="section-header">Detalles del Pago</div>
                <div class="section-content">
                    ${paymentInfo}
                </div>
            </div>

            <div class="footer">
                <p><strong>BeautySPA - Tu centro de belleza y bienestar</strong></p>
                <p>${contact.address} | Tel: ${contact.phone} | ${contact.email}</p>
                <p>Emitida el ${new Date().toLocaleString()} - Gracias por tu compra</p>
            </div>
            
            ${enablePrint ? '<button class="no-print" onclick="window.print()">📄 Imprimir</button>' : ''}
        </body>
        </html>
    `;
    
    const invoiceWindow = window.open('', '_blank', 'width=800,height=700');
    invoiceWindow.document.write(invoiceContent);
    invoiceWindow.document.close();
}

// Add new function to save sale to history
function saveSaleToHistory(saleData) {
    let salesHistory = JSON.parse(localStorage.getItem('beautyspa_sales_history') || '[]');
    salesHistory.unshift(saleData); // Add to beginning
    localStorage.setItem('beautyspa_sales_history', JSON.stringify(salesHistory));
}

// Add sales history to admin menu
function createSalesHistory() {
    const salesHistory = JSON.parse(localStorage.getItem('beautyspa_sales_history') || '[]');
    
    if (salesHistory.length === 0) {
        return `
            <h3>Historial de Ventas</h3>
            <p style="text-align: center; color: var(--text-light); margin: 2rem 0;">
                📊 No hay ventas registradas aún
            </p>
        `;
    }
    
    return `
        <h3>Historial de Ventas</h3>
        <div class="sales-history-grid">
            ${salesHistory.map(sale => {
                const totalItems = sale.items.reduce((sum, item) => sum + item.quantity, 0);
                return `
                    <div class="sale-item">
                        <div class="sale-header">
                            <div>
                                <strong>Factura:</strong> ${sale.invoiceNumber}<br>
                                <small>${new Date(sale.date).toLocaleDateString()}</small>
                            </div>
                            <div class="sale-total">${formatCurrency(sale.total)}</div>
                        </div>
                        <div class="sale-details">
                            <strong>Cliente:</strong> ${sale.customerName}<br>
                            <strong>Teléfono:</strong> ${sale.customerPhone}<br>
                            <strong>Productos:</strong> ${totalItems} artículos<br>
                            <strong>Método de pago:</strong> ${sale.paymentMethod.toUpperCase()}
                        </div>
                        <div class="sale-actions">
                            <button onclick="viewSaleInvoice('${sale.invoiceNumber}')" class="btn-view">
                                👁️ Ver Factura
                            </button>
                            <button onclick="printSaleInvoice('${sale.invoiceNumber}')" class="btn-pdf">
                                📄 Imprimir
                            </button>
                            <button onclick="deleteSale('${sale.invoiceNumber}')" class="btn-delete">
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function viewSaleInvoice(invoiceNumber) {
    const salesHistory = JSON.parse(localStorage.getItem('beautyspa_sales_history') || '[]');
    const sale = salesHistory.find(s => s.invoiceNumber === invoiceNumber);
    
    if (sale) {
        generateSalesInvoice(sale);
    }
}

function printSaleInvoice(invoiceNumber) {
    const salesHistory = JSON.parse(localStorage.getItem('beautyspa_sales_history') || '[]');
    const sale = salesHistory.find(s => s.invoiceNumber === invoiceNumber);
    
    if (sale) {
        generateSalesInvoice(sale, true);
    }
}

function deleteSale(invoiceNumber) {
    if (confirm('¿Estás seguro de eliminar esta venta?')) {
        let salesHistory = JSON.parse(localStorage.getItem('beautyspa_sales_history') || '[]');
        salesHistory = salesHistory.filter(s => s.invoiceNumber !== invoiceNumber);
        localStorage.setItem('beautyspa_sales_history', JSON.stringify(salesHistory));
        
        // Refresh sales history view
        showSalesHistory();
        
        // Show feedback
        const feedback = document.createElement('div');
        feedback.textContent = 'Venta eliminada con éxito';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #dc3545;
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 3000;
            animation: fadeInOut 2s ease;
        `;
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    }
}

// Add function to show sales history in admin panel
function showSalesHistory() {
    const configSection = document.getElementById('configSection');
    if (configSection) {
        configSection.innerHTML = createSalesHistory();
    }
}

// Update the admin menu to include sales history button
document.addEventListener('DOMContentLoaded', function() {
    // Add sales history button to admin menu
    const adminMenu = document.querySelector('.admin-menu');
    if (adminMenu) {
        const salesButton = document.createElement('button');
        salesButton.textContent = 'Historial de Ventas';
        salesButton.onclick = function() { showConfigSection('sales'); };
        adminMenu.appendChild(salesButton);
    }
    
    // Update product click behavior
    loadProducts = function() {
        const productsGrid = document.getElementById('productsGrid');
        const products = dataManager.getData('products');
        
        // Check if productsGrid exists before trying to access it
        if (!productsGrid) {
            return;
        }
        
        productsGrid.innerHTML = products.map(product => {
            const imageKey = `product_${product.id}_image`;
            const storedImage = localStorage.getItem(imageKey);
            const imageSrc = storedImage || `product-${product.id}.png`;
            const stockStatus = product.stock <= 10 ? 'low-stock' : product.stock <= 20 ? 'medium-stock' : 'high-stock';
            
            return `
                <div class="product-card ${stockStatus}" onclick="selectProduct(${product.id})" style="cursor: pointer; position: relative; overflow: hidden;">
                    <div class="product-image" style="background-image: url('${imageSrc}'); background-size: cover; background-position: center; height: 200px;"></div>
                    <div class="product-info">
                        <h4 class="product-name">${product.name}</h4>
                        <p class="product-price">${formatCurrency(product.price)}</p>
                        <p class="product-stock ${stockStatus}">
                            📦 Stock: ${product.stock} unidades disponibles
                        </p>
                        <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--primary-color); font-weight: 500;">
                            🛍️ Haz clic para agregar al carrito
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Check for stock alerts only if alertsContainer exists
        const alertsContainer = document.getElementById('stockAlerts');
        if (alertsContainer) {
            checkStockAlerts();
        }
    };
    
    loadProducts(); // Reload products with new behavior
});

// Add new function to validate business hours
function isWithinBusinessHours(date, time) {
    const businessHours = dataManager.getData('general').businessHours;
    
    // Parse business hours (format: "Lunes a Sábado: 8:00 - 20:00")
    const hoursMatch = businessHours.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (!hoursMatch) return true; // If can't parse, allow all times
    
    const startHour = parseInt(hoursMatch[1]);
    const startMinute = parseInt(hoursMatch[2]);
    const endHour = parseInt(hoursMatch[3]);
    const endMinute = parseInt(hoursMatch[4]);
    
    // Parse selected time
    const [selectedHour, selectedMinute] = time.split(':').map(Number);
    
    // Convert to minutes for comparison
    const selectedTotalMinutes = selectedHour * 60 + selectedMinute;
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    // Check day of week (Monday to Saturday)
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Reject Sundays (0)
    if (dayOfWeek === 0) {
        return false;
    }
    
    // Check if time is within business hours
    return selectedTotalMinutes >= startTotalMinutes && selectedTotalMinutes <= endTotalMinutes;
}

// Add new function to validate date and time
function validateDateAndTime(date) {
    const timeSelect = document.getElementById('time');
    if (!date || !timeSelect) return;
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Reset previous validations
    const options = timeSelect.querySelectorAll('option');
    options.forEach(option => {
        option.disabled = false;
        option.style.color = '';
    });
    
    // Disable past dates
    if (selectedDate < today) {
        timeSelect.disabled = true;
        return;
    } else {
        timeSelect.disabled = false;
    }
    
    // Check if it's Sunday
    if (selectedDate.getDay() === 0) {
        timeSelect.disabled = true;
        alert('Lo sentimos, no atendemos los domingos. El horario es: Lunes a Sábado: 8:00 - 20:00');
        return;
    }
    
    // Validate each time slot
    const businessHours = dataManager.getData('general').businessHours;
    const hoursMatch = businessHours.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    
    if (hoursMatch) {
        const startHour = parseInt(hoursMatch[1]);
        const startMinute = parseInt(hoursMatch[2]);
        const endHour = parseInt(hoursMatch[3]);
        const endMinute = parseInt(hoursMatch[4]);
        
        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;
        
        options.forEach(option => {
            if (option.value) {
                const [hour, minute] = option.value.split(':').map(Number);
                const totalMinutes = hour * 60 + minute;
                
                if (totalMinutes < startTotalMinutes || totalMinutes > endTotalMinutes) {
                    option.disabled = true;
                    option.style.color = '#ccc';
                }
            }
        });
    }
}

// Add new stock management functions
function updateStock(productId, change) {
    event.stopPropagation();
    const products = dataManager.getData('products');
    const product = products.find(p => p.id === productId);
    
    if (product) {
        const newStock = Math.max(0, product.stock + change);
        product.stock = newStock;
        
        // Update the display
        const stockInput = document.querySelector(`[data-field="stock"][data-id="${productId}"]`);
        const stockIndicator = document.querySelector(`.stock-indicator[data-id="${productId}"]`);
        
        if (stockInput) {
            stockInput.value = newStock;
        }
        
        // Update visual indicators
        updateStockIndicators(productId, newStock);
        
        // Check for low stock alerts
        checkStockAlerts();
    }
}

function updateStockIndicators(productId, stock) {
    const productItem = document.querySelector(`[data-id="${productId}"]`).closest('.product-item');
    const stockIndicator = productItem.querySelector('.stock-indicator');
    
    // Remove all stock status classes
    productItem.classList.remove('low-stock', 'medium-stock', 'high-stock');
    stockIndicator.classList.remove('low-stock', 'medium-stock', 'high-stock');
    
    // Add appropriate class based on stock level
    if (stock <= 10) {
        productItem.classList.add('low-stock');
        stockIndicator.classList.add('low-stock');
    } else if (stock <= 20) {
        productItem.classList.add('medium-stock');
        stockIndicator.classList.add('medium-stock');
    } else {
        productItem.classList.add('high-stock');
        stockIndicator.classList.add('high-stock');
    }
    
    stockIndicator.textContent = stock;
}

function getStockMessage(stock) {
    if (stock <= 5) return '¡Stock crítico! Reabastecer urgente';
    if (stock <= 10) return 'Stock bajo, considerar reabastecer';
    if (stock <= 20) return 'Stock medio';
    return 'Stock suficiente';
}

function checkStockAlerts() {
    const products = dataManager.getData('products');
    const lowStockProducts = products.filter(p => p.stock <= 10);
    const alertsContainer = document.getElementById('stockAlerts');
    
    // Check if alertsContainer exists before trying to access it
    if (!alertsContainer) {
        return;
    }
    
    if (lowStockProducts.length > 0) {
        alertsContainer.innerHTML = `
            <div class="stock-alert">
                <h4>⚠️ Alertas de Stock Bajo</h4>
                ${lowStockProducts.map(product => `
                    <div class="alert-item">
                        <span>${product.name}: ${product.stock} unidades</span>
                        <button onclick="updateStock(${product.id}, 10)" class="restock-btn">
                            +10
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        alertsContainer.innerHTML = '';
    }
}

// Add CSS for stock management
const stockStyle = document.createElement('style');
stockStyle.textContent = `
    /* Stock management styles */
    .stock-control {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }
    
    .stock-input-group {
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }
    
    .stock-input-group input {
        width: 60px !important;
        padding: 0.3rem !important;
        text-align: center;
    }
    
    .stock-btn {
        background: var(--primary-color);
        color: white;
        border: none;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        cursor: pointer;
        font-weight: bold;
        transition: var(--transition);
    }
    
    .stock-btn:hover {
        background: var(--secondary-color);
        transform: scale(1.1);
    }
    
    .stock-btn:active {
        transform: scale(0.9);
    }
    
    .stock-indicator {
        font-weight: bold;
        padding: 0.2rem 0.5rem;
        border-radius: 12px;
        font-size: 0.8rem;
        text-align: center;
    }
    
    .stock-indicator.low-stock {
        background: #dc3545;
        color: white;
        animation: pulse 1s infinite;
    }
    
    .stock-indicator.medium-stock {
        background: #ffc107;
        color: #212529;
    }
    
    .stock-indicator.high-stock {
        background: #28a745;
        color: white;
    }
    
    .product-item.low-stock {
        border-left: 4px solid #dc3545;
        background: #fff5f5;
    }
    
    .product-item.medium-stock {
        border-left: 4px solid #ffc107;
        background: #fff8e1;
    }
    
    .product-item.high-stock {
        border-left: 4px solid #28a745;
        background: #f0fff4;
    }
    
    .stock-alert {
        background: #fff3cd;
        border: 1px solid #ffc107;
        border-radius: 10px;
        padding: 1rem;
        margin-top: 1rem;
    }
    
    .stock-alert h4 {
        color: #856404;
        margin-bottom: 0.5rem;
    }
    
    .alert-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background: white;
        border-radius: 5px;
        margin: 0.3rem 0;
    }
    
    .restock-btn {
        background: #28a745;
        color: white;
        border: none;
        padding: 0.3rem 0.6rem;
        border-radius: 12px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: var(--transition);
    }
    
    .restock-btn:hover {
        background: #218838;
        transform: scale(1.05);
    }
    
    .restock-btn:active {
        transform: scale(0.95);
    }
    
    /* Stock management in mobile */
    @media (max-width: 768px) {
        .stock-control {
            grid-column: 1 / -1;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
        
        .stock-input-group {
            flex-direction: row;
        }
        
        .stock-input-group input {
            width: 50px !important;
        }
    }
`;
document.head.appendChild(stockStyle);

// Add contact admin function
function contactAdmin(method) {
    const email = 'enzemajr@gmail.com';
    const whatsapp = '+240222084663';
    
    if (method === 'email') {
        // Create email with subject and body
        const subject = encodeURIComponent('Solicitud de ayuda - BeautySPA');
        const body = encodeURIComponent(
            'Hola, soy un usuario de BeautySPA y necesito ayuda con:\n\n' +
            '[Describe aquí el problema que estás experimentando]\n\n' +
            'Gracias por tu atención.\n\n' +
            '---\n' +
            'Este mensaje fue enviado desde el panel de login de BeautySPA'
        );
        
        // Open email client
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        
        // Visual feedback
        const feedback = document.createElement('div');
        feedback.textContent = '📧 Abriendo cliente de email...';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #d4af37;
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 3000;
            animation: fadeInOut 2s ease;
        `;
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
        
    } else if (method === 'whatsapp') {
        // Create WhatsApp message
        const message = encodeURIComponent(
            'Hola, soy un usuario de BeautySPA y necesito ayuda con mi cuenta. ¿Podrías ayudarme, por favor? 🙏'
        );
        
        // Open WhatsApp
        window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
        
        // Visual feedback
        const feedback = document.createElement('div');
        feedback.textContent = '💬 Abriendo WhatsApp...';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #25d366;
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 3000;
            animation: fadeInOut 2s ease;
        `;
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    }
}

// Add CSS animation for feedback
const contactStyle = document.createElement('style');
contactStyle.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(contactStyle);

// Add CSS for enhanced animations
const enhancedStyle = document.createElement('style');
enhancedStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .service-card:hover, .product-card:hover {
        transform: translateY(-8px) scale(1.02) !important;
        box-shadow: 0 15px 30px rgba(0,0,0,0.15) !important;
    }
    
    .service-card:active, .product-card:active {
        transform: translateY(-2px) scale(0.98) !important;
    }
    
    .service-card.selected, .product-card.selected {
        animation: pulse 0.5s ease;
        border: 3px solid var(--primary-color) !important;
        box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
    }
    
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
        100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
    }
    
    .cart-button {
        transition: all 0.3s ease;
    }
    
    .cart-button:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }
`;
document.head.appendChild(enhancedStyle);