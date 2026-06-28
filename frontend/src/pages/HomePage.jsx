import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHotels } from '../api/api';

const AMENITY_ICONS = {
  'Free WiFi': '📶',
  Pool: '🏊',
  Spa: '💆',
  Restaurant: '🍽️',
  Gym: '💪',
};

export default function HomePage() {
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHotel = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await getHotels();
        setHotel(data[0] ?? null);
      } catch {
        setError('Unable to load hotel details. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    loadHotel();
  }, []);

  const goToRooms = () => {
    if (hotel) navigate(`/hotels/${hotel.id}`);
  };

  const heroBackground = hotel?.imageUrl
    ? `${hotel.imageUrl.split('?')[0]}?w=1920&q=80&auto=format&fit=crop`
    : 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80&auto=format&fit=crop';

  const galleryImages = [
    hotel?.imageUrl,
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611892440504-42a784e683ff?w=800&q=80&auto=format&fit=crop',
  ].filter(Boolean);

  if (loading) {
    return <p className="status-message container">Loading...</p>;
  }

  if (error || !hotel) {
    return <p className="error-message container">{error || 'Hotel not found.'}</p>;
  }

  return (
    <div
      className="page home-page"
      style={{ '--hero-bg': `url("${heroBackground}")` }}
    >
      <section className="hero hero-home">
        <div className="container hero-home-inner">
          <span className="hero-badge">★ {hotel.rating.toFixed(1)} Guest Rating</span>
          <h1>Welcome to {hotel.name}</h1>
          <p className="hero-subtitle">
            {hotel.address}, {hotel.city}
          </p>
          <p className="hero-tagline">{hotel.description}</p>
        </div>
      </section>

      <section className="home-highlights">
        <div className="container home-highlights-grid">
          <div className="highlight-card">
            <span className="highlight-icon">📍</span>
            <h3>Prime Location</h3>
            <p>In the heart of {hotel.city}, close to business districts and landmarks.</p>
          </div>
          <div className="highlight-card">
            <span className="highlight-icon">✨</span>
            <h3>Luxury Comfort</h3>
            <p>Elegantly designed rooms with premium bedding and modern amenities.</p>
          </div>
          <div className="highlight-card">
            <span className="highlight-icon">🛎️</span>
            <h3>24/7 Service</h3>
            <p>Concierge, room service, and seamless online booking at your fingertips.</p>
          </div>
        </div>
      </section>

      <section className="container home-about">
        <div className="home-about-grid">
          <div className="home-about-text">
            <h2>Experience {hotel.name}</h2>
            <p>{hotel.description}</p>
            <p>
              Whether you are visiting {hotel.city} for business or leisure, our team ensures
              a refined stay with thoughtful hospitality, curated dining, and spaces designed
              for rest and productivity.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={goToRooms}
            >
              View Rooms & Rates
            </button>
          </div>
          <div className="home-gallery">
            {galleryImages.map((src, i) => (
              <img key={src} src={src} alt={`${hotel.name} view ${i + 1}`} loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      <section className="home-amenities">
        <div className="container">
          <h2>Hotel Amenities</h2>
          <p className="section-lead">Everything you need for a comfortable and memorable stay.</p>
          <div className="amenity-grid">
            {hotel.amenities?.map((amenity) => (
              <div key={amenity} className="amenity-card">
                <span className="amenity-icon">{AMENITY_ICONS[amenity] || '✓'}</span>
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="container home-cta-inner">
          <h2>Ready to book your stay?</h2>
          <p>Secure your room at {hotel.name} in just a few clicks.</p>
          <button
            type="button"
            className="btn-primary btn-lg"
            onClick={goToRooms}
          >
            Book Now
          </button>
        </div>
      </section>
    </div>
  );
}
