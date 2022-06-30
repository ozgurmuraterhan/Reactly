## UI Code Style Guide

> Clean code, kodu okuyan kisiyi, kahvesini jaz muzik esliginde 
> yudumlarken bir yandanda en sevdigi kitabi okuyormus gibi hissettirir ve 
> her bir nüansı görüldügünde yüzde bir gülümseme bırakır.
>
> Temiz kod, aptallıkla dahilik arasında, aptallığa daha yakın noktadadır. 
>
> En güzel fonksiyon argumani olmayan fonksiyondur.

### Naming
1) Variable and function names written as camelCase

`const firstName = "Huseyin";`

`const userNames = ["Jhon", "Jack"];`

`function updateElement(){}`

2) All names start with a letter

`const price = 19.90;`

3) Do not start names with a $ sign

It will put you in conflict with many JavaScript library names.

```
// bad
const $item = "foo"; 
```

4) Global variables written in UPPERCASE

`const IS_DEBUGGER_ACTIVE = true;`

5) Function names "starts with a verb" or "is" or "has" or "on"

`function createUser(){}`

`function setElementProperties(){}`

`function sortUserAges(){}`

`function assertValidProps(){}`

`function warnForDeletedHydratableText(){}`

`function restoreControlledState(){}`

`function diffHydratedText(){}`

`function onClickSubmit(){}`

`function isHumankind("cat"){}`

`function hasContext({...someHugeObject}){}`

6) Boolean variable names start with "is", "are" or "has" prefix.

```
// bad
const visible = true;

// good
const isVisible = true;

// bad
const encryption = true;

// good
const hasEncryption = true;
```

7) Never use "not" while naming boolean variable

```
// bad
function isDOMNodeNotPresent(node) {}

// bad
if (!isDOMNodeNotPresent(node)) {}

// good
function isDOMNodePresent(node) {}

// good
if (isDOMNodePresent(node)) {}

```


8) Class and component names starts with uppercase letter Also it does not contain any verb

```
// bad
function softwareDeveloper (){}

// good
function SoftwareDeveloper (){}

// good
class UserProfile {}
``` 

9) Public method, public static method and public static variable names are like function names

```
class Person {
  static type = "human";
 
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
    
  static greet() {
    alert("hello");
  } 

  getName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

10) Private method and private static variable names starts with an underscore (_)

```
class Person {
  static _type = "human";
 
  constructor() {
    this._init()    
  }

  _init() {}
}
```


11) Use the same vocabulary for the same type of variable.

```
// bad
getUserInfo();
getClientData();
getCustomerRecord();

// good
getUser();
```

12) Use explanatory variables.

```
// bad
const address = "One Infinite Loop, Cupertino 95014";
const cityZipCodeRegex = /^[^,\\]+[,\\\s]+(.+?)\s*(\d{5})?$/;
saveCityZipCode(
  address.match(cityZipCodeRegex)[1],
  address.match(cityZipCodeRegex)[2]
);

//good
const address = "One Infinite Loop, Cupertino 95014";
const cityZipCodeRegex = /^[^,\\]+[,\\\s]+(.+?)\s*(\d{5})?$/;
const [_, city, zipCode] = address.match(cityZipCodeRegex) || [];
saveCityZipCode(city, zipCode);
```

13) Avoid Mental Mapping

```
// bad
const locations = ["Austin", "New York", "San Francisco"];
locations.forEach(l => {
  doStuff();
  doSomeOtherStuff();
  // ...
  // ...
  // ...
  // Wait, what is `l` for again?
  dispatch(l);
});

// good
const locations = ["Austin", "New York", "San Francisco"];
locations.forEach(location => {
  doStuff();
  doSomeOtherStuff();
  // ...
  // ...
  // ...
  dispatch(location);
});
```

14) Do not add unneeded context.

```
// bad
const Car = {
  carMake: "Honda",
  carModel: "Accord",
  carColor: "Blue"
};

function paintCar(car) {
  car.carColor = "Red";
}

// good
const Car = {
  make: "Honda",
  model: "Accord",
  color: "Blue"
};

function paintCar(car) {
  car.color = "Red";
}
```

15) Do not mix quoted and unquoted keys

```
// bad
const myObj = {
  firstName: 42
  'lastName': 43
}

