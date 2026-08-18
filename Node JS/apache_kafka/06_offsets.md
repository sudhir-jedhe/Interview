an offset - the position of a message inside a partition

topic -> partitions -> offsets

every message in a particular gets an offset number

topic order.placed
partition 0
offset 0 -> order_1001
offset 1 -> order 1004
offset 2 -> order_1007
offset 3 -> order_1010

partition 1

no

offset is not the event ID, but its actually the msg position inside. partition

noti- offset 25
ana - offset 12
inventory - offset 30
