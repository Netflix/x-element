```
  x-element
  _________
 / /__ __\ \
/ / \ \ / \ \
\ \ /_\_\ / /
 \_\_____/_/

```

A dead simple starting point for custom elements. It provides the following functionality:

- Efficient element generation and data binding using your preferred [templating engine](./docs/SETUP.md)
- Automatic `.property` to `[attribute]` reflection (opt-in)
- Automatic `[attribute]` to `.property` synchronization (one-way, on connected)
- Simple and efficient property observation and computation
- Simple delegated event handling
- Useful error messages
- See [SPEC.md](./SPEC.md) for all the deets

## Installation

```
import XElement from 'https://deno.land/x/element/x-element.js';
```

or 
```
curl --location https://deno.land/x/element/x-element.js > x-element.js
```

...or if you're fancy:
```
npm install @netflix/x-element
```

## Project Philosophy

1. No compilation step is necessary for adoption (include [`x-element.js`](./x-element.js) any way you prefer)
2. Implement a minimal set of opinionated features
3. Make very few design decisions
4. Presume adopters are browser experts already (and stay out of their way)
5. Follow web platform precedent whenever possible
6. Prioritize simple syntax and useful comments (code is documentation)
7. Zero dependencies always and forever

## Development

```
npm install && npm start
```

Then...
* http://localhost:8080