// good
// if you really need to seperate it
const myObj = {
  firstName: 42,
  lastName: 43,
}; 
```

15) React Component naming

React component names start a uppercase letter.
```
// good
const MyComponent:React.FC<Props> = () => <div></div>;

// good
const MyComponent = class extends React.Component<Props, State>{}

// good
class MyComponent extends React.Component<Props, State>{}

// bad
export default class extends React.Component<Props, State>{}

// bad
export default () => <div></div>;
```

16) React props naming

Avoid using DOM component prop names for different purposes.

```
// bad
<MyComponent style="fancy" />

// bad
<MyComponent className="fancy" />

// good
<MyComponent variant="fancy" />
```

17) React Higher-order Component naming

Use a composite of the higher-order component’s name and the passed-in component’s 
name as the displayName on the generated component. For example, the higher-order 
component withFoo(), when passed a component Bar should produce a component with a 
displayName of withFoo(Bar).

```
// bad
export default function withFoo(WrappedComponent) {
  return function WithFoo(props) {
    return <WrappedComponent {...props} foo />;
  }
}

// good
export default function withFoo(WrappedComponent) {
  function WithFoo(props) {
    return <WrappedComponent {...props} foo />;
  }

  const wrappedComponentName = WrappedComponent.displayName
    || WrappedComponent.name
    || 'Component';

  WithFoo.displayName = `withFoo(${wrappedComponentName})`;
  return WithFoo;
}
```


### Types

1) Primitives: When you access a primitive type you work directly on its value.
   
 - string
 - number
 - boolean
 - null
 - undefined
 - symbol
 - bigint
 
> Symbols and BigInts cannot be faithfully polyfilled, so they should not be used when targeting browsers/environments that don’t support them natively.

2) Complex: When you access a complex type you work on a reference to its value.

- object
- array
- function

## References

1) Use `const` for all of your references; avoid using `var`.

```
// bad
var a = 1;
var b = 2;

// good
const a = 1;
const b = 2;
```

2) If you must reassign references, use `let` instead of `var`.
 
```
// bad
var count = 1;
if (true) {
  count += 1;
}

// good, use the let.
let count = 1;
if (true) {
  count += 1;
}
```

### Objects

1) Use the literal syntax for object creation.

```
// bad
const item = new Object();

// good
const item = {};
```

2) Use object method shorthand.

```
// bad
const atom = {
  value: 1,

  addValue: function (value) {
    return atom.value + value;
  },
};

// good
const atom = {
  value: 1,

  addValue(value) {
    return atom.value + value;
  },
};
```

3) Use property value shorthand.

```
const lukeSkywalker = 'Luke Skywalker';

// bad
const obj = {
  lukeSkywalker: lukeSkywalker,
};

// good
const obj = {
  lukeSkywalker,
};
```

4) Only quote properties that are invalid identifiers.

```
// bad
const bad = {
  'foo': 3,
  'bar': 4,
  'data-blah': 5,
};

// good
const good = {
  foo: 3,
  bar: 4,
  'data-blah': 5,
};
```

5) Prefer the object spread operator over `Object.assign` to shallow-copy 
objects. Use the object rest operator to get a new object with certain 
properties omitted.

```
// bad
const original = { a: 1, b: 2 };
const copy = Object.assign({}, original, { c: 3 }); // copy => { a: 1, b: 2, c: 3 }

// good
const original = { a: 1, b: 2 };
const copy = { ...original, c: 3 }; // copy => { a: 1, b: 2, c: 3 }

```

### Array

1) Use the literal syntax for array creation.

```
// bad
const item = new Array();

// good
const item = [];
```

2) Use `Array.push()` instead of direct assignment to add items to an array.

```
const someStack = [];

// bad
someStack[someStack.length] = 'abracadabra';

// good
someStack.push('abracadabra');
```

3) Use array spreads ... to copy arrays.

```
// bad
const len = items.length;
const itemsCopy = [];
let i;

for (i = 0; i < len; i += 1) {
  itemsCopy[i] = items[i];
}

