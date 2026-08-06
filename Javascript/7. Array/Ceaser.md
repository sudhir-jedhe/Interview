// Caesar Cipher

**Input:**
text = ABCD , Key = 13
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
13 shift to A is N
13 shift to B is O
13 shift to C is P
13 shift to D is Q

**Output:**
NOPQ

```js
let ceaserCipher = (str) => {
    //Deciphered reference letters
    let decoded = {
      a: 'n', b: 'o', c: 'p',
      d: 'q', e: 'r', f: 's',
      g: 't', h: 'u', i: 'v',
      j: 'w', k: 'x', l: 'y',
      m: 'z', n: 'a', o: 'b',
      p: 'c', q: 'd', r: 'e',
      s: 'f', t: 'g', u: 'h',
      v: 'i', w: 'j', x: 'k',
      y: 'l', z: 'm'    
    }
    
    //convert the string to lowercase
    str = str.toLowerCase();
    
    //decipher the code
    let decipher = '';
    for(let i = 0 ; i < str.length; i++){
      decipher += decoded[str[i]];
    }
    
    //return the output
    return decipher;
  }



  let caesarCipher => (str, key) {
    return str.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode((c.charCodeAt(0)-65 + key ) % 26 + 65));
  }

```

  **Input**:
  ```js
console.log(ceaserCipher('attackatonce'));
console.log(ceaserCipher('prashantyadav'));
```
**Output**:
"nggnpxngbapr"
"cenfunaglnqni"

  **Input**:
  ```js
console.log(ceaserCipher('ATTACKATONCE', 13));
console.log(ceaserCipher('PRASHANTYADAV', 13));
```

**Output**:
"NGGNPXNGBAPR"
"CENFUNAGLNQNI"



The Caesar Cipher is a classic encryption technique where each letter in the plaintext is shifted by a certain number (the key) to produce the ciphertext. 

Here's a breakdown of your code and some suggestions to fix or improve it:

### Key Issues:
1. **Function Names:**
   You have two different functions with incorrect or incomplete names (`ceaserCipher` and `caesarCipher`). The correct spelling is **"Caesar"** with two "a"s, not "ceaser".
   
2. **First Function (`ceaserCipher`):**
   This is attempting to perform a Caesar cipher with a hardcoded shift of 13, but it uses a predefined dictionary `decoded`, which is fine for a shift of 13. However, it lacks the generalizability for arbitrary shifts (key).

3. **Second Function (`caesarCipher`):**
   This function looks better and more flexible since it uses the key provided as an argument. It can handle any shift dynamically, but the function's syntax for declaration is incorrect (`let caesarCipher => ...`), which is why it's invalid.

---

### Fixed Code:

Here is the corrected version of the **Caesar Cipher** code, which allows for a dynamic key (shift) and supports both lowercase and uppercase letters.

```javascript
// Caesar Cipher with customizable key
let caesarCipher = (str, key) => {
    return str.replace(/[A-Z]/g, c => 
        String.fromCharCode((c.charCodeAt(0) - 65 + key) % 26 + 65)
    ).replace(/[a-z]/g, c =>
        String.fromCharCode((c.charCodeAt(0) - 97 + key) % 26 + 97)
    );
};

// Example 1: with string and key
console.log(caesarCipher('attackatonce', 13)); // Output: "nggnpxngbapr"
console.log(caesarCipher('prashantyadav', 13)); // Output: "cenfunaglnqni"

// Example 2: with uppercase string and key
console.log(caesarCipher('ATTACKATONCE', 13)); // Output: "NGGNPXNGBAPR"
console.log(caesarCipher('PRASHANTYADAV', 13)); // Output: "CENFUNAGLNQNI"
```

### Explanation:
- **`String.fromCharCode()`** and **`charCodeAt()`**:
  - We are using `charCodeAt()` to convert each character to its Unicode value.
  - The uppercase letters `'A'` to `'Z'` have Unicode values from `65` to `90`. The lowercase letters `'a'` to `'z'` have Unicode values from `97` to `122`.
  
- **Shifting Logic**:
  - We subtract the base value (`65` for uppercase, `97` for lowercase) to make the shift start from `0`.
  - We then add the key, perform a modulo operation (`% 26`) to ensure we stay within the alphabet, and add back the base value to convert the shifted value back to a character.

- **Regex Replacement**:
  - The `replace(/[A-Z]/g, c => ...)` part works for uppercase letters.
  - The `replace(/[a-z]/g, c => ...)` part handles lowercase letters.

### Example:

For input: 
```javascript
caesarCipher('attackatonce', 13)
```
- The letter `'a'` (ASCII value `97`) is shifted by `13` to become `'n'`.
- The letter `'t'` (ASCII value `116`) is shifted by `13` to become `'g'`.
- The letter `'a'` becomes `'n'` again, and so on.

**Output**:
```javascript
"nggnpxngbapr"
```

For uppercase input:
```javascript
caesarCipher('ATTACKATONCE', 13)
```
**Output**:
```javascript
"NGGNPXNGBAPR"
```

### Alternate Approach: 
If you want a version that hardcodes the shift (like your original `ceaserCipher`), you can implement it like this for **shift 13**:

```javascript
let ceaserCipher = (str) => {
    const decoded = {
        a: 'n', b: 'o', c: 'p', d: 'q', e: 'r', f: 's', g: 't', h: 'u', 
        i: 'v', j: 'w', k: 'x', l: 'y', m: 'z', n: 'a', o: 'b', p: 'c', 
        q: 'd', r: 'e', s: 'f', t: 'g', u: 'h', v: 'i', w: 'j', x: 'k', 
        y: 'l', z: 'm'
    };
    
    str = str.toLowerCase();
    let decipher = '';
    for (let i = 0; i < str.length; i++) {
        decipher += decoded[str[i]];
    }
    return decipher;
};

// Example with hardcoded shift of 13
console.log(ceaserCipher('attackatonce')); // Output: "nggnpxngbapr"
```

### Conclusion:
The flexible version allows you to use any key, making it more reusable and applicable to different Caesar cipher problems. The hardcoded version can be used for a specific shift (like `13`), which is useful in certain scenarios like ROT13.