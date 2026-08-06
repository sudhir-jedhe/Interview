
```javascript
    function map(array, func) {
        return reduce(array, function (result, item) {
        result.push(func(item));
        return result;
        }, []);
    }

    map([1, 2, 3, 4, 5], item => item + 1) // [ 2, 3, 4, 5, 6 ]
```


```Javascript
    const map = (array, func) =>
    reduce(array, (result, item) =>
    result.concat(func(item)), []);
```