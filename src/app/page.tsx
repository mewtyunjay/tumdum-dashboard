'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area
} from 'recharts';

const PricingDashboard = () => {
  // Core pricing inputs with empty defaults
  const [menuPrice, setMenuPrice] = useState<number | ''>('');
  const [zomatoListedPrice, setZomatoListedPrice] = useState<number | ''>('');
  const [zomatoCommission, setZomatoCommission] = useState<number | ''>('');
  const [zomatoDiscount, setZomatoDiscount] = useState<number | ''>('');
  const [distance, setDistance] = useState<number | ''>('');
  const [zomatoDeliveryFeeOverride, setZomatoDeliveryFeeOverride] = useState<number | ''>('');
  const [isGoldEnabled, setIsGoldEnabled] = useState(false);
  const [profitMargin, setProfitMargin] = useState(5); // Default 5% more profit

  // Calculated values
  const [recommendedPrice, setRecommendedPrice] = useState<number | null>(null);
  const [comparison, setComparison] = useState({
    zomato: { customerPrice: 0, restaurantEarning: 0, deliveryFee: 0, effectiveCommission: 0, platformFee: 0, gst: 0 },
    tumdum: { customerPrice: 0, restaurantEarning: 0, deliveryFee: 0, platformFee: 0, gst: 0 }
  });

  // Calculate pricing and earnings
  useEffect(() => {
    if (!menuPrice || !zomatoListedPrice || !zomatoCommission || !distance) {
      return;
    }

    // Zomato calculations
    const calculatedZomatoDeliveryFee = isGoldEnabled && zomatoListedPrice > 199 && distance <= 7 
      ? 0 
      : distance * 7;
    
    // Use override delivery fee if provided
    const zomatoDeliveryFee = zomatoDeliveryFeeOverride !== '' 
      ? Number(zomatoDeliveryFeeOverride)
      : calculatedZomatoDeliveryFee;

    const zomatoPlatformFee = 10; // Fixed ₹10 platform fee
    const zomatoGst = Number(zomatoListedPrice) * 0.05; // 5% GST on listing price
    
    // Apply discount if provided (as absolute value)
    const discountedPrice = zomatoDiscount 
      ? Number(zomatoListedPrice) - Number(zomatoDiscount)
      : Number(zomatoListedPrice);
    
    const zomatoEarning = discountedPrice * (1 - Number(zomatoCommission) / 100);
    const effectiveCommission = ((Number(zomatoListedPrice) - zomatoEarning) / Number(zomatoListedPrice) * 100).toFixed(1);
    
    // Calculate recommended price based on chosen profit margin
    const targetEarning = zomatoEarning * (1 + profitMargin / 100);
    
    // TumDum calculations
    const tumDumPlatformFee = 5; // Fixed ₹5 platform fee
    const recommendedBasePrice = Math.ceil(targetEarning + tumDumPlatformFee); // Add platform fee to ensure target earning after fees
    const tumDumDeliveryFee = Number(distance) * 9;
    const tumDumGst = recommendedBasePrice * 0.05; // 5% GST on listing price
    
    setRecommendedPrice(recommendedBasePrice);
    
    setComparison({
      zomato: {
        customerPrice: discountedPrice + zomatoDeliveryFee + zomatoPlatformFee + zomatoGst,
        restaurantEarning: zomatoEarning,
        deliveryFee: zomatoDeliveryFee,
        effectiveCommission: Number(effectiveCommission),
        platformFee: zomatoPlatformFee,
        gst: zomatoGst
      },
      tumdum: {
        customerPrice: recommendedBasePrice + tumDumDeliveryFee + tumDumPlatformFee + tumDumGst,
        restaurantEarning: recommendedBasePrice - tumDumPlatformFee, // Subtract flat platform fee
        deliveryFee: tumDumDeliveryFee,
        platformFee: tumDumPlatformFee,
        gst: tumDumGst
      }
    });
  }, [menuPrice, zomatoListedPrice, zomatoCommission, zomatoDiscount, distance, zomatoDeliveryFeeOverride, isGoldEnabled, profitMargin]);

  // Generate data for order volume comparison
  const generateOrderVolumeData = () => {
    if (!recommendedPrice) return [];
    
    const orderVolumes = [1, 5, 10, 25, 50, 100, 200, 500];
    return orderVolumes.map(volume => {
      const zomatoProfit = comparison.zomato.restaurantEarning * volume;
      const tumDumProfit = comparison.tumdum.restaurantEarning * volume;
      const profitDifference = tumDumProfit - zomatoProfit;
      const percentageGain = zomatoProfit > 0 
        ? ((tumDumProfit - zomatoProfit) / zomatoProfit * 100).toFixed(1)
        : '0';
      
      return {
        orders: volume,
        zomatoProfit,
        tumDumProfit,
        profitDifference,
        percentageGain
      };
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 sm:px-8 lg:px-12">
          <div className="flex h-20 items-center">
            <h1 className="text-2xl font-semibold tracking-tight">TumDum Pricing Analysis</h1>
          </div>
        </div>
      </header>

      <main className="container px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Card */}
          <Card className="backdrop-blur-sm bg-card/50">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-medium">Order Details</CardTitle>
              <p className="text-sm text-muted-foreground">Enter the order details to compare platforms</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base">Menu Price (₹)</Label>
                <Input
                  type="number"
                  value={menuPrice}
                  onChange={(e) => setMenuPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Enter menu price"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base">Zomato Listed Price (₹)</Label>
                <Input
                  type="number"
                  value={zomatoListedPrice}
                  onChange={(e) => setZomatoListedPrice(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Enter Zomato price"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base">Zomato Commission (%)</Label>
                <Input
                  type="number"
                  value={zomatoCommission}
                  onChange={(e) => setZomatoCommission(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Enter commission percentage"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base">Zomato Discount (₹) - Optional</Label>
                <Input
                  type="number"
                  value={zomatoDiscount}
                  onChange={(e) => setZomatoDiscount(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Enter discount amount (if any)"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base">Delivery Distance (km)</Label>
                <Input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Enter distance in km"
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base">Zomato Delivery Fee Override (₹) - Optional</Label>
                <Input
                  type="number"
                  value={zomatoDeliveryFeeOverride}
                  onChange={(e) => setZomatoDeliveryFeeOverride(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Override default delivery fee"
                  className="h-12 text-base"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <Label className="text-base">Zomato Gold Enabled</Label>
                <Switch
                  checked={isGoldEnabled}
                  onCheckedChange={setIsGoldEnabled}
                  className="scale-125"
                />
              </div>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card className="backdrop-blur-sm bg-card/50">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-medium">Price Comparison</CardTitle>
              <p className="text-sm text-muted-foreground">Recommended pricing and earnings comparison</p>
            </CardHeader>
            <CardContent className="space-y-8">
              {recommendedPrice ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Recommended TumDum Price</h3>
                    <div className="space-y-6">
                      <div>
                        <p className="text-3xl font-semibold text-green-600">₹{recommendedPrice}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          List your dish at this price on TumDum to earn{' '}
                          <span className="text-green-600 font-medium">
                            ₹{(comparison.tumdum.restaurantEarning - comparison.zomato.restaurantEarning).toFixed(2)} more
                          </span>{' '}
                          per order compared to Zomato (
                          <span className="text-green-600 font-medium">
                            {((comparison.tumdum.restaurantEarning - comparison.zomato.restaurantEarning) / comparison.zomato.restaurantEarning * 100).toFixed(1)}% more
                          </span>)
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-base">Target Profit Increase</Label>
                          <span className="text-sm font-medium text-green-600">
                            {((comparison.tumdum.restaurantEarning - comparison.zomato.restaurantEarning) / comparison.zomato.restaurantEarning * 100).toFixed(1)}% more than Zomato
                          </span>
                        </div>
                        <div className="px-2">
                          <input
                            type="range"
                            min={1}
                            max={30}
                            step={1}
                            value={profitMargin}
                            onChange={(e) => setProfitMargin(Number(e.target.value))}
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>2%</span>
                            <span>5%</span>
                            <span>10%</span>
                            <span>15%</span>
                            <span>20%</span>
                            <span>30%</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Adjust the slider to find the sweet spot between your earnings and customer price
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-base font-medium mb-4">Zomato</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Listed Price</p>
                          <p className="text-xl font-semibold">₹{zomatoListedPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Commission ({comparison.zomato.effectiveCommission}%)</p>
                          <p className="text-xl font-semibold text-red-500">
                            -₹{(Number(zomatoListedPrice) - comparison.zomato.restaurantEarning).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">GST (5%)</p>
                          <p className="text-xl font-semibold">₹{comparison.zomato.gst.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Platform Fee</p>
                          <p className="text-xl font-semibold">₹{comparison.zomato.platformFee}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">You Earn</p>
                          <p className="text-xl font-semibold">₹{comparison.zomato.restaurantEarning.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Delivery Fee</p>
                          <p className="text-xl font-semibold">₹{comparison.zomato.deliveryFee}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Customer Pays</p>
                          <p className="text-xl font-semibold">₹{comparison.zomato.customerPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-medium mb-4">TumDum</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Listed Price</p>
                          <p className="text-xl font-semibold">₹{recommendedPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Commission (0%)</p>
                          <p className="text-xl font-semibold text-green-500">₹0</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">GST (5%)</p>
                          <p className="text-xl font-semibold">₹{comparison.tumdum.gst.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Platform Fee</p>
                          <p className="text-xl font-semibold">₹{comparison.tumdum.platformFee}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">You Earn</p>
                          <p className="text-xl font-semibold">₹{comparison.tumdum.restaurantEarning.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Delivery Fee</p>
                          <p className="text-xl font-semibold">₹{comparison.tumdum.deliveryFee}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Customer Pays</p>
                          <p className="text-xl font-semibold">₹{comparison.tumdum.customerPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-medium mb-2">Key Benefits</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-green-600">
                        ✓ Keep 100% of your listed price
                      </p>
                      <p className="text-sm text-green-600">
                        ✓ Earn ₹{(comparison.tumdum.restaurantEarning - comparison.zomato.restaurantEarning).toFixed(2)} more per order
                      </p>
                      <p className="text-sm text-green-600">
                        ✓ Customer pays ₹{(comparison.zomato.customerPrice - comparison.tumdum.customerPrice).toFixed(2)} less
                      </p>
                      <p className="text-sm text-green-600">
                        ✓ Premium delivery service (₹9/km)
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Enter order details to see pricing recommendations
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profit Comparison Chart */}
          <Card className="lg:col-span-2 backdrop-blur-sm bg-card/50">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-medium">Profit Comparison</CardTitle>
              <p className="text-sm text-muted-foreground">See how restaurant profits scale with order volume</p>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateOrderVolumeData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="hsl(var(--muted))" 
                      opacity={0.2} 
                    />
                    <XAxis 
                      dataKey="orders" 
                      label={{ 
                        value: 'Number of Orders', 
                        position: 'bottom', 
                        offset: -10,
                        fill: 'hsl(var(--muted-foreground))'
                      }}
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(value) => `${value}`}
                    />
                    <YAxis 
                      label={{ 
                        value: 'Profit (₹)', 
                        angle: -90, 
                        position: 'insideLeft', 
                        offset: 10,
                        fill: 'hsl(var(--muted-foreground))'
                      }}
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      labelStyle={{
                        color: 'hsl(var(--foreground))',
                        fontWeight: 500,
                        marginBottom: '4px'
                      }}
                      formatter={(value: number, name: string) => [
                        `₹${value.toLocaleString()}`,
                        name === 'profitDifference' ? 'Extra Profit' : 
                        name === 'zomatoProfit' ? 'Zomato Profit' : 'TumDum Profit'
                      ]}
                      labelFormatter={(label) => `${label} Orders`}
                    />
                    <Legend 
                      formatter={(value) => (
                        value === 'profitDifference' ? 'Extra Profit with TumDum' : 
                        value === 'zomatoProfit' ? 'Profit with Zomato' : 'Profit with TumDum'
                      )}
                    />
                    <defs>
                      <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34C759" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#34C759" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Line 
                      type="monotone" 
                      dataKey="zomatoProfit" 
                      name="zomatoProfit"
                      stroke="#007AFF"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#007AFF' }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="tumDumProfit" 
                      name="tumDumProfit"
                      stroke="#34C759"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#34C759' }}
                      activeDot={{ r: 6 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="profitDifference"
                      name="profitDifference"
                      fill="url(#profitGradient)"
                      stroke="#34C759"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 text-sm text-muted-foreground">
                <p>The green area shows the additional profit restaurants make with TumDum compared to Zomato.</p>
                {generateOrderVolumeData().length > 0 && (
                  <p className="mt-2">
                    At {generateOrderVolumeData()[generateOrderVolumeData().length - 1].orders} orders, 
                    restaurants make an extra ₹
                    {generateOrderVolumeData()[generateOrderVolumeData().length - 1].profitDifference.toLocaleString()} 
                    with TumDum
                  </p>
                )}
              </div>

              {generateOrderVolumeData().length === 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter order details to see profit projections
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PricingDashboard;
