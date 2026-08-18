sync rest chains -

one service directly calls multiple other services during the same user req

order-service

imme calls
noti-service - to send an email
analytic-service - track the order
inventory-service - to update stock

one service - noti-service slows down - slows the full request
analytic-service - 3 seconds

```ts
try{
    await createOrder(orderData)
    await notiUser(orderData)
    await analytics(orderData)
    await updateInventory(orderData)
}
```

create messy code

adding a new service can be problematic

how ???

order-service -> should not care about who needs the order event
