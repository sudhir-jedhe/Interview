```js
const providers = {
  amex: 3,
  visa: 4,
  mastercard: 5,
  discover: 6,
};

export const getCreditCardProvider = (cardNumber) => {
  if (!/^\d+$/.test(cardNumber)) {
    return "Invalid Card Number";
  }

  if (cardNumber.length !== 15 && cardNumber.length !== 16) {
    return "Invalid Card Number";
  }

  for (let provider in providers) {
    if (Number(cardNumber.charAt(0)) === providers[provider]) {
      return provider;
    }
  }

  return "Invalid Card Number";
};

// '432143214321asd'  => 'Invalid Card Number'
// '1234567890123456' => 'Invalid Card Number'
// '340000000000000' => 'amex'
// '4000000000000000' => visa
