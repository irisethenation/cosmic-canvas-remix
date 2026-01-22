import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LavaLampBackground from '@/components/LavaLampBackground';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Phone, 
  Clock, 
  Calendar, 
  CheckCircle, 
  ExternalLink,
  Loader2
} from 'lucide-react';

interface PaidCallProduct {
  id: string;
  name: string;
  description: string | null;
  price_gbp: number;
  duration_minutes: number;
  entitlement: string;
  calendly_event_type_url: string | null;
  active: boolean;
}

interface PaidCallBooking {
  id: string;
  product_id: string;
  payment_status: string;
  status: string;
  scheduled_start: string | null;
  scheduled_end: string | null;
  meeting_link: string | null;
  created_at: string;
  paid_call_products?: PaidCallProduct;
}

const entitlementLabels: Record<string, { label: string; color: string }> = {
  MORPHEUS_CALL: { label: 'AI Support', color: 'bg-amber-500' },
  TRINITY_CALL: { label: 'Onboarding', color: 'bg-purple-500' },
  HUMAN_CALL: { label: 'Expert Consultation', color: 'bg-blue-500' },
};

const PaidCalls = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<PaidCallProduct[]>([]);
  const [bookings, setBookings] = useState<PaidCallBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('paid_call_products')
      .select('*')
      .eq('active', true)
      .order('price_gbp', { ascending: true });
    
    setProducts(data || []);
    setLoading(false);
  };

  const fetchBookings = async () => {
    const { data } = await supabase
      .from('paid_call_bookings')
      .select('*, paid_call_products(*)')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
    
    setBookings(data || []);
  };

  const handlePurchase = async (product: PaidCallProduct) => {
    if (!user) {
      toast({ title: 'Please log in', description: 'You need to be logged in to purchase calls', variant: 'destructive' });
      return;
    }

    setPurchasing(product.id);
    try {
      // Create a pending booking
      const { data: booking, error: bookingError } = await supabase
        .from('paid_call_bookings')
        .insert({
          user_id: user.id,
          product_id: product.id,
          payment_status: 'PENDING',
          status: 'PENDING',
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // If Calendly is configured, redirect to Calendly
      if (product.calendly_event_type_url) {
        // Build Calendly URL with prefilled info
        const calendlyUrl = new URL(product.calendly_event_type_url);
        calendlyUrl.searchParams.set('email', user.email || '');
        calendlyUrl.searchParams.set('name', user.email?.split('@')[0] || '');
        
        // Open Calendly in new tab
        window.open(calendlyUrl.toString(), '_blank');
        
        toast({
          title: 'Booking Started',
          description: 'Complete your booking in the Calendly window. Payment will be collected after scheduling.',
        });
      } else {
        // TODO: Integrate with Stripe checkout
        toast({
          title: 'Coming Soon',
          description: 'Stripe payment integration is being configured.',
        });
      }

      fetchBookings();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setPurchasing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-yellow-500',
      SCHEDULED: 'bg-blue-500',
      COMPLETED: 'bg-green-500',
      NO_SHOW: 'bg-red-500',
      CANCELED: 'bg-slate-500',
    };
    return <Badge className={`${styles[status] || 'bg-slate-500'} text-white`}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background relative">
      <LavaLampBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 lava-heading lava-adaptive-text">
              Paid Support Calls
            </h1>
            <p className="text-xl max-w-2xl mx-auto lava-adaptive-text opacity-80">
              Get personalized guidance with our expert support sessions
            </p>
          </div>

          <Tabs defaultValue="products" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="products">
                <Phone className="h-4 w-4 mr-2" />
                Available Calls
              </TabsTrigger>
              <TabsTrigger value="bookings">
                <Calendar className="h-4 w-4 mr-2" />
                My Bookings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-500" />
                </div>
              ) : products.length === 0 ? (
                <Card className="lava-glass text-center py-12">
                  <CardContent>
                    <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No call products available yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="lava-glass hover:border-amber-500/50 transition-colors">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${entitlementLabels[product.entitlement]?.color} text-white`}>
                            {entitlementLabels[product.entitlement]?.label}
                          </Badge>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">{product.duration_minutes} min</span>
                          </div>
                        </div>
                        <CardTitle className="text-foreground">{product.name}</CardTitle>
                        <CardDescription>{product.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end justify-between">
                          <div>
                            <span className="text-3xl font-bold text-amber-400">£{product.price_gbp}</span>
                          </div>
                          <Button
                            onClick={() => handlePurchase(product)}
                            disabled={purchasing === product.id}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                          >
                            {purchasing === product.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Calendar className="h-4 w-4 mr-2" />
                                Book Now
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="bookings">
              {!user ? (
                <Card className="lava-glass text-center py-12">
                  <CardContent>
                    <p className="text-muted-foreground">Please log in to view your bookings</p>
                  </CardContent>
                </Card>
              ) : bookings.length === 0 ? (
                <Card className="lava-glass text-center py-12">
                  <CardContent>
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No bookings yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="lava-glass">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {booking.paid_call_products?.name || 'Call Booking'}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                              {getStatusBadge(booking.status)}
                              <Badge variant="outline">{booking.payment_status}</Badge>
                            </div>
                            {booking.scheduled_start && (
                              <p className="text-sm text-muted-foreground mt-2">
                                <Calendar className="h-4 w-4 inline mr-1" />
                                {new Date(booking.scheduled_start).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {booking.meeting_link && booking.status === 'SCHEDULED' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(booking.meeting_link!, '_blank')}
                                className="border-amber-500/50 text-amber-400"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Join Call
                              </Button>
                            )}
                            {booking.status === 'COMPLETED' && (
                              <CheckCircle className="h-6 w-6 text-green-500" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default PaidCalls;
