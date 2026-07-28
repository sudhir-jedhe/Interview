Below is a complete config-driven React Router stepper implementation with:

✅ Next / Previous navigation
✅ Form data persisted across steps
✅ Refresh-safe localStorage persistence
✅ Validation schema per step using Zod
✅ Role-based step access
✅ Permission-based access
✅ Feature flag checks
✅ Conditional steps based on form data
✅ Breadcrumb generated from visible steps
✅ Route guard to prevent invalid direct URL access

Install Packages
npm install react-router-dom react-hook-form zod @hookform/resolvers

Folder Structure
src/
├── App.jsx
├── auth/
│ └── AuthContext.jsx
├── flags/
│ └── FeatureFlagContext.jsx
├── stepper/
│ ├── StepperProvider.jsx
│ ├── stepConfig.js
│ ├── stepResolver.js
│ ├── StepGuard.jsx
│ ├── WizardRoutes.jsx
│ ├── Breadcrumb.jsx
│ ├── StepPage.jsx
│ └── useWizardNavigation.js
└── steps/
├── PersonalStep.jsx
├── EmploymentStep.jsx
├── TeamStep.jsx
├── SecurityStep.jsx
└── ReviewStep.jsx

1. Auth Context
   // src/auth/AuthContext.jsx

import {
createContext,
useContext
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
const user = {
id: "u101",
name: "Sudhir",
role: "Manager",

    permissions: [
      "TEAM_VIEW",
      "TEAM_EDIT"
    ]

};

return (
<AuthContext.Provider value={user}>
{children}
</AuthContext.Provider>
);
}

export function useAuth() {
return useContext(AuthContext);
}

2. Feature Flag Context
   // src/flags/FeatureFlagContext.jsx

import {
createContext,
useContext
} from "react";

const FeatureFlagContext = createContext({});

export function FeatureFlagProvider({ children }) {
const flags = {
ENABLE_EMPLOYMENT_STEP: true,
ENABLE_TEAM_STEP: true,
ENABLE_SECURITY_STEP: false
};

return (
<FeatureFlagContext.Provider value={flags}>
{children}
</FeatureFlagContext.Provider>
);
}

export function useFeatureFlags() {
return useContext(FeatureFlagContext);
}

3. Step Config with Validation Schema Per Step
   // src/stepper/stepConfig.js

import { z } from "zod";

import PersonalStep from "../steps/PersonalStep";
import EmploymentStep from "../steps/EmploymentStep";
import TeamStep from "../steps/TeamStep";
import SecurityStep from "../steps/SecurityStep";
import ReviewStep from "../steps/ReviewStep";

export const personalSchema = z.object({
firstName: z
.string()
.min(2, "First name must be at least 2 characters"),

lastName: z
.string()
.min(2, "Last name must be at least 2 characters"),

email: z
.string()
.email("Please enter a valid email"),

isEmployed: z.boolean()
});

export const employmentSchema = z.object({
companyName: z
.string()
.min(2, "Company name is required"),

designation: z
.string()
.min(2, "Designation is required")
});

export const teamSchema = z.object({
teamName: z
.string()
.min(2, "Team name is required"),

teamSize: z
.coerce
.number()
.min(1, "Team size must be at least 1")
});

export const securitySchema = z.object({
accessLevel: z
.string()
.min(1, "Access level is required")
});

export const reviewSchema = z.object({});

export const STEPS = [
{
id: "personal",
title: "Personal",
path: "/wizard/personal",
component: PersonalStep,
schema: personalSchema,

    roles: ["Employee", "Manager", "Admin"]

},

{
id: "employment",
title: "Employment",
path: "/wizard/employment",
component: EmploymentStep,
schema: employmentSchema,

    roles: ["Employee", "Manager", "Admin"],

    featureFlag: "ENABLE_EMPLOYMENT_STEP",

    condition: formData =>
      formData.isEmployed === true

},

{
id: "team",
title: "Team",
path: "/wizard/team",
component: TeamStep,
schema: teamSchema,

    roles: ["Manager", "Admin"],

    permissions: ["TEAM_VIEW"],

    featureFlag: "ENABLE_TEAM_STEP"

},

{
id: "security",
title: "Security",
path: "/wizard/security",
component: SecurityStep,
schema: securitySchema,

    roles: ["Admin"],

    permissions: ["SECURITY_MANAGE"],

    featureFlag: "ENABLE_SECURITY_STEP"

},

{
id: "review",
title: "Review",
path: "/wizard/review",
component: ReviewStep,
schema: reviewSchema,

    roles: ["Employee", "Manager", "Admin"]

}
];

