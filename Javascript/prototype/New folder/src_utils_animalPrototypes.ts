export function setupAnimalPrototypes() {
  // Animal constructor
  function Animal(this: any, name: string) {
    this.name = name;
  }

  // Add a method to Animal prototype
  Animal.prototype.breathe = function() {
    return `${this.name} is breathing.`;
  };

  // Mammal constructor
  function Mammal(this: any, name: string) {
    Animal.call(this, name);
  }

  // Set up inheritance
  Mammal.prototype = Object.create(Animal.prototype);
  Mammal.prototype.constructor = Mammal;

  // Add a method to Mammal prototype
  Mammal.prototype.giveBirth = function() {
    return `${this.name} is giving birth to live young.`;
  };

  // Dog constructor
  function Dog(this: any, name: string) {
    Mammal.call(this, name);
  }

  // Set up inheritance
  Dog.prototype = Object.create(Mammal.prototype);
  Dog.prototype.constructor = Dog;

  // Add a method to Dog prototype
  Dog.prototype.bark = function() {
    return `${this.name} is barking.`;
  };

  return { Animal, Mammal, Dog };
}