// good
const itemsCopy = [...items];
```

4) Use `map`, `filter`, `reduce` to loop through array.

```
// good
[1, 2, 3].map((x) => x + 1);
```

### Destructuring

1) Use object destructuring when accessing and using multiple properties of an object.

```
// bad
function getFullName(user) {
  const firstName = user.firstName;
  const lastName = user.lastName;

  return `${firstName} ${lastName}`;
}

// good
function getFullName(user) {
  const { firstName, lastName } = user;
  return `${firstName} ${lastName}`;
}

// best
function getFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}

// best

const ProfileCard:React.FC<Props> = ({firstName, lastName}) => (
  <>
    <div>{firstName}</div>
    <div>{lastName}</div>
  </>
);
```

2) Use array destructuring.

```
const arr = [1, 2, 3, 4];

// bad
const first = arr[0];
const second = arr[1];

// good
const [first, second] = arr;
```

### Strings

1) When programmatically building up strings, use template strings instead of concatenation.

```
// bad
function sayHi(name) {
  return 'How are you, ' + name + '?';
}

// good
function sayHi(name) {
  return `How are you, ${name}?`;
}
```

2) Strings that cause the line to go over 100 characters should not be written across multiple lines using string concatenation.

```
// bad
const errorMessage = 'This is a super long error that was thrown because \
of Batman. When you stop to think about how Batman had anything to do \
with this, you would get nowhere \
fast.';

// bad
const errorMessage = 'This is a super long error that was thrown because ' +
  'of Batman. When you stop to think about how Batman had anything to do ' +
  'with this, you would get nowhere fast.';

// good
const errorMessage = 'This is a super long error that was thrown because of Batman. When you stop to think about how Batman had anything to do with this, you would get nowhere fast.';
```

### Functions

> The best function is the function has no arguments.

1) Never declare a function in a non-function block (if, while, etc).

2) Never name a parameter `arguments`. This will take precedence over the `arguments` object that is given to every function scope.

```
// bad
function foo(name, options, arguments) {
  // ...
}

// good
function foo(name, options, args) {
  // ...
}
``` 

3) Use default parameter syntax rather than mutating function arguments.

```
// bad
function handleThings(opts) {
  opts = opts || {};
}

// good
function handleThings(opts = {}) {}

// bad
const MyComponent:React.FC<Props> = ({name}) => {
  if(!name){
    name = "Jhon"; 
  } 
}
 
// bad
const MyComponent:React.FC<Props> = ({name}) => {
  name = name || "Jhon";  
}

//good
const MyComponent:React.FC<Props> = ({name = "Jhon"}) => {}
```

4) Never reassign parameters.

```
// bad
function f1(a) {
  a = 1;
}

// bad
function f2(a) {
  if (!a) { a = 1; }
}

// good
function f3(a) {
  const b = a || 1;
}

// good
function f4(a = 1) {}
```

5) Function Argument number (2 or fewer ideally)

```
// bad
function createMenu(title, body, buttonText, cancellable) {}
createMenu("Foo", "Bar", "Baz", true);

// good
function createMenu({ title, body, buttonText, cancellable }) {}
createMenu({
  title: "Foo",
  body: "Bar",
  buttonText: "Baz",
  cancellable: true
});
```

6) Functions should do one thing. Singularity.

```
// bad
function emailClients(clients) {
  clients.forEach(client => {
    const clientRecord = database.lookup(client);
    if (clientRecord.isActive()) {
      email(client);
    }
  });
}

// good
function emailActiveClients(clients) {
  clients.filter(isActiveClient).forEach(email);
}
function isActiveClient(client) {
  const clientRecord = database.lookup(client);
  return clientRecord.isActive();
}
```

7) Function names should say what they do

```
// bad
function addToDate(date, month) {
  // ...
}

const date = new Date();

// It's hard to tell from the function name what is added
addToDate(date, 1);


//good
function addMonthToDate(month, date) {
  // ...
}

const date = new Date();
addMonthToDate(1, date);

```

8) Do not use flags as function parameters

```
// bad
function createFile(name, temp) {
  if (temp) {
    fs.create(`./temp/${name}`);
  } else {
    fs.create(name);
  }
}

// good
function createFile(name) {
  fs.create(name);
}

function createTempFile(name) {
  createFile(`./temp/${name}`);
}
```



### Arrow Functions

1) When you must use an anonymous function (as when passing an inline callback), use arrow function notation.

```
// bad
[1, 2, 3].map(function (x) {
  const y = x + 1;
  return x * y;
});

