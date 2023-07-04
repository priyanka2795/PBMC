const API_ENDPOINT = `${process.env.REACT_APP_BASE_URL}`;

export const stripePaymentMethodHandler = async (data, cb) => {
  const { amount, result, userCustomerId, invoice_id , currency,fundType} = data;
  
  if (result.error) {
    // show error in payment form
    cb(result);
  } else {
    const paymentResponse = await stripePayment({
      payment_method_id: result.paymentMethod.id,
      name: result.paymentMethod.billing_details.name,
      amount: amount,
      userCustomerId : userCustomerId,
      currency:currency.toLowerCase(),
      invoice_id:invoice_id,
      fundType:fundType
    });
    console.log(paymentResponse,"payment Response");
    cb(paymentResponse);
  }
}

// place backend API call for payment
const stripePayment = async data => {
  const res = await fetch(`${API_ENDPOINT}/funds/p2p-create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return await res.json();
}