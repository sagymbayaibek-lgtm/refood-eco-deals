import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Store, Package, Clock, BarChart3, Star, User, Settings,
  Plus, Edit, Trash2, Check, X, TrendingUp, DollarSign,
  Leaf, Eye, ChevronDown, ChevronUp, Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useApp, Deal, Order } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/Layout';

const BusinessDashboard = () => {
  const { user, getBusinessDeals, getBusinessOrders, getBusinessReviews, addDeal, updateDeal, deleteDeal, updateOrderStatus, updateUser } = useApp();
  const { toast } = useToast();

  // State
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [dealForm, setDealForm] = useState({
    title: '',
    description: '',
    originalPrice: '',
    discountPrice: '',
    quantity: '',
    pickupStart: '',
    pickupEnd: '',
    category: '',
    image: '',
    co2Saved: '',
  });

  // Profile edit
  const [editProfile, setEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    businessName: user?.businessName || '',
    businessAddress: user?.businessAddress || '',
    phone: user?.phone || '',
    logo: user?.logo || '',
  });

  if (!user || user.role !== 'business') {
    return <Navigate to="/login" replace />;
  }

  const deals = getBusinessDeals();
  const orders = getBusinessOrders();
  const reviews = getBusinessReviews();

  // Analytics
  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalPrice, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const totalCO2Saved = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.co2Saved, 0);

  const resetDealForm = () => {
    setDealForm({
      title: '',
      description: '',
      originalPrice: '',
      discountPrice: '',
      quantity: '',
      pickupStart: '',
      pickupEnd: '',
      category: user.category || 'Restaurant',
      image: '',
      co2Saved: '',
    });
  };

  const handleAddDeal = () => {
    resetDealForm();
    setEditingDeal(null);
    setShowAddDeal(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setDealForm({
      title: deal.title,
      description: deal.description,
      originalPrice: deal.originalPrice.toString(),
      discountPrice: deal.discountPrice.toString(),
      quantity: deal.quantity.toString(),
      pickupStart: deal.pickupStart,
      pickupEnd: deal.pickupEnd,
      category: deal.category,
      image: deal.image,
      co2Saved: deal.co2Saved.toString(),
    });
    setEditingDeal(deal);
    setShowAddDeal(true);
  };

  const handleDeleteDeal = (dealId: string) => {
    deleteDeal(dealId);
    toast({
      title: 'Deal deleted',
      description: 'The deal has been removed.',
    });
  };

  const saveDeal = () => {
    const dealData = {
      title: dealForm.title,
      description: dealForm.description,
      originalPrice: parseFloat(dealForm.originalPrice),
      discountPrice: parseFloat(dealForm.discountPrice),
      quantity: parseInt(dealForm.quantity),
      pickupStart: dealForm.pickupStart,
      pickupEnd: dealForm.pickupEnd,
      category: dealForm.category,
      image: dealForm.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=400&fit=crop',
      co2Saved: parseFloat(dealForm.co2Saved) || 2,
      distance: Math.random() * 3,
    };

    if (editingDeal) {
      updateDeal(editingDeal.id, dealData);
      toast({
        title: 'Deal updated!',
        description: 'Your changes have been saved.',
      });
    } else {
      addDeal(dealData);
      toast({
        title: 'Deal created!',
        description: 'Your new deal is now live.',
      });
    }

    setShowAddDeal(false);
    resetDealForm();
  };

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    toast({
      title: 'Order updated',
      description: `Order status changed to ${status}`,
    });
  };

  const saveProfile = () => {
    updateUser(profileData);
    setEditProfile(false);
    toast({
      title: 'Profile updated!',
      description: 'Your business profile has been saved.',
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isLogo = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isLogo) {
          setProfileData({ ...profileData, logo: reader.result as string });
        } else {
          setDealForm({ ...dealForm, image: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = ['Restaurant', 'Café', 'Bakery', 'Supermarket', 'Grocery Store', 'Hotel', 'Catering', 'Other'];

  return (
    <Layout showFooter={false}>
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              {user.logo && (
                <img
                  src={user.logo}
                  alt={user.businessName}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-border"
                />
              )}
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold">
                  {user.businessName || 'Your Business'}
                </h1>
                <p className="text-muted-foreground">{user.category}</p>
              </div>
            </div>
            <Button onClick={handleAddDeal} className="btn-bounce gap-2">
              <Plus className="w-4 h-4" />
              Add New Deal
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-xl font-bold">${totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-xl font-bold">{completedOrders}/{totalOrders}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-xl font-bold">{avgRating.toFixed(1)} ⭐</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-eco-light flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-eco" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                  <p className="text-xl font-bold text-eco">{totalCO2Saved.toFixed(1)} kg</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="deals" className="space-y-6">
            <TabsList className="bg-background border">
              <TabsTrigger value="deals" className="gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">My Deals</span>
                {deals.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{deals.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
                {orders.filter(o => o.status === 'pending').length > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {orders.filter(o => o.status === 'pending').length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2">
                <Star className="w-4 h-4" />
                <span className="hidden sm:inline">Reviews</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
            </TabsList>

            {/* Deals Tab */}
            <TabsContent value="deals" className="space-y-4">
              {deals.length > 0 ? (
                <div className="grid gap-4">
                  {deals.map((deal) => (
                    <Card key={deal.id} className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={deal.image}
                          alt={deal.title}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{deal.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">{deal.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditDeal(deal)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteDeal(deal.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="font-bold text-primary">${deal.discountPrice.toFixed(2)}</span>
                            <span className="text-muted-foreground line-through">${deal.originalPrice.toFixed(2)}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{deal.quantity} left</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{deal.pickupStart} - {deal.pickupEnd}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">{deal.category}</Badge>
                            <span className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              {deal.rating.toFixed(1)} ({deal.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No deals yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first deal to start selling</p>
                  <Button onClick={handleAddDeal} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Deal
                  </Button>
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
                              <p className="text-sm text-muted-foreground">
                                Customer: {order.customerName}
                              </p>
                            </div>
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-background z-50">
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="ready">Ready</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>Qty: {order.quantity}</span>
                            <span>•</span>
                            <span>${order.totalPrice.toFixed(2)}</span>
                            <span>•</span>
                            <span>Pickup: {order.pickupTime}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No orders yet</h3>
                  <p className="text-muted-foreground">Orders will appear here when customers reserve your deals</p>
                </div>
              )}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-4">
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{review.customerName}</p>
                          <div className="flex gap-1 mt-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="mt-2 text-muted-foreground">{review.comment}</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">Customer reviews will appear here</p>
                </div>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Performance Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Total Revenue</span>
                      <span className="font-bold text-lg">${totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Total Orders</span>
                      <span className="font-bold text-lg">{totalOrders}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Completed Orders</span>
                      <span className="font-bold text-lg">{completedOrders}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Average Rating</span>
                      <span className="font-bold text-lg">{avgRating.toFixed(1)} ⭐</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Active Deals</span>
                      <span className="font-bold text-lg">{deals.length}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-eco" />
                    Environmental Impact
                  </h3>
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <div className="w-24 h-24 rounded-full bg-eco-light flex items-center justify-center mx-auto mb-4">
                        <Leaf className="w-12 h-12 text-eco" />
                      </div>
                      <p className="text-3xl font-bold text-eco">{totalCO2Saved.toFixed(1)} kg</p>
                      <p className="text-muted-foreground">CO₂ Emissions Prevented</p>
                    </div>
                    <p className="text-sm text-center text-muted-foreground">
                      By selling surplus food, you've helped reduce environmental impact and 
                      contributed to a more sustainable future! 🌍
                    </p>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="p-6 max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold">Business Profile</h2>
                  <Button
                    variant={editProfile ? 'default' : 'outline'}
                    onClick={() => {
                      if (editProfile) saveProfile();
                      else {
                        setProfileData({
                          name: user.name,
                          businessName: user.businessName || '',
                          businessAddress: user.businessAddress || '',
                          phone: user.phone || '',
                          logo: user.logo || '',
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

                {/* Logo */}
                <div className="flex justify-center mb-6">
                  <label className={`cursor-pointer group ${editProfile ? '' : 'pointer-events-none'}`}>
                    <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-border hover:border-primary flex items-center justify-center overflow-hidden transition-colors">
                      {profileData.logo ? (
                        <img src={profileData.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    {editProfile && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, true)}
                        className="hidden"
                      />
                    )}
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Business Name</label>
                      {editProfile ? (
                        <Input
                          value={profileData.businessName}
                          onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                        />
                      ) : (
                        <p className="text-muted-foreground">{user.businessName}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Owner Name</label>
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
                      <label className="text-sm font-medium mb-1 block">Category</label>
                      <p className="text-muted-foreground">{user.category}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium mb-1 block">Business Address</label>
                      {editProfile ? (
                        <Input
                          value={profileData.businessAddress}
                          onChange={(e) => setProfileData({ ...profileData, businessAddress: e.target.value })}
                        />
                      ) : (
                        <p className="text-muted-foreground">{user.businessAddress || 'Not set'}</p>
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
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Add/Edit Deal Dialog */}
        <Dialog open={showAddDeal} onOpenChange={setShowAddDeal}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDeal ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium mb-2 block">Deal Image</label>
                <label className="cursor-pointer block">
                  <div className="w-full h-40 rounded-lg border-2 border-dashed border-border hover:border-primary flex items-center justify-center overflow-hidden transition-colors">
                    {dealForm.image ? (
                      <img src={dealForm.image} alt="Deal" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Click to upload image</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e)}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Title *</label>
                <Input
                  value={dealForm.title}
                  onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
                  placeholder="Surprise Pizza Box"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Description *</label>
                <Textarea
                  value={dealForm.description}
                  onChange={(e) => setDealForm({ ...dealForm, description: e.target.value })}
                  placeholder="Describe what's included..."
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Original Price ($) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={dealForm.originalPrice}
                    onChange={(e) => setDealForm({ ...dealForm, originalPrice: e.target.value })}
                    placeholder="25.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Discount Price ($) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={dealForm.discountPrice}
                    onChange={(e) => setDealForm({ ...dealForm, discountPrice: e.target.value })}
                    placeholder="9.99"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Quantity *</label>
                  <Input
                    type="number"
                    value={dealForm.quantity}
                    onChange={(e) => setDealForm({ ...dealForm, quantity: e.target.value })}
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Category *</label>
                  <Select
                    value={dealForm.category}
                    onValueChange={(value) => setDealForm({ ...dealForm, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Pickup Start *</label>
                  <Input
                    type="time"
                    value={dealForm.pickupStart}
                    onChange={(e) => setDealForm({ ...dealForm, pickupStart: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Pickup End *</label>
                  <Input
                    type="time"
                    value={dealForm.pickupEnd}
                    onChange={(e) => setDealForm({ ...dealForm, pickupEnd: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">CO₂ Saved (kg)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={dealForm.co2Saved}
                  onChange={(e) => setDealForm({ ...dealForm, co2Saved: e.target.value })}
                  placeholder="2.0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDeal(false)}>
                Cancel
              </Button>
              <Button
                onClick={saveDeal}
                disabled={!dealForm.title || !dealForm.description || !dealForm.originalPrice || !dealForm.discountPrice || !dealForm.quantity}
                className="btn-bounce"
              >
                {editingDeal ? 'Save Changes' : 'Create Deal'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default BusinessDashboard;
