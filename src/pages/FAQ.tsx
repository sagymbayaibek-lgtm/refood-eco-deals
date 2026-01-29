import { Layout } from '@/components/layout/Layout';
import { HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const faqCategories = [
    {
      title: 'For Customers',
      questions: [
        {
          question: 'How does ReFood work?',
          answer: 'ReFood connects you with local restaurants, cafés, and stores that have surplus food. Browse deals near you, reserve your meal at a discounted price, and pick it up during the specified time window. It\'s that simple!',
        },
        {
          question: 'What type of food can I expect?',
          answer: 'The food varies depending on the business. You might find pizzas, pastries, sushi, sandwiches, prepared meals, fresh produce, and more. Each listing describes what\'s included so you know what you\'re getting.',
        },
        {
          question: 'How much can I save?',
          answer: 'Most deals offer 50-70% off the original price. This means you can enjoy quality meals at a fraction of the cost while helping reduce food waste.',
        },
        {
          question: 'Is the food safe to eat?',
          answer: 'Absolutely! All food on ReFood is perfectly good to eat. It\'s simply surplus food that would otherwise go to waste. Businesses maintain their regular food safety standards.',
        },
        {
          question: 'Can I request a refund?',
          answer: 'If there\'s an issue with your order, contact us within 24 hours. We review each case individually and work to ensure customer satisfaction.',
        },
      ],
    },
    {
      title: 'For Businesses',
      questions: [
        {
          question: 'How do I join ReFood as a business?',
          answer: 'Simply click "Join as a Business" on our homepage, fill out the registration form, and start listing your surplus food. Our team will verify your account and you can begin selling within 24 hours.',
        },
        {
          question: 'What are the costs involved?',
          answer: 'ReFood takes a small commission on each sale. There are no upfront costs, monthly fees, or minimum commitments. You only pay when you sell.',
        },
        {
          question: 'How do I manage my listings?',
          answer: 'Use our intuitive business dashboard to create deals, manage inventory, track orders, and view analytics. You can add new deals in minutes.',
        },
        {
          question: 'When do customers pick up orders?',
          answer: 'You set the pickup window that works for your business. Customers reserve their order and come to collect during your specified time.',
        },
        {
          question: 'What happens to unsold items?',
          answer: 'If items don\'t sell, simply update the quantity in your dashboard. You\'re never obligated to reserve specific inventory for ReFood.',
        },
      ],
    },
    {
      title: 'General',
      questions: [
        {
          question: 'How does ReFood help the environment?',
          answer: 'Every meal saved from the bin reduces CO₂ emissions associated with food production and waste. We track and display the environmental impact of each purchase.',
        },
        {
          question: 'Is ReFood available in my area?',
          answer: 'We\'re currently operating in major cities and expanding rapidly. Enter your location on the app to see available deals near you.',
        },
        {
          question: 'How can I contact support?',
          answer: 'Reach out via our Contact page, email us at hello@refood.com, or call +1 (555) 123-4567 during business hours.',
        },
        {
          question: 'Can I partner with ReFood for corporate orders?',
          answer: 'Yes! We offer corporate partnerships for companies looking to provide sustainable meal options for their employees. Contact our partnerships team.',
        },
      ],
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked<br />
            <span className="text-gradient-primary">Questions</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about using ReFood as a customer or business partner.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {faqCategories.map((category) => (
            <div key={category.title} className="mb-12">
              <h2 className="font-display text-2xl font-bold mb-6">{category.title}</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`${category.title}-${index}`}
                    className="border rounded-xl px-6 bg-card"
                  >
                    <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
