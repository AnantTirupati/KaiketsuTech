import { NextResponse } from 'next/server'
import { paymentService } from '@/lib/payments/service'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { message: 'Missing payment signature verification parameters' },
        { status: 400 }
      )
    }

    // Input Validation
    if (
      typeof razorpay_order_id !== 'string' ||
      (!razorpay_order_id.startsWith('order_') && !razorpay_order_id.startsWith('mock_order_')) ||
      typeof razorpay_payment_id !== 'string' ||
      (!razorpay_payment_id.startsWith('pay_') && !razorpay_payment_id.startsWith('mock_pay_')) ||
      typeof razorpay_signature !== 'string' ||
      razorpay_signature.trim().length === 0
    ) {
      return NextResponse.json(
        { message: 'Invalid payment parameters format' },
        { status: 400 }
      )
    }

    // Verify payment using PaymentService abstraction
    const isVerified = await paymentService.verifyPayment({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    })

    const supabase = await createClient()

    if (!isVerified) {
      // Update payment status to failed in database
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('razorpay_order_id', razorpay_order_id)

      return NextResponse.json(
        { message: 'Payment verification failed' },
        { status: 400 }
      )
    }

    // Update payment status to completed in database
    const { data: payment, error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        razorpay_payment_id: razorpay_payment_id,
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating payment completion status:', updateError)
    }

    // Create a new project auto-provisioned upon successful payment
    if (payment) {
      const { error: projectError } = await supabase.from('projects').insert({
        client_id: payment.client_id,
        title: `${payment.package_type?.toUpperCase()} Engagement`,
        description: `Auto-provisioned project for ${payment.package_type} package.`,
        status: 'planning',
        velocity: 0,
        capacity_utilization: 10,
        estimated_budget: payment.amount,
      })

      if (projectError) {
        console.error('Failed to auto-create project for client:', projectError)
      }
    }

    return NextResponse.json({
      verified: true,
      message: 'Payment completed and verified successfully',
    })
  } catch (err: any) {
    console.error('Verification endpoint error:', err)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
