// Hotel Details Page JavaScript

let currentHotel = null;
let searchData = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initSearchData();
    loadHotelDetails();
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

// Initialize search data from URL
function initSearchData() {
    const params = Utils.getUrlParams();
    searchData = {
        checkIn: params.checkIn || getDefaultCheckIn(),
        checkOut: params.checkOut || getDefaultCheckOut(),
        people: params.people || 2
    };
}

function getDefaultCheckIn() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

function getDefaultCheckOut() {
    const checkOut = new Date();
    checkOut.setDate(checkOut.getDate() + 3);
    return checkOut.toISOString().split('T')[0];
}

// Load hotel details
async function loadHotelDetails() {
    const params = Utils.getUrlParams();
    const hotelId = params.id;
    
    if (!hotelId) {
        window.location.href = 'hotels.html';
        return;
    }
    
    try {
        const response = await API.hotels.getById(hotelId);
        
        if (response.success) {
            currentHotel = response.data;
            renderHotelDetails(currentHotel);
        } else {
            alert('Hotel not found');
            window.location.href = 'hotels.html';
        }
    } catch (error) {
        console.error('Error loading hotel:', error);
        alert('Failed to load hotel details');
    }
}

// Render hotel details
function renderHotelDetails(hotel) {
    const container = document.getElementById('hotelContent');
    if (!container) return;
    
    const nights = Utils.calculateNights(searchData.checkIn, searchData.checkOut);
    const totalPrice = hotel.price * nights;
    
    container.innerHTML = `
        <div class="hotel-details-layout">
            <div class="hotel-details-main">
                <!-- Image Gallery -->
                <div class="hotel-gallery">
                    <div class="gallery-main">
                        <img src="${hotel.image}" alt="${hotel.name}">
                    </div>
                    ${hotel.images && hotel.images.length > 1 ? `
                        <div class="gallery-thumbnails">
                            ${hotel.images.slice(1, 4).map(img => `
                                <div class="gallery-thumbnail">
                                    <img src="${img}" alt="${hotel.name}">
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                
                <!-- Hotel Header -->
                <div class="hotel-details-header">
                    <h1 class="hotel-details-title">${hotel.name}</h1>
                    <div class="details-meta">
                        <div class="hotel-rating">
                            <span class="rating-badge">${hotel.rating}</span>
                            <span class="rating-text">Very Good</span>
                        </div>
                        <div class="rooms-left" style="color: var(--danger);">${hotel.roomsLeft} Rooms Left</div>
                    </div>
                </div>
                
                <!-- Amenities -->
                <div class="amenities-section">
                    <h3>Amenities</h3>
                    <div class="amenities-grid">
                        ${hotel.amenities.map(amenity => `
                            <div class="amenity-item">
                                <span>•</span>
                                <span>${amenity}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Description -->
                <div class="description-section">
                    <h3>Description</h3>
                    <p>${hotel.longDescription || hotel.description}</p>
                </div>
                
                <!-- Map -->
                ${hotel.mapUrl ? `
                    <div class="map-section">
                        <h3>Location</h3>
                        <div class="map-container">
                            <iframe src="${hotel.mapUrl}" allowfullscreen="" loading="lazy"></iframe>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <!-- Booking Sidebar -->
            <div class="booking-sidebar">
                <div class="booking-card">
                    <h3>Booking Details</h3>
                    
                    <div class="booking-summary">
                        <div class="booking-hotel-info">
                            <img src="${hotel.image}" alt="${hotel.name}" class="booking-hotel-img">
                            <div class="booking-hotel-details">
                                <h4>${hotel.name}</h4>
                                <div class="hotel-rating">
                                    <span class="rating-badge">${hotel.rating}</span>
                                    <span class="rating-text">Couple Friendly</span>
                                </div>
                                <div style="color: var(--gray); font-size: 0.9rem;">${hotel.location || hotel.address}</div>
                            </div>
                        </div>
                        
                        <div class="summary-row">
                            <span class="summary-label">CHECK IN</span>
                            <span class="summary-value">${formatBookingDate(searchData.checkIn)}</span>
                        </div>
                        
                        <div class="summary-row">
                            <span class="summary-label">CHECK Out</span>
                            <span class="summary-value">${formatBookingDate(searchData.checkOut)}</span>
                        </div>
                        
                        <div class="summary-row">
                            <span class="summary-label">Nights</span>
                            <span class="summary-value">${nights} Night</span>
                        </div>
                        
                        <div class="summary-row">
                            <span class="summary-label">Adults</span>
                            <span class="summary-value">${searchData.people} Adult</span>
                        </div>
                        
                        <div class="summary-row">
                            <span class="summary-label">Rooms</span>
                            <span class="summary-value">1 Room</span>
                        </div>
                        
                        <div class="summary-row summary-total">
                            <span class="summary-label">Total Price</span>
                            <span class="summary-value">${Utils.formatPrice(totalPrice)}</span>
                        </div>
                    </div>
                    
                    <form class="guest-details-form" onsubmit="handleBooking(event)">
                        <h4>Guest Details</h4>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Check-In</label>
                                <input type="date" id="bookCheckIn" value="${searchData.checkIn}" required min="${new Date().toISOString().split('T')[0]}">
                            </div>
                            <div class="form-group">
                                <label>Check-Out</label>
                                <input type="date" id="bookCheckOut" value="${searchData.checkOut}" required min="${searchData.checkIn}">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Adults</label>
                                <input type="number" id="bookAdults" value="${searchData.people}" min="1" required>
                            </div>
                            <div class="form-group">
                                <label>Rooms</label>
                                <input type="number" id="bookRooms" value="1" min="1" max="${hotel.roomsLeft}" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" id="bookName" placeholder="Name" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Email Id</label>
                            <input type="email" id="bookEmail" placeholder="Email" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Mobile</label>
                            <input type="tel" id="bookMobile" placeholder="Mobile" required pattern="[0-9]{10}">
                        </div>
                        
                        <button type="submit" class="btn-book-now" id="bookNowBtn">Book Now</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Update date inputs to recalculate nights
    document.getElementById('bookCheckIn').addEventListener('change', updateBookingSummary);
    document.getElementById('bookCheckOut').addEventListener('change', updateBookingSummary);
    document.getElementById('bookRooms').addEventListener('change', updateBookingSummary);
}

// Format date for booking display
function formatBookingDate(dateString) {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Update booking summary when dates/rooms change
function updateBookingSummary() {
    const checkIn = document.getElementById('bookCheckIn').value;
    const checkOut = document.getElementById('bookCheckOut').value;
    const rooms = parseInt(document.getElementById('bookRooms').value);
    
    if (checkIn && checkOut && currentHotel) {
        const nights = Utils.calculateNights(checkIn, checkOut);
        const totalPrice = currentHotel.price * nights * rooms;
        
        // Update summary values
        const summaryRows = document.querySelectorAll('.summary-row');
        summaryRows.forEach(row => {
            const label = row.querySelector('.summary-label').textContent;
            const valueEl = row.querySelector('.summary-value');
            
            if (label === 'CHECK IN') {
                valueEl.textContent = formatBookingDate(checkIn);
            } else if (label === 'CHECK Out') {
                valueEl.textContent = formatBookingDate(checkOut);
            } else if (label === 'Nights') {
                valueEl.textContent = `${nights} Night`;
            } else if (label === 'Rooms') {
                valueEl.textContent = `${rooms} Room`;
            } else if (label === 'Total Price') {
                valueEl.textContent = Utils.formatPrice(totalPrice);
            }
        });
    }
}

// Handle booking submission
async function handleBooking(event) {
    event.preventDefault();
    
    const bookBtn = document.getElementById('bookNowBtn');
    bookBtn.disabled = true;
    bookBtn.textContent = 'Processing...';
    
    const bookingData = {
        hotelId: currentHotel.id,
        hotelName: currentHotel.name,
        name: document.getElementById('bookName').value,
        email: document.getElementById('bookEmail').value,
        mobile: document.getElementById('bookMobile').value,
        checkIn: document.getElementById('bookCheckIn').value,
        checkOut: document.getElementById('bookCheckOut').value,
        adults: parseInt(document.getElementById('bookAdults').value),
        rooms: parseInt(document.getElementById('bookRooms').value),
        totalPrice: currentHotel.price * Utils.calculateNights(
            document.getElementById('bookCheckIn').value,
            document.getElementById('bookCheckOut').value
        ) * parseInt(document.getElementById('bookRooms').value)
    };
    
    try {
        const response = await API.booking.create(bookingData);
        
        if (response.success) {
            showSuccessModal('Booking successful');
            // Reset form after 2 seconds
            setTimeout(() => {
                event.target.reset();
                bookBtn.disabled = false;
                bookBtn.textContent = 'Book Now';
            }, 2000);
        } else {
            alert(response.error || 'Booking failed. Please try again.');
            bookBtn.disabled = false;
            bookBtn.textContent = 'Book Now';
        }
    } catch (error) {
        console.error('Booking error:', error);
        alert('Booking failed. Please try again.');
        bookBtn.disabled = false;
        bookBtn.textContent = 'Book Now';
    }
}

// Show success modal
function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const messageEl = document.getElementById('successMessage');
    
    if (modal && messageEl) {
        messageEl.textContent = message;
        modal.classList.add('active');
    }
}

// Close success modal
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal on click outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
};
