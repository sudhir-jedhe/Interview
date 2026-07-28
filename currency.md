Sure! Below is the code you can use to work with currencies, exchange rates, and perform various operations with the `Currency`, `Bank`, and `Money` classes:

### Full Implementation with Code:

```javascript
// Currency Class
class Currency {
  static allCurrencies = new Map();

  static get(code) {
    const currency = this.allCurrencies.get(code.toUpperCase());
    if (!currency) {
      throw new RangeError(`Invalid currency ISO code "${code}"`);
    }
    return currency;
  }

  static wrap(currency) {
    if (typeof currency === "string") {
      return this.get(currency);
    }
    return currency;
  }

  constructor(code, symbol) {
    this.code = code;
    this.symbol = symbol;
    Currency.allCurrencies.set(code.toUpperCase(), this);
  }

  format(value) {
    return `${this.symbol}${value.toFixed(2)}`;
  }
}

// Example Currencies
new Currency("USD", "$");
new Currency("EUR", "€");
new Currency("GBP", "£");

// Bank Class
class Bank {
  constructor() {
    this.exchangeRates = new Map();
  }

  setRate(from, to, rate) {
    const fromCurrency = Currency.wrap(from);
    const toCurrency = Currency.wrap(to);
    this.exchangeRates.set(`${fromCurrency.code} -> ${toCurrency.code}`, rate);
    return this;
  }

  getRate(from, to) {
    const fromCurrency = Currency.wrap(from);
    const toCurrency = Currency.wrap(to);
    return this.exchangeRates.get(`${fromCurrency.code} -> ${toCurrency.code}`);
  }

  exchange(money, toCurrency) {
    const toCurrencyObj = Currency.wrap(toCurrency);
    if (money.currency.code === toCurrencyObj.code) {
      return money; // No conversion needed
    }

    const rate = this.getRate(money.currency, toCurrencyObj);
    if (!rate) {
      throw new TypeError(
        `No exchange rate found for ${money.currency.code} to ${toCurrencyObj.code}`,
      );
    }

    return new Money(money.value * rate, toCurrencyObj, this);
  }
}

// Money Class
class Money {
  constructor(value, currency, bank = new Bank()) {
    this.value = value;
    this.currency = Currency.wrap(currency);
    this.bank = bank;
  }

  format() {
    return this.currency.format(this.value);
  }

  exchangeTo(currency) {
    return this.bank.exchange(this, currency);
  }

  add(money) {
    if (this.currency.code !== money.currency.code) {
      money = money.exchangeTo(this.currency);
    }
    return new Money(this.value + money.value, this.currency, this.bank);
  }

  subtract(money) {
    if (this.currency.code !== money.currency.code) {
      money = money.exchangeTo(this.currency);
    }
    return new Money(this.value - money.value, this.currency, this.bank);
  }

  multiply(num) {
    return new Money(this.value * num, this.currency, this.bank);
  }

  divide(num) {
    return new Money(this.value / num, this.currency, this.bank);
  }

  equals(money) {
    if (this.currency.code !== money.currency.code) {
      money = money.exchangeTo(this.currency);
    }
    return this.value === money.value;
  }

  greaterThan(money) {
    if (this.currency.code !== money.currency.code) {
      money = money.exchangeTo(this.currency);
    }
    return this.value > money.value;
  }

  lessThan(money) {
    if (this.currency.code !== money.currency.code) {
      money = money.exchangeTo(this.currency);
    }
    return this.value < money.value;
  }
}

// Example Usage

// Create Bank instance
const bank = new Bank();
bank.setRate("USD", "EUR", 0.85); // 1 USD = 0.85 EUR
bank.setRate("EUR", "USD", 1.1765); // 1 EUR = 1.1765 USD

// Create Money instances
const usdMoney = new Money(100, "USD", bank);
const eurMoney = new Money(100, "EUR", bank);

// Format Money objects
console.log(usdMoney.format()); // Output: $100.00
console.log(eurMoney.format()); // Output: €100.00

// Exchange USD to EUR
const exchangedMoney = usdMoney.exchangeTo("EUR");
console.log(exchangedMoney.format()); // Output: €85.00

// Add Money objects
const sumMoney = usdMoney.add(new Money(50, "USD", bank));
console.log(sumMoney.format()); // Output: $150.00

// Subtract Money objects
const differenceMoney = usdMoney.subtract(new Money(30, "USD", bank));
console.log(differenceMoney.format()); // Output: $70.00

// Multiply Money object
const multipliedMoney = usdMoney.multiply(2);
console.log(multipliedMoney.format()); // Output: $200.00

// Divide Money object
const dividedMoney = usdMoney.divide(4);
console.log(dividedMoney.format()); // Output: $25.00

// Comparison
console.log(usdMoney.equals(new Money(100, "USD", bank))); // Output: true
console.log(usdMoney.greaterThan(new Money(50, "USD", bank))); // Output: true
console.log(usdMoney.lessThan(new Money(200, "USD", bank))); // Output: true
```

### Explanation of the Example:

1. **Currency Setup**:
   - We define three currencies: `USD`, `EUR`, and `GBP`. These are represented with symbols like `$`, `€`, and `£`.
   - The `Currency` class is used to create these currencies, and they are stored in a static map (`Currency.allCurrencies`), which makes them easily retrievable.

2. **Bank Setup**:
   - A `Bank` instance is created to store exchange rates between currencies.
   - Exchange rates are set using `bank.setRate(from, to, rate)`. In this case, 1 USD = 0.85 EUR, and 1 EUR = 1.1765 USD.

3. **Money Creation**:
   - `Money` objects are created for 100 USD and 100 EUR. Each `Money` object knows which currency it is in and which bank it should use for any potential conversions.

4. **Formatting**:
   - The `format()` method is used to display the value of money in the appropriate currency format (e.g., `$100.00` for USD or `€100.00` for EUR).

5. **Exchange**:
   - The `exchangeTo(currency)` method is used to convert a `Money` object from one currency to another, using the exchange rate stored in the bank.

6. **Arithmetic Operations**:
   - We demonstrate how to add, subtract, multiply, and divide `Money` objects.
   - If the currencies are different, the appropriate conversion is done before performing the arithmetic.

7. **Comparison**:
   - We compare `Money` objects using `equals()`, `greaterThan()`, and `lessThan()` methods. Again, conversions are done as needed if the currencies are different.

### Example Output:

```
$100.00
€100.00
€85.00
$150.00
$70.00
$200.00
$25.00
true
true
true
```

This implementation allows you to handle currencies, exchange rates, and operations on monetary values, making it easy to manage currency conversions and perform arithmetic with different currencies in a consistent manner.
