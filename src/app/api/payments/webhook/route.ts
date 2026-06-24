import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature')
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!signature || !secret) {
      console.warn('Webhook received but missing signature or webhook secret configuration.')
      return NextResponse.json(
        { error: 'Missing signature or webhook secret configuration' },
        { status: 400 }
      )
    }

    // Cryptographic verification of Razorpay webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    if (expectedSignature !== signature) {
      console.warn('Razorpay Webhook signature verification failed.')
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }

    const payload = JSON.parse(body)
    const { event } = payload

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) {
      console.error('Critical Error: SUPABASE_SERVICE_ROLE_KEY is not configured.')
      return NextResponse.json({ error: 'Internal configuration error' }, { status: 500 })
    }

    // Connect to Supabase with administrative permissions (bypassing Client RLS)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    )

    if (event === 'payment.captured') {
      const paymentEntity = payload.payload.payment.entity
      const orderId = paymentEntity.order_id
      const paymentId = paymentEntity.id
      const amountPaise = paymentEntity.amount
      const currency = paymentEntity.currency
      const notes = paymentEntity.notes || {}
      
      const clientId = notes.client_id
      const packageName = notes.package_name || 'launch'

      if (orderId) {
        // Find existing pending payment
        const { data: existingPayment, error: fetchError } = await supabaseAdmin
          .from('payments')
          .select('*')
          .eq('razorpay_order_id', orderId)
          .maybeSingle()

        if (fetchError) {
          console.error('Error fetching existing payment:', fetchError)
        }

        if (existingPayment) {
          // If the payment is pending, update to completed
          if (existingPayment.status !== 'completed') {
            const { error: updateError } = await supabaseAdmin
              .from('payments')
              .update({
                status: 'completed',
                razorpay_payment_id: paymentId,
              })
              .eq('razorpay_order_id', orderId)

            if (updateError) {
              console.error('Error updating payment status via webhook:', updateError)
            } else {
              // Auto-provision project for the client
              const { error: projectError } = await supabaseAdmin.from('projects').insert({
                client_id: existingPayment.client_id,
                title: `${existingPayment.package_type?.toUpperCase()} Engagement`,
                description: `Auto-provisioned project for ${existingPayment.package_type} package.`,
                status: 'planning',
                velocity: 0,
                capacity_utilization: 10,
                estimated_budget: existingPayment.amount,
              })
              
              if (projectError) {
                console.error('Failed to auto-create project via webhook:', projectError)
              }
            }
          }
        } else {
          // Insert new payment record if order was initiated elsewhere (e.g. via Razorpay API directly)
          const { data: newPayment, error: insertError } = await supabaseAdmin
            .from('payments')
            .insert({
              client_id: clientId || null,
              amount: amountPaise / 100,
              currency: currency,
              status: 'completed',
              razorpay_order_id: orderId,
              razorpay_payment_id: paymentId,
              package_type: packageName.toLowerCase() as 'starter' | 'business' | 'enterprise' | 'launch' | 'growth' | 'business_pro' | 'care_plan',
            })
            .select()
            .single()

          if (insertError) {
            console.error('Error inserting webhook payment:', insertError)
          } else if (clientId) {
            // Auto-provision project
            const { error: projectError } = await supabaseAdmin.from('projects').insert({
              client_id: clientId,
              title: `${packageName.toUpperCase()} Engagement`,
              description: `Auto-provisioned project for ${packageName} package.`,
              status: 'planning',
              velocity: 0,
              capacity_utilization: 10,
              estimated_budget: amountPaise / 100,
            })
            
            if (projectError) {
              console.error('Failed to auto-create project via webhook:', projectError)
            }
          }
        }
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payload.payment.entity
      const orderId = paymentEntity.order_id

      if (orderId) {
        // Mark order as failed in the database
        const { error: updateError } = await supabaseAdmin
          .from('payments')
          .update({ status: 'failed' })
          .eq('razorpay_order_id', orderId)

        if (updateError) {
          console.error('Error marking payment as failed via webhook:', updateError)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook endpoint execution error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
