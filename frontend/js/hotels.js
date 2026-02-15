// Hotels Listing Page JavaScript

let allHotels = [];
let currentFilters = {
    city: '',
    amenities: [],
    priceRange: null
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initSearchParams();
    initFilters();
    loadHotels();
});

// Initialize auth display
function initAuth() {
    const user = Utils.storage.get('user');
    const userDisplay = document.getElementById('userDisplay');
    const userName = document.getElementById('userName');
    
    if (user && userName) {
        userName.textContent = user.name;
        userDisplay.style.display = 'flex';
    }
    
    // Logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            Utils.storage.remove('user');
            window.location.href = 'index.html';
        });
    }
}

// Initialize search parameters from URL
function initSearchParams() {
    const params = Utils.getUrlParams();
    
    if (params.city) {
        currentFilters.city = params.city;
        document.getElementById('searchLocation').value = params.city;
        document.getElementById('cityName').textContent = params.city;
    }
    
    if (params.checkIn) {
        document.getElementById('checkInDate').value = params.checkIn;
    } else {
        // Set default check-in to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('checkInDate').value = tomorrow.toISOString().split('T')[0];
    }
    
    if (params.checkOut) {
        document.getElementById('checkOutDate').value = params.checkOut;
    } else {
        // Set default check-out to 2 days from tomorrow
        const checkOut = new Date();
        checkOut.setDate(checkOut.getDate() + 3);
        document.getElementById('checkOutDate').value = checkOut.toISOString().split('T')[0];
    }
    
    if (params.people) {
        document.getElementById('searchPeople').value = params.people;
    }
}

// Initialize filters
function initFilters() {
    // Amenity checkboxes
    const amenityCheckboxes = document.querySelectorAll('input[name="amenity"]');
    amenityCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterHotels);
    });
    
    // Price range radios
    const priceRadios = document.querySelectorAll('input[name="price"]');
    priceRadios.forEach(radio => {
        radio.addEventListener('change', filterHotels);
    });
}

// Load hotels
async function loadHotels() {
    showLoading();
    
    try {
        const params = currentFilters.city ? { city: currentFilters.city } : {};
        const response = await API.hotels.getAll(params);
        
        if (response.success) {
            allHotels = response.data;
            filterHotels();
        } else {
            showNoResults();
        }
    } catch (error) {
        console.error('Error loading hotels:', error);
        showNoResults();
    } finally {
        hideLoading();
    }
}

// Filter hotels based on selected criteria
function filterHotels() {
    // Get selected amenities
    const selectedAmenities = Array.from(document.querySelectorAll('input[name="amenity"]:checked'))
        .map(cb => cb.value);
    
    // Get selected price range
    const selectedPrice = document.querySelector('input[name="price"]:checked');
    let priceRange = null;
    
    if (selectedPrice) {
        const value = selectedPrice.value;
        if (value === '0-1000') {
            priceRange = { min: 0, max: 1000 };
        } else if (value === '1000-5000') {
            priceRange = { min: 1000, max: 5000 };
        } else if (value === '5000-10000') {
            priceRange = { min: 5000, max: 10000 };
        } else if (value === '10000+') {
            priceRange = { min: 10000, max: Infinity };
        }
    }
    
    // Filter hotels
    let filtered = [...allHotels];
    
    // Filter by amenities
    if (selectedAmenities.length > 0) {
        filtered = filtered.filter(hotel =>
            selectedAmenities.every(amenity =>
                hotel.amenities.some(hotelAmenity =>
                    hotelAmenity.toLowerCase().includes(amenity.toLowerCase())
                )
            )
        );
    }
    
    // Filter by price range
    if (priceRange) {
        filtered = filtered.filter(hotel =>
            hotel.price >= priceRange.min && hotel.price <= priceRange.max
        );
    }
    
    // Display filtered hotels
    if (filtered.length > 0) {
        renderHotels(filtered);
    } else {
        showNoResults();
    }
}

// Render hotels
function renderHotels(hotels) {
    const container = document.getElementById('hotelsContainer');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;
    
    container.style.display = 'grid';
    noResults.style.display = 'none';
    
    container.innerHTML = hotels.map(hotel => `
        <div class="hotel-card">
            <div class="hotel-image">
                <img src="${hotel.image}" alt="${hotel.name}" class="hotel-main-image">
                ${hotel.images && hotel.images.length > 1 ? `
                    <div class="hotel-thumbnails">
                        ${hotel.images.slice(1, 4).map(img => `
                            <img src="${img}" alt="${hotel.name}" class="hotel-thumbnail">
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            
            <div class="hotel-info">
                <div class="hotel-header">
                    <div>
                        <h3 class="hotel-title">${hotel.name}</h3>
                        <div class="hotel-rating">
                            <span class="rating-badge">${hotel.rating}</span>
                            <span class="rating-text">Very Good</span>
                        </div>
                    </div>
                </div>
                
                <p class="hotel-description">${hotel.description}</p>
                
                <div class="hotel-amenities">
                    ${hotel.amenities.slice(0, 3).map(amenity => `
                        <span class="amenity-tag">${amenity}</span>
                    `).join('')}
                </div>
                
                <div class="hotel-location">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0a5 5 0 0 0-5 5c0 3.75 5 11 5 11s5-7.25 5-11a5 5 0 0 0-5-5zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                    </svg>
                    ${hotel.location || hotel.address}
                </div>
            </div>
            
            <div class="hotel-pricing">
                <div class="rooms-left">${hotel.roomsLeft} Rooms Left</div>
                
                <div class="price-section">
                    <div class="price">${Utils.formatPrice(hotel.price)}<span class="price-unit">/ night</span></div>
                    ${hotel.discount ? `
                        <span class="discount">${hotel.discount}% Discount</span>
                    ` : ''}
                </div>
                
                <button class="btn-book" onclick="viewHotel('${hotel.id}')">Book Now</button>
            </div>
        </div>
    `).join('');
}

// View hotel details
function viewHotel(hotelId) {
    const searchData = {
        checkIn: document.getElementById('checkInDate').value,
        checkOut: document.getElementById('checkOutDate').value,
        people: document.getElementById('searchPeople').value
    };
    
    const params = new URLSearchParams({
        id: hotelId,
        ...searchData
    });
    
    window.location.href = `hotel-details.html?${params.toString()}`;
}

// Clear filters
function clearFilters() {
    document.querySelectorAll('input[name="amenity"]:checked').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="price"]:checked').forEach(rb => rb.checked = false);
    filterHotels();
}

// Show loading state
function showLoading() {
    const spinner = document.getElementById('loadingSpinner');
    const container = document.getElementById('hotelsContainer');
    const noResults = document.getElementById('noResults');
    
    if (spinner) spinner.style.display = 'block';
    if (container) container.style.display = 'none';
    if (noResults) noResults.style.display = 'none';
}

// Hide loading state
function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'none';
}

// Show no results state
function showNoResults() {
    const spinner = document.getElementById('loadingSpinner');
    const container = document.getElementById('hotelsContainer');
    const noResults = document.getElementById('noResults');
    
    if (spinner) spinner.style.display = 'none';
    if (container) container.style.display = 'none';
    if (noResults) noResults.style.display = 'block';
}
