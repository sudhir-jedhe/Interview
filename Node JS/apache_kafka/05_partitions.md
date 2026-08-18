topic - we already know

partition - will be a ordered append only log inside a topic

order.placed

partition 0: event, event, event, event
partition 1: event, event, event
partition 2: event, event, event, event, event

order.placed - can receive lot of order events

parition allows kafka to spread events acroos multiple logs so multiple consumers can process all events in order

partition 0: order_1001, order_1004, order_1005
partition 1: order_1002, order_1003
partition 2: order_1010
