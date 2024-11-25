## **Consolidated JavaScript Basics**


### <a href="../README.md">Interview Preparation</a> <img src="../img/icons8-right-25.png" alt="arrow" style="width:15px; height:15px;"> <a href="./README.md">NodeJs</a> <img src="../img/icons8-right-25.png" alt="arrow" style="width:15px; height:15px;"> Basics Of Js

---
## 🎯 Table of Contents

| No. | Topic                                                   | Description |
|-----|---------------------------------------------------------|-------------|
| 1 | [Scope](#1-scope)                                       | Global, Function, and Block scope concepts |
| 2 | [IIFE](#2-iife-immediately-invoked-function-expression) | Immediately Invoked Function Expression patterns |
| 3 | [Hoisting](#3-hoisting)                                 | Variable and function declaration hoisting |
| 4 | [Closures](#4-closures)                                 | Functions retaining access to parent scope |
| 5 | [Callbacks](#5-callbacks)                               | Functions passed as arguments |
| 6 | [Promises](#6-promises)                                 | Handling asynchronous operations |
| 7 | [Async & Await](#7-async--await)                        | Modern async programming patterns |
| 8 | [Event Loop](#8-event-loop)                             | JavaScript's event handling mechanism |
| 9 | [Data Types](#9-data-types-and-type-conversion)         | Primitive and non-primitive types |
| 10 | [Loops](#10-loops)                                      | Different looping structures |
| 11 | [Functions](#11-functions)                              | Function declarations, expressions, and arrows |
| 12 | [Arrays](#12-arrays)                                    | Array manipulation and methods |
| 13 | [Objects](#13-objects)                                  | Object handling and manipulation |
| 14 | [Template Literals](#14-template-literals)              | String interpolation and multi-line strings |
| 15 | [Destructuring](#15-destructuring)                      | Extracting values from arrays/objects |
| 16 | [Spread/Rest](#16-spread-and-rest-operators)            | Spread and rest operator usage |
| 17 | [Conditionals](#17-conditional-statements)              | Control flow statements |
| 18 | [Truthy/Falsy](#18-truthy-and-falsy-values)             | Boolean context evaluations |
| 19 | [Event Handling](#19-event-handling)                    | Managing user interactions |
| 20 | [Modules](#20-modules)                                  | Code organization with imports/exports |
| 21 | [Error Handling](#21-error-handling)                    | Exception handling with try-catch |

---

### **1. Scope**

#### Explanation

Scope determines the accessibility of variables. JavaScript has:

- **Global Scope**: Variables accessible throughout the program.
- **Function Scope**: Variables defined in a function are local to that function.
- **Block Scope**: Variables declared with `let` or `const` are confined to the block.

#### Coding Example

```javascript
let globalVar = "Global";

function scopeExample() {
    let functionVar = "Function";
    if (true) {
        let blockVar = "Block";
        console.log(blockVar); // Block
    }
    console.log(functionVar); // Function
    // console.log(blockVar); // Error: blockVar is not defined
}

scopeExample();
console.log(globalVar); // Global
```

#### Do's and Don'ts

**Do's**

- Use `let` and `const` for block-scoped variables.
- Minimize global variable usage.

**Don'ts**

- Avoid using `var` due to its lack of block scope.

#### [Back to Top](#-table-of-contents)

---

### **2. IIFE (Immediately Invoked Function Expression)**

#### Explanation

IIFEs are functions that run immediately after being defined. They create a private scope and are often used for
initialization.

#### Coding Example

```javascript
(function() {
    let privateVar = "IIFE";
    console.log(privateVar); // IIFE
})();
```

#### Do's and Don'ts

**Do's**

- Use IIFEs to avoid polluting the global namespace.
- Encapsulate initialization logic within IIFEs.

**Don'ts**

- Avoid excessive use of IIFEs when block scope (`let`, `const`) suffices.

#### [Back to Top](#-table-of-contents)

---

### **3. Hoisting**

#### Explanation

Hoisting allows variable and function declarations to be moved to the top of their scope during runtime. Only
declarations are hoisted, not initializations.

#### Coding Example

```javascript
console.log(a); // Undefined (Declaration hoisted)
var a = 5;

foo(); // Works (Function declaration hoisted)
function foo() {
    console.log("Hoisted!");
}
```

#### Do's and Don'ts

**Do's**

- Declare variables and functions at the beginning of their scope.
- Use `let` and `const` to avoid hoisting issues.

**Don'ts**

- Avoid relying on implicit hoisting for variable initializations.

#### [Back to Top](#-table-of-contents)

---

### **4. Closures**

#### Explanation

A closure is a function that retains access to its parent scope, even when executed outside that scope.

#### Coding Example

```javascript
function outer() {
    let count = 0;
    return function inner() {
        count++;
        return count;
    };
}

const increment = outer();
console.log(increment()); // 1
console.log(increment()); // 2
```

#### Do's and Don'ts

**Do's**

- Use closures to encapsulate private data.
- Leverage closures for modular design.

**Don'ts**

- Avoid creating closures inside large loops for memory efficiency.

#### [Back to Top](#-table-of-contents)

---

### **5. Callbacks**

#### Explanation

A callback is a function passed as an argument to another function and executed later.

#### Coding Example

```javascript
function fetchData(callback) {
    setTimeout(() => {
        callback("Data received");
    }, 1000);
}

fetchData((data) => console.log(data)); // Data received
```

#### Do's and Don'ts

**Do's**

- Use callbacks for asynchronous tasks.
- Handle callback errors properly.

**Don'ts**

- Avoid deeply nested callbacks ("callback hell").

#### [Back to Top](#-table-of-contents)

---

### **6. Promises**

#### Explanation

Promises represent the eventual completion (or failure) of an asynchronous operation and its resulting value.

#### Coding Example

```javascript
const promise = new Promise((resolve, reject) => {
    let success = true;
    success ? resolve("Success!") : reject("Error!");
});

promise
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
```

#### Do's and Don'ts

**Do's**

- Use Promises to avoid callback hell.
- Chain `.then()` and `.catch()` for clean async handling.

**Don'ts**

- Avoid mixing Promises and callbacks.

#### [Back to Top](#-table-of-contents)

---

### **7. Async & Await**

#### Explanation

`async/await` provides a cleaner way to work with Promises by making asynchronous code look synchronous.

#### Coding Example

```javascript
async function fetchData() {
    try {
        const data = await new Promise((resolve) =>
            setTimeout(() => resolve("Data received"), 1000)
        );
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

fetchData();
```

#### Do's and Don'ts

**Do's**

- Use `async/await` for better readability.
- Use `try-catch` for error handling.

**Don'ts**

- Avoid blocking the event loop with long-running `await`.

#### [Back to Top](#-table-of-contents)

---

### **8. Event Loop**

#### Explanation

The event loop manages asynchronous operations in JavaScript. It processes tasks from different queues (e.g., call
stack, microtask queue).

#### Coding Example

```javascript
console.log("Start");

setTimeout(() => console.log("Timeout callback"), 0);

Promise.resolve().then(() => console.log("Promise callback"));

console.log("End");
```

**Output:**

```
Start
End
Promise callback
Timeout callback
```

#### Do's and Don'ts

**Do's**

- Write non-blocking code for scalability.
- Prioritize tasks using microtasks (`Promises`) over macrotasks (`setTimeout`).

**Don'ts**

- Avoid blocking the event loop with synchronous operations.

#### [Back to Top](#-table-of-contents)

---

### **9. Data Types and Type Conversion**

#### Explanation

JavaScript has dynamic typing and supports:

- **Primitive Types**: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`.
- **Non-Primitive Types**: `object` (arrays, functions).

**Type Conversion**:

- Explicit: `String()`, `Number()`, `Boolean()`.
- Implicit: Coercion by JavaScript.

#### Coding Example

```javascript
let num = "123";
console.log(typeof num); // string
let convertedNum = Number(num);
console.log(typeof convertedNum); // number
```

#### Do's and Don'ts

**Do's**

- Use explicit type conversion for clarity.
- Check types using `typeof`.

**Don'ts**

- Avoid relying on implicit coercion.

#### [Back to Top](#-table-of-contents)

---

### **10. Loops**

#### Explanation

JavaScript supports multiple looping structures:

- `for`
- `while`
- `do...while`
- `for...in` (iterates object keys)
- `for...of` (iterates iterable objects).

#### Coding Example

```javascript
const array = [1, 2, 3];
for (let num of array) {
    console.log(num); // 1, 2, 3
}
```

#### Do's and Don'ts

**Do's**

- Use `for...of` for arrays and `for...in` for objects.
- Prefer array methods like `map` for transformations.

**Don'ts**

- Avoid infinite loops; ensure exit conditions.

#### [Back to Top](#-table-of-contents)

---

### **11. Functions**

#### Explanation

Functions are reusable blocks of code designed to perform specific tasks. JavaScript supports:

- **Function Declaration**
- **Function Expression**
- **Arrow Functions**

#### Coding Example

```javascript
function greet(name) {
    return `Hello, ${name}`;
}

const add = (a, b) => a + b;

console.log(greet("Alice")); // Hello, Alice
console.log(add(2, 3)); // 5
```

#### Do's and Don'ts

**Do's**

- Use meaningful names for functions.
- Use arrow functions for concise callbacks.

**Don'ts**

- Avoid deeply nested functions.

#### [Back to Top](#-table-of-contents)

---

### **12. Arrays**

#### Explanation

Arrays are ordered collections of elements. They support various methods for manipulation:

- Mutating: `push`, `pop`, `shift`, `unshift`
- Non-Mutating: `map`, `filter`, `reduce`

#### Coding Example

```javascript
const numbers = [1, 2, 3];
const doubled = numbers.map((num) => num * 2);
console.log(doubled); // [2, 4, 6]
```

#### Do's and Don'ts

**Do's**

- Use array methods for cleaner and more functional code.
- Prefer non-mutating methods like `map` or `filter`.

**Don'ts**

- Avoid manually iterating arrays when a method exists.

#### [Back to Top](#-table-of-contents)

---

### **13. Objects**

#### Explanation

Objects are key-value pairs used for structured data. They support methods for manipulation like `Object.keys()`
and `Object.values()`.

#### Coding Example

```javascript
const person = { name: "John", age: 30 };
person.job = "Developer"; // Adding new property
console.log(person); // { name: "John", age: 30, job: "Developer" }
```

#### Do's and Don'ts

**Do's**

- Use `Object.assign` or spread syntax for immutability.
- Use destructuring for clean code.

**Don'ts**

- Avoid mutating objects directly when possible.

#### [Back to Top](#-table-of-contents)

---

### **14. Template Literals**

#### Explanation

Template literals allow embedding expressions and creating multi-line strings using backticks (`` ` ``).

#### Coding Example

```javascript
const name = "Alice";
const greeting = `Hello, ${name}!`;
console.log(greeting); // Hello, Alice!
```

#### Do's and Don'ts

**Do's**

- Use template literals for dynamic strings.
- Use them for readability in multi-line strings.

**Don'ts**

- Avoid using concatenation when template literals suffice.

#### [Back to Top](#-table-of-contents)

---

### **15. Destructuring**

#### Explanation

Destructuring simplifies extracting values from arrays or objects.

#### Coding Example

```javascript
const user = { name: "Bob", age: 25 };
const { name, age } = user;
console.log(name); // Bob

const numbers = [1, 2, 3];
const [first, second] = numbers;
console.log(first); // 1
```

#### Do's and Don'ts

**Do's**

- Use destructuring for concise variable declarations.
- Provide default values in destructuring.

**Don'ts**

- Avoid over-complicating destructuring in deeply nested structures.

#### [Back to Top](#-table-of-contents)

---

### **16. Spread and Rest Operators**

#### Explanation

- **Spread (`...`)**: Expands elements in arrays/objects.
- **Rest (`...`)**: Collects multiple elements into an array.

#### Coding Example

```javascript
const array = [1, 2, 3];
const newArray = [...array, 4];
console.log(newArray); // [1, 2, 3, 4]

function sum(...args) {
    return args.reduce((acc, num) => acc + num, 0);
}

console.log(sum(1, 2, 3)); // 6
```

#### Do's and Don'ts

**Do's**

- Use spread for immutability.
- Use rest for flexible function arguments.

**Don'ts**

- Avoid overusing spread for large datasets.

#### [Back to Top](#-table-of-contents)

---

### **17. Conditional Statements**

#### Explanation

Control the flow of execution using:

- `if-else`
- `switch`
- Ternary operator

#### Coding Example

```javascript
const age = 20;
const result = age > 18 ? "Adult" : "Minor";
console.log(result); // Adult
```

#### Do's and Don'ts

**Do's**

- Use ternary operators for simple conditions.
- Use `switch` for multiple cases.

**Don'ts**

- Avoid deeply nested conditionals.

#### [Back to Top](#-table-of-contents)

---

### **18. Truthy and Falsy Values**

#### Explanation

Values in JavaScript are either **truthy** or **falsy** in a Boolean context.

- **Falsy**: `false`, `0`, `""`, `null`, `undefined`, `NaN`
- **Truthy**: All other values.

#### Coding Example

```javascript
if (0) {
    console.log("Falsy"); // Won't execute
} else {
    console.log("Truthy"); // Executes
}
```

#### Do's and Don'ts

**Do's**

- Use short-circuit evaluation (`||`, `&&`) for cleaner code.

**Don'ts**

- Avoid relying on implicit type conversion for truthy/falsy checks.

#### [Back to Top](#-table-of-contents)

---

### **19. Event Handling**

#### Explanation

Events are user interactions like clicks or keypresses. JavaScript provides methods to attach listeners
using `addEventListener`.

#### Coding Example

```javascript
document.getElementById("btn").addEventListener("click", () => {
    console.log("Button clicked");
});
```

#### Do's and Don'ts

**Do's**

- Use `addEventListener` for dynamic event binding.
- Use event delegation for dynamic elements.

**Don'ts**

- Avoid inline event handlers in HTML (`onclick="..."`).

---

### **20. Modules**

#### Explanation

JavaScript modules allow reusable and maintainable code by exporting and importing functionality.

#### Coding Example

**module.js:**

```javascript
export const greet = (name) => `Hello, ${name}!`;
```

**main.js:**

```javascript
import { greet } from './module.js';

console.log(greet("Alice")); // Hello, Alice!
```

#### Do's and Don'ts

**Do's**

- Use ES6 `import/export` syntax for modularity.
- Keep modules focused on a single responsibility.

**Don'ts**

- Avoid exporting large, unrelated functions in one module.

#### [Back to Top](#-table-of-contents)

---

### **21. Error Handling**

#### Explanation

Error handling ensures applications can gracefully manage runtime errors. Use `try-catch` blocks to capture and handle
exceptions.

#### Coding Example

```javascript
try {
    throw new Error("Something went wrong");
} catch (error) {
    console.error(error.message);
}
```

#### Do's and Don'ts

**Do's**

- Use `try-catch` for error-prone code.
- Log errors for debugging.

**Don'ts**

- Avoid exposing sensitive information in error messages.

#### [Back to Top](#-table-of-contents)