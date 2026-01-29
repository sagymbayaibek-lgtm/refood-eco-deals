import { Layout } from '@/components/layout/Layout';
import { Shield } from 'lucide-react';

const Privacy = () => {
  return (
    <Layout>
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            <Shield className="w-4 h-4" />
            Privacy
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">Last updated: January 2024</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-display text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-6">
              At ReFood, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our platform.
            </p>

            <h2 className="font-display text-2xl font-bold mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Name and email address</li>
              <li>Phone number and location</li>
              <li>Business information (for business accounts)</li>
              <li>Payment information</li>
              <li>Order history and preferences</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Personalize your experience on our platform</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mb-4">4. Information Sharing</h2>
            <p className="text-muted-foreground mb-6">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              except as necessary to provide our services, comply with the law, or protect our rights.
            </p>

            <h2 className="font-display text-2xl font-bold mb-4">5. Data Security</h2>
            <p className="text-muted-foreground mb-6">
              We implement appropriate technical and organizational measures to protect your personal 
              data against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="font-display text-2xl font-bold mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request data portability</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mb-4">7. Contact Us</h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions about this Privacy Policy, please contact us at 
              privacy@refood.com or +1 (555) 123-4567.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
