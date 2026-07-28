**The difference between event.target vs event.currentTarget is important to know.**

e.target contains a reference to the element that triggered the event, while e. currentTarget contains a reference to the element that the event handler is attached to.

For example, if you have a div element which is a parent that has a button element the div element has onClick event and you click on the button the e.target property will contain a reference to the button element but the e.currentTarget will contain the reference of the div element.

**Where this can be useful?**

By using this you can achieve the great optimisation technique called event delegation.

Before event delegation you need to know event bubbling which in-short means events bubbles up untill the end.

**What is event delegation?**

In a nutshell when you have thousands of elements in a array a native approach is to attach maybe a onClick handler to each element but its better to attach only one event listener (onClick) on parent and with the power of event bubbling you can get the reference of the triggered element.
