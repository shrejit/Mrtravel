import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
let bookings = [];
let users = [];
let bookingIdCounter = 1;
let userIdCounter = 1;

// Sample hotel data matching the screenshots
const hotels = [
  {
    id: "1",
    name: "Hotel Amber Palace",
    city: "Jaipur",
    location: "Amber Road, Jaipur",
    rating: 4.80,
    reviews: 2456,
    description: "Luxury hotel near Amber Fort",
    longDescription: "Experience royal luxury in the heart of Jaipur. Our heritage property combines traditional Rajasthani architecture with modern amenities. Located near the iconic Amber Fort, enjoy stunning views and world-class hospitality.",
    amenities: ["Swimming Pool", "Gym", "Spa", "Breakfast", "Buffet", "Indian Cuisine", "Wi-Fi", "Room Service", "Parking"],
    address: "Amber Road, Jaipur, Rajasthan 302001",
    roomsLeft: 50,
    price: 12000,
    originalPrice: 14000,
    discount: 15,
    coupleFriendly: true,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"
    ],
    mapUrl: "https://maps.google.com/maps?q=Amber+Fort+Jaipur&t=&z=13&ie=UTF8&iwloc=&output=embed",
    coordinates: { lat: 26.9855, lng: 75.8513 }
  },
  {
    id: "2",
    name: "Rajputana Palace",
    city: "Jaipur",
    location: "M.I. Road, Jaipur",
    rating: 4.50,
    reviews: 1890,
    description: "Heritage hotel with royal decor",
    longDescription: "A magnificent blend of heritage and comfort. Stay in a palace that once hosted royalty and nobility. Experience authentic Rajasthani hospitality with modern luxury.",
    amenities: ["Bar", "Conference Hall", "Swimming Pool", "Spa", "Wi-Fi", "Parking", "Room Service"],
    address: "M.I. Road, Jaipur, Rajasthan 302006",
    roomsLeft: 80,
    price: 8000,
    originalPrice: 10000,
    discount: 10,
    coupleFriendly: true,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
    ],
    mapUrl: "https://maps.google.com/maps?q=MI+Road+Jaipur&t=&z=13&ie=UTF8&iwloc=&output=embed",
    coordinates: { lat: 26.9124, lng: 75.7873 }
  },
  {
    id: "3",
    name: "Pink City Hotel",
    city: "Jaipur",
    location: "Bapu Bazaar, Jaipur",
    rating: 4.20,
    reviews: 1234,
    description: "Affordable stay with modern amenities",
    longDescription: "Modern comfort in the heart of the Pink City. Perfect for both business and leisure travelers. Close to major attractions and shopping areas.",
    amenities: ["Wi-Fi", "Parking", "Elevator", "Swimming Pool", "Gym"],
    address: "Bapu Bazaar, Jaipur, Rajasthan 302001",
    roomsLeft: 120,
    price: 4000,
    originalPrice: 5000,
    discount: 20,
    coupleFriendly: true,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800"
    ],
    mapUrl: "https://maps.google.com/maps?q=Bapu+Bazaar+Jaipur&t=&z=13&ie=UTF8&iwloc=&output=embed",
    coordinates: { lat: 26.9195, lng: 75.7951 }
  },
  {
    id: "4",
    name: "Trident Jaipur",
    city: "Jaipur",
    location: "Amber Fort Road, Jaipur",
    rating: 4.70,
    reviews: 3421,
    description: "Sophisticated hotel with luxury services",
    longDescription: "Five-star luxury with world-class amenities. Experience unparalleled hospitality and service in the royal city of Jaipur.",
    amenities: ["Free Wi-Fi", "Outdoor Pool", "Spa", "Gym", "Room Service", "Conference Hall"],
    address: "Amber Fort Road, Jaipur, Rajasthan 302002",
    roomsLeft: 60,
    price: 15000,
    originalPrice: 17000,
    discount: 12,
    coupleFriendly: true,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
    ],
    mapUrl: "https://maps.google.com/maps?q=Amber+Fort+Road+Jaipur&t=&z=13&ie=UTF8&iwloc=&output=embed",
    coordinates: { lat: 26.9855, lng: 75.8613 }
  },
  {
    id: "5",
    name: "Holiday Inn Jaipur",
    city: "Jaipur",
    location: "Raja Park, Jaipur",
    rating: 4.40,
    reviews: 2100,
    description: "Comfortable hotel with easy access to major attractions",
    longDescription: "Contemporary comfort with excellent connectivity. Ideal for business travelers and tourists alike.",
    amenities: ["Free Parking", "Room Service", "Swimming Pool", "Gym"],
    address: "Raja Park, Jaipur, Rajasthan 302004",
    roomsLeft: 70,
    price: 7500,
    originalPrice: 9000,
    discount: 14,
    coupleFriendly: true,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800"
    ],
    mapUrl: "https://maps.google.com/maps?q=Raja+Park+Jaipur&t=&z=13&ie=UTF8&iwloc=&output=embed",
    coordinates: { lat: 26.9011, lng: 75.7876 }
  }
];

