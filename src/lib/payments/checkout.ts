export interface CheckoutOptions {
  amount: number; // in cents/paise
  currency: string;
  packageName: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  onSuccess: (paymentId: string, orderId: string, signature: string) => void;
  onError: (error: any) => void;
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false)
    if ((window as any).Razorpay) return resolve(true)

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function initiateCheckout(options: CheckoutOptions) {
  const isLoaded = await loadRazorpayScript()
  if (!isLoaded) {
    options.onError(new Error('Razorpay SDK failed to load. Please check your network connection.'))
    return
  }

  try {
    // 1. Create order on the server
    const res = await fetch('/api/payments/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: options.amount,
        currency: options.currency,
        packageName: options.packageName,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Failed to initialize order on server')
    }

    const order = await res.json()

    // 2. Open Razorpay checkout
    const rzpOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholderkeyid',
      amount: order.amount,
      currency: order.currency,
      name: 'KaiketsuTech',
      description: `Purchase ${options.packageName} Package`,
      order_id: order.id,
      handler: function (response: any) {
        options.onSuccess(
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature
        )
      },
      prefill: {
        name: options.clientName,
        email: options.clientEmail,
        contact: options.clientPhone || '',
      },
      theme: {
        color: '#f97316', // Orange Accent
      },
      modal: {
        ondismiss: function () {
          options.onError(new Error('Checkout dismissed by user.'))
        },
      },
    }

    // In local sandbox / mock mode, if order.id starts with mock_order_ mock order,
    // we bypass the Razorpay iframe (which will error out with invalid key) and simulate success!
    if (order.id.startsWith('mock_order_')) {
      console.warn('Sandbox Mock Mode: Simulating checkout flow...')
      setTimeout(() => {
        const confirmMock = window.confirm(
          `[SANDBOX CHECKOUT MOCK]\nPackage: ${options.packageName}\nAmount: ${options.currency} ${(options.amount / 100).toLocaleString()}\n\nSimulate successful payment?`
        )
        if (confirmMock) {
          const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 15)}`
          const mockSignature = `mock_signature`
          options.onSuccess(mockPaymentId, order.id, mockSignature)
        } else {
          options.onError(new Error('Mock checkout cancelled.'))
        }
      }, 500)
      return
    }

    const rzp = new (window as any).Razorpay(rzpOptions)
    rzp.open()
  } catch (err: any) {
    options.onError(err)
  }
}
