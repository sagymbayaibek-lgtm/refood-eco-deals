import { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CreditCard, Check, Clock, Leaf,
  ShieldCheck, Loader2, AlertCircle, Smartphone, MapPin
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useApp, Deal } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/Layout';

type PaymentMethod = 'kaspi' | 'card';
type CheckoutStep = 1 | 2 | 3;

const Checkout = () => {
  const { user, deals, addOrder } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const dealId = searchParams.get('dealId');
  const qtyParam = parseInt(searchParams.get('qty') || '1', 10);

  const [deal, setDeal] = useState<Deal | null>(null);
  const [quantity, setQuantity] = useState(qtyParam);
  const [step, setStep] = useState<CheckoutStep>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderQrCode, setOrderQrCode] = useState('');

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  useEffect(() => {
    if (dealId) {
      const found = deals.find(d => d.id === dealId);
      if (found) setDeal(found);
    }
  }, [dealId, deals]);

  if (!user || user.role !== 'customer') return <Navigate to="/login" replace />;
  if (!deal) return <Navigate to="/customer/dashboard" replace />;

  const total = deal.discountPrice * quantity;
  const savings = (deal.originalPrice - deal.discountPrice) * quantity;
  const co2 = deal.co2Saved * quantity;
  const discountPercent = Math.round((1 - deal.discountPrice / deal.originalPrice) * 100);

  const handlePayment = async () => {
    if (!paymentMethod) return;
    setIsProcessing(true);
    setPaymentError(false);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 90% success rate simulation
    const success = Math.random() > 0.1;

    if (success) {
      const qrCode = `REFOOD-${Date.now()}-${deal.id}-${quantity}`;
      setOrderQrCode(qrCode);
      addOrder(deal.id, quantity, paymentMethod);
      setOrderComplete(true);
      setStep(3);
    } else {
      setPaymentError(true);
    }
    setIsProcessing(false);
  };

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const canProceedStep2 = paymentMethod === 'kaspi' || (cardNumber.replace(/\s/g, '').length === 16 && cardExpiry.length === 5 && cardCvv.length === 3);

  return (
    <Layout showFooter={false}>
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-6 max-w-3xl">

          {/* Back button */}
          {step < 3 && (
            <Button
              variant="ghost"
              onClick={() => step === 1 ? navigate(-1) : setStep((step - 1) as CheckoutStep)}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 1 ? 'Back to deals' : 'Back'}
            </Button>
          )}

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  s <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && <div className={`w-12 h-0.5 ${s < step ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Order Review */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h1 className="font-display text-2xl font-bold">Review Your Order</h1>

              <Card className="p-6">
                <div className="flex gap-4">
                  <img src={deal.image} alt={deal.title} className="w-28 h-28 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {deal.businessLogo && <img src={deal.businessLogo} alt="" className="w-5 h-5 rounded-full object-cover" />}
                      <span className="text-sm text-muted-foreground">{deal.businessName}</span>
                    </div>
                    <h2 className="font-semibold text-lg">{deal.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{deal.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Pickup: {deal.pickupStart} - {deal.pickupEnd}</span>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="mt-6 pt-4 border-t border-border">
                  <label className="text-sm font-medium mb-2 block">Quantity</label>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>-</Button>
                    <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => setQuantity(Math.min(deal.quantity, quantity + 1))} disabled={quantity >= deal.quantity}>+</Button>
                    <span className="text-sm text-muted-foreground">({deal.quantity} available)</span>
                  </div>
                </div>
              </Card>

              {/* Price Breakdown */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Price Breakdown</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Original price × {quantity}</span>
                    <span className="line-through text-muted-foreground">${(deal.originalPrice * quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-eco font-medium">
                    <span>Discount ({discountPercent}% off)</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </Card>

              {/* Impact Preview */}
              <Card className="p-4 bg-eco-light border-eco/20">
                <div className="flex items-center gap-3">
                  <Leaf className="w-6 h-6 text-eco" />
                  <div>
                    <p className="font-semibold text-eco">Environmental Impact</p>
                    <p className="text-sm text-muted-foreground">This purchase saves {co2.toFixed(1)} kg CO₂ and rescues {quantity} meal{quantity > 1 ? 's' : ''} from waste</p>
                  </div>
                </div>
              </Card>

              <Button onClick={() => setStep(2)} className="w-full btn-bounce gap-2" size="lg">
                Proceed to Payment
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h1 className="font-display text-2xl font-bold">Payment</h1>

              {/* Payment Methods */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Select Payment Method</label>

                {/* Kaspi Pay */}
                <Card
                  className={`p-4 cursor-pointer transition-all border-2 ${paymentMethod === 'kaspi' ? 'border-primary shadow-md' : 'border-transparent hover:border-primary/30'}`}
                  onClick={() => { setPaymentMethod('kaspi'); setPaymentError(false); }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-destructive flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-destructive-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Kaspi Pay</p>
                      <p className="text-sm text-muted-foreground">Fast and secure payment via Kaspi</p>
                    </div>
                    {paymentMethod === 'kaspi' && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </Card>

                {/* Card */}
                <Card
                  className={`p-4 cursor-pointer transition-all border-2 ${paymentMethod === 'card' ? 'border-primary shadow-md' : 'border-transparent hover:border-primary/30'}`}
                  onClick={() => { setPaymentMethod('card'); setPaymentError(false); }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Bank Card</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
                    </div>
                    {paymentMethod === 'card' && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Card Form */}
                  {paymentMethod === 'card' && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3" onClick={e => e.stopPropagation()}>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Card Number</label>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCard(e.target.value))}
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Expiry</label>
                          <Input
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">CVV</label>
                          <Input
                            placeholder="123"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            maxLength={3}
                            type="password"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Error */}
              {paymentError && (
                <Card className="p-4 border-destructive/50 bg-destructive/5">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <div>
                      <p className="font-semibold text-destructive">Payment Failed</p>
                      <p className="text-sm text-muted-foreground">Please try again or choose a different payment method.</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Order Summary */}
              <Card className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">{deal.title} × {quantity}</p>
                    <p className="text-xl font-bold text-primary">${total.toFixed(2)}</p>
                  </div>
                  <div className="eco-badge text-xs">🌱 -{co2.toFixed(1)} kg CO₂</div>
                </div>
              </Card>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Secure Payment</div>
                <div className="flex items-center gap-1"><Check className="w-4 h-4" /> Instant Confirmation</div>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full btn-bounce gap-2"
                size="lg"
                disabled={!paymentMethod || isProcessing || (paymentMethod === 'card' && !canProceedStep2)}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    Pay ${total.toFixed(2)}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && orderComplete && (
            <div className="text-center space-y-6 py-8 animate-scale-in">
              <div className="w-20 h-20 rounded-full bg-eco/10 flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-eco" />
              </div>

              <div>
                <h1 className="font-display text-2xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground">Your order has been confirmed</p>
              </div>

              <Card className="p-6 text-left">
                <div className="flex gap-4 mb-4">
                  <img src={deal.image} alt={deal.title} className="w-20 h-20 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-semibold">{deal.title}</h3>
                    <p className="text-sm text-muted-foreground">{deal.businessName}</p>
                    <Badge className="mt-1 bg-eco/10 text-eco border-eco/20">Confirmed</Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm border-t border-border pt-4">
                  <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span>{quantity}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Payment Method</span><span className="capitalize">{paymentMethod === 'kaspi' ? 'Kaspi Pay' : 'Bank Card'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Pickup Time</span><span>{deal.pickupStart} - {deal.pickupEnd}</span></div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-border"><span>Total Paid</span><span className="text-primary">${total.toFixed(2)}</span></div>
                </div>
              </Card>

              {/* Impact card */}
              <Card className="p-4 bg-eco-light border-eco/20">
                <div className="flex items-center gap-3 justify-center">
                  <Leaf className="w-5 h-5 text-eco" />
                  <span className="font-medium text-eco">You saved {co2.toFixed(1)} kg CO₂ with this purchase! 🎉</span>
                </div>
              </Card>

              {/* QR Code */}
              {orderQrCode && (
                <Card className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Your Pickup QR Code</h3>
                  <p className="text-sm text-muted-foreground mb-4">Show this to the business staff when you pick up your order</p>
                  <div className="flex justify-center">
                    <QRCodeSVG value={orderQrCode} size={180} level="H" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 font-mono">{orderQrCode}</p>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/customer/dashboard')} className="btn-bounce gap-2">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={() => navigate('/customer/dashboard')}>
                  Browse More Deals
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
