## **Consolidated JavaScript Basics**


### **<a href="../README.md">Interview Preparation</a> <img src="../img/icons8-right-25.png" alt="arrow" style="width:15px; height:15px;"> <a href="./README.md">NodeJs</a> <img src="../img/icons8-right-25.png" alt="arrow" style="width:15px; height:15px;"> Basics Of Js**

## 🎯 Table of Contents

| No. | Topic                                                   | Description |
|-----|---------------------------------------------------------|-------------|
| 1   | [Scope](#1-scope)                                       | Global, Function, and Block scope concepts |
| 2   | [IIFE](#2-iife-immediately-invoked-function-expression) | Immediately Invoked Function Expression patterns |
| 3   | [Hoisting](#3-hoisting)                                 | Variable and function declaration hoisting |
| 4   | [Closures](#4-closures)                                 | Functions retaining access to parent scope |
| 5   | [Callbacks](#5-callbacks)                               | Functions passed as arguments |
| 6   | [Promises](#6-promises)                                 | Handling asynchronous operations |
| 7   | [Async & Await](#7-async--await)                        | Modern async programming patterns |
| 8   | [Event Loop](#8-event-loop)                             | JavaScript's event handling mechanism |
| 9   | [Data Types](#9-data-types-and-type-conversion)         | Primitive and non-primitive types |
| 10  | [Loops](#10-loops)                                      | Different looping structures |
| 11  | [Functions](#11-functions)                              | Function declarations, expressions, and arrows |
| 12  | [Arrays](#12-arrays)                                    | Array manipulation and methods |
| 13  | [Objects](#13-objects)                                  | Object handling and manipulation |
| 14  | [Template Literals](#14-template-literals)              | String interpolation and multi-line strings |
| 15  | [Destructuring](#15-destructuring)                      | Extracting values from arrays/objects |
| 16  | [Spread/Rest](#16-spread-and-rest-operators)            | Spread and rest operator usage |
| 17  | [Conditionals](#17-conditional-statements)              | Control flow statements |
| 18  | [Truthy/Falsy](#18-truthy-and-falsy-values)             | Boolean context evaluations |
| 19  | [Event Handling](#19-event-handling)                    | Managing user interactions |
| 20  | [Modules](#20-modules)                                  | Code organization with imports/exports |
| 21  | [Error Handling](#21-error-handling)                    | Exception handling with try-catch |

---

### **1. Scope**

#### Explanation

Scope determines where variables are accessible. JavaScript has three levels:

- **Global Scope**: Accessible everywhere in the program.
- **Function Scope**: Variables declared with `var` (or `let`/`const`) inside a function are local to it.
- **Block Scope**: Variables declared with `let` or `const` are confined to the nearest `{ }` block.

`var` is function-scoped — it leaks out of `if`/`for` blocks, which is the primary reason to avoid it.

#### Code Example

```javascript
let globalVar = 'Global';

function scopeExample() {
    var functionScoped = 'Function'; // accessible anywhere in this function
    if (true) {
        let blockVar = 'Block';       // only accessible inside this if block
        var leaky = 'Leaky var';      // leaks to function scope!
        console.log(blockVar);        // Block
    }
    console.log(functionScoped);  // Function
    console.log(leaky);           // Leaky var  ← this is why var is avoided
    // console.log(blockVar);     // ReferenceError: blockVar is not defined
}

scopeExample();
console.log(globalVar); // Global
```

#### Do's and Don'ts

**Do's**

- Use `const` by default; use `let` only when the variable needs to be reassigned.
- Keep variables in the narrowest scope needed — reduces unintended side effects.
- Use module scope (one file = one module) to avoid polluting the global namespace.

**Don'ts**

- Don't use `var` — its function-scoped, hoisted behaviour leads to subtle bugs.
- Avoid attaching properties to `globalThis`/`window` unless absolutely necessary.

#### [Back to Top](#-table-of-contents)

---

### **2. IIFE (Immediately Invoked Function Expression)**

#### Explanation

An IIFE is a function that executes immediately after being defined. It creates an isolated scope that does not pollute the surrounding namespace. IIFEs were essential in pre-ES6 JavaScript when there was no block scope or module system. In modern code (ES6+ with modules), they are rarely needed — block scope and `import/export` solve the same problems more cleanly.

> **When still useful:** Library authors use IIFEs to wrap UMD (Universal Module Definition) bundles so they work in both browser globals and CommonJS environments.

#### Code Example

```javascript
// Classic IIFE — creates private scope
(function () {
    let privateVar = 'IIFE scope';
    console.log(privateVar); // IIFE scope
})();

// console.log(privateVar); // ReferenceError — not accessible outside

// Arrow function IIFE (modern syntax)
(() => {
    const config = { debug: true };
    console.log(config.debug); // true
})();

// IIFE with a return value
const result = (() => {
    const x = 10;
    return x * 2;
})();
console.log(result); // 20
```

#### Do's and Don'ts

**Do's**

- Use IIFEs when you need a self-contained execution context in a non-module environment (e.g., a `<script>` tag without `type="module"`).
- Use them in UMD bundles to conditionally export for different module systems.

**Don'ts**

- Don't use IIFEs in modern Node.js or module-based browser code — use modules and block scope instead.
- Avoid IIFEs just to create a private scope when `{ }` with `let`/`const` does the same job more readably.

#### [Back to Top](#-table-of-contents)

---

### **3. Hoisting**

#### Explanation

Hoisting is JavaScript's behaviour of moving declarations (not initialisations) to the top of their scope before code executes. `var` declarations are hoisted and initialised to `undefined`. `function` declarations are fully hoisted (both declaration and body). `let` and `const` are hoisted but **not initialised** — accessing them before the declaration throws a `ReferenceError`. The window between the top of the scope and the `let`/`const` declaration is called the **Temporal Dead Zone (TDZ)**.

> **Key Interview Insight:** Candidates who only know "hoisting moves declarations to the top" without knowing the TDZ will get tripped up on `let`/`const` questions.

#### Code Example

```javascript
// var: hoisted and initialised to undefined
console.log(a); // undefined (not ReferenceError)
var a = 5;
console.log(a); // 5

// function declaration: fully hoisted
foo(); // Works — "Hoisted!"
function foo() {
    console.log('Hoisted!');
}

// let/const: hoisted but in the Temporal Dead Zone
console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 10;

// Function expression: NOT hoisted (the variable is, but not the function)
bar(); // TypeError: bar is not a function
var bar = function () {
    console.log('Not hoisted');
};
```

#### Do's and Don'ts

**Do's**

- Declare variables at the top of their scope to make hoisting explicit and intentional.
- Use `let` and `const` — the TDZ error is a helpful safety net compared to silent `undefined`.

**Don'ts**

- Don't rely on `var` hoisting — code that reads a variable before declaring it is confusing and error-prone.
- Don't assume `let` and `const` behave like `var` — the TDZ makes them fail loudly if accessed early.

#### [Back to Top](#-table-of-contents)

---

### **4. Closures**

#### Explanation

A closure is a function that remembers and continues to access variables from its outer (enclosing) scope, even after that outer function has returned. Closures are the mechanism behind data encapsulation, factory functions, partial application, and memoisation in JavaScript.

> **Memory note:** Each closure holds a reference to its outer scope — if a closure outlives its use, the outer scope variables stay in memory. Creating closures inside loops without care is a common memory leak pattern.

#### Code Example

```javascript
// Counter factory — classic closure pattern
function makeCounter(initial = 0) {
    let count = initial; // private — not accessible from outside

    return {
        increment: () => ++count,
        decrement: () => --count,
        value: () => count,
    };
}

const counter = makeCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log(counter.value());     // 11

// Common loop pitfall — all callbacks share the same 'i'
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0); // prints: 3 3 3 (not 0 1 2)
}

// Fix: use let (block-scoped, new binding per iteration)
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0); // prints: 0 1 2
}
```

#### Do's and Don'ts

**Do's**

- Use closures to create private state — they are the idiomatic way to encapsulate data in JavaScript without classes.
- Use closures for factory functions that generate pre-configured callbacks or handlers.

**Don'ts**

- Avoid creating closures inside tight loops that run thousands of times — each closure holds a reference to the outer scope.
- Don't use `var` in loops with closures — use `let` to get a fresh binding per iteration.

#### [Back to Top](#-table-of-contents)

---

### **5. Callbacks**

#### Explanation

A callback is a function passed as an argument to another function, to be invoked later — either synchronously or asynchronously. Callbacks are the original asynchronous pattern in Node.js. The Node.js convention is **error-first callbacks**: the first argument is always an error (or `null`), and subsequent arguments are the result. The main drawback is "callback hell" — deeply nested callbacks that are hard to read and error-prone. Promises and `async/await` were designed to solve this.

#### Code Example

```javascript
// Error-first callback convention (Node.js standard)
function readUserData(userId, callback) {
    db.find(userId, (err, user) => {
        if (err) return callback(err);
        callback(null, user);
    });
}

readUserData(42, (err, user) => {
    if (err) return console.error('Failed:', err.message);
    console.log('User:', user.name);
});

// Callback hell — hard to read, hard to handle errors
getUser(id, (err, user) => {
    getOrders(user.id, (err, orders) => {
        getInvoice(orders[0].id, (err, invoice) => {
            // deeply nested, error handling is a mess
        });
    });
});

// Fix: Promises or async/await flatten this completely
const user = await getUser(id);
const orders = await getOrders(user.id);
const invoice = await getInvoice(orders[0].id);
```

#### Do's and Don'ts

**Do's**

- Follow the error-first convention when writing callback-based APIs in Node.js.
- Use `util.promisify` to convert error-first callbacks into Promises for use with `async/await`.

**Don'ts**

- Avoid deeply nested callbacks — flatten with Promises or `async/await`.
- Don't forget to `return` after calling the callback with an error — execution continues otherwise.

#### [Back to Top](#-table-of-contents)

---

### **6. Promises**

#### Explanation

A Promise represents the eventual result of an asynchronous operation. It is in one of three states: **pending**, **fulfilled** (resolved), or **rejected**. Promises are chainable via `.then()` and `.catch()`, which makes sequential async operations readable. For concurrent operations, `Promise.all` (fail-fast), `Promise.allSettled` (wait for all), and `Promise.race` (first to settle) cover the main patterns.

#### Code Example

```javascript
// Creating a Promise
const fetchUser = (id) => new Promise((resolve, reject) => {
    if (!id) return reject(new Error('ID is required'));
    setTimeout(() => resolve({ id, name: 'Alice' }), 100);
});

// Chaining
fetchUser(1)
    .then((user) => {
        console.log(user.name); // Alice
        return user.id;
    })
    .then((id) => console.log('ID:', id))
    .catch((err) => console.error('Error:', err.message))
    .finally(() => console.log('Done'));

// Concurrent: all must succeed
const [user, orders] = await Promise.all([fetchUser(1), fetchOrders(1)]);

// Concurrent: collect all results even if some fail
const results = await Promise.allSettled([fetchUser(1), fetchUser(999)]);
results.forEach((r) => {
    if (r.status === 'fulfilled') console.log(r.value);
    else console.error(r.reason);
});

// Race: first to settle wins (useful for timeouts)
const withTimeout = (promise, ms) =>
    Promise.race([promise, new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), ms)
    )]);
```

#### Do's and Don'ts

**Do's**

- Always attach a `.catch()` or handle rejection with `try/catch` — unhandled rejections crash Node.js processes in newer versions.
- Use `Promise.allSettled` when you need all results regardless of individual failures.
- Use `Promise.race` or `AbortController` to implement request timeouts.

**Don'ts**

- Don't mix callbacks and Promises in the same chain — pick one pattern per function.
- Avoid the Promise constructor anti-pattern: don't wrap an already-Promise-returning function in `new Promise(...)`.

#### [Back to Top](#-table-of-contents)

---

### **7. Async & Await**

#### Explanation

`async/await` is syntactic sugar over Promises that makes asynchronous code read like synchronous code. An `async` function always returns a Promise. `await` pauses execution of the current `async` function until the Promise settles — it does not block the thread. The most common performance mistake is awaiting independent operations sequentially instead of running them in parallel with `Promise.all`.

#### Code Example

```javascript
// Anti-pattern: sequential awaits for independent operations (slow)
async function slow(userId) {
    const user = await getUser(userId);      // wait...
    const orders = await getOrders(userId);  // then wait...
    return { user, orders };
}

// Correct: parallel execution (fast)
async function fast(userId) {
    const [user, orders] = await Promise.all([
        getUser(userId),
        getOrders(userId),
    ]);
    return { user, orders };
}

// Error handling
async function loadDashboard(userId) {
    try {
        const data = await fast(userId);
        return data;
    } catch (err) {
        console.error('Dashboard load failed:', err.message);
        throw err; // re-throw so the caller can handle it too
    }
}

// await in for...of (correct — each iteration waits)
for (const id of userIds) {
    const user = await getUser(id); // works as expected
}

// forEach does NOT respect await — don't do this
userIds.forEach(async (id) => {
    const user = await getUser(id); // forEach doesn't wait for each iteration
});
```

#### Do's and Don'ts

**Do's**

- Use `Promise.all` for independent async operations — sequential `await` chains are a common performance trap.
- Always use `try/catch` around `await` calls that can fail.
- Re-throw errors in `catch` blocks when the caller also needs to handle them.

**Don'ts**

- Don't `await` inside `forEach` — it returns `undefined` per iteration and doesn't wait. Use `for...of` or `Promise.all`.
- Avoid top-level `await` in files that are `require`d as CommonJS modules — it is only supported in ES modules.

#### [Back to Top](#-table-of-contents)

---

### **8. Event Loop**

#### Explanation

JavaScript is single-threaded, but Node.js achieves concurrency through the event loop. The loop runs phases in order: **timers** → **pending callbacks** → **poll** (I/O) → **check** (`setImmediate`) → **close callbacks**. Between every phase, Node.js first drains the **nextTick queue** (`process.nextTick`), then the **microtask queue** (resolved Promises). This means Promises resolve before `setTimeout` callbacks, even with a 0 ms delay.

#### Code Example

```javascript
console.log('1 — sync');

setTimeout(() => console.log('2 — setTimeout'), 0);

Promise.resolve().then(() => console.log('3 — Promise microtask'));

process.nextTick(() => console.log('4 — process.nextTick'));

setImmediate(() => console.log('5 — setImmediate'));

console.log('6 — sync');

// Output order:
// 1 — sync
// 6 — sync
// 4 — process.nextTick    (nextTick queue — highest priority)
// 3 — Promise microtask   (microtask queue)
// 2 — setTimeout          (timers phase)
// 5 — setImmediate        (check phase)
```

#### Do's and Don'ts

**Do's**

- Write non-blocking async code — any synchronous operation that takes >10 ms noticeably delays all concurrent requests.
- Use `setImmediate` to defer non-urgent work to after the current I/O callbacks.

**Don'ts**

- Don't run CPU-intensive synchronous operations on the main thread — they freeze the event loop for all clients.
- Avoid deeply recursive `process.nextTick` — it starves the I/O poll phase and effectively freezes I/O.

#### [Back to Top](#-table-of-contents)

---

### **9. Data Types and Type Conversion**

#### Explanation

JavaScript is dynamically typed with seven primitive types (`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`) and one non-primitive type (`object`, which includes arrays, functions, and plain objects). Type coercion — JavaScript automatically converting types during operations — is a frequent source of bugs. Use explicit conversion and strict equality (`===`) to avoid surprises.

> **Classic gotchas:** `typeof null === 'object'` (historical bug, not a feature). `NaN !== NaN` (use `Number.isNaN()` to check). `[] + []` is `""`, `[] + {}` is `"[object Object]"`.

#### Code Example

```javascript
// Primitive types
typeof 'hello'    // 'string'
typeof 42         // 'number'
typeof true       // 'boolean'
typeof undefined  // 'undefined'
typeof Symbol()   // 'symbol'
typeof 42n        // 'bigint'
typeof null       // 'object'  ← well-known bug, not fixable for backwards compat

// Checking for null: use strict equality
const val = null;
console.log(val === null); // true (correct)

// NaN check
console.log(NaN === NaN);          // false  ← surprising
console.log(Number.isNaN(NaN));    // true   ← correct way

// Explicit conversion
Number('123')   // 123
Number('')      // 0   ← surprising
Number(null)    // 0   ← surprising
Number(true)    // 1

// Implicit coercion surprises
'5' + 3         // '53' (string concatenation)
'5' - 3         // 2   (numeric subtraction)
false == 0      // true (loose equality coerces)
false === 0     // false (strict equality — always use this)
```

#### Do's and Don'ts

**Do's**

- Use `===` (strict equality) instead of `==` — loose equality applies coercion rules that are hard to remember.
- Use `Number.isNaN()` instead of the global `isNaN()` — the global version coerces its argument first.
- Use `typeof` for primitive checks and `instanceof` or `Array.isArray()` for objects.

**Don'ts**

- Don't rely on implicit type coercion — make conversions explicit (`String()`, `Number()`, `Boolean()`).
- Avoid `== null` for checking both `null` and `undefined` unless you specifically want that behaviour.

#### [Back to Top](#-table-of-contents)

---

### **10. Loops**

#### Explanation

JavaScript has several loop constructs suited for different situations: `for` (index-based), `while` / `do...while` (condition-based), `for...in` (object keys — avoid on arrays), `for...of` (iterables: arrays, strings, Maps, Sets, generators), and array methods (`map`, `filter`, `reduce`). In async code, `for...of` is the correct way to await each iteration sequentially; `forEach` does not await async callbacks.

#### Code Example

```javascript
const items = [1, 2, 3, 4, 5];

// for...of — iterates values (correct for arrays)
for (const item of items) {
    console.log(item);
}

// for...in — iterates keys (use for plain objects, not arrays)
const obj = { a: 1, b: 2 };
for (const key in obj) {
    console.log(key, obj[key]); // a 1, b 2
}

// Array methods — functional, declarative
const doubled = items.map((n) => n * 2);          // [2, 4, 6, 8, 10]
const evens = items.filter((n) => n % 2 === 0);   // [2, 4]
const sum = items.reduce((acc, n) => acc + n, 0); // 15

// Async: for...of correctly awaits each iteration
async function processAll(ids) {
    for (const id of ids) {
        await processItem(id); // waits for each before the next
    }
}

// Anti-pattern: forEach doesn't await
items.forEach(async (id) => {
    await processItem(id); // NOT waited — all run concurrently and errors are lost
});
```

#### Do's and Don'ts

**Do's**

- Use `for...of` for arrays and iterables, especially when you need `await` inside the loop.
- Use `map`/`filter`/`reduce` for transformations — they are declarative and return new arrays (non-mutating).
- Use `for...in` only on plain objects, never on arrays.

**Don'ts**

- Don't use `for...in` on arrays — it iterates all enumerable properties, including any added to `Array.prototype`.
- Avoid `forEach` with `async` callbacks — errors are swallowed and the loop doesn't wait.

#### [Back to Top](#-table-of-contents)

---

### **11. Functions**

#### Explanation

JavaScript has three main ways to define functions: **function declarations** (hoisted, have their own `this`), **function expressions** (not hoisted, assigned to a variable), and **arrow functions** (not hoisted, do not have their own `this` — they inherit `this` from the enclosing lexical scope). This `this` distinction is the most important difference to know for interviews.

#### Code Example

```javascript
// Function declaration — hoisted
function greet(name) {
    return `Hello, ${name}`;
}

// Function expression — not hoisted
const double = function (n) {
    return n * 2;
};

// Arrow function — inherits `this` from surrounding scope
const multiply = (a, b) => a * b;

// `this` difference — critical interview topic
function Timer() {
    this.seconds = 0;

    // Regular function: `this` is the caller, not Timer — breaks
    // setInterval(function() { this.seconds++; }, 1000);

    // Arrow function: `this` is lexically bound to Timer — correct
    setInterval(() => {
        this.seconds++;
        console.log(this.seconds);
    }, 1000);
}

new Timer();

// Default parameters
const greetUser = (name = 'Guest') => `Hello, ${name}`;
console.log(greetUser());        // Hello, Guest
console.log(greetUser('Alice')); // Hello, Alice
```

#### Do's and Don'ts

**Do's**

- Use arrow functions for callbacks and closures where you need the surrounding `this`.
- Use function declarations for top-level named functions — they are hoisted and easier to read in call stacks.
- Use default parameters instead of `if (!param)` checks inside functions.

**Don'ts**

- Don't use arrow functions as object methods if the method needs its own `this`.
- Avoid deeply nested functions — extract to named helpers instead.

#### [Back to Top](#-table-of-contents)

---

### **12. Arrays**

#### Explanation

Arrays are ordered, zero-indexed collections. JavaScript provides rich built-in methods split into **mutating** (change the original array: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`) and **non-mutating** (return a new value: `map`, `filter`, `reduce`, `slice`, `find`, `findIndex`, `flat`, `flatMap`). Prefer non-mutating methods in functional code to avoid unexpected side effects.

#### Code Example

```javascript
const numbers = [1, 2, 3, 4, 5];

// Non-mutating — return new arrays
const doubled  = numbers.map((n) => n * 2);           // [2, 4, 6, 8, 10]
const evens    = numbers.filter((n) => n % 2 === 0);  // [2, 4]
const sum      = numbers.reduce((acc, n) => acc + n, 0); // 15
const firstBig = numbers.find((n) => n > 3);           // 4

// Mutating — modifies the original
const arr = [3, 1, 2];
arr.sort((a, b) => a - b); // [1, 2, 3] — mutates arr

// Shallow copy before sorting to avoid mutation
const sorted = [...numbers].sort((a, b) => b - a); // [5, 4, 3, 2, 1]

// Flattening nested arrays
const nested = [[1, 2], [3, [4, 5]]];
nested.flat();    // [1, 2, 3, [4, 5]]
nested.flat(2);   // [1, 2, 3, 4, 5]

// Checking membership
numbers.includes(3);          // true
numbers.some((n) => n > 4);   // true (at least one)
numbers.every((n) => n > 0);  // true (all)
```

#### Do's and Don'ts

**Do's**

- Prefer non-mutating methods — they make data flow predictable and enable composition.
- Always pass a comparator to `.sort()` — the default sorts by UTF-16 code unit, which is wrong for numbers.
- Use `Array.isArray()` to check if something is an array — `typeof []` returns `'object'`.

**Don'ts**

- Don't mutate arrays passed as function arguments — callers won't expect their data to change.
- Avoid using `delete arr[i]` — it leaves a hole (`undefined`) without changing `.length`.

#### [Back to Top](#-table-of-contents)

---

### **13. Objects**

#### Explanation

Objects are collections of key-value pairs. Keys are strings (or Symbols); values can be any type. JavaScript objects are dynamic — properties can be added or removed at runtime. Key built-in utilities: `Object.keys()`, `Object.values()`, `Object.entries()`, `Object.assign()`, `Object.freeze()`, and the spread operator `{...obj}` for shallow copies.

> **Shallow copy warning:** Spread and `Object.assign` create a shallow copy — nested objects are still shared by reference.

#### Code Example

```javascript
const person = { name: 'Alice', age: 30 };

// Add / update properties
person.job = 'Developer';

// Shallow copy (nested objects still shared)
const copy = { ...person };
copy.name = 'Bob';           // does not affect person
copy.address = person.address; // same reference as person.address

// Merging objects
const defaults = { theme: 'light', lang: 'en' };
const userPrefs = { theme: 'dark' };
const config = { ...defaults, ...userPrefs }; // { theme: 'dark', lang: 'en' }

// Object utility methods
Object.keys(person);    // ['name', 'age', 'job']
Object.values(person);  // ['Alice', 30, 'Developer']
Object.entries(person); // [['name', 'Alice'], ['age', 30], ['job', 'Developer']]

// Prevent mutation
const immutable = Object.freeze({ x: 1, y: 2 });
immutable.x = 99; // silently fails in strict mode, throws in strict mode
console.log(immutable.x); // 1

// Convert entries back to object
const map = { a: 1, b: 2 };
const doubled = Object.fromEntries(
    Object.entries(map).map(([k, v]) => [k, v * 2])
); // { a: 2, b: 4 }
```

#### Do's and Don'ts

**Do's**

- Use spread `{...obj}` for shallow copies and merging — it is concise and immutable-friendly.
- Use `Object.freeze()` for config objects or constants that should never change.
- Use optional chaining (`obj?.deeply?.nested?.prop`) to safely access nested properties.

**Don'ts**

- Don't mutate objects received as function parameters — create a new object with the changes instead.
- Avoid `for...in` on objects unless you check `hasOwnProperty` — it also iterates inherited properties.

#### [Back to Top](#-table-of-contents)

---

### **14. Template Literals**

#### Explanation

Template literals use backticks (`` ` ``) and allow embedding expressions with `${}`, multi-line strings without `\n`, and tagged templates (a function that processes the template — used by libraries like `styled-components`, `gql`, and `sql`).

#### Code Example

```javascript
const name = 'Alice';
const age = 30;

// String interpolation
const greeting = `Hello, ${name}! You are ${age} years old.`;

// Multi-line strings (no \n needed)
const multiLine = `
  Line one
  Line two
  Line three
`.trim();

// Expressions inside ${}
const price = 9.99;
console.log(`Total: $${(price * 1.1).toFixed(2)}`); // Total: $10.99

// Tagged template — function processes the template parts
function highlight(strings, ...values) {
    return strings.reduce((result, str, i) =>
        result + str + (values[i] !== undefined ? `**${values[i]}**` : ''), ''
    );
}
console.log(highlight`Hello ${name}, you have ${3} messages`);
// Hello **Alice**, you have **3** messages
```

#### Do's and Don'ts

**Do's**

- Use template literals for any string that contains a variable — avoid `+` concatenation.
- Use tagged templates when building SQL queries, HTML, or GraphQL strings — the tag can sanitise inputs.

**Don'ts**

- Don't use template literals for static strings that contain no expressions — plain quotes are cleaner.
- Avoid using template literals for user-generated content without sanitisation — they don't escape HTML.

#### [Back to Top](#-table-of-contents)

---

### **15. Destructuring**

#### Explanation

Destructuring extracts values from arrays or properties from objects into named variables in a single statement. It supports default values (used when the value is `undefined`), renaming (aliasing), nested destructuring, and rest patterns.

#### Code Example

```javascript
// Object destructuring
const user = { name: 'Bob', age: 25, role: 'admin' };
const { name, age } = user;

// Rename while destructuring
const { name: userName, role: userRole = 'guest' } = user;
console.log(userName); // 'Bob'
console.log(userRole); // 'admin'

// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(rest);  // [3, 4, 5]

// Swap variables without a temp
let a = 1, b = 2;
[a, b] = [b, a];

// Nested destructuring
const { address: { city, zip } } = { address: { city: 'NYC', zip: '10001' } };

// Function parameter destructuring (very common in Node.js)
function createUser({ name, age = 18, role = 'user' } = {}) {
    return { name, age, role };
}
createUser({ name: 'Alice' }); // { name: 'Alice', age: 18, role: 'user' }
```

#### Do's and Don'ts

**Do's**

- Destructure function parameters to make the expected shape explicit and provide defaults.
- Use rest destructuring (`...rest`) to collect remaining properties or elements.

**Don'ts**

- Avoid deeply nested destructuring (more than 2 levels) — it becomes unreadable and fragile.
- Don't destructure from potentially `null` or `undefined` values without a fallback default (`= {}`).

#### [Back to Top](#-table-of-contents)

---

### **16. Spread and Rest Operators**

#### Explanation

Both use `...` syntax but in opposite directions. **Spread** expands an iterable (array) or object into individual elements — used in function calls, array literals, and object literals. **Rest** collects remaining elements into an array — used in function parameters and destructuring. A key limitation: spread creates **shallow copies** — nested objects are still shared references.

#### Code Example

```javascript
// Spread — expand
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Spread in function calls
Math.max(...arr1); // 3

// Object spread (shallow copy + merge)
const base = { a: 1, b: { c: 2 } };
const copy = { ...base, d: 3 };
copy.b.c = 99; // mutates base.b.c too! (shallow copy)

// Rest — collect
function sum(first, ...others) {
    return others.reduce((acc, n) => acc + n, first);
}
sum(1, 2, 3, 4); // 10

// Rest in destructuring
const { a, ...remaining } = { a: 1, b: 2, c: 3 };
console.log(remaining); // { b: 2, c: 3 }
```

#### Do's and Don'ts

**Do's**

- Use spread for shallow copies and non-mutating array/object operations.
- Use rest parameters instead of the old `arguments` object — rest gives a real array.

**Don'ts**

- Don't spread large arrays into function arguments — there is a call stack size limit.
- Avoid assuming spread creates a deep clone — nested objects are still shared.

#### [Back to Top](#-table-of-contents)

---

### **17. Conditional Statements**

#### Explanation

Control flow in JavaScript uses `if/else`, `switch`, the ternary operator (`? :`), the nullish coalescing operator (`??`), and optional chaining (`?.`). `??` returns the right-hand side only when the left is `null` or `undefined` (unlike `||` which also triggers on `0`, `''`, and `false`). Optional chaining short-circuits and returns `undefined` instead of throwing when accessing a property on `null` or `undefined`.

#### Code Example

```javascript
const age = 20;

// if / else
if (age >= 18) {
    console.log('Adult');
} else {
    console.log('Minor');
}

// Ternary — for simple one-liners
const label = age >= 18 ? 'Adult' : 'Minor';

// switch — for multiple discrete values
const day = 'Monday';
switch (day) {
    case 'Monday':
    case 'Tuesday':
        console.log('Weekday');
        break;
    default:
        console.log('Other');
}

// Nullish coalescing — default only for null/undefined (not 0 or '')
const port = process.env.PORT ?? 3000; // 3000 if PORT is unset
const count = 0;
console.log(count ?? 'default'); // 0  ← correct (|| would give 'default')

// Optional chaining — safe property access
const user = null;
console.log(user?.profile?.avatar); // undefined (no throw)
console.log(user?.greet?.());       // undefined (safe method call)
```

#### Do's and Don'ts

**Do's**

- Use `??` instead of `||` for default values when `0`, `false`, or `''` are valid inputs.
- Use optional chaining `?.` for safe access on values that might be `null` or `undefined`.
- Use `switch` with explicit `break` statements to prevent fall-through bugs.

**Don'ts**

- Avoid deeply nested `if/else` chains — early returns or a lookup table are usually cleaner.
- Don't use `||` for defaults when the left side can be a valid falsy value like `0` or `""`.

#### [Back to Top](#-table-of-contents)

---

### **18. Truthy and Falsy Values**

#### Explanation

Every value in JavaScript is either truthy or falsy when evaluated in a Boolean context. The exhaustive list of **falsy** values is: `false`, `0`, `-0`, `0n` (BigInt zero), `""` (empty string), `null`, `undefined`, and `NaN`. Everything else — including `[]`, `{}`, and `"false"` — is truthy.

> **Interview trap:** `[]` and `{}` are truthy. `"0"` is truthy (non-empty string). `0` is falsy but `"0"` is not.

#### Code Example

```javascript
// Falsy values
Boolean(false)     // false
Boolean(0)         // false
Boolean('')        // false
Boolean(null)      // false
Boolean(undefined) // false
Boolean(NaN)       // false

// Truthy — these surprise many candidates
Boolean([])        // true  ← empty array is truthy
Boolean({})        // true  ← empty object is truthy
Boolean('0')       // true  ← non-empty string is truthy
Boolean('false')   // true  ← non-empty string is truthy

// Short-circuit evaluation
const name = user?.name || 'Guest';    // 'Guest' if name is falsy
const port = config.port ?? 3000;      // 3000 only if config.port is null/undefined

// Guard clause pattern
function process(data) {
    if (!data) return; // guards against null, undefined, '', 0, false
    // ...
}
```

#### Do's and Don'ts

**Do's**

- Use `if (!value)` for null/undefined checks on reference types, but be explicit when 0 or '' are valid values.
- Use `??` (nullish coalescing) when you only want to default on `null`/`undefined`, not all falsy values.

**Don'ts**

- Don't use `if (arr.length)` when you mean `if (arr.length > 0)` — they're equivalent, but the latter is more explicit to future readers.
- Avoid assuming `[]` or `{}` are falsy — they are not.

#### [Back to Top](#-table-of-contents)

---

### **19. Event Handling**

#### Explanation

Event handling is primarily a browser concept — DOM elements emit events (click, keydown, submit) that JavaScript can listen to with `addEventListener`. In Node.js, the equivalent is `EventEmitter` (see the Events Module section in the main Q&A). For browser-targeted code in this repository, understanding `addEventListener`, event delegation, and removing listeners is important.

> **Note:** This section covers browser events. For Node.js server-side event handling, see `EventEmitter` in [1-10.md → Q5](./1-10.md#5-using-the-events-module).

#### Code Example

```javascript
// Add an event listener
const btn = document.getElementById('btn');
btn.addEventListener('click', handleClick);

function handleClick(event) {
    console.log('Button clicked:', event.target);
    event.preventDefault(); // prevent default browser behaviour (e.g., form submit)
}

// Remove listener (must reference the same function)
btn.removeEventListener('click', handleClick);

// Event delegation — one listener handles all children
document.getElementById('list').addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        console.log('Item clicked:', event.target.textContent);
    }
});

// Once — fires only one time
btn.addEventListener('click', handleClick, { once: true });
```

#### Do's and Don'ts

**Do's**

- Use event delegation (listen on a parent) for lists of dynamic elements — more efficient than one listener per child.
- Remove listeners when elements are removed from the DOM to prevent memory leaks.
- Use `{ once: true }` in `addEventListener` options instead of manually calling `removeEventListener` inside the handler.

**Don'ts**

- Avoid inline event handlers in HTML (`onclick="..."`): they mix concerns, are hard to test, and cannot be easily removed.
- Don't add event listeners inside loops — use delegation instead.

#### [Back to Top](#-table-of-contents)

---

### **20. Modules**

#### Explanation

JavaScript has two module systems: **CommonJS (CJS)** — used in Node.js by default (`require`/`module.exports`) — and **ES Modules (ESM)** — the standard (`import`/`export`), supported in Node.js since v12 with `.mjs` or `"type": "module"` in `package.json`. The key behavioural differences: CJS is synchronous and evaluated at runtime; ESM is statically analysed at parse time and supports tree-shaking. You cannot use `require` inside an ESM file, and top-level `await` is only available in ESM.

#### Code Example

```javascript
// === CommonJS (CJS) — Node.js default ===

// math.js
const add = (a, b) => a + b;
const PI = 3.14159;
module.exports = { add, PI };

// main.js
const { add, PI } = require('./math');
console.log(add(2, 3)); // 5

// Dynamic require (CJS allows this at runtime)
const lib = require(condition ? './libA' : './libB');

// === ES Modules (ESM) — add "type": "module" to package.json ===

// math.mjs
export const add = (a, b) => a + b;
export const PI = 3.14159;
export default function multiply(a, b) { return a * b; }

// main.mjs
import multiply, { add, PI } from './math.mjs';

// Top-level await (ESM only)
const config = await fetch('/config').then(r => r.json());
```

#### Do's and Don'ts

**Do's**

- Use ESM for new projects — it is the standard, enables tree-shaking, and supports top-level `await`.
- Use named exports rather than default exports — they are easier to refactor and import with autocomplete.
- Add `"type": "module"` to `package.json` to use `.js` extension with ESM instead of `.mjs`.

**Don'ts**

- Don't mix `require` and `import` in the same file — they come from different module systems.
- Avoid circular dependencies — both CJS and ESM handle them but the results can be surprising (partially initialised exports).

#### [Back to Top](#-table-of-contents)

---

### **21. Error Handling**

#### Explanation

Robust error handling prevents crashes and makes debugging manageable. JavaScript has synchronous errors (caught with `try/catch`), asynchronous errors (caught with `.catch()` on Promises, or `try/catch` around `await`), and unhandled errors that bubble up to the process level. Custom error classes (extending `Error`) let you attach machine-readable context like status codes or error codes without parsing messages.

#### Code Example

```javascript
// Custom error class
class AppError extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Synchronous
try {
    throw new AppError('Not found', 404, 'NOT_FOUND');
} catch (err) {
    if (err instanceof AppError) {
        console.error(`[${err.code}] ${err.message}`); // [NOT_FOUND] Not found
    } else {
        throw err; // re-throw unexpected errors
    }
}

// Async — always catch at the boundary
async function fetchUser(id) {
    const user = await db.findById(id);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    return user;
}

// Process-level safety net — log and exit gracefully
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    process.exit(1);
});
```

#### Do's and Don'ts

**Do's**

- Create custom error classes to carry structured metadata (status code, error code) alongside the message.
- Always re-throw errors you cannot handle — swallowing errors silently is worse than crashing.
- Attach `process.on('unhandledRejection')` and `process.on('uncaughtException')` handlers as a safety net.

**Don'ts**

- Don't catch errors with an empty `catch` block — at minimum, log them.
- Avoid exposing internal error details (stack traces, DB errors) to API clients in production.
- Don't use error handling as control flow for expected conditions — throw only for truly exceptional cases.

#### [Back to Top](#-table-of-contents)

## 🌐 Socials:
[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white)](https://instagram.com/biswajit_fsd) [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://linkedin.com/in/biswajitfsd) [![Medium](https://img.shields.io/badge/Medium-12100E?logo=medium&logoColor=white)](https://medium.com/@biswajitfsd) [![X](https://img.shields.io/badge/X-black.svg?logo=X&logoColor=white)](https://x.com/biswajitfsd) [![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?logo=YouTube&logoColor=white)](https://youtube.com/@biswajitfsd)
