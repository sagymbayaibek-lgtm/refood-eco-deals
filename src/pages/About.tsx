import { Layout } from '@/components/layout/Layout';
import { Leaf, Users, Target, Heart, TrendingUp, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';

const About = () => {
  const values = [
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'We believe in reducing food waste to protect our planet for future generations.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building connections between local businesses and conscious consumers.',
    },
    {
      icon: Target,
      title: 'Impact',
      description: 'Every meal saved is a step towards a more sustainable world.',
    },
    {
      icon: Heart,
      title: 'Quality',
      description: 'We ensure all food on our platform meets the highest standards.',
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    },
    {
      name: 'Emma Williams',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    },
    {
      name: 'David Park',
      role: 'Head of Partnerships',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco-light text-eco font-medium text-sm mb-6">
            <Leaf className="w-4 h-4" />
            Our Mission
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Fighting Food Waste,<br />
            <span className="text-gradient-primary">One Meal at a Time</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ReFood is on a mission to eliminate food waste by connecting surplus food from 
            businesses with customers who appreciate great deals and care about the planet.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                ReFood was born from a simple observation: every day, restaurants, cafés, 
                and supermarkets throw away perfectly good food while many people search 
                for affordable, quality meals.
              </p>
              <p className="text-muted-foreground mb-4">
                Founded in 2024, we set out to build a platform that turns this problem 
                into an opportunity. By connecting businesses with surplus food to conscious 
                consumers, we create value for everyone while reducing environmental impact.
              </p>
              <p className="text-muted-foreground">
                Today, ReFood partners with hundreds of businesses and has helped save 
                thousands of meals from going to waste, one delicious deal at a time.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center bg-primary/5">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold">700+</p>
                <p className="text-sm text-muted-foreground">kg Food Saved</p>
              </Card>
              <Card className="p-6 text-center bg-eco-light">
                <Leaf className="w-8 h-8 mx-auto mb-2 text-eco" />
                <p className="text-3xl font-bold">1,500+</p>
                <p className="text-sm text-muted-foreground">kg CO₂ Reduced</p>
              </Card>
              <Card className="p-6 text-center bg-secondary">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold">3,000+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </Card>
              <Card className="p-6 text-center bg-muted">
                <Globe className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold">20+</p>
                <p className="text-sm text-muted-foreground">Partner Businesses</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="p-6 text-center card-hover">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
