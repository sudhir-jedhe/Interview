queue - buffer between services

order service - publish a message to a queue

order service does not wait for the noti service to finish sending the email

once the order is placed

```json
{
    "eventType": "ORDER_PLACED,
    "orderId": "1141,
    "userID" : 1223
}

```

order service puts this msg into the queue
noti service consume it and send the email

system is less tightly coupled

OS - NQ - NS
OS - AQ - AS
OS - IQ - IS

msgs usually removed after processing

consumed is already consumed -> removed from the queue
backgrounds jobs

analytics-service -> new service -> process orders from the last 7 days
