# Image CDNs and Delivery Infrastructure

For modern frontend applications, image optimisation is no longer just about compression. At scale, you need a **delivery infrastructure** that can:

```text
✅ Store originals
✅ Transform images
✅ Optimise formats
✅ Cache globally
✅ Deliver quickly
```

This is where **Image CDNs** come in. An Image CDN combines traditional CDN capabilities with image-specific features such as dynamic optimisation, resizing, format conversion, and adaptive delivery. [\[codelucky.com\]](https://codelucky.com/image-cdn-specialized-image-delivery-networks/), [\[edgeone.ai\]](https://edgeone.ai/learning/image-cdn)

---

# Why Image CDNs Exist

Without an Image CDN:

```text
User
  ↓
Origin Server
  ↓
Image
```

Problems:

```text
❌ High latency
❌ Large image downloads
❌ Same image for every device
❌ Repeated processing
```

With an Image CDN:

```text
User
  ↓
Nearest Edge Server
  ↓
Optimised Image
```

Images are cached near users and can be transformed before delivery. [\[codelucky.com\]](https://codelucky.com/image-cdn-specialized-image-delivery-networks/), [\[edgeone.ai\]](https://edgeone.ai/learning/image-cdn)

---

# Typical Architecture

```text
             Upload
                │
                ▼
       Object Storage
                │
                ▼
      Image Processing Layer
                │
                ▼
         Image CDN
                │
     ┌──────────┼──────────┐
     ▼          ▼          ▼
 Edge US    Edge EU    Edge Asia
     │          │          │
     ▼          ▼          ▼
   Users      Users      Users
```

A common architecture uses object storage for originals, image processing for transformations, and edge caching for global delivery. [\[medium.com\]](https://medium.com/@lorenzo_33729/building-a-scalable-image-cdn-with-minio-imgproxy-and-cloudflare-4694ad4b93df), [\[edgeone.ai\]](https://edgeone.ai/learning/image-cdn)

---

# What Image CDNs Do

## 1. Dynamic Resizing

Original:

```text
4000 × 3000
```

Mobile request:

```text
width=400
```

Desktop request:

```text
width=1600
```

CDN generates the appropriate version automatically. [\[edge.network\]](https://edge.network/docs/cdn/image-optimization), [\[codelucky.com\]](https://codelucky.com/image-cdn-specialized-image-delivery-networks/)

Example pattern:

```text
hero.jpg?width=800
```

[\[edge.network\]](https://edge.network/docs/cdn/image-optimization)

---

## 2. Automatic Format Conversion

A browser supporting:

```text
AVIF
```

receives:

```text
hero.avif
```

Another browser might receive:

```text
hero.webp
```

or:

```text
hero.jpeg
```

Many image delivery platforms automatically select the best format based on browser support. [\[cloudflare.com\]](https://www.cloudflare.com/products/images/), [\[edge.network\]](https://edge.network/docs/cdn/image-optimization), [\[edgeone.ai\]](https://edgeone.ai/learning/image-cdn)

---

## 3. Smart Compression

CDNs typically:

```text
Compress
Resize
Optimise quality
Strip unnecessary bytes
```

before serving images. [\[codelucky.com\]](https://codelucky.com/image-cdn-specialized-image-delivery-networks/), [\[edge.network\]](https://edge.network/docs/cdn/image-optimization)

---

## 4. Edge Caching

First request:

```text
Origin → Edge → User
```

Later requests:

```text
Edge → User
```

This significantly reduces latency and origin load. [\[codelucky.com\]](https://codelucky.com/image-cdn-specialized-image-delivery-networks/), [\[edgeone.ai\]](https://edgeone.ai/learning/image-cdn), [\[cloudflare.com\]](https://www.cloudflare.com/products/images/)

---

# Real Request Flow

```text
User opens page
     │
     ▼
Request image
     │
     ▼
Nearest edge checks cache
     │
 ┌───┴────┐
 │ Cache? │
 └───┬────┘
     │
Yes  │   No
     ▼
 Serve      Fetch Origin
 Image      Transform
            Cache
            Serve
```

This cache-first pattern is explicitly described in image CDN architectures. [\[medium.com\]](https://medium.com/@lorenzo_33729/building-a-scalable-image-cdn-with-minio-imgproxy-and-cloudflare-4694ad4b93df), [\[codelucky.com\]](https://codelucky.com/image-cdn-specialized-image-delivery-networks/)

---

# Popular Image CDN Capabilities

### Responsive Delivery

```text
srcset
sizes
device-aware optimisation
```

[\[cloudflare.com\]](https://www.cloudflare.com/products/images/), [\[codelucky.com\]](https://codelucky.com/image-cdn-specialized-image-delivery-networks/)

### Format Optimisation

```text
AVIF
WebP
JPEG
PNG
```

[\[cloudflare.com\]](https://www.cloudflare.com/products/images/), [\[edge.network\]](https://edge.network/docs/cdn/image-optimization), [\[edgeone.ai\]](https://edgeone.ai/learning/image-cdn)

### On-the-Fly Transformations

```text
Crop
Resize
Blur
Sharpen
Grayscale
```

[\[edge.network\]](https://edge.network/docs/cdn/image-optimization)

### Security

```text
Tokenised URLs
Hotlink protection
HTTPS delivery
```

[\[codelucky.com\]](https://codelucky.com/image-cdn-specialized-image-delivery-networks/)

---

# React / Next.js Perspective

Without CDN:

```jsx
/hero.jpg
```

Server must manage:

```text
Resizing
Compression
Caching
Formats
```

With image infrastructure:

```jsx
/hero.jpg
```

The backing image service can handle optimisation and delivery automatically. (This is a general architectural pattern; exact behaviour depends on the platform.)

---

# Core Web Vitals Benefits

## LCP

```text
Faster hero image delivery
```

Because:

```text
Optimised format
Closer edge location
Pre-generated variants
```

[\[cloudflare.com\]](https://www.cloudflare.com/products/images/), [\[codelucky.com\]](https://codelucky.com/image-cdn-specialized-image-delivery-networks/)

---

## CLS

```text
Properly sized images
```

when combined with responsive delivery. [\[codelucky.com\]](https://codelucky.com/image-cdn-specialized-image-delivery-networks/), [\[edgeone.ai\]](https://edgeone.ai/learning/image-cdn)

---

## INP

```text
Less CPU work
Smaller decode costs
```

due to lighter image payloads and optimised delivery. [\[cloudflare.com\]](https://www.cloudflare.com/products/images/), [\[codelucky.com\]](https://codelucky.com/image-cdn-specialized-image-delivery-networks/)

---

# Senior System Design Interview Answer

> An Image CDN is a specialised content delivery network that combines global edge caching with real-time image processing. Rather than storing multiple image variants, the CDN can resize, compress, crop, and convert images on demand, then cache the transformed version at the edge. This reduces bandwidth, improves Core Web Vitals, lowers origin load, and ensures each device receives the most appropriate image format and size. [\[codelucky.com\]](https://codelucky.com/image-cdn-specialized-image-delivery-networks/), [\[edgeone.ai\]](https://edgeone.ai/learning/image-cdn), [\[cloudflare.com\]](https://www.cloudflare.com/products/images/)
