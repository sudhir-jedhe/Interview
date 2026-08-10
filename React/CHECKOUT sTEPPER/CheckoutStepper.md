Here is a clean, fully functional React `CheckoutStepper` component built with standard React state and Tailwind CSS. It manages step navigation, active states, completion indicators, and step content switching.

### Complete React Component

```jsx
import React, { useState } from 'react';
import { Check, CreditCard, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Cart Summary', icon: ShoppingBag },
  { id: 2, name: 'Shipping Details', icon: Truck },
  { id: 3, name: 'Payment Method', icon: CreditCard },
  { id: 4, name: 'Review Order', icon: ShieldCheck },
];

export default function CheckoutStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      {/* --- Stepper Header --- */}
      <div className="relative flex items-center justify-between mb-8">
        {/* Connecting Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 -z-0" />

        {/* Progress Line */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 transition-all duration-300 ease-in-out -z-0"
          style={{
            width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {/* Step Nodes */}
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isDone = step.id < currentStep || isCompleted;
          const isCurrent = step.id === currentStep && !isCompleted;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <button
                onClick={() => !isCompleted && setCurrentStep(step.id)}
                disabled={isCompleted}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200 ${
                  isDone
                    ? 'bg-indigo-600 text-white'
                    : isCurrent
                    ? 'bg-white border-2 border-indigo-600 text-indigo-600 ring-4 ring-indigo-100'
                    : 'bg-gray-100 text-gray-400 border border-gray-300'
                }`}
              >
                {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </button>
              <span
                className={`text-xs mt-2 font-medium ${
                  isCurrent || isDone ? 'text-gray-900 font-semibold' : 'text-gray-400'
                }`}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* --- Step Content Container --- */}
      <div className="py-8 border-y border-gray-100 min-h-[180px] flex items-center justify-center">
        {isCompleted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Order Placed Successfully!</h3>
            <p className="text-sm text-gray-500 mt-1">Thank you for your purchase.</p>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Step {currentStep}: {STEPS[currentStep - 1].name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Insert your form fields or components for this section here.
            </p>
          </div>
        )}
      </div>

      {/* --- Action Buttons --- */}
      {!isCompleted && (
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-5 py-2 text-sm font-medium rounded-lg border transition-colors ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed border-gray-200 text-gray-400'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-5 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            {currentStep === STEPS.length ? 'Place Order' : 'Continue'}
          </button>
        </div>
      )}
    </div>
  );
}

```

---

### Key Features

* **Dynamic Progress Bar**: Smoothly animates width based on `currentStep`.
* **Clickable Navigation**: Users can jump directly to prior steps by clicking step icons.
* **Icons & States**: Differentiates completed (checkmarks), current (accent ring), and pending steps cleanly.

We can expand this to include form validation (e.g., React Hook Form / Zod), integrate Framer Motion for step transitions, or build out individual step components. Tell me where you'd like to take it next!

When structuring a `CheckoutStepper` (or any complex step-based workflow) in React, choosing the right **component design pattern** determines how readable, reusable, and maintainable your code will be.

Depending on your requirements, three primary component patterns fit this scenario best:

---

### Pattern 1: Compound Components (Recommended)

This pattern exposes individual sub-components (`Stepper`, `Stepper.Step`, `Stepper.Panel`, `Stepper.Controls`) that implicitly share state via React Context. It provides **maximum flexibility** over layout and styling while keeping state management hidden.

```jsx
import React, { createContext, useContext, useState } from 'react';

const StepperContext = createContext(null);

export function Stepper({ children, initialStep = 1, onComplete }) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const next = () => setCurrentStep((prev) => prev + 1);
  const back = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const goTo = (step) => setCurrentStep(step);

  return (
    <StepperContext.Provider value={{ currentStep, next, back, goTo, onComplete }}>
      <div className="stepper-container">{children}</div>
    </StepperContext.Provider>
  );
}

