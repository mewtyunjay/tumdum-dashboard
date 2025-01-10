import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const { data: result, error } = await supabase
      .from('analysis_history')
      .insert([
        {
          restaurant_name: data.restaurantName,
          dish_name: data.dishName,
          menu_price: data.menuPrice,
          zomato_listed_price: data.zomatoListedPrice,
          zomato_commission: data.zomatoCommission,
          zomato_discount: data.zomatoDiscount || null,
          distance: data.distance,
          zomato_delivery_fee_override: data.zomatoDeliveryFeeOverride || null,
          is_gold_enabled: data.isGoldEnabled,
          profit_margin: data.profitMargin,
          comparison_zomato_customer_price: data.comparison.zomato.customerPrice,
          comparison_zomato_restaurant_earning: data.comparison.zomato.restaurantEarning,
          comparison_zomato_delivery_fee: data.comparison.zomato.deliveryFee,
          comparison_zomato_effective_commission: data.comparison.zomato.effectiveCommission,
          comparison_zomato_platform_fee: data.comparison.zomato.platformFee,
          comparison_zomato_small_order_fee: data.comparison.zomato.smallOrderFee,
          comparison_zomato_gst: data.comparison.zomato.gst,
          comparison_tumdum_customer_price: data.comparison.tumdum.customerPrice,
          comparison_tumdum_restaurant_earning: data.comparison.tumdum.restaurantEarning,
          comparison_tumdum_delivery_fee: data.comparison.tumdum.deliveryFee,
          comparison_tumdum_platform_fee: data.comparison.tumdum.platformFee,
          comparison_tumdum_small_order_fee: data.comparison.tumdum.smallOrderFee,
          comparison_tumdum_gst: data.comparison.tumdum.gst
        }
      ])
      .select();

    if (error) throw error;
    
    return NextResponse.json({ 
      success: true, 
      id: result[0].id 
    });
  } catch (error) {
    console.error('Error saving analysis:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save analysis' },
      { status: 500 }
    );
  }
} 