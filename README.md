```
  x-element
  _________
 / /__ __\ \
/ / \ \ / \ \
\ \ /_\_\ / /
 \_\_____/_/

```

A dead simple starting point for custom elements. It provides the following functionality:

- Efficient DOM generation and data binding using your preferred [templating engine](./doc/TEMPLATES.md)
- Automatic `.property` to `[attribute]` reflection (opt-in)
- Automatic `[attribute]` to `.property` synchronization (one-directional, on connected)
- Simple and efficient property observation and computation
- Simple delegated event handling
- Useful error messages

## Installation:

```
# save a local copy
curl https://raw.githubusercontent.com/Netflix/x-element/main/x-element.js > x-element.js
```

or
```
# load it from the web
import XElement from 'https://deno.land/x/element/x-element.js';
```

...or if you're fancy:
```
# use a package manager
npm install @netflix/x-element
```

## Project Philosophy:

1. No compilation step is necessary for adoption, just import `x-element.js`
2. Implement a minimal set of generalized functionality
3. Make as few design decisions as possible
4. Presume adopters are browser experts already (stay out of their way)
5. Follow web platform precedents whenever possible
6. Remain compatible with any browser which fully supports custom elements
7. Prioritize simple syntax and useful comments in the code itself
8. Zero dependencies

## Development:

```
npm install && npm start
```

Then...
* http://localhost:8080

See [SPEC.md](./doc/SPEC.md) for all the deets.

