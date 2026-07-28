# Airbnb Card Compound Component (React Context Pattern)

This challenge is a classic **Compound Components + Context API** interview problem where the `Card` component acts as a provider and subcomponents consume only the data they need from Context. This pattern enables flexible composition, implicit state sharing, and allows subcomponents to be rearranged or omitted. [\[dev.to\]](https://dev.to/muhammadazfaraslam/react-design-patterns-compound-component-pattern-2p0a), [\[patterns.dev\]](https://www.patterns.dev/react/compound-pattern/), [\[namastedev.com\]](https://namastedev.com/guides/namaste-react/how-to-implement-the-compound-component-pattern-in-react)

---

# CardContext.tsx

```tsx
import { createContext, useContext } from "react";

export interface AirbnbCardData {
  id: number;
  image: string;
  title: string;
  rating?: number;
  description: string;
  price: number;
  cancellation?: string;
  recommendation?: string;
  isFavorite?: boolean;
}

const CardContext = createContext<AirbnbCardData | null>(null);

export function useCard() {
  const context = useContext(CardContext);

  if (!context) {
    throw new Error("Card compound components must be used inside Card");
  }

  return context;
}

export default CardContext;
```

---

# Card.tsx

```tsx
import CardContext from "./CardContext";

export default function Card({
  data,
  children,
}: {
  data: AirbnbCardData;
  children: React.ReactNode;
}) {
  return (
    <CardContext.Provider value={data}>
      <article data-testid={`card-${data.id}`} className="card">
        {children}
      </article>
    </CardContext.Provider>
  );
}
```

---

# Compound Components

## ImageWrapper

```tsx
export function ImageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div data-testid="image-wrapper" className="image-wrapper">
      {children}
    </div>
  );
}
```

---

## Image

```tsx
import { useCard } from "./CardContext";

export function Image() {
  const card = useCard();

  return (
    {card.image}
  );
}
```

---

## Heart

```tsx
import { useState } from "react";

import { useCard } from "./CardContext";

export function Heart() {
  const card = useCard();

  const [favorite, setFavorite] = useState(card.isFavorite ?? false);

  return (
    <button
      data-testid="heart-btn"
      aria-label="Favorite"
      onClick={() => setFavorite((prev) => !prev)}
    >
      {favorite ? "❤️" : "🤍"}
    </button>
  );
}
```

---

## Recommendation

```tsx
import { useCard } from "./CardContext";

export function Recommendation() {
  const card = useCard();

  if (!card.recommendation) return null;

  return <span data-testid="recommendation">{card.recommendation}</span>;
}
```

---

## Content

```tsx
export function Content({ children }: { children: React.ReactNode }) {
  return <div data-testid="content">{children}</div>;
}
```

---

## Title

```tsx
import { useCard } from "./CardContext";

export function Title() {
  const card = useCard();

  return <h3 data-testid="title">{card.title}</h3>;
}
```

---

## Valoration

```tsx
import { useCard } from "./CardContext";

export function Valoration() {
  const card = useCard();

  if (card.rating === undefined) return null;

  return <span data-testid="rating">⭐ {card.rating}</span>;
}
```

---

## Description

```tsx
import { useCard } from "./CardContext";

export function Description() {
  const card = useCard();

  return <p data-testid="description">{card.description}</p>;
}
```

---

## Price

```tsx
import { useCard } from "./CardContext";

export function Price() {
  const card = useCard();

  return (
    <p data-testid="price">
      ${card.price}
      /night
    </p>
  );
}
```

---

## Cancelation

```tsx
import { useCard } from "./CardContext";

export function Cancelation() {
  const card = useCard();

  if (!card.cancellation) return null;

  return <span data-testid="cancelation">{card.cancellation}</span>;
}
```

---

# Sample Data

```tsx
export const airbnbData = [
  {
    id: 1,
    image: "/1.jpg",
    title: "Lake View",
    rating: 4.9,
    description: "Peaceful stay",
    price: 120,
    cancellation: "Free cancellation",
    recommendation: "Guest favorite",
    isFavorite: true,
  },

  {
    id: 2,
    image: "/2.jpg",
    title: "Mountain Cabin",
    rating: 4.7,
    description: "Amazing scenery",
    price: 150,
    cancellation: "Free cancellation",
    recommendation: "Top rated",
    isFavorite: false,
  },

  {
    id: 3,
    image: "/3.jpg",
    title: "Beach House",
    rating: 4.8,
    description: "Ocean front",
    price: 200,
    cancellation: "Free cancellation",
    recommendation: "Trending",
    isFavorite: false,
  },

  {
    id: 4,
    image: "/4.jpg",
    title: "Tiny House",
    description: "Minimalist stay",
    price: 90,
  },
];
```

---

# App.tsx

## First 3 Cards (Full Composition)

```tsx
import Card from "./Card";

import {
  ImageWrapper,
  Image,
  Heart,
  Recommendation,
  Content,
  Title,
  Valoration,
  Description,
  Price,
  Cancelation,
} from "./Components";

import { airbnbData } from "./data";

export default function App() {
  return (
    <div>
      <h1>Airbnb Cards</h1>

      {airbnbData.slice(0, 3).map((card) => (
        <Card key={card.id} data={card}>
          <ImageWrapper>
            <Image />
            <Heart />
            <Recommendation />
          </ImageWrapper>

          <Content>
            <div>
              <Title />
              <Valoration />
            </div>

            <Description />

            <Price />

            <Cancelation />
          </Content>
        </Card>
      ))}

      {/* Card 4 */}
      <Card data={airbnbData[3]}>
        <ImageWrapper>
          <Image />
        </ImageWrapper>

        <Content>
          <Title />

          <Price />

          <Description />
        </Content>
      </Card>
    </div>
  );
}
```

---

# Why This Passes

### Card Uses Context

```tsx
<Card data={card}>
```

Provider supplies all data.

Subcomponents consume it through:

```tsx
useCard();
```

without props. This aligns with the Compound Component pattern of a parent providing shared state through Context. [\[patterns.dev\]](https://www.patterns.dev/react/compound-pattern/), [\[namastedev.com\]](https://namastedev.com/guides/namaste-react/how-to-implement-the-compound-component-pattern-in-react)

---

### First Three Cards

Render:

```text
ImageWrapper
 ├─ Image
 ├─ Heart
 └─ Recommendation

Content
 ├─ Title + Valoration
 ├─ Description
 ├─ Price
 └─ Cancelation
```

✅ Full composition

---

### Fourth Card

Renders:

```text
Image

Title

Price

Description
```

No:

```text
Heart
Recommendation
Valoration
Cancelation
```

✅ Required partial card

---

### Heart

```tsx
useState(card.isFavorite);
```

Clicking toggles:

```text
🤍 → ❤️
❤️ → 🤍
```

✅ Interactive state

---

# Senior Interview Answer

> I implemented the Airbnb card using the Compound Components pattern with React Context. The `Card` acts as the provider boundary and exposes the card data to child components via Context, eliminating prop drilling. Each subcomponent consumes only the fields it needs, making the card highly composable. This enables different card layouts—such as the partial fourth card—without changing the underlying card implementation, which is one of the key advantages of compound components. [\[dev.to\]](https://dev.to/muhammadazfaraslam/react-design-patterns-compound-component-pattern-2p0a), [\[namastedev.com\]](https://namastedev.com/guides/namaste-react/how-to-implement-the-compound-component-pattern-in-react)
