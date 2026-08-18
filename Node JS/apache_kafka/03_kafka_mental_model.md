distributed event streaming platform

\*\*\* not just a queue

storing a stream of events so many consumers can read it indepndently

order-service -> writes an event to kafka

```json
{
    "eventType": "ORDER_PLACED,
    "orderId": "1141,
    "userID" : 1223,
    "amount:23534
}


```

stores this event in a topic

multiple services can read the same events

writing as an event log

order.placed topic

offset 0 - order 1 placed
offset 1 - order 2 placed
offset 2 - order 3 placed

consumers do not remove messages from kafka

each consumer tracks its own position
this position called offset

why its powerful

events are stored

multiple services can read same event

services can catch up after downtime

analytics service -> was down for 20 mins -> kafka can still keep the events
once analytics service is up again - kafka can continue from where it stopped

new service. - fraud service - read old order related events also

producer and consumer are decoupled