// good
[1, 2, 3].map((x) => {
  const y = x + 1;
  return x * y;
});
```

2) If the function body consists of a single statement returning an expression without side effects, omit the braces and use the implicit return. Otherwise, keep the braces and use a return statement.

```
// bad
[1, 2, 3].map((number) => {
  const nextNumber = number + 1;
  `A string containing the ${nextNumber}.`;
});

// good
[1, 2, 3].map((number) => `A string containing the ${number + 1}.`);

// good
myArray.map((item) => {...item, foo: 5});
```

3) Methods can return this to help with method chaining.

```
class MyFunction extends React.Component {

  state = {
    foo: 5
  }

  onClick = () => {
    this.setState({ foo: 6 });
  };

  render(){
    return (
      <button onClick={this.onClick}>click me</div>
    )
  }
}
```

### Import

1) Always use modules (import/export) over a non-standard module system. You can always transpile to your preferred module system.

```
// bad
const AirbnbStyleGuide = require('./AirbnbStyleGuide');
module.exports = AirbnbStyleGuide.es6;

// ok
import AirbnbStyleGuide from './AirbnbStyleGuide';
export default AirbnbStyleGuide.es6;

// best
import { es6 } from './AirbnbStyleGuide';
export default es6;
```

2) Do not use wildcard imports.

```
// bad
import * as MyComponent from './MyComponent';

// good
import MyComponent from './MyComponent';
```

3) Do not include JavaScript filename extensions.

```
// bad
import foo from './foo.js';
import bar from './bar.jsx';
import baz from './baz/index.jsx';

// good
import foo from './foo';
import bar from './bar';
import baz from './baz';
```

4) use relative imports for strict related dependencies.

```
// bad
import MyComponent from "../../../MyComponent";

// good
import MyComponent from "src/Path/To/File/MyComponent";
```

### Properties

1) Use dot notation when accessing properties.

```
const person = {
  skinColor: "white",
  age: 28,
};

// bad
const skinColor = person["skinColor"];

// good
const skinColor = person.skinColor;
```

### Blocks

1) Use braces with all multiline blocks.

```
// bad
function foo() { return false; }

// good
if (test) return false;
```

2) If an if block always executes a return statement, 
the subsequent else block is unnecessary. A return in an else 
if block following an if block that contains a return can be separated 
into multiple if blocks.

```
// bad
function foo() {
  if (x) {
    return x;
  } else {
    return y;
  }
}

// bad
function cats() {
  if (x) {
    return x;
  } else if (y) {
    return y;
  }
}

// bad
function dogs() {
  if (x) {
    return x;
  } else {
    if (y) {
      return y;
    }
  }
}

// good
function foo() {
  if (x) {
    return x;
  }

  return y;
}

// good
function cats() {
  if (x) {
    return x;
  }

  if (y) {
    return y;
  }
}

// good
function dogs(x) {
  if (x) {
    if (z) {
      return y;
    }
  } else {
    return z;
  }
}
```

### Comments

Never use comments. 
clean code is the best documentation.
If you feel you should make a comment, it is code smell. 
Probably your code is too complex to read. Refactor it.

### Extract

1) use ... separator.

```
const MyComponent:React.FC<Props> = ({foo, bar, ...others}) => <div></div>;
```
 
### Remove duplicate code

```
// bad
function showDeveloperList(developers) {
  developers.forEach(developer => {
    const expectedSalary = developer.calculateExpectedSalary();
    const experience = developer.getExperience();
    const githubLink = developer.getGithubLink();
    const data = {
      expectedSalary,
      experience,
      githubLink
    };

    render(data);
  });
}

function showManagerList(managers) {
  managers.forEach(manager => {
    const expectedSalary = manager.calculateExpectedSalary();
    const experience = manager.getExperience();
    const portfolio = manager.getMBAProjects();
    const data = {
      expectedSalary,
      experience,
      portfolio
    };

    render(data);
  });
}

