// Homepage JavaScript

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    loadCountries();
    loadTourPackages();
    initSearchDates();
});

// Authentication
function initAuth() {
    const user = Utils.storage.get('user');
    const userDisplay = document.getElementById('userDisplay');
    const registerBtn = document.getElementById('registerBtn');
    
    if (user) {
        document.getElementById('userName').textContent = user.name;
        userDisplay.style.display = 'flex';
        if (registerBtn) registerBtn.style.display = 'none';
    } else {
        userDisplay.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'block';
    }
    
    // Logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            Utils.storage.remove('user');
            window.location.reload();
        });
    }
    
    // Register button handler
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            showModal('registerModal');
        });
    }
}

// Load countries
async function loadCountries() {
    try {
        const response = await API.getCountries();
        if (response.success) {
            renderCountries(response.data);
        }
    } catch (error) {
        console.error('Error loading countries:', error);
    }
}

function renderCountries(countries) {
    const container = document.getElementById('countriesGrid');
    if (!container) return;
    
    container.innerHTML = countries.map(country => `
        <div class="country-card" onclick="searchByCity('${country.city}')">
            <img src="${country.image}" alt="${country.country}">
            <div class="country-card-content">
                <div class="country-header">
                    <span class="country-flag">${country.flag}</span>
                    <span class="country-name">${country.country}</span>
                </div>
                <div class="country-city">${country.city}</div>
                <div class="country-price">$${country.price}</div>
                <button class="btn-read-now">Read Now</button>
            </div>
        </div>
    `).join('');
}

// Load tour packages
async function loadTourPackages() {
    try {
        const response = await API.getTourPackages();
        if (response.success) {
            renderTourPackages(response.data);
        }
    } catch (error) {
        console.error('Error loading tour packages:', error);
    }
}

function renderTourPackages(packages) {
    const container = document.getElementById('packagesGrid');
    if (!container) return;
    
    container.innerHTML = packages.map(pkg => `
        <div class="package-card">
            <div class="package-image">
                <img src="${pkg.image}" alt="${pkg.name}">
                <span class="package-badge">${pkg.duration}</span>
            </div>
            <div class="package-content">
                <h3 class="package-title">${pkg.name}</h3>
                <p class="package-description">${pkg.description}</p>
                <div class="package-stats">
                    <span>❤️ ${pkg.likes.toLocaleString()}</span>
                    <span>👁️ ${pkg.views.toLocaleString()}</span>
                </div>
                <div class="package-footer">
                    <span class="package-price">$${pkg.price}</span>
                    <button class="btn-more">More Info</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Search functionality
function initSearchDates() {
    const dateInput = document.getElementById('searchDate');
    if (dateInput) {
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
        dateInput.min = new Date().toISOString().split('T')[0];
    }
}

function searchHotels() {
    const location = document.getElementById('searchLocation').value.trim();
    const date = document.getElementById('searchDate')?.value;
    const people = document.getElementById('searchPeople').value;
    
    if (!location) {
        alert('Please enter a destination');
        return;
    }
    
    // Navigate to hotels page with search params
    const params = new URLSearchParams({
        city: location,
        ...(date && { checkIn: date }),
        ...(people && { people })
    });
    
    window.location.href = `hotels.html?${params.toString()}`;
}

function searchByCity(city) {
    window.location.href = `hotels.html?city=${city.toLowerCase()}`;
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function switchToLogin() {
    hideModal('registerModal');
    showModal('loginModal');
}

function switchToRegister() {
    hideModal('loginModal');
    showModal('registerModal');
}

// Close modal on click outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
};

// Close buttons
document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.modal').classList.remove('active');
    });
});

// Register form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userData = {
            name: document.getElementById('regName').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPassword').value
        };
        
        try {
            const response = await API.auth.register(userData);
            
            if (response.success) {
                alert('Registration successful! Please login.');
                hideModal('registerModal');
                showModal('loginModal');
                registerForm.reset();
            } else {
                alert(response.error || 'Registration failed');
            }
        } catch (error) {
            alert('Registration failed. Please try again.');
        }
    });
}

// Login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const credentials = {
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value
        };
        
        try {
            const response = await API.auth.login(credentials);
            
            if (response.success) {
                Utils.storage.set('user', response.data);
                hideModal('loginModal');
                window.location.reload();
            } else {
                alert(response.error || 'Login failed');
            }
        } catch (error) {
            alert('Login failed. Please try again.');
        }
    });
}
