```js
function strongPasswordCheckerII(password: string): boolean {
    if (password.length < 8) {
        return false;
    }
    let mask = 0;
    for (let i = 0; i < password.length; ++i) {
        const c = password[i];
        if (i && c == password[i - 1]) {
            return false;
        }
        if (c >= 'a' && c <= 'z') {
            mask |= 1;
        } else if (c >= 'A' && c <= 'Z') {
            mask |= 2;
        } else if (c >= '0' && c <= '9') {
            mask |= 4;
        } else {
            mask |= 8;
        }
    }
    return mask == 15;
}

A password is said to be strong if it satisfies all the following criteria:

It has at least 8 characters.
It contains at least one lowercase letter.
It contains at least one uppercase letter.
It contains at least one digit.
It contains at least one special character. The special characters are the characters in the following string: "!@#$%^&*()-+".
It does not contain 2 of the same character in adjacent positions (i.e., "aab" violates this condition, but "aba" does not).
Given a string password, return true if it is a strong password. Otherwise, return false.



Example 1:

Input: password = "IloveLe3tcode!"
Output: true
Explanation: The password meets all the requirements. Therefore, we return true.
Example 2:

Input: password = "Me+You--IsMyDream"
Output: false
Explanation: The password does not contain a digit and also contains 2 of the same character in











/********************************** */



A password is considered strong if the below conditions are all met:

It has at least 6 characters and at most 20 characters.
It contains at least one lowercase letter, at least one uppercase letter, and at least one digit.
It does not contain three repeating characters in a row (i.e., "Baaabb0" is weak, but "Baaba0" is strong).
Given a string password, return the minimum number of steps required to make password strong. if password is already strong, return 0.

In one step, you can:

Insert one character to password,
Delete one character from password, or
Replace one character of password with another character.


Example 1:

Input: password = "a"
Output: 5
Example 2:

Input: password = "aA1"
Output: 3
Example 3:

Input: password = "1337C0d3"
Output: 0



class Solution {
    strongPasswordChecker(password) {
        const types = this.countTypes(password);
        const n = password.length;

        if (n < 6) {
            return Math.max(6 - n, 3 - types);
        }

        const chars = password.split('');
        if (n <= 20) {
            let replace = 0;
            let cnt = 0;
            let prev = '~';
            for (let i = 0; i < chars.length; i++) {
                const curr = chars[i];
                if (curr === prev) {
                    cnt++;
                } else {
                    replace += Math.floor(cnt / 3);
                    cnt = 1;
                    prev = curr;
                }
            }
            replace += Math.floor(cnt / 3);
            return Math.max(replace, 3 - types);
        }

        let replace = 0, remove = n - 20;
        let remove2 = 0;
        let cnt = 0;
        let prev = '~';
        for (let i = 0; i < chars.length; i++) {
            const curr = chars[i];
            if (curr === prev) {
                cnt++;
            } else {
                if (remove > 0 && cnt >= 3) {
                    if (cnt % 3 === 0) {
                        remove--;
                        replace--;
                    } else if (cnt % 3 === 1) {
                        remove2++;
                    }
                }
                replace += Math.floor(cnt / 3);
                cnt = 1;
                prev = curr;
            }
        }

        if (remove > 0 && cnt >= 3) {
            if (cnt % 3 === 0) {
                remove--;
                replace--;
            } else if (cnt % 3 === 1) {
                remove2++;
            }
        }
        replace += Math.floor(cnt / 3);

        const use2 = Math.min(Math.min(replace, remove2), Math.floor(remove / 2));
        replace -= use2;
        remove -= use2 * 2;

        const use3 = Math.min(replace, Math.floor(remove / 3));
        replace -= use3;
        remove -= use3 * 3;

        return (n - 20) + Math.max(replace, 3 - types);
    }

    countTypes(s) {
        let a = 0, b = 0, c = 0;
        for (let ch of s) {
            if (/[a-z]/.test(ch)) {
                a = 1;
            } else if (/[A-Z]/.test(ch)) {
                b = 1;
            } else if (/\d/.test(ch)) {
                c = 1;
            }
        }
        return a + b + c;
    }
}


const solution = new Solution();
console.log(solution.strongPasswordChecker("aA1")); // Example usage
```
