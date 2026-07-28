```js
removeChars('ab') // 'a'
removeChars('abc') // ''
removeChars('cabbaabcca') // 'caa'

function removeChars(input) {
    const stack = []
  
    for (let i = 0; i < input.length; i++) {
      const character = input[i]
      if (stack.length && character === 'c' && stack[stack.length - 1] === 'a') {
        stack.pop()
      } else if (character !== 'b') {
        stack.push(character)
      }
    }
  
    return stack.join('')
  }


  function removeChars(input) {
    const result = input.replace(/b|ac/gi, '');
    return input === result ? result : removeChars(result);
  }


  function removeChars(input) {
    input = input.replace(/b|ac/g, '')
    if (!/ac/.test(input)) return input
    return removeChars(input)
  }

  

  /**
 * @param {string} input
 * @returns string
 */
// chars stack | current char
// '' | 'c'
// undefind 'c' !== ac, add 'c' to stack
// '[c]' | 'a'
// 'c' 'a' !== ac, add 'a' to stack
// 'c[a]' | 'a'
// 'a' 'a' !== ac, add 'a' to stack
// 'caa[a]' | 'c'
// 'a' 'c' === ac
// 'ca[a]' | 'c'
// 'a' 'c' === ac
// 'c[a]' | 'a'
// 'a', 'a' !== ac
function removeChars(input) {
    const chars = input.split('');
    // O(n)
    const removedB = chars.reduce((acc, char) => {
      if (char !== 'b') {
        return acc.concat(char);
      }
      return acc;
    }, []);
    // O(n)
    const removedAC = removedB.reduce((acc, char) => {
      const last = acc.pop();
      if (!last) {
        return acc.concat(char);
      }
      if (last + char === 'ac') {
        return acc;
      }
      return acc.concat(last, char);
    }, []);
    return removedAC.join('');
  }

  

  /**
 * @param {string} input
 * @returns string
 */
function removeChars(input) {
    const str = input.replace(/b|ac/g, '')
    if (str.includes('ac')) {
      return removeChars(str)
    } else {
      return str
    }
  }