// good
function showEmployeeList(employees) {
  employees.forEach(employee => {
    const expectedSalary = employee.calculateExpectedSalary();
    const experience = employee.getExperience();

    const data = {
      expectedSalary,
      experience
    };

    switch (employee.type) {
      case "manager":
        data.portfolio = employee.getMBAProjects();
        break;
      case "developer":
        data.githubLink = employee.getGithubLink();
        break;
    }

    render(data);
  });
}
```
### Avoid Side Effects

1) Scope

```
// bad
let name = "Ryan McDermott";

function splitIntoFirstAndLastName() {
  name = name.split(" ");
}

splitIntoFirstAndLastName();
console.log(name); // ['Ryan', 'McDermott'];
```

```
// good
function splitIntoFirstAndLastName(name) {
  return name.split(" ");
}

const name = "Ryan McDermott";
const newName = splitIntoFirstAndLastName(name);

console.log(name); // 'Ryan McDermott';
console.log(newName); // ['Ryan', 'McDermott'];
```

2) Mutable variable

In JavaScript, some values are unchangeable (immutable) and some are changeable (mutable). 
Objects and arrays are two kinds of mutable values so it's important to handle 
them carefully when they're passed as parameters to a function. A JavaScript function 
can change an object's properties or alter the contents of an array which could easily 
cause bugs elsewhere.

```
// bad
const addItemToCart = (cart, item) => {
  cart.push({ item, date: Date.now() });
};

// good
const addItemToCart = (cart, item) => {
  return [...cart, { item, date: Date.now() }];
};
```

### for loop 

1) use "for of" for arrays

```
const array1 = ['a', 'b', 'c'];

for (const element of array1) {
  console.log(element);
}
``` 

2) use "for in" for objects

```
const myObject = { a: 1, b: 2, c: 3 };

for (const property in myObject) {
  console.log(`${property}: ${myObject[property]}`);
}

```

### use shorthand conditionals

```
// good
const item = "foo";
const secondItem = item ? "bar" : "baz";
```
 
### Avoid conditionals

```
// bad
class Airplane {
  // ...
  getCruisingAltitude() {
    switch (this.type) {
      case "777":
        return this.getMaxAltitude() - this.getPassengerCount();
      case "Air Force One":
        return this.getMaxAltitude();
      case "Cessna":
        return this.getMaxAltitude() - this.getFuelExpenditure();
    }
  }
}
```

```
// good 
class Airplane {
  // ...
}

class Boeing777 extends Airplane {
  // ...
  getCruisingAltitude() {
    return this.getMaxAltitude() - this.getPassengerCount();
  }
}

class AirForceOne extends Airplane {
  // ...
  getCruisingAltitude() {
    return this.getMaxAltitude();
  }
}

class Cessna extends Airplane {
  // ...
  getCruisingAltitude() {
    return this.getMaxAltitude() - this.getFuelExpenditure();
  }
}
```

### Remove dead code

```
// bad
function oldRequestModule(url) {
  // ...
}

function newRequestModule(url) {
  // ...
}

const req = newRequestModule;
inventoryTracker("apples", req, "www.inventory-awesome.io");


// good

function newRequestModule(url) {
  // ...
}

const req = newRequestModule;
inventoryTracker("apples", req, "www.inventory-awesome.io");
```

### Use getters and setters

```
// bad
function makeBankAccount() {
  // ...

  return {
    balance: 0
    // ...
  };
}

const account = makeBankAccount();
account.balance = 100;
```

```
// good
function makeBankAccount() {
  // this one is private
  let balance = 0;

  // a "getter", made public via the returned object below
  function getBalance() {
    return balance;
  }

  // a "setter", made public via the returned object below
  function setBalance(amount) {
    // ... validate before updating the balance
    balance = amount;
  }

  return {
    // ...
    getBalance,
    setBalance
  };
}

const account = makeBankAccount();
account.setBalance(100);
```
  
### Use method chaining

```
// bad
class Car {
  constructor(make, model, color) {
    this.make = make;
    this.model = model;
    this.color = color;
  }

  setMake(make) {
    this.make = make;
  }

  setModel(model) {
    this.model = model;
  }

  setColor(color) {
    this.color = color;
  }

  save() {
    console.log(this.make, this.model, this.color);
  }
}

const car = new Car("Ford", "F-150", "red");
car.setColor("pink");
car.save();
```

```
// good
class Car {
  constructor(make, model, color) {
    this.make = make;
    this.model = model;
    this.color = color;
  }

