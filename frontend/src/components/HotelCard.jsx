import { Link } from 'react-router-dom';

export default function HotelCard({ hotel }) {
  return (
    <Link to={`/hotels/${hotel.id}`} className="hotel-card">
      <div className="hotel-card-image">
        <img src={hotel.imageUrl} alt={hotel.name} loading="lazy" />
        <span className="rating-badge">★ {hotel.rating.toFixed(1)}</span>
      </div>
      <div className="hotel-card-body">
        <h3>{hotel.name}</h3>
        <p className="hotel-location">{hotel.city}</p>
        <p className="hotel-description">{hotel.description}</p>
        <div className="amenities">
          {hotel.amenities?.slice(0, 3).map((amenity) => (
            <span key={amenity} className="amenity-tag">
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
