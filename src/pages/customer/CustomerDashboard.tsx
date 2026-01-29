import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, Heart, Clock, User, Bell, Leaf, Star, 
  MapPin, Filter, Search, TrendingUp, Package, Settings,
  ChevronRight, X, Minus, Plus, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DealCard } from '@/components/deals/DealCard';
import { useApp, Deal, Order } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/Layout';

const CustomerDashboard = () => {
  const { user, deals, getCustomerOrders, getFavoriteDeals, addOrder, addReview, updateUser } = useApp();
  const { toast } = useToast();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [sortBy, setSortBy] = useState<string>('distance');
  const [showFilters, setShowFilters] = useState(false);

  // Purchase dialog
  const [purchaseDialog, setPurchaseDialog] = useState<{ open: boolean; deal: Deal | null }>({ open: false, deal: null });
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);

  // Review dialog
  const [reviewDialog, setReviewDialog] = useState<{ open: boolean; order: Order | null }>({ open: false, order: null });
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Profile edit
  const [editProfile, setEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    phone: user?.phone || '',
  });

  if (!user || user.role !== 'customer') {
    return <Navigate to="/login" replace />;
  }

  const orders = getCustomerOrders();
  const favorites = getFavoriteDeals();

  // Filter and sort deals
  const filteredDeals = deals
    .filter((deal) => {
      if (searchQuery && !deal.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !deal.businessName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (categoryFilter !== 'all' && deal.category !== categoryFilter) return false;
      if (deal.discountPrice < priceRange[0] || deal.discountPrice > priceRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price': return a.discountPrice - b.discountPrice;
        case 'rating': return b.rating - a.rating;
        case 'distance': return (a.distance || 0) - (b.distance || 0);
        default: return 0;
      }
    });

  const handlePurchase = (deal: Deal) => {
    setPurchaseDialog({ open: true, deal });
    setPurchaseQuantity(1);
  };

  const confirmPurchase = () => {
    if (purchaseDialog.deal) {
      addOrder(purchaseDialog.deal.id, purchaseQuantity);
      toast({
        title: 'Order placed!',
        description: `You've reserved ${purchaseQuantity}x ${purchaseDialog.deal.title}`,
      });
      setPurchaseDialog({ open: false, deal: null });
    }
  };

  const handleReview = (order: Order) => {
    setReviewDialog({ open: true, order });
    setReviewRating(5);
    setReviewComment('');
  };

  const submitReview = () => {
    if (reviewDialog.order) {
      addReview(reviewDialog.order.dealId, reviewRating, reviewComment);
      toast({
        title: 'Review submitted!',
        description: 'Thank you for your feedback.',
      });
      setReviewDialog({ open: false, order: null });
    }
  };

  const saveProfile = () => {
    updateUser(profileData);
    setEditProfile(false);
    toast({
      title: 'Profile updated!',
      description: 'Your profile has been saved.',
    });
  };

  const categories = ['all', 'Restaurant', 'Café', 'Bakery', 'Supermarket'];

  return (
    <Layout showFooter={false}>
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">
                Welcome back, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-muted-foreground">Find great deals near you</p>
            </div>
            
            {/* Impact Summary */}
            <div className="flex gap-4">
              <Card className="px-4 py-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-eco-light flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-eco" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CO₂ Saved</p>
                  <p className="font-semibold text-eco">{(user.co2Saved || 0).toFixed(1)} kg</p>
                </div>
              </Card>
              <Card className="px-4 py-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Meals Saved</p>
                  <p className="font-semibold">{user.mealsPurchased || 0}</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="deals" className="space-y-6">
            <TabsList className="bg-background border">
              <TabsTrigger value="deals" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Find Deals</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Favorites</span>
                {favorites.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{favorites.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
                {orders.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{orders.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
            </TabsList>

            {/* Deals Tab */}
            <TabsContent value="deals" className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search deals or businesses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="distance">Nearest</SelectItem>
                      <SelectItem value="price">Price: Low-High</SelectItem>
                      <SelectItem value="rating">Top Rated</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant={showFilters ? 'default' : 'outline'}
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                </div>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <Card className="p-4 animate-fade-in">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat === 'all' ? 'All Categories' : cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                      </label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={50}
                        step={1}
                        className="mt-4"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setCategoryFilter('all');
                          setPriceRange([0, 50]);
                          setSearchQuery('');
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Category Pills */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={categoryFilter === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategoryFilter(cat)}
                    className="whitespace-nowrap"
                  >
                    {cat === 'all' ? 'All' : cat}
                  </Button>
                ))}
              </div>

              {/* Deals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onPurchase={handlePurchase}
                  />
                ))}
              </div>

              {filteredDeals.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No deals found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                </div>
              )}
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-4">
              {favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      onPurchase={handlePurchase}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground">Save deals you love by clicking the heart icon</p>
                </div>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={order.dealImage}
                          alt={order.dealTitle}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{order.dealTitle}</h3>
                              <p className="text-sm text-muted-foreground">{order.businessName}</p>
                            </div>
                            <Badge
                              variant={order.status === 'completed' ? 'default' : 'secondary'}
                              className={order.status === 'completed' ? 'bg-eco text-eco-foreground' : ''}
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>Qty: {order.quantity}</span>
                            <span>•</span>
                            <span>${order.totalPrice.toFixed(2)}</span>
                            <span>•</span>
                            <span>Pickup: {order.pickupTime}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="eco-badge text-xs">
                              🌱 Saved {order.co2Saved.toFixed(1)} kg CO₂
                            </span>
                          </div>
                        </div>
                      </div>
                      {order.status === 'completed' && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReview(order)}
                            className="gap-2"
                          >
                            <Star className="w-4 h-4" />
                            Leave Review
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No orders yet</h3>
                  <p className="text-muted-foreground">Your order history will appear here</p>
                </div>
              )}
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="p-6 max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold">Profile Settings</h2>
                  <Button
                    variant={editProfile ? 'default' : 'outline'}
                    onClick={() => {
                      if (editProfile) saveProfile();
                      else {
                        setProfileData({
                          name: user.name,
                          location: user.location || '',
                          phone: user.phone || '',
                        });
                        setEditProfile(true);
                      }
                    }}
                    className="gap-2"
                  >
                    {editProfile ? (
                      <>
                        <Check className="w-4 h-4" />
                        Save
                      </>
                    ) : (
                      <>
                        <Settings className="w-4 h-4" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Full Name</label>
                      {editProfile ? (
                        <Input
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        />
                      ) : (
                        <p className="text-muted-foreground">{user.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email</label>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Location</label>
                      {editProfile ? (
                        <Input
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        />
                      ) : (
                        <p className="text-muted-foreground">{user.location || 'Not set'}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Phone</label>
                      {editProfile ? (
                        <Input
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        />
                      ) : (
                        <p className="text-muted-foreground">{user.phone || 'Not set'}</p>
                      )}
                    </div>
                  </div>

                  {/* Impact Stats */}
                  <div className="mt-8 pt-8 border-t border-border">
                    <h3 className="font-semibold mb-4">Your Impact</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4 text-center bg-eco-light border-eco/20">
                        <Leaf className="w-8 h-8 mx-auto mb-2 text-eco" />
                        <p className="text-2xl font-bold text-eco">{(user.co2Saved || 0).toFixed(1)} kg</p>
                        <p className="text-sm text-muted-foreground">CO₂ Reduced</p>
                      </Card>
                      <Card className="p-4 text-center bg-primary/5 border-primary/20">
                        <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold text-primary">{user.mealsPurchased || 0}</p>
                        <p className="text-sm text-muted-foreground">Meals Saved</p>
                      </Card>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Purchase Dialog */}
        <Dialog open={purchaseDialog.open} onOpenChange={(open) => setPurchaseDialog({ ...purchaseDialog, open })}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reserve Deal</DialogTitle>
            </DialogHeader>
            {purchaseDialog.deal && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <img
                    src={purchaseDialog.deal.image}
                    alt={purchaseDialog.deal.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{purchaseDialog.deal.title}</h3>
                    <p className="text-sm text-muted-foreground">{purchaseDialog.deal.businessName}</p>
                    <p className="text-lg font-bold text-primary mt-2">
                      ${purchaseDialog.deal.discountPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Quantity</label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPurchaseQuantity(Math.max(1, purchaseQuantity - 1))}
                      disabled={purchaseQuantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-xl font-semibold w-8 text-center">{purchaseQuantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPurchaseQuantity(Math.min(purchaseDialog.deal!.quantity, purchaseQuantity + 1))}
                      disabled={purchaseQuantity >= purchaseDialog.deal.quantity}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      ({purchaseDialog.deal.quantity} available)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Pickup: {purchaseDialog.deal.pickupStart} - {purchaseDialog.deal.pickupEnd}</span>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-bold text-primary">
                      ${(purchaseDialog.deal.discountPrice * purchaseQuantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="eco-badge text-xs">
                    🌱 Saves {(purchaseDialog.deal.co2Saved * purchaseQuantity).toFixed(1)} kg CO₂
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setPurchaseDialog({ open: false, deal: null })}>
                Cancel
              </Button>
              <Button onClick={confirmPurchase} className="btn-bounce">
                Confirm Reservation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Review Dialog */}
        <Dialog open={reviewDialog.open} onOpenChange={(open) => setReviewDialog({ ...reviewDialog, open })}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Leave a Review</DialogTitle>
            </DialogHeader>
            {reviewDialog.order && (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  How was your experience with {reviewDialog.order.dealTitle}?
                </p>

                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= reviewRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Comment</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    className="w-full h-24 p-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setReviewDialog({ open: false, order: null })}>
                Cancel
              </Button>
              <Button onClick={submitReview} className="btn-bounce">
                Submit Review
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default CustomerDashboard;