  setMake(make) {
    this.make = make;
    // NOTE: Returning this for chaining
    return this;
  }

  setModel(model) {
    this.model = model;
    // NOTE: Returning this for chaining
    return this;
  }

  setColor(color) {
    this.color = color;
    // NOTE: Returning this for chaining
    return this;
  }

  save() {
    console.log(this.make, this.model, this.color);
    // NOTE: Returning this for chaining
    return this;
  }
}

const car = new Car("Ford", "F-150", "red").setColor("pink").save();
```

### Principles

1) Single Responsibility Principle (SRP)

As stated in Clean Code, "There should never be more than one reason 
for a class to change". It's tempting to jam-pack a class with a lot 
of functionality, like when you can only take one suitcase on your flight. 
The issue with this is that your class won't be conceptually cohesive and 
it will give it many reasons to change. Minimizing the amount of times you 
need to change a class is important. It's important because if too much 
functionality is in one class and you modify a piece of it, it can be 
difficult to understand how that will affect other dependent modules in 
your codebase.

```
// bad
class UserSettings {
  constructor(user) {
    this.user = user;
  }

  changeSettings(settings) {
    if (this.verifyCredentials()) {
      // ...
    }
  }

  verifyCredentials() {
    // ...
  }
}
```

```
// good
class UserAuth {
  constructor(user) {
    this.user = user;
  }

  verifyCredentials() {
    // ...
  }
}

class UserSettings {
  constructor(user) {
    this.user = user;
    this.auth = new UserAuth(user);
  }

  changeSettings(settings) {
    if (this.auth.verifyCredentials()) {
      // ...
    }
  }
}
```

2) Open/Closed Principle (OCP)

As stated by Bertrand Meyer, "software entities (classes, modules, 
functions, etc.) should be open for extension, but closed for modification." 
What does that mean though? This principle basically states that you 
should allow users to add new functionalities without changing existing code.

```
// bad
class AjaxAdapter extends Adapter {
  constructor() {
    super();
    this.name = "ajaxAdapter";
  }
}

class NodeAdapter extends Adapter {
  constructor() {
    super();
    this.name = "nodeAdapter";
  }
}

class HttpRequester {
  constructor(adapter) {
    this.adapter = adapter;
  }

  fetch(url) {
    if (this.adapter.name === "ajaxAdapter") {
      return makeAjaxCall(url).then(response => {
        // transform response and return
      });
    } else if (this.adapter.name === "nodeAdapter") {
      return makeHttpCall(url).then(response => {
        // transform response and return
      });
    }
  }
}

function makeAjaxCall(url) {
  // request and return promise
}

function makeHttpCall(url) {
  // request and return promise
}
```

```
// good
class AjaxAdapter extends Adapter {
  constructor() {
    super();
    this.name = "ajaxAdapter";
  }

  request(url) {
    // request and return promise
  }
}

class NodeAdapter extends Adapter {
  constructor() {
    super();
    this.name = "nodeAdapter";
  }

  request(url) {
    // request and return promise
  }
}

class HttpRequester {
  constructor(adapter) {
    this.adapter = adapter;
  }

  fetch(url) {
    return this.adapter.request(url).then(response => {
      // transform response and return
    });
  }
}
```

3) Liskov Substitution Principle (LSP)

This is a scary term for a very simple concept. It's formally defined 
as "If S is a subtype of T, then objects of type T may be replaced with 
objects of type S (i.e., objects of type S may substitute objects of type T) 
without altering any of the desirable properties of that program 
(correctness, task performed, etc.)." That's an even scarier definition.

The best explanation for this is if you have a parent class and a child 
class, then the base class and child class can be used interchangeably 
without getting incorrect results. This might still be confusing, so let's 
take a look at the classic Square-Rectangle example. Mathematically, a 
square is a rectangle, but if you model it using the "is-a" relationship 
via inheritance, you quickly get into trouble.

```
// bad
class Rectangle {
  constructor() {
    this.width = 0;
    this.height = 0;
  }

  setColor(color) {
    // ...
  }

  render(area) {
    // ...
  }

  setWidth(width) {
    this.width = width;
  }

