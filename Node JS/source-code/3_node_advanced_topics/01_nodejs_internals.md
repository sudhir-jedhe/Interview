// v8 engine -> executes js
// fs, timers

// more than v8 engine

## main js thread

normal app JS executes on one main JS thread

## v8 engine

parsing js
executes js
manage call stack
heap memory and performning garbage collection

## node js core apis

fs
http
path
streams
buffer
process
timers

core apis -> some of this written in js

## c++ bindings

connect js facing apis to native functionality
js code to comminucate with
libuv
os apis
native libraries

## libuv

native library used by node js
event loop
worker thread pool
timers
async i/o handling

## os

low level work
reading files
writing files
tracking time