// Tour packages
const tourPackages = [
  {
    id: "t1",
    name: "Lotus-Delhi",
    location: "Delhi",
    description: "Included: Air ticket, Hotel, Breakfast, Tours, Airport transfers",
    likes: 24512,
    views: 8536,
    price: 2870,
    duration: "3 Days",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400"
  },
  {
    id: "t2",
    name: "Burj Khalifa-DXB",
    location: "Dubai",
    description: "Included: Air ticket, Hotel, Breakfast, Tours, Airport transfers",
    likes: 24572,
    views: 9371,
    price: 2350,
    duration: "4 Days",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400"
  },
  {
    id: "t3",
    name: "Piramids-Egypt",
    location: "Egypt",
    description: "Included: Air ticket, Hotel, Breakfast, Tours, Airport transfers",
    likes: 40165,
    views: 2209,
    price: 1130,
    duration: "5 Days",
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400"
  },
  {
    id: "t4",
    name: "Mountain-Vietnam",
    location: "Vietnam",
    description: "Included: Air ticket, Hotel, Breakfast, Tours, Airport transfers",
    likes: 24513,
    views: 4538,
    price: 2870,
    duration: "6 Days",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400"
  }
];

// Countries to travel
const countries = [
  {
    id: "c1",
    country: "INDIA",
    city: "Mumbai Central",
    price: 460,
    flag: "🇮🇳",
    image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=400"
  },
  {
    id: "c2",
    country: "UNITED STATE",
    city: "New York",
    price: 870,
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400"
  },
  {
    id: "c3",
    country: "RUSSIA",
    city: "Sanpitersburg",
    price: 660,
    flag: "🇷🇺",
    image: "https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=400"
  },
  {
    id: "c4",
    country: "SPAIN",
    city: "Barcelona",
    price: 730,
    flag: "🇪🇸",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400"
  }
];

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MR.travel API is running' });
});

