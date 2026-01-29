import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Store, Leaf, TrendingUp, Clock, Users, ChevronRight, Star, Quote, Utensils, Coffee, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { DealCard } from '@/components/deals/DealCard';
import { useApp } from '@/context/AppContext';

const Index = () => {
  const { deals } = useApp();
  const featuredDeals = deals.slice(0, 6);

  const stats = [
    { value: '700', unit: 'kg', label: 'Food Saved', icon: Leaf },
    { value: '3,000+', unit: '', label: 'Meals Purchased', icon: Utensils },
    { value: '1,500+', unit: 'kg', label: 'CO₂ Reduced', icon: TrendingUp },
    { value: '20+', unit: '', label: 'Business Partners', icon: Store },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Find Nearby Deals',
      description: 'Browse surplus food from restaurants, cafés, and stores near you.',
      icon: ShoppingBag,
    },
    {
      step: 2,
      title: 'Reserve & Save',
      description: 'Reserve your meal at up to 70% off the original price.',
      icon: Clock,
    },
    {
      step: 3,
      title: 'Pick Up & Enjoy',
      description: 'Collect your food at the scheduled time and enjoy!',
      icon: Users,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Customer',
      content: 'ReFood has changed how I think about food. Great meals at amazing prices, and I\'m helping the planet!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      name: 'Marco R.',
      role: 'Restaurant Owner',
      content: 'We\'ve reduced our food waste by 60% and gained new loyal customers. Win-win!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      name: 'Emily L.',
      role: 'Customer',
      content: 'The app is so easy to use. I get gourmet meals for a fraction of the price!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
  ];

  const categories = [
    { name: 'Restaurants', icon: Utensils, count: 45 },
    { name: 'Cafés', icon: Coffee, count: 32 },
    { name: 'Supermarkets', icon: ShoppingCart, count: 18 },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-eco/20 rounded-full blur-3xl animate-float animation-delay-200" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Eco Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco-light text-eco font-medium text-sm mb-6 animate-fade-in-up">
              <Leaf className="w-4 h-4" />
              Join the Food Rescue Movement
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up animation-delay-100">
              Save Food. Save Money.{' '}
              <span className="text-gradient-primary">Save the Planet.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              Discover delicious surplus meals from local businesses at up to 70% off. 
              Fight food waste while enjoying amazing deals.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-300">
              <Link to="/register/customer">
                <Button size="lg" className="btn-bounce gap-2 text-lg px-8 py-6">
                  <ShoppingBag className="w-5 h-5" />
                  Find Deals
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/register/business">
                <Button size="lg" variant="outline" className="btn-bounce gap-2 text-lg px-8 py-6">
                  <Store className="w-5 h-5" />
                  Join as a Business
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in-up animation-delay-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background" />
                  ))}
                </div>
                <span>3,000+ happy customers</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value}
                  {stat.unit && <span className="text-lg ml-1">{stat.unit}</span>}
                </div>
                <p className="text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Saving food has never been easier. Follow these simple steps to start.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorks.map((item, index) => (
              <div
                key={item.step}
                className="relative text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Connector Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
                )}
                
                {/* Step Number */}
                <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold mb-4 shadow-lg">
                  {item.step}
                </div>

                <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Browse by Category
            </h2>
            <Link to="/register/customer" className="flex items-center gap-1 text-primary hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link key={category.name} to="/register/customer">
                <Card className="p-6 card-hover cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <category.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-muted-foreground text-sm">{category.count} deals available</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                Featured Deals
              </h2>
              <p className="text-muted-foreground">
                Don't miss these amazing offers near you
              </p>
            </div>
            <Link to="/register/customer">
              <Button variant="outline" className="gap-2">
                See All Deals
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                showPurchase={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              What People Say
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Join thousands of happy customers and businesses
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.name}
                className="p-6 card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-foreground mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mt-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Join ReFood today and start saving food, money, and the planet. 
            Every meal counts!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register/customer">
              <Button size="lg" variant="secondary" className="btn-bounce gap-2 text-lg px-8">
                <ShoppingBag className="w-5 h-5" />
                Start Saving
              </Button>
            </Link>
            <Link to="/register/business">
              <Button
                size="lg"
                variant="outline"
                className="btn-bounce gap-2 text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Store className="w-5 h-5" />
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
