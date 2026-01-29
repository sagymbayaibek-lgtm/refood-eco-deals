import { Deal } from '@/context/AppContext';
import { Heart, Star, Clock, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

interface DealCardProps {
  deal: Deal;
  onPurchase?: (deal: Deal) => void;
  showPurchase?: boolean;
}

export const DealCard = ({ deal, onPurchase, showPurchase = true }: DealCardProps) => {
  const { user, toggleFavorite } = useApp();
  const isFavorite = user?.favorites?.includes(deal.id);
  const discountPercent = Math.round((1 - deal.discountPrice / deal.originalPrice) * 100);

  return (
    <Card className="group overflow-hidden card-hover bg-card border-border/50">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={deal.image}
          alt={deal.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Discount Badge */}
        <div className="absolute top-3 left-3 discount-badge">
          -{discountPercent}%
        </div>
        {/* Favorite Button */}
        {user?.role === 'customer' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(deal.id);
            }}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all ${
              isFavorite ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
        {/* Quantity Badge */}
        {deal.quantity <= 3 && deal.quantity > 0 && (
          <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md text-xs font-medium bg-destructive/90 text-destructive-foreground">
            Only {deal.quantity} left!
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Business Info */}
        <div className="flex items-center gap-2 mb-2">
          {deal.businessLogo && (
            <img
              src={deal.businessLogo}
              alt={deal.businessName}
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
          <span className="text-sm text-muted-foreground">{deal.businessName}</span>
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold text-lg mb-1 line-clamp-1">
          {deal.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {deal.description}
        </p>

        {/* Rating & Distance */}
        <div className="flex items-center gap-4 mb-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">{deal.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({deal.reviewCount})</span>
          </div>
          {deal.distance && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{deal.distance} km</span>
            </div>
          )}
        </div>

        {/* Pickup Time */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <Clock className="w-4 h-4" />
          <span>Pick up: {deal.pickupStart} - {deal.pickupEnd}</span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">${deal.discountPrice.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground line-through">${deal.originalPrice.toFixed(2)}</span>
          </div>
          {showPurchase && deal.quantity > 0 && (
            <Button
              size="sm"
              onClick={() => onPurchase?.(deal)}
              className="btn-bounce"
            >
              Reserve
            </Button>
          )}
          {deal.quantity === 0 && (
            <span className="text-sm font-medium text-destructive">Sold Out</span>
          )}
        </div>

        {/* Eco Impact */}
        <div className="mt-3 pt-3 border-t border-border flex items-center gap-1 text-xs text-eco">
          <span className="eco-badge text-xs px-2 py-0.5">
            🌱 Saves {deal.co2Saved} kg CO₂
          </span>
        </div>
      </div>
    </Card>
  );
};
