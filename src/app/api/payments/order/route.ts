import { NextResponse } from 'next/server'
import { paymentService } from '@/lib/payments/service'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { amount, currency, packageName } = await req.json()

    if (!amount || !currency || !packageName) {
      return NextResponse.json(
        { message: 'Missing required parameters: amount, currency, packageName' },
        { status: 400 }
      )
    }

    // Input Validation
    if (typeof amount !== 'number' || amount <= 0 || !Number.isInteger(amount)) {
      return NextResponse.json(
        { message: 'Amount must be a positive integer in minor units (cents/paise)' },
        { status: 400 }
      )
    }

    if (typeof currency !== 'string' || currency.trim().length !== 3) {
      return NextResponse.json(
        { message: 'Currency must be a valid 3-letter ISO code' },
        { status: 400 }
      )
    }

    const allowedPackages = ['starter', 'business', 'enterprise', 'launch', 'growth', 'business_pro', 'care_plan']
    if (typeof packageName !== 'string' || !allowedPackages.includes(packageName.toLowerCase())) {
      return NextResponse.json(
        { message: 'Invalid package type' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Retrieve current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const receiptId = `receipt_${Math.random().toString(36).substring(2, 12)}`

    // Create order using payment service abstraction
    const order = await paymentService.createOrder({
      amount: amount, // in cents/paise
      currency: currency,
      receipt: receiptId,
      notes: {
        package_name: packageName,
        client_id: user.id,
      },
    })

    // Insert pending payment into DB
    const { error } = await supabase.from('payments').insert({
      client_id: user.id,
      amount: amount / 100, // store in major unit (USD)
      currency: currency,
      status: 'pending',
      razorpay_order_id: order.id,
      package_type: packageName.toLowerCase() as 'starter' | 'business' | 'enterprise' | 'launch' | 'growth' | 'business_pro' | 'care_plan',
    })

    if (error) {
      console.error('Error inserting pending payment:', error)
      // We continue since payment tracking failed but order is created
    }

    return NextResponse.json(order)
  } catch (err: any) {
    console.error('Order creation endpoint error:', err)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
