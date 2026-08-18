producer is an application that sends events/messafes to kafka

order-service = producer

order-service -> order.placed topic

topic - order.placed
event data - order details
message key - userId

```ts
await producer.send({
    topic: 'topic',
    messages: [
        {
            "key" : "user_42",
            value :  JSON.strinfy({})
        }
    ]
})

same key -> same partition

order_placed for user 42 - partition 1
order_updated for user_42 - partition 1
order_cancelled for user_42 - partition 1

order service - topic order.placed, key, value: actual event data

user_42 - to a certain partition 1

places another order - sends to same partition 1


```