// Sub-component: Step Node Header
Stepper.Step = function Step({ step, children }) {
  const { currentStep, goTo } = useContext(StepperContext);
  const isActive = currentStep === step;
  const isDone = currentStep > step;

  return (
    <button
      onClick={() => goTo(step)}
      className={`step-btn ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
    >
      {children}
    </button>
  );
};

// Sub-component: Panel for Body Content
Stepper.Panel = function Panel({ step, children }) {
  const { currentStep } = useContext(StepperContext);
  if (currentStep !== step) return null;
  return <div className="stepper-panel">{children}</div>;
};

// Sub-component: Navigation Controls
Stepper.Controls = function Controls({ totalSteps }) {
  const { currentStep, next, back, onComplete } = useContext(StepperContext);
  const isLast = currentStep === totalSteps;

  return (
    <div className="stepper-controls">
      <button onClick={back} disabled={currentStep === 1}>Back</button>
      <button onClick={isLast ? onComplete : next}>
        {isLast ? 'Complete' : 'Next'}
      </button>
    </div>
  );
};

```

#### Declarative Usage Example

```jsx
<Stepper totalSteps={3} onComplete={() => alert('Order Placed!')}>
  {/* Custom Layout Header */}
  <div className="flex justify-between">
    <Stepper.Step step={1}>Cart</Stepper.Step>
    <Stepper.Step step={2}>Shipping</Stepper.Step>
    <Stepper.Step step={3}>Payment</Stepper.Step>
  </div>

  {/* Panels */}
  <Stepper.Panel step={1}><CartView /></Stepper.Panel>
  <Stepper.Panel step={2}><ShippingForm /></Stepper.Panel>
  <Stepper.Panel step={3}><PaymentForm /></Stepper.Panel>

  {/* Footer Controls */}
  <Stepper.Controls totalSteps={3} />
</Stepper>

```

---

### Pattern 2: Headless Custom Hook Pattern

If you need complete control over rendering or want to build completely different UI components (e.g., a modal wizard vs. a page-level wizard) using the exact same logic, extract the state machine into a **custom hook**.

```jsx
import { useState } from 'react';

export function useStepper({ totalSteps, initialStep = 1 }) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const next = () => {
    if (!isLastStep) setCurrentStep((prev) => prev + 1);
  };

  const back = () => {
    if (!isFirstStep) setCurrentStep((prev) => prev - 1);
  };

  const goTo = (step) => {
    if (step >= 1 && step <= totalSteps) setCurrentStep(step);
  };

  return {
    currentStep,
    isFirstStep,
    isLastStep,
    next,
    back,
    goTo,
  };
}

```

#### Usage Example

```jsx
function CheckoutWizard() {
  const { currentStep, isFirstStep, isLastStep, next, back } = useStepper({ totalSteps: 3 });

  return (
    <div>
      <h2>Step {currentStep} of 3</h2>
      
      {currentStep === 1 && <CartSummary />}
      {currentStep === 2 && <ShippingForm />}
      {currentStep === 3 && <PaymentForm />}

      <div>
        <button onClick={back} disabled={isFirstStep}>Previous</button>
        <button onClick={next}>{isLastStep ? 'Finish' : 'Next'}</button>
      </div>
    </div>
  );
}

```

---

### Pattern 3: Configuration / Data-Driven Pattern

If your steps are dynamic (e.g., generated from an API response or feature flags), pass a `steps` configuration array to a self-contained controller component.

```jsx
const checkoutConfig = [
  { id: 'cart', title: 'Cart Summary', component: CartSummary },
  { id: 'shipping', title: 'Shipping Details', component: ShippingForm },
  { id: 'payment', title: 'Payment', component: PaymentForm },
];

function ConfigurableStepper({ steps }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const CurrentStepComponent = steps[activeIndex].component;

  return (
    <div>
      <HeaderNav steps={steps} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      
      {/* Dynamic Component Injection */}
      <CurrentStepComponent 
        onNext={() => setActiveIndex((prev) => prev + 1)}
        onBack={() => setActiveIndex((prev) => prev - 1)}
      />
    </div>
  );
}

```

---

### Pattern Comparison

| Pattern                  | Best Used For                                 | Key Advantage                                          |
| ------------------------ | --------------------------------------------- | ------------------------------------------------------ |
| **Compound Components**  | Shared UI components, Design Systems          | Extremely flexible JSX layouts with zero prop drilling |
| **Headless Custom Hook** | Completely dynamic UI / Multiple distinct UIs | Pure logic reusability; zero CSS or layout assumptions |
| **Config Driven**        | Dynamic forms, API-driven workflows           | Easy to add/remove/reorder steps dynamically           |
