6 ways to convert string to a number in javascript
Posted on April 17, 2019 | by Prashant Yadav

Posted in Javascript, String

A number can be represented in two different ways in javascript,

1. As actual number 25.
2. As String '25'.

There are many times when we need to convert the string to number in javascript.

We will see 6 different ways in which we can convert string to a number.

Using Number() function.
The most relevant way to convert a string to number is by using Number() method.

```js
Number("25"); //25
Number("2500"); //2500
Number("25.24"); //25.24
Number("24,000"); //NaN
```

Copy
It takes care of the interger as well as decimal or floating numbers.

However it does not converts strings with separators like Number("24,000") as you can see it returns NaN. If you want to convert string with separators then use Intl.NumberFormat.

Using parseInt()

```js
parseInt(string, base) function converts a string to an integer of the specified base.

parseInt('25', 10); //25
```

Copy
If we don’t specify the base then it will use the appropriate base based on the input. So for our case always use 10 as base.

As it convert strings for different base, for base 10 if the starting character is not number then it will return NaN.

```js
parseInt("25 is my age", 10); //25
parseInt("25,000", 10); // 25
parseInt("My age is 25", 10); //NaN
```

Copy
If we want to keep the decimal part, then we need to use parseFloat().

```js
parseInt("25.24"); //25
```

Copy
Using parseFloat()

```js
parseFloat() function converts a string to the floating point number.

parseFloat('25.24'); //25.24
parseFloat('25'); //25

```

Copy
Just like parseInt() it will also convert the fist matching number only. It will return NaN for the strings starting with other than numbers.

```js
parseFloat(3.14); //3.14
parseFloat("3.14"); //3.14
parseFloat("314e-2"); //3.14
parseFloat("0.0314E+2"); //3.14
parseFloat("3.14more non-digit characters"); //3.14
parseFloat("31,400"); //31
parseFloat("Age is 25"); //NaN
```

Copy
Using Math.floor() to convert string to number
Math.floor() can also be used to convert the string to number in javascript. It will not work for floating point numbers as it round offs the number.

```js
Math.floor("25"); //25
Math.floor("25.24"); //25
Math.floor("25,000"); //NaN
Math.floor("25abc"); //NaN
Math.floor("abc25"); //NaN
```

Copy
Using unary operator +
You can append the + operator before the string to convert it to integer. Be careful using this as + operator is also used to concatenate two or more strings 'abc'+'xyz' = 'abcxyz'.

```js
+"25"; //25
+"25.24"; //25.24
+"25,000"; //NaN
+"25abc"; //NaN
+"abc25"; //NaN
```

Copy
Multiplying the string by 1 using _ 1
Just like +, we can also multiply the string with 1 using _ 1 to convert the string to a number.

```js
'25' _ 1; //25
'25.24' _ 1; //25.24
'25,000' _ 1; //NaN
'25abc' _ 1; //NaN
'abc25' \* 1; //NaN
```

Copy
It is one of the fastest method to available for the quick conversion.
