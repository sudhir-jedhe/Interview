normal node js -> one main js thread

cluster module ->
by starting multiple node js worker process

each and every worker proces ->
its own node js runtime
its own v8 engine
its own event loop
its onw main js thread
its own memory
