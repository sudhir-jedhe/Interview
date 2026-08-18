The industry standard for REST API error payloads is based on **RFC 7807 (Problem Details for HTTP APIs)** and **RFC 9457**.

To serve frontends cleanly—especially for form validation, internationalization (i18n), and telemetry—the error schema should provide **machine-readable error codes**, **field-level pointer paths**, and **dynamic translation interpolation parameters**.

---

### 1. The Standard Error Schema (TypeScript Definition)

```typescript
export interface ApiErrorResponse {
  /** A URI reference identifying the problem type (RFC 7807) */
  type: string;
  /** Short, human-readable summary of the problem */
  title: string;
  /** HTTP status code */
  status: number;
  /** Detailed human-readable explanation in English/fallback */
  detail: string;
  /** Stable, machine-readable application error code */
  code: string;
  /** A unique identifier to trace the error in backend logs/Datadog/Sentry */
  traceId: string;
  /** Timestamp when the error occurred */
  timestamp: string;
  /** Field-level errors for form validations */
  errors?: FieldValidationError[];
}

export interface FieldValidationError {
  /** JSON Pointer / property path to the invalid field (e.g. "email", "billing.zipCode", "items[0].qty") */
  field: string;
  /** Stable validation error code for frontend localization */
  code: string;
  /** Default English human-readable message */
  message: string;
  /** Dynamic values to interpolate into localized UI strings (e.g., min length, max value) */
  params?: Record<string, string | number>;
  /** Rejected value for debugging (omit sensitive values like passwords) */
  rejectedValue?: unknown;
}

```

---

### 2. Concrete JSON Payloads

#### Example A: Form Validation Error (`422 Unprocessable Entity`)

Contains field-level validation errors with interpolation params:

```json
{
  "type": "https://api.example.com/errors/validation-failed",
  "title": "Validation Failed",
  "status": 422,
  "code": "ERR_VALIDATION_FAILED",
  "detail": "One or more fields in your request failed validation checks.",
  "traceId": "req_8f1a2c3d-9b8e-4a7f-99c0-123456789abc",
  "timestamp": "2026-08-18T05:01:39.000Z",
  "errors": [
    {
      "field": "email",
      "code": "INVALID_EMAIL_FORMAT",
      "message": "The email address provided is not valid."
    },
    {
      "field": "password",
      "code": "PASSWORD_TOO_SHORT",
      "message": "Password must be at least 8 characters long.",
      "params": {
        "min": 8,
        "actual": 5
      }
    },
    {
      "field": "addresses.billing.zipCode",
      "code": "POSTAL_CODE_INVALID_FOR_COUNTRY",
      "message": "Postal code is invalid for the selected country.",
      "params": {
        "country": "IN"
      },
      "rejectedValue": "XYZ-99"
    }
  ]
}

```

#### Example B: Business Domain Error (`409 Conflict` / `403 Forbidden`)

```json
{
  "type": "https://api.example.com/errors/insufficient-inventory",
  "title": "Insufficient Stock",
  "status": 409,
  "code": "ERR_INSUFFICIENT_STOCK",
  "detail": "Requested 5 units of 'Wireless Headphones', but only 2 remain in stock.",
  "traceId": "req_99bba123-4411-a88b-112233445566",
  "timestamp": "2026-08-18T05:01:39.000Z",
  "errors": [
    {
      "field": "items[2].quantity",
      "code": "EXCEEDS_AVAILABLE_STOCK",
      "message": "Requested quantity exceeds available stock.",
      "params": {
        "requested": 5,
        "available": 2,
        "productId": "prod_headphone_pro"
      }
    }
  ]
}

```

---

### 3. Frontend Consumption & Localization

Using `code` and `params` allows frontend i18n libraries (e.g., `i18next` or `react-intl`) to format user-facing messages cleanly:

#### Translation Dictionaries (`locales/en.json` & `locales/hi.json`)

```json
// en.json
{
  "errors": {
    "ERR_INSUFFICIENT_STOCK": "Some items in your cart are no longer available in the requested quantity.",
    "PASSWORD_TOO_SHORT": "Password must be at least {{min}} characters long.",
    "POSTAL_CODE_INVALID_FOR_COUNTRY": "The postal code is invalid for {{country}}."
  }
}

// hi.json
{
  "errors": {
    "ERR_INSUFFICIENT_STOCK": "आपके कार्ट में कुछ वस्तुएं अनुरोधित मात्रा में उपलब्ध नहीं हैं।",
    "PASSWORD_TOO_SHORT": "पासवर्ड कम से कम {{min}} अक्षरों का होना चाहिए।",
    "POSTAL_CODE_INVALID_FOR_COUNTRY": "{{country}} के लिए पिन कोड अमान्य है।"
  }
}

```

#### React / React Hook Form Error Mapper

```typescript
import { UseFormSetError, FieldValues, Path } from 'react-hook-form';
import i18n from 'i18next';
import { ApiErrorResponse } from './types';

export function handleApiFormErrors<T extends FieldValues>(
  error: ApiErrorResponse,
  setError: UseFormSetError<T>
) {
  if (!error.errors || error.errors.length === 0) {
    // Show top-level toast/banner if not a field-specific error
    const localizedTitle = i18n.t(`errors.${error.code}`, {
      defaultValue: error.detail || error.title,
    });
    console.error(localizedTitle);
    return;
  }

  // Map each backend error directly to the corresponding form input
  error.errors.forEach(({ field, code, message, params }) => {
    const localizedMessage = i18n.t(`errors.${code}`, {
      ...params,
      defaultValue: message,
    });

    setError(field as Path<T>, {
      type: 'server',
      message: localizedMessage,
    });
  });
}

```

---

### Key Architectural Guidelines

* **Never localize on the server:** The backend should return stable, machine-readable keys (`code`) and raw values (`params`). The client controls language formatting, date formats, and regional variants.
* **Stable String Codes over Numeric IDs:** Prefer descriptive enums like `ERR_INSUFFICIENT_STOCK` over numbers like `1042`, which are prone to collisions across microservices.
* **Nested Field Pointers:** Use dot/bracket notation (`addresses.billing.zipCode` or `items[0].sku`) so frontend form libraries can bind server errors to deeply nested object models without manual mapping.
* **Sanitize `rejectedValue`:** Strip passwords, credit card numbers, and PII from error logs and client payloads to prevent security leakage.
* **Always Provide `traceId`:** Allows frontend crash-reporting tools (e.g., Sentry) to correlate user reports with backend distributed tracing logs (e.g., OpenTelemetry/Datadog).