4. Step Resolver

This decides which steps are visible for the current user.

// src/stepper/stepResolver.js

import { STEPS } from "./stepConfig";

export function hasRoleAccess(step, user) {
if (!step.roles) return true;

return step.roles.includes(user.role);
}

export function hasPermissionAccess(step, user) {
if (!step.permissions) return true;

return step.permissions.every(permission =>
user.permissions.includes(permission)
);
}

export function hasFeatureAccess(step, flags) {
if (!step.featureFlag) return true;

return Boolean(flags[step.featureFlag]);
}

export function hasConditionAccess(step, formData) {
if (!step.condition) return true;

return step.condition(formData);
}

export function canAccessStep({
step,
user,
flags,
formData
}) {
return (
hasRoleAccess(step, user) &&
hasPermissionAccess(step, user) &&
hasFeatureAccess(step, flags) &&
hasConditionAccess(step, formData)
);
}

export function getVisibleSteps({
user,
flags,
formData
}) {
return STEPS.filter(step =>
canAccessStep({
step,
user,
flags,
formData
})
);
}

export function getStepByPath(path) {
return STEPS.find(step => step.path === path);
}

export function getFirstIncompleteStep({
visibleSteps,
completedStepIds
}) {
return visibleSteps.find(
step => !completedStepIds.includes(step.id)
);
}

5. Stepper Provider with Persistent Form Data

This keeps data across steps and refresh.

// src/stepper/StepperProvider.jsx

import {
createContext,
useContext,
useEffect,
useMemo,
useState
} from "react";

const StepperContext = createContext(null);

const STORAGE_KEY = "config-driven-wizard-draft";

const initialState = {
formData: {
firstName: "",
lastName: "",
email: "",
isEmployed: true,

    companyName: "",
    designation: "",

    teamName: "",
    teamSize: "",

    accessLevel: ""

},

completedStepIds: []
};

function loadInitialState() {
try {
const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return initialState;
    }

    return JSON.parse(saved);

} catch {
return initialState;
}
}

export function StepperProvider({ children }) {
const [state, setState] = useState(loadInitialState);

useEffect(() => {
localStorage.setItem(
STORAGE_KEY,
JSON.stringify(state)
);
}, [state]);

const updateFormData = data => {
setState(prev => ({
...prev,
formData: {
...prev.formData,
...data
}
}));
};

const markStepCompleted = stepId => {
setState(prev => {
if (prev.completedStepIds.includes(stepId)) {
return prev;
}

      return {
        ...prev,
        completedStepIds: [
          ...prev.completedStepIds,
          stepId
        ]
      };
    });

};

const resetWizard = () => {
setState(initialState);
localStorage.removeItem(STORAGE_KEY);
};

const value = useMemo(
() => ({
formData: state.formData,
completedStepIds: state.completedStepIds,
updateFormData,
markStepCompleted,
resetWizard
}),
[state]
);

return (
<StepperContext.Provider value={value}>
{children}
</StepperContext.Provider>
);
}

export function useStepper() {
return useContext(StepperContext);
}

6. Wizard Navigation Hook

Next and Previous automatically skip hidden or unauthorised steps.

// src/stepper/useWizardNavigation.js

import {
useLocation,
useNavigate
} from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { useFeatureFlags } from "../flags/FeatureFlagContext";
import { useStepper } from "./StepperProvider";

import {
getVisibleSteps
} from "./stepResolver";

export function useWizardNavigation() {
const navigate = useNavigate();
const location = useLocation();

const user = useAuth();
const flags = useFeatureFlags();

const {
formData
} = useStepper();

const visibleSteps = getVisibleSteps({
user,
flags,
formData
});

const currentIndex = visibleSteps.findIndex(
step => step.path === location.pathname
);

const currentStep = visibleSteps[currentIndex];

const previousStep =
currentIndex > 0
? visibleSteps[currentIndex - 1]
: null;

const nextStep =
currentIndex >= 0
? visibleSteps[currentIndex + 1]
: null;

const goPrevious = () => {
if (previousStep) {
navigate(previousStep.path);
}
};

const goNext = () => {
if (nextStep) {
navigate(nextStep.path);
}
};

const getNextStepAfterDataChange = nextFormData => {
const updatedVisibleSteps = getVisibleSteps({
user,
flags,
formData: nextFormData
});

    const updatedCurrentIndex =
      updatedVisibleSteps.findIndex(
        step => step.path === location.pathname
      );

    return updatedVisibleSteps[
      updatedCurrentIndex + 1
    ];

};

return {
visibleSteps,
currentStep,
previousStep,
nextStep,
goPrevious,
goNext,
getNextStepAfterDataChange
};
}

