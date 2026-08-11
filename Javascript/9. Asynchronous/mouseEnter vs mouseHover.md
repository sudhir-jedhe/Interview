How do mouseenter and mouseover differ?
mouseenter
Does not bubble up the DOM tree.
Triggered only when the mouse pointer enters the element itself, excluding its children.
Fires a single event when entering the target element.

mouseover
Bubbles up the DOM tree.
Triggered when the mouse pointer enters the target element or any of its children.
Fires multiple events when moving over child elements.
