'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@supabase/supabase-js';
import { Modal } from '@/components/ui/modal';
import { Trash2 } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type AnalysisRecord = {
  id: string;
  restaurant_name: string;
  dish_name: string;
  menu_price: number;
  zomato_listed_price: number;
  comparison_zomato_restaurant_earning: number;
  comparison_tumdum_restaurant_earning: number;
  comparison_tumdum_customer_price: number;
  saved_at: string;
  // Add all other fields needed for detailed view
  zomato_commission: number;
  zomato_discount: number | null;
  distance: number;
  is_gold_enabled: boolean;
  profit_margin: number;
  comparison_zomato_customer_price: number;
  comparison_zomato_delivery_fee: number;
  comparison_zomato_effective_commission: number;
  comparison_zomato_platform_fee: number;
  comparison_zomato_small_order_fee: number;
  comparison_zomato_gst: number;
  comparison_tumdum_delivery_fee: number;
  comparison_tumdum_platform_fee: number;
  comparison_tumdum_small_order_fee: number;
  comparison_tumdum_gst: number;
};

export default function RecordsPage() {
  const [restaurantFilter, setRestaurantFilter] = useState('');
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AnalysisRecord | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecords() {
      try {
        let query = supabase
          .from('analysis_history')
          .select('*')
          .order('saved_at', { ascending: false });

        if (restaurantFilter) {
          query = query.ilike('restaurant_name', `%${restaurantFilter}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        setRecords(data || []);
      } catch (err) {
        console.error('Error fetching records:', err);
        setError('Failed to load records');
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, [restaurantFilter]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click from triggering
    if (deleting) return; // Prevent multiple deletes

    try {
      setDeleting(id);
      const { error } = await supabase
        .from('analysis_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update the local state to remove the deleted record
      setRecords(records.filter(record => record.id !== id));
    } catch (err) {
      console.error('Error deleting record:', err);
      // You might want to show an error message to the user here
    } finally {
      setDeleting(null);
    }
  };

  return (
    <main className="container px-4 sm:px-8 lg:px-12 py-8 space-y-8">
      <Card className="backdrop-blur-sm bg-card/50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-medium">Analysis Records</CardTitle>
          <p className="text-sm text-muted-foreground">View and filter your saved analyses</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base">Filter by Restaurant</Label>
            <Input
              type="text"
              value={restaurantFilter}
              onChange={(e) => setRestaurantFilter(e.target.value)}
              placeholder="Enter restaurant name"
              className="h-12 text-base"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">Loading records...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : records.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {restaurantFilter 
                ? 'No records found for this restaurant name.' 
                : 'No records found. Start by analyzing dishes from the dashboard.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left py-3 px-4">Restaurant & Dish</th>
                    <th className="text-right py-3 px-4">Menu Price</th>
                    <th className="text-right py-3 px-4">Zomato Price</th>
                    <th className="text-right py-3 px-4">TumDum Price</th>
                    <th className="text-right py-3 px-4">Extra Profit</th>
                    <th className="w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr
                      key={record.id}
                      onClick={() => setSelectedRecord(record)}
                      className="border-b border-border/40 cursor-pointer ring-offset-background transition-shadow hover:ring-2 hover:ring-ring hover:ring-offset-2"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{record.restaurant_name}</div>
                          <div className="text-sm text-muted-foreground">{record.dish_name}</div>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4">₹{record.menu_price}</td>
                      <td className="text-right py-3 px-4">₹{record.zomato_listed_price}</td>
                      <td className="text-right py-3 px-4">₹{record.comparison_tumdum_customer_price}</td>
                      <td className="text-right py-3 px-4 text-green-600">
                        ₹{(record.comparison_tumdum_restaurant_earning - record.comparison_zomato_restaurant_earning).toFixed(2)}
                      </td>
                      <td className="w-16 px-4">
                        <button
                          onClick={(e) => handleDelete(record.id, e)}
                          disabled={deleting === record.id}
                          className={`p-2 rounded-full transition-colors ${
                            deleting === record.id
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-red-100 text-red-600 hover:text-red-700'
                          }`}
                          title="Delete record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
      >
        {selectedRecord && (
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">{selectedRecord.restaurant_name}</h2>
              <p className="text-lg text-muted-foreground">{selectedRecord.dish_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Zomato</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Listed Price</p>
                    <p className="text-xl font-semibold">₹{selectedRecord.zomato_listed_price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Commission ({selectedRecord.comparison_zomato_effective_commission}%)</p>
                    <p className="text-xl font-semibold text-red-500">
                      -₹{(selectedRecord.zomato_listed_price - selectedRecord.comparison_zomato_restaurant_earning).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Platform Fee</p>
                    <p className="text-xl font-semibold">₹{selectedRecord.comparison_zomato_platform_fee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Small Order Fee</p>
                    <p className="text-xl font-semibold">₹{selectedRecord.comparison_zomato_small_order_fee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">GST (5%)</p>
                    <p className="text-xl font-semibold">₹{selectedRecord.comparison_zomato_gst.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">You Earn</p>
                    <p className="text-xl font-semibold">₹{selectedRecord.comparison_zomato_restaurant_earning.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Fee</p>
                    <p className="text-xl font-semibold">₹{selectedRecord.comparison_zomato_delivery_fee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Pays</p>
                    <p className="text-xl font-semibold">₹{selectedRecord.comparison_zomato_customer_price.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">TumDum</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Listed Price</p>
                    <p className="text-xl font-semibold">₹{selectedRecord.comparison_tumdum_customer_price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Commission (0%)</p>
                    <p className="text-xl font-semibold text-green-500">₹0</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Platform Fee</p>
                    <p className="text-xl font-semibold">₹{selectedRecord.comparison_tumdum_platform_fee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Small Order Fee</p>
                    <p className="text-xl font-semibold">₹{selectedRecord.comparison_tumdum_small_order_fee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">GST (5%)</p>
                    <p className="text-xl font-semibold">₹{selectedRecord.comparison_tumdum_gst.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">You Earn</p>
                    <p className="text-xl font-semibold">₹{selectedRecord.comparison_tumdum_restaurant_earning.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Fee</p>
                    <p className="text-xl font-semibold">₹{selectedRecord.comparison_tumdum_delivery_fee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Pays</p>
                    <p className="text-xl font-semibold">₹{selectedRecord.comparison_tumdum_customer_price.toFixed(2)}</p>
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
                  ✓ Earn ₹{(selectedRecord.comparison_tumdum_restaurant_earning - selectedRecord.comparison_zomato_restaurant_earning).toFixed(2)} more per order
                </p>
                <p className="text-sm text-green-600">
                  ✓ Customer pays ₹{(selectedRecord.comparison_zomato_customer_price - selectedRecord.comparison_tumdum_customer_price).toFixed(2)} less
                </p>
                <p className="text-sm text-green-600">
                  ✓ Premium delivery service (₹9/km)
                </p>
              </div>
            </div>

            <div className="text-sm text-muted-foreground text-right">
              Analyzed on {new Date(selectedRecord.saved_at).toLocaleString()}
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
} 