7. Route Guard

This prevents users from directly opening unauthorised steps.

// src/stepper/StepGuard.jsx

import {
Navigate,
useLocation
} from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { useFeatureFlags } from "../flags/FeatureFlagContext";
import { useStepper } from "./StepperProvider";

import {
canAccessStep,
getVisibleSteps
} from "./stepResolver";

export default function StepGuard({
step,
children
}) {
const location = useLocation();

const user = useAuth();
const flags = useFeatureFlags();

const {
formData,
completedStepIds
} = useStepper();

const visibleSteps = getVisibleSteps({
user,
flags,
formData
});

const hasCurrentStepAccess = canAccessStep({
step,
user,
flags,
formData
});

if (!hasCurrentStepAccess) {
return (
<Navigate
        to="/unauthorised"
        replace
      />
);
}

const currentIndex = visibleSteps.findIndex(
visibleStep => visibleStep.path === location.pathname
);

const previousSteps = visibleSteps.slice(
0,
currentIndex
);

const hasCompletedPreviousSteps =
previousSteps.every(previousStep =>
completedStepIds.includes(previousStep.id)
);

if (!hasCompletedPreviousSteps) {
const firstIncompleteStep =
previousSteps.find(
previousStep =>
!completedStepIds.includes(previousStep.id)
);

    return (
      <Navigate
        to={
          firstIncompleteStep?.path ||
          visibleSteps[0].path
        }
        replace
      />
    );

}

return children;
}

8. Generic Step Page with Validation

This is the most important piece.

It:

Loads the schema from config
Uses React Hook Form
Saves data to context
Marks step completed
Navigates to next visible step
Skips conditional hidden steps automatically
// src/stepper/StepPage.jsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { useStepper } from "./StepperProvider";
import { useWizardNavigation } from "./useWizardNavigation";