  setHeight(height) {
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  setWidth(width) {
    this.width = width;
    this.height = width;
  }

  setHeight(height) {
    this.width = height;
    this.height = height;
  }
}

function renderLargeRectangles(rectangles) {
  rectangles.forEach(rectangle => {
    rectangle.setWidth(4);
    rectangle.setHeight(5);
    const area = rectangle.getArea(); // BAD: Returns 25 for Square. Should be 20.
    rectangle.render(area);
  });
}

const rectangles = [new Rectangle(), new Rectangle(), new Square()];
renderLargeRectangles(rectangles);
```

```
/// good
class Shape {
  setColor(color) {
    // ...
  }

  render(area) {
    // ...
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square extends Shape {
  constructor(length) {
    super();
    this.length = length;
  }

  getArea() {
    return this.length * this.length;
  }
}

function renderLargeShapes(shapes) {
  shapes.forEach(shape => {
    const area = shape.getArea();
    shape.render(area);
  });
}

const shapes = [new Rectangle(4, 5), new Rectangle(4, 5), new Square(5)];
renderLargeShapes(shapes);
```

4) Interface Segregation Principle (ISP)

JavaScript doesn't have interfaces so this principle doesn't apply as 
strictly as others. However, it's important and relevant even with 
JavaScript's lack of type system.

ISP states that "Clients should not be forced to depend upon interfaces 
that they do not use." Interfaces are implicit contracts in JavaScript 
because of duck typing.

A good example to look at that demonstrates this principle in JavaScript 
is for classes that require large settings objects. Not requiring clients 
to setup huge amounts of options is beneficial, because most of the time 
they won't need all of the settings. Making them optional helps prevent 
having a "fat interface".

```
// bad
class DOMTraverser {
  constructor(settings) {
    this.settings = settings;
    this.setup();
  }

  setup() {
    this.rootNode = this.settings.rootNode;
    this.settings.animationModule.setup();
  }

  traverse() {
    // ...
  }
}

const $ = new DOMTraverser({
  rootNode: document.getElementsByTagName("body"),
  animationModule() {} // Most of the time, we won't need to animate when traversing.
  // ...
});
```

```
// good
class DOMTraverser {
  constructor(settings) {
    this.settings = settings;
    this.options = settings.options;
    this.setup();
  }

  setup() {
    this.rootNode = this.settings.rootNode;
    this.setupOptions();
  }

  setupOptions() {
    if (this.options.animationModule) {
      // ...
    }
  }

  traverse() {
    // ...
  }
}

const $ = new DOMTraverser({
  rootNode: document.getElementsByTagName("body"),
  options: {
    animationModule() {}
  }
});
```

5) Dependency Inversion Principle (DIP)

This principle states two essential things:

- High-level modules should not depend on low-level modules. Both should 
depend on abstractions.

- Abstractions should not depend upon details. Details should depend on 
abstractions.

This can be hard to understand at first, but if you've worked with AngularJS, 
you've seen an implementation of this principle in the form of Dependency 
Injection (DI). While they are not identical concepts, DIP keeps high-level 
modules from knowing the details of its low-level modules and setting them up. 
It can accomplish this through DI. A huge benefit of this is that it reduces 
the coupling between modules. Coupling is a very bad development pattern 
because it makes your code hard to refactor.

As stated previously, JavaScript doesn't have interfaces so the abstractions 
that are depended upon are implicit contracts. That is to say, the methods 
and properties that an object/class exposes to another object/class. 
In the example below, the implicit contract is that any Request module for 
an InventoryTracker will have a requestItems method.

```
// bad
class InventoryRequester {
  constructor() {
    this.REQ_METHODS = ["HTTP"];
  }

  requestItem(item) {
    // ...
  }
}

class InventoryTracker {
  constructor(items) {
    this.items = items;

    // BAD: We have created a dependency on a specific request implementation.
    // We should just have requestItems depend on a request method: `request`
    this.requester = new InventoryRequester();
  }

  requestItems() {
    this.items.forEach(item => {
      this.requester.requestItem(item);
    });
  }
}

const inventoryTracker = new InventoryTracker(["apples", "bananas"]);
inventoryTracker.requestItems();
```

```
// good
class InventoryTracker {
  constructor(items, requester) {
    this.items = items;
    this.requester = requester;
  }

  requestItems() {
    this.items.forEach(item => {
      this.requester.requestItem(item);
    });
  }
}

class InventoryRequesterV1 {
  constructor() {
    this.REQ_METHODS = ["HTTP"];
  }

  requestItem(item) {
    // ...
  }
}

class InventoryRequesterV2 {
  constructor() {
    this.REQ_METHODS = ["WS"];
  }

  requestItem(item) {
    // ...
  }
}

// By constructing our dependencies externally and injecting them, we can easily
// substitute our request module for a fancy new one that uses WebSockets.
const inventoryTracker = new InventoryTracker(
  ["apples", "bananas"],
  new InventoryRequesterV2()
);
inventoryTracker.requestItems();
```

### Concurrency

1) Use Promises, not callbacks

```
// bad
import { get } from "request";
import { writeFile } from "fs";

get(
  "https://en.wikipedia.org/wiki/Robert_Cecil_Martin",
  (requestErr, response, body) => {
    if (requestErr) {
      console.error(requestErr);
    } else {
      writeFile("article.html", body, writeErr => {
        if (writeErr) {
          console.error(writeErr);
        } else {
          console.log("File written");
        }
      });
    }
  }
);
```

```
// good
import { get } from "request-promise";
import { writeFile } from "fs-extra";

get("https://en.wikipedia.org/wiki/Robert_Cecil_Martin")
  .then(body => {
    return writeFile("article.html", body);
  })
  .then(() => {
    console.log("File written");
  })
  .catch(err => {
    console.error(err);
  });
```

2) Async/Await are even cleaner than Promises

```
// bad
import { get } from "request-promise";
import { writeFile } from "fs-extra";

get("https://en.wikipedia.org/wiki/Robert_Cecil_Martin")
  .then(body => {
    return writeFile("article.html", body);
  })
  .then(() => {
    console.log("File written");
  })
  .catch(err => {
    console.error(err);
  });
```

```
// good
import { get } from "request-promise";
import { writeFile } from "fs-extra";

async function getCleanCodeArticle() {
  try {
    const body = await get(
      "https://en.wikipedia.org/wiki/Robert_Cecil_Martin"
    );
    await writeFile("article.html", body);
    console.log("File written");
  } catch (err) {
    console.error(err);
  }
}

getCleanCodeArticle()
```

3) Do not ignore rejected promises

```
// bad
getdata()
  .then(data => {
    functionThatMightThrow(data);
  })
  .catch(error => {
    console.log(error);
  });

// good
getdata()
  .then(data => {
    functionThatMightThrow(data);
  })
  .catch(error => {
    // One option (more noisy than console.log):
    console.error(error);
    // Another option:
    notifyUserOfError(error);
    // Another option:
    reportErrorToService(error);
    // OR do all three!
  });
```

### React/JSX

1) Do not use mixins.
https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html

2) do not use underscore (_) for internal methods. Because we never use mixins with React.

```
// bad
class extends React.Component {
  _onClickSubmit() {
    // do stuff
  },

  // other stuff
});

// good
class extends React.Component {
  onClickSubmit() {
    // do stuff
  }

  // other stuff
}
```

4) ordering

- optional static methods

- constructor

- react lifecycle methods

- other methods (e.i eventHandlers like onClickSubmit() )

- render

```
import React from 'react';

type Porps = {
  id: string,
  url: string,
  text: string,
};

type State = {
  foo: number;
};

const MyComponent = class extends React.Component<Props, State> {
  
  static location = "istanbul";

  static methodsAreOk() {
    return true;
  }

  constructor(props){
    super(props);
    this.state:State = {
      foo: 5
    };
  }

  render() {
    const {url, id, text="lorem ipsum"} = this.props;
    return <a href={url}>{text}</a>;
  }
}

export default MyComponent;
```

### TDD

TDD steps: 

- Write one test
- Watch it fail
- Implement the code
- Watch the test pass
- Repeat

Recommended articles:

- https://medium.com/javascript-scene/5-common-misconceptions-about-tdd-unit-tests-863d5beb3ce9

- https://medium.com/javascript-scene/tdd-changed-my-life-5af0ce099f80
