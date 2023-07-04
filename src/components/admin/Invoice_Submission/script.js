const API_ENDPOINT = `${process.env.REACT_APP_BASE_URL}/v1/kyc`;

export const stripePaymentMethodHandler = async (data, cb) => {
  const { amount, result, userCustomerId, invoice_id , currency} = data;
  if (result.error) {
    // show error in payment form
    cb(result);
  } else {
    const paymentResponse = await stripePayment({
      payment_method_id: result.paymentMethod.id,
      name: result.paymentMethod.billing_details.name,
      email: result.paymentMethod.billing_details.email,
      amount: amount,
      userCustomerId : userCustomerId,
      currency:currency.toLowerCase(),
      invoice_id:invoice_id
    });
    cb(paymentResponse);
  }
}

// place backend API call for payment
const stripePayment = async data => {
  const res = await fetch(`${API_ENDPOINT}/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return await res.json();
  
}