export default function StepPage({ step }) {
const navigate = useNavigate();

const {
formData,
updateFormData,
markStepCompleted
} = useStepper();

const {
previousStep,
getNextStepAfterDataChange
} = useWizardNavigation();

const StepComponent = step.component;

const {
register,
handleSubmit,
formState: {
errors,
isDirty,
isSubmitting
},
watch,
setValue
} = useForm({
resolver: zodResolver(step.schema),
defaultValues: formData,
mode: "onBlur"
});

const onSubmit = data => {
const updatedFormData = {
...formData,
...data
};

    updateFormData(data);
    markStepCompleted(step.id);

    const nextStep =
      getNextStepAfterDataChange(updatedFormData);

    if (nextStep) {
      navigate(nextStep.path);
    } else {
      navigate("/wizard/completed");
    }

};

return (

<form onSubmit={handleSubmit(onSubmit)}>
<StepComponent
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
        formData={formData}
      />

      <div
        style={{
          marginTop: "24px",
          display: "flex",
          gap: "12px"
        }}
      >
        {previousStep && (
          <button
            type="button"
            onClick={() =>
              navigate(previousStep.path)
            }
          >
            Previous
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : "Next"}
        </button>

        {isDirty && (
          <span style={{ color: "#666" }}>
            Unsaved changes
          </span>
        )}
      </div>
    </form>

);
}

9. Breadcrumb

Breadcrumb is generated only from visible steps.

// src/stepper/Breadcrumb.jsx

import {
useLocation,
useNavigate
} from "react-router-dom";

import { useWizardNavigation } from "./useWizardNavigation";

export default function Breadcrumb() {
const location = useLocation();
const navigate = useNavigate();

const {
visibleSteps
} = useWizardNavigation();

return (

<nav
style={{
        display: "flex",
        gap: "8px",
        marginBottom: "24px"
      }} >
{visibleSteps.map((step, index) => {
const isActive =
location.pathname === step.path;

        return (
          <button
            key={step.id}
            type="button"
            onClick={() =>
              navigate(step.path)
            }
            style={{
              fontWeight: isActive
                ? "bold"
                : "normal",
              borderBottom: isActive
                ? "2px solid blue"
                : "1px solid #ccc"
            }}
          >
            {index + 1}. {step.title}
          </button>
        );
      })}
    </nav>

);
}

10. Wizard Routes

Config drives the router.

// src/stepper/WizardRoutes.jsx

import {
Navigate,
Route,
Routes
} from "react-router-dom";

import { STEPS } from "./stepConfig";
import StepGuard from "./StepGuard";
import StepPage from "./StepPage";
import Breadcrumb from "./Breadcrumb";

import { useAuth } from "../auth/AuthContext";
import { useFeatureFlags } from "../flags/FeatureFlagContext";
import { useStepper } from "./StepperProvider";

import {
getVisibleSteps
} from "./stepResolver";

function WizardLayout() {
return (

<div
style={{
        maxWidth: "760px",
        margin: "40px auto",
        padding: "24px",
        border: "1px solid #ddd",
        borderRadius: "8px"
      }} >
<h1>Config Driven Stepper</h1>
<Breadcrumb />

      <Routes>
        {STEPS.map(step => (
          <Route
            key={step.id}
            path={step.path.replace("/wizard", "")}
            element={
              <StepGuard step={step}>
                <StepPage step={step} />
              </StepGuard>
            }
          />
        ))}

        <Route
          path="completed"
          element={<Completed />}
        />

        <Route
          path="*"
          element={<WizardRedirect />}
        />
      </Routes>
    </div>

);
}

function WizardRedirect() {
const user = useAuth();
const flags = useFeatureFlags();

const {
formData
} = useStepper();

const visibleSteps = getVisibleSteps({
user,
flags,
formData
});

return (
<Navigate
to={
visibleSteps[0]?.path ||
"/unauthorised"
}
replace
/>
);
}

function Completed() {
return (

<div>
<h2>Wizard Completed</h2>
<p>Your form has been submitted successfully.</p>
</div>
);
}

export default function WizardRoutes() {
return (
<Routes>
<Route
path="/wizard/\*"
element={<WizardLayout />}
/>

      <Route
        path="/unauthorised"
        element={
          <h2>
            You do not have access to this step.
          </h2>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/wizard/personal"
            replace
          />
        }
      />
    </Routes>

);
}

11. Step Components
    Personal Step
    // src/steps/PersonalStep.jsx

export default function PersonalStep({
register,
errors,
watch
}) {
const isEmployed = watch("isEmployed");

return (

<section>
<h2>Personal Details</h2>

      <div>
        <label>First Name</label>
        <input {...register("firstName")} />
        {errors.firstName && (
          <p style={{ color: "red" }}>
            {errors.firstName.message}
          </p>
        )}
      </div>

      <div>
        <label>Last Name</label>
        <input {...register("lastName")} />
        {errors.lastName && (
          <p style={{ color: "red" }}>
            {errors.lastName.message}
          </p>
        )}
      </div>

      <div>
        <label>Email</label>
        <input {...register("email")} />
        {errors.email && (
          <p style={{ color: "red" }}>
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            {...register("isEmployed")}
          />
          Currently employed
        </label>
      </div>

      <p>
        Employment step visible:{" "}
        <strong>
          {isEmployed ? "Yes" : "No"}
        </strong>
      </p>
    </section>

);
}

Employment Step
// src/steps/EmploymentStep.jsx

export default function EmploymentStep({
register,
errors
}) {
return (

<section>
<h2>Employment Details</h2>

      <div>
        <label>Company Name</label>
        <input {...register("companyName")} />
        {errors.companyName && (
          <p style={{ color: "red" }}>
            {errors.companyName.message}
          </p>
        )}
      </div>

      <div>
        <label>Designation</label>
        <input {...register("designation")} />
        {errors.designation && (
          <p style={{ color: "red" }}>
            {errors.designation.message}
          </p>
        )}
      </div>
    </section>

);
}

Team Step
// src/steps/TeamStep.jsx

export default function TeamStep({
register,
errors
}) {
return (

<section>
<h2>Team Details</h2>

      <div>
        <label>Team Name</label>
        <input {...register("teamName")} />
        {errors.teamName && (
          <p style={{ color: "red" }}>
            {errors.teamName.message}
          </p>
        )}
      </div>

      <div>
        <label>Team Size</label>
        <input
          type="number"
          {...register("teamSize")}
        />
        {errors.teamSize && (
          <p style={{ color: "red" }}>
            {errors.teamSize.message}
          </p>
        )}
      </div>
    </section>

);
}

Security Step
// src/steps/SecurityStep.jsx

export default function SecurityStep({
register,
errors
}) {
return (

<section>
<h2>Security Access</h2>

      <div>
        <label>Access Level</label>

        <select {...register("accessLevel")}>
          <option value="">
            Select access level
          </option>
          <option value="read">
            Read
          </option>
          <option value="write">
            Write
          </option>
          <option value="admin">
            Admin
          </option>
        </select>

        {errors.accessLevel && (
          <p style={{ color: "red" }}>
            {errors.accessLevel.message}
          </p>
        )}
      </div>
    </section>

);
}

Review Step
// src/steps/ReviewStep.jsx

export default function ReviewStep({
formData
}) {
return (

<section>
<h2>Review Details</h2>

      <pre
        style={{
          background: "#f5f5f5",
          padding: "16px"
        }}
      >
        {JSON.stringify(formData, null, 2)}
      </pre>
    </section>

);
}

12. App Setup
    // src/App.jsx

import {
BrowserRouter
} from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";
import { FeatureFlagProvider } from "./flags/FeatureFlagContext";
import { StepperProvider } from "./stepper/StepperProvider";
import WizardRoutes from "./stepper/WizardRoutes";

export default function App() {
return (
<BrowserRouter>
<AuthProvider>
<FeatureFlagProvider>
<StepperProvider>
<WizardRoutes />
</StepperProvider>
</FeatureFlagProvider>
</AuthProvider>
</BrowserRouter>
);
}

How Next / Previous Works
Next

When the user clicks Next:

Submit current step
↓
Run Zod validation
↓
If valid, save data to context
↓
Mark current step completed
↓
Recalculate visible steps
↓
Navigate to next allowed step

This is important because steps can change dynamically.

Example:

Personal step:
isEmployed = false

Then visible steps become:

Personal → Team → Review

The Employment step is skipped automatically.

Previous

Previous uses the current visibleSteps list:

const previousStep =
visibleSteps[currentIndex - 1];

So if a step is hidden due to role, condition, or feature flag, Previous also skips it.

How Form Data Persists Across Steps

The form data is stored in StepperProvider.

formData: {
firstName: "",
lastName: "",
email: "",
isEmployed: true
}

Each valid submit does this:

updateFormData(data);

The provider also saves the entire wizard state to localStorage:

localStorage.setItem(
STORAGE_KEY,
JSON.stringify(state)
);

So if the user refreshes the page, the form is restored using:

JSON.parse(localStorage.getItem(STORAGE_KEY));

How Validation Works Per Step

Each step has its own schema:

{
id: "team",
title: "Team",
schema: teamSchema
}

The generic StepPage loads the correct schema dynamically:

useForm({
resolver: zodResolver(step.schema),
defaultValues: formData
});

So validation is fully config-driven.

Example Behaviour

For this user:

role: "Manager",
permissions: ["TEAM_VIEW", "TEAM_EDIT"]

And these flags:

ENABLE_EMPLOYMENT_STEP: true
ENABLE_TEAM_STEP: true
ENABLE_SECURITY_STEP: false

Visible steps will be:

Personal → Employment → Team → Review

Security is hidden because:

role is not Admin
feature flag is disabled
permission is missing

If isEmployed is unchecked, visible steps become:

Personal → Team → Review

Lead-Level Interview Explanation

You can explain it like this:

I would keep the wizard configuration-driven. Each step defines its route, component, validation schema, allowed roles, required permissions, feature flag, and conditional visibility rules. React Router routes, breadcrumbs, next/previous navigation, validation, and route guards are all derived from the same config. This avoids hardcoding and allows different users to see different step flows based on role, permissions, feature flags, and form data.

This is a strong architecture for enterprise use cases like employee onboarding, insurance claims, loan applications, tax filing flows, internal job posting forms, and KYC workflows.

For enterprise React forms, it's important to have clear validation messages, a reliable reset mechanism, and a dedicated review/summary step before final submission. Internal React guidance also emphasises validation handling and React forms with validation rules.

1. Custom Validation Error Messages
   Zod Schema with Custom Messages

Instead of:

z.string().min(2)

Use:

export const personalSchema = z.object({
firstName: z.string()
.min(2, {
message:
"First Name must contain at least 2 characters"
})
.max(50, {
message:
"First Name cannot exceed 50 characters"
}),

email: z.string()
.email({
message:
"Please enter a valid email address"
}),

age: z.coerce.number()
.min(18, {
message:
"Minimum age required is 18 years"
})
});

Dynamic Error Message Mapping

Useful for localisation.

const validationMessages = {
required:
"This field is mandatory",

invalidEmail:
"Please provide a valid email address",

minLength:
"Input length is too short"
};

React Hook Form Display
<input {...register("email")} />

{errors.email && (
<ErrorText>
{errors.email.message}
</ErrorText>
)}

Multiple Errors
useForm({
resolver: zodResolver(schema),

criteriaMode: "all"
});

<ErrorMessage
errors={errors}
name="password"
render={({ messages }) =>
Object.values(
messages
).map(message => (

<p key={message}>
{message}
</p>
))
}
/>

2. Reset Form Data and Wizard State

Current Provider:

{
formData,
completedStepIds
}

Add reset support.

const defaultState = {
formData: {
firstName: "",
lastName: "",

    email: "",

    companyName: "",

    designation: ""

},

completedStepIds: []
};

Provider Reset Method
const resetWizard = () => {

setState(defaultState);

localStorage.removeItem(
"wizardDraft"
);
};

Context
<StepperContext.Provider
value={{
formData,

    updateFormData,

    completedStepIds,

    resetWizard

}}

>

Reset Button
const {
resetWizard
} = useStepper();

<button
type="button"
onClick={resetWizard}

> Reset Wizard
> </button>

Reset Current React Hook Form
const {
reset
} = useForm();

<button
onClick={() => reset()}

> Reset Current Step
> </button>

Reset to Default Values
reset({
firstName: "",
email: ""
});

3. Add Summary Step Before Completion

Current Flow:

Personal
↓
Employment
↓
Team
↓
Review
↓
Completed

Better Enterprise Flow:

Personal
↓
Employment
↓
Team
↓
Review
↓
Summary
↓
Submit
↓
Completed

Update Step Config
import SummaryStep
from "../steps/SummaryStep";

{
id: "summary",

title: "Summary",

path: "/wizard/summary",

component: SummaryStep,

schema: z.object({})
}

Add before Review or Completion.

Summary Component
import {
useStepper
} from "../stepper/StepperProvider";

export default function SummaryStep() {

const {
formData
} = useStepper();

return (

    <div>

      <h2>
        Application Summary
      </h2>

      <div>
        <strong>
          First Name:
        </strong>

        {formData.firstName}
      </div>

      <div>
        <strong>Email:</strong>

        {formData.email}
      </div>

      <div>
        <strong>Company:</strong>

        {formData.companyName}
      </div>

      <div>
        <strong>Designation:</strong>

        {formData.designation}
      </div>

    </div>

);
}

Highlight Missing Data
const fields = [
{
label: "Email",
value: formData.email
},
{
label: "Company",
value: formData.companyName
}
];

{
fields.map(field => (

<div key={field.label}>
{field.label}

      {!field.value && (
        <span
          style={{
            color: "red"
          }}
        >
          Missing
        </span>
      )}
    </div>

));
}

Edit from Summary

Allow user to jump back.

<button
onClick={() =>
navigate(
"/wizard/personal"
)
}

> Edit Personal
> </button>

Summary Validation Before Final Submit
const validateBeforeSubmit = () => {

const mandatoryFields = [
"firstName",
"email"
];

return mandatoryFields.every(
field => formData[field]
);
};

Final Submit
const handleFinalSubmit =
async () => {

await submitWizard(
formData
);

resetWizard();

navigate(
"/wizard/completed"
);
};

<button
onClick={
handleFinalSubmit
}

> Submit Application
> </button>

# Advanced Enterprise Summary Screen

# Application Summary

✓ Personal Details

✓ Employment Information

✓ Team Details

⚠ Missing Security Access

---

[Edit Personal]

[Edit Employment]

[Edit Team]

---

Save As Draft

# Submit Application

Senior/Lead Interview Answer

A production-ready wizard should:

Use step-specific validation schemas with meaningful custom messages.
Support form reset, step reset, and full wizard reset.
Persist draft data in Context + localStorage.
Include a dedicated Summary/Review step before final submission.
Allow users to jump back to any completed step for correction.
Perform a final validation pass before API submission.
Clear local state and draft storage after successful submission.

This pattern works extremely well for onboarding, insurance claims, IJP applications, KYC journeys, and large enterprise workflows with 10–20 dynamic steps.
