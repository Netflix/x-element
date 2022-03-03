```
  x-element
  _________
 / /__ __\ \
/ / \ \ / \ \
\ \ /_\_\ / /
 \_\_____/_/

```

A dead simple starting point for custom elements. It provides the following functionality:

- Efficient element generation and data binding via [lit-html](https://lit.dev)
- Automatic `.property` to `[attribute]` refection (opt-in)
- Automatic `[attribute]` to `.property` synchronization (one-directional, on boot)
- Simple and efficient property observation and computation
- Simple delegated event handling
- Useful error messages

## Installation:

```
curl https://raw.githubusercontent.com/Netflix/x-element/master/x-element.js > x-element.js
```

...or if you're fancy:

```
yarn add @netflix/x-element
```
or 
```
npm install @netflix/x-element
```

## Project Philosophy:

1. No compilation step is necessary for adoption, just import `x-element.js`
2. Implement a minimal set of generalized functionality
3. Make as few design decisions as possible
4. Presume adopters are browser experts already, don't get in their way
5. Follow the web platform precedents whenever possible
6. Remain compatible with any browser which fully supports custom elements
7. Prioritize simple syntax and useful comments in the code itself
8. Strive for zero dependencies (never add more!)

## Development:

```
yarn install && yarn start
```

Then...
* http://localhost:8080
* http://localhost:8080/demo
* http://localhost:8080/demo/react
* http://localhost:8080/test

---

[![Build Status](https://travis-ci.com/Netflix/x-element.svg?branch=master)](https://travis-ci.com/Netflix/x-element)