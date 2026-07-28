```js
n this question, you need to implement a function read that takes two parameters:

read(collection, property)

collection: The top level parent object in which we need to find the field.
property: The path of the field we need to find/read.
Expected Output: field value if field exists else undefined.

const collection = {
  a: {
    b: {
      c: {
        d: {
          e: 2
        }
      }
    }
  }
}

// should return 2
read(collection, 'a.b.c.d.e');

// should return undefined
read(collection, 'a.b.c.f');






/*************************** */
/**
 * Read FAQs section on the left for more information on how to use the editor
**/
function read(collection, property) {
    const isCollectionInvalid = !collection || typeof collection !== 'object';
    const isPropertyInvalid =
      !property || !property.trim().length || typeof property !== 'string';
  
    if (isCollectionInvalid || isPropertyInvalid) {
      return undefined;
    }
  
    // cleaning the property and splitting it
    let path = property.replaceAll('[', '.');
  
    path = path.replaceAll(']', '.');
    path = path.split('.').filter(Boolean);
  
    let i;
    let currentKey;
    let currentItem = collection;
  
    for (i = 0; i < path.length; i++) {
      currentKey = path[i];
  
      // escape condition
      // if the currentKey doesn't exists in the currentItem
      // then return undefined
      if (!Object.prototype.hasOwnProperty.call(currentItem, currentKey)) {
        currentItem = undefined;
        break;
      }
  
      // updating currentItem
      currentItem = currentItem[currentKey];
    }
  
    // return the value
    return currentItem;
  }

  /********************************** */


  
function read(collection, property) {
    if (!collection) return undefined;

    if (property.indexOf('][') !== -1) {
        const arr = [...property];
        arr.splice(property.indexOf('][') + 1, 0, '.');
        let wow = "";
        for (let i = 0; i < arr.length; i++) {
            wow += arr[i];
        }
        property = wow;
    }
        if (property.indexOf('[') === 0) {
          property = property.replace('[', '');
        if (property.indexOf(']') !== -1) property = property.replace(']', '');
        }

  
    let index = property.indexOf('.');
    
    if (index === -1) return collection[property];

    const main = property.substring(0, index);

    if (!collection[main]) return collection[main];

    return read(collection[main], property.substring(index + 1));
};


/********************************************* */



function read(collection, property) {
    if(collection == null || property.length==0) return 
    const path = property.replaceAll('[', '.').replaceAll(']', '')
    const parts = path.split('.').filter(Boolean)
    
    let obj = collection
    for(let i=0; i<parts.length; i++){
      const k = parts[i]
      if(Object.hasOwn(obj, k)){
        obj = obj[k]
      } else {
        return undefined
      }
    }
    
    return obj
  }

  /********************************** */


  
function read(collection, property) {
    if(collection == null || property.length==0) return 
    const path = property.replaceAll('[', '.').replaceAll(']', '')
    const parts = path.split('.').filter(Boolean)
    
    let obj = collection
    for(let i=0; i<parts.length; i++){
      const k = parts[i]
      if(Object.hasOwn(obj, k)){
        obj = obj[k]
      } else {
        return undefined
      }
    }
    
    return obj
  }


  /********************************** */


  
function read(collection, property) {
    if(collection == null || property.length==0) return 
    const path = property.replaceAll('[', '.').replaceAll(']', '')
    const parts = path.split('.').filter(Boolean)
    
    let obj = collection
    for(let k of parts){
      if(Object.hasOwn(obj, k)){
        obj = obj[k]
      } else {
        return undefined
      }
    }
    
    return obj
  }