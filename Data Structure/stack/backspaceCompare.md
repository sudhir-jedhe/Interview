function backspaceCompare(S, T) {
    const stackS = [];
    const stackT = [];

    // Function to build the stack for a given string
    const buildStack = (str, stack) => {
        for (let char of str) {
            if (char === '#') {
                stack.pop(); // Simulate backspace
            } else {
                stack.push(char);
            }
        }
    };

    buildStack(S, stackS);
    buildStack(T, stackT);

    // Compare stacks
    if (stackS.length !== stackT.length) {
        return false;
    }

    while (stackS.length > 0) {
        if (stackS.pop() !== stackT.pop()) {
            return false;
        }
    }

    return true;
}

// Example usage:
console.log(backspaceCompare("ab#c", "ad#c")); // Output: true
console.log(backspaceCompare("ab##", "c#d#")); // Output: true
console.log(backspaceCompare("a##c", "#a#c")); // Output: true
console.log(backspaceCompare("a#c", "b")); // Output: false
