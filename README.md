```
  x-element
  _________
 / /__ __\ \
/ / \ \ / \ \
\ \ /_\_\ / /
 \_\_____/_/

```

A dead simple basis for custom elements. It provides the following functionality:

- Efficient DOM generation and data binding using your preferred [templating engine](./doc/TEMPLATES.md)
- Automatic `.property` to `[attribute]` reflection (opt-in)
- Automatic `[attribute]` to `.property` synchronization (one-directional, on connected)
- Simple and efficient property observation and computation
- Simple delegated event handling
- Useful error messages

## Installation:

Save a local copy to your project:
```bash
curl https://raw.githubusercontent.com/Netflix/x-element/main/x-element.js > x-element.js
curl https://raw.githubusercontent.com/Netflix/x-element/main/x-parser.js > x-parser.js
curl https://raw.githubusercontent.com/Netflix/x-element/main/x-template.js > x-template.js
```

Then import it:
```js
import XElement from '/path/to/x-element.js';
```

...or load it directly from the web:
```js
import XElement from 'https://deno.land/x/element/x-element.js';
```

...or use an [importmap](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap):
```html
<script type="importmap">
  {
    "imports": {
      "@netflix/x-element": "https://deno.land/x/element/x-element.js"
    }
  }
</script>
```

Then import it using a bare module specifier...
```js
import XElement from '@netflix/x-element';
```

...or use a package manager:
```bash
npm install @netflix/x-element
```

Then import it using a bare module specifier...
```js
import XElement from '@netflix/x-element';
```

## Project Philosophy:

1. No compilation step is necessary for adoption, just import `x-element.js`
2. Implement a minimal set of generalized functionality
3. Make as few design decisions as possible
4. Presume adopters are browser experts already (stay out of their way)
5. Follow web platform precedents whenever possible
6. Remain compatible with any browser which fully supports custom elements
7. Prioritize simple syntax and useful comments in the code itself
8. Avoid making developers learn new proprietary stuff
9. Zero dependencies

## Development:

```
npm install && npm start
```

Then...
* http://localhost:8080

See [SPEC.md](./doc/SPEC.md) for all the deets.

