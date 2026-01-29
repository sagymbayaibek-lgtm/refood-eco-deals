import { Layout } from '@/components/layout/Layout';
import { FileText } from 'lucide-react';

const Terms = () => {
  return (
    <Layout>
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            <FileText className="w-4 h-4" />
            Legal
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">Last updated: January 2024</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-display text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-6">
              By accessing or using ReFood, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>

            <h2 className="font-display text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground mb-6">
              ReFood is a marketplace platform that connects food businesses with surplus food 
              to consumers seeking discounted meals. We facilitate transactions but are not 
              responsible for the quality of food provided by businesses.
            </p>

            <h2 className="font-display text-2xl font-bold mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground mb-4">To use certain features, you must create an account. You agree to:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be responsible for all activities under your account</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mb-4">4. Customer Responsibilities</h2>
            <p className="text-muted-foreground mb-4">As a customer, you agree to:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Pick up orders within the specified time window</li>
              <li>Treat businesses and their staff with respect</li>
              <li>Report any issues with orders within 24 hours</li>
              <li>Not resell purchased items</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mb-4">5. Business Responsibilities</h2>
            <p className="text-muted-foreground mb-4">As a business partner, you agree to:</p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Maintain valid food handling licenses and permits</li>
              <li>Ensure all listed food meets safety standards</li>
              <li>Accurately describe all deals and offerings</li>
              <li>Honor all confirmed reservations</li>
              <li>Maintain appropriate business insurance</li>
            </ul>

            <h2 className="font-display text-2xl font-bold mb-4">6. Payment Terms</h2>
            <p className="text-muted-foreground mb-6">
              Payment is processed at the time of reservation. Refunds are handled on a 
              case-by-case basis. Businesses receive payouts according to our standard 
              settlement schedule, minus applicable fees.
            </p>

            <h2 className="font-display text-2xl font-bold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-6">
              ReFood is not liable for any indirect, incidental, special, consequential, or 
              punitive damages arising from your use of the service. Our total liability is 
              limited to the amount you paid for the specific transaction in question.
            </p>

            <h2 className="font-display text-2xl font-bold mb-4">8. Termination</h2>
            <p className="text-muted-foreground mb-6">
              We may terminate or suspend your account at any time for violations of these 
              terms or for any other reason at our sole discretion.
            </p>

            <h2 className="font-display text-2xl font-bold mb-4">9. Changes to Terms</h2>
            <p className="text-muted-foreground mb-6">
              We reserve the right to modify these terms at any time. Continued use of the 
              service after changes constitutes acceptance of the modified terms.
            </p>

            <h2 className="font-display text-2xl font-bold mb-4">10. Contact</h2>
            <p className="text-muted-foreground mb-6">
              For questions about these Terms of Service, contact us at legal@refood.com 
              or +1 (555) 123-4567.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