// Get all hotels with filters
app.get('/api/hotels', (req, res) => {
  try {
    const { city, amenities, minPrice, maxPrice, search } = req.query;
    
    let filteredHotels = [...hotels];
    
    // Filter by city
    if (city) {
      filteredHotels = filteredHotels.filter(
        hotel => hotel.city.toLowerCase() === city.toLowerCase()
      );
    }
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredHotels = filteredHotels.filter(
        hotel => 
          hotel.name.toLowerCase().includes(searchLower) ||
          hotel.city.toLowerCase().includes(searchLower) ||
          hotel.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by amenities
    if (amenities) {
      const amenityList = amenities.split(',').map(a => a.trim());
      filteredHotels = filteredHotels.filter(hotel =>
        amenityList.every(amenity =>
          hotel.amenities.some(hotelAmenity =>
            hotelAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        )
      );
    }
    
    // Filter by price range
    if (minPrice !== undefined) {
      filteredHotels = filteredHotels.filter(hotel => hotel.price >= parseFloat(minPrice));
    }
    if (maxPrice !== undefined) {
      filteredHotels = filteredHotels.filter(hotel => hotel.price <= parseFloat(maxPrice));
    }
    
    res.json({
      success: true,
      count: filteredHotels.length,
      data: filteredHotels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single hotel by ID
app.get('/api/hotel/:id', (req, res) => {
  try {
    const { id } = req.params;
    const hotel = hotels.find(h => h.id === id);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hotel not found'
      });
    }
    
    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get tour packages
app.get('/api/tour-packages', (req, res) => {
  res.json({
    success: true,
    data: tourPackages
  });
});

// Get countries
app.get('/api/countries', (req, res) => {
  res.json({
    success: true,
    data: countries
  });
});

// Get available cities
app.get('/api/cities', (req, res) => {
  const cities = [...new Set(hotels.map(hotel => hotel.city))];
  res.json({
    success: true,
    data: cities
  });
});

// User registration
app.post('/api/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }
    
    const user = {
      id: userIdCounter++,
      name,
      email,
      password, // In production, hash this!
      createdAt: new Date().toISOString()
    };
    
    users.push(user);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// User login
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    res.json({
      success: true,
      message: 'Login successful',
      data: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create a booking
app.post('/api/book', (req, res) => {
  try {
    const { hotelId, hotelName, name, email, mobile, checkIn, checkOut, adults, rooms, totalPrice } = req.body;
    
    // Validation
    if (!hotelId || !name || !email || !mobile || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }
    
    // Check if hotel exists
    const hotel = hotels.find(h => h.id === hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hotel not found'
      });
    }
    
    // Check room availability
    if (rooms > hotel.roomsLeft) {
      return res.status(400).json({
        success: false,
        error: `Only ${hotel.roomsLeft} rooms available`
      });
    }
    
    // Calculate nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    // Create booking
    const booking = {
      id: bookingIdCounter++,
      hotelId,
      hotelName: hotelName || hotel.name,
      guestDetails: {
        name,
        email,
        mobile
      },
      bookingDetails: {
        checkIn,
        checkOut,
        nights,
        adults: adults || 1,
        rooms: rooms || 1
      },
      totalPrice: totalPrice || (hotel.price * rooms * nights),
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      confirmationCode: `MRT${Date.now().toString(36).toUpperCase()}`
    };
    
    bookings.push(booking);
    
    // Update room availability
    hotel.roomsLeft -= rooms;
    
    res.status(201).json({
      success: true,
      message: 'Booking successful',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  res.json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// Get user bookings by email
app.get('/api/bookings/user/:email', (req, res) => {
  const { email } = req.params;
  const userBookings = bookings.filter(b => b.guestDetails.email === email);
  
  res.json({
    success: true,
    count: userBookings.length,
    data: userBookings
  });
});

// Get booking by confirmation code
app.get('/api/booking/:confirmationCode', (req, res) => {
  const { confirmationCode } = req.params;
  const booking = bookings.find(b => b.confirmationCode === confirmationCode);
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found'
    });
  }
  
  res.json({
    success: true,
    data: booking
  });
});

// Cancel booking
app.delete('/api/booking/:confirmationCode', (req, res) => {
  const { confirmationCode } = req.params;
  const bookingIndex = bookings.findIndex(b => b.confirmationCode === confirmationCode);
  
  if (bookingIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found'
    });
  }
  
  const booking = bookings[bookingIndex];
  
  // Restore room availability
  const hotel = hotels.find(h => h.id === booking.hotelId);
  if (hotel) {
    hotel.roomsLeft += booking.bookingDetails.rooms;
  }
  
  bookings.splice(bookingIndex, 1);
  
  res.json({
    success: true,
    message: 'Booking cancelled successfully'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MR.travel Backend Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`\n📊 Available Data:`);
  console.log(`   - ${hotels.length} hotels`);
  console.log(`   - ${tourPackages.length} tour packages`);
  console.log(`   - ${countries.length} countries`);
});

export default app;
