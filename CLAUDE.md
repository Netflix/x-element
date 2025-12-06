# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm start` - Start development server on http://localhost:8080
- `npm run lint` - Run ESLint with zero warnings tolerance
- `npm run lint-fix` - Auto-fix ESLint issues
- `npm test` - Run tests with tap-parser formatting
- `npm run type` - Run TypeScript type checking
- `npm run performance` - Run automated performance tests via puppeteer (requires server to be running)
- `./bump.sh` - Bump version and create release

## Performance Testing

The `npm run performance` command runs automated performance tests using puppeteer. It requires the development server to be running (`npm start`) and supports these options:

- `--frames=<number>` - Number of animation frames to run (default: 100)
- `--delay=<number>` - Delay between test phases in ms (default: 1000) 
- `--timing=<mode>` - Timing mode: 'raf' or 'fixed' (default: 'fixed')
- `--skip=<group>` - Skip test group: 'inject', 'initial', or 'update'

Examples:
```bash
npm run performance
npm run performance -- --frames=50 --timing=raf
npm run performance -- --skip=inject --skip=initial
```

Results are saved to:
- `performance/performance.json` - Standard performance results
- `performance/performance-profile.json` - Detailed profiling data (if profiling is enabled)

**Important Performance Testing Notes:**
- Use the `--profile=true` flag to focus on this library's performance (chrome profiling results are also output).
- Performance results can be volatile and unstable with default settings
- For reliable measurements when optimizing, use more frames: `--frames=200` or higher
- Run tests multiple times and compare medians to account for noise
- System load, browser state, and other factors affect timing measurements
- Focus on consistent trends across multiple runs rather than single measurements
- **Always confirm your performance testing findings with a larger `--frames` count. And, run it twice to be very certain. It's easy for a single run to produce poor results and lead you astray!**

## Development Server Assumptions

- You can assume that the development server will already be running. This is standard for developers to do in this repository.

## Core Architecture

This is **x-element**, a minimal custom element base class library built on web standards with zero dependencies. The architecture consists of three main modules:

### Core Files

1. **x-element.js** - Main XElement base class
   - Provides property system with reflection, observation, and computed properties
   - Manages element lifecycle (constructor analysis, initialization, updates)
   - Handles templating integration and DOM rendering
   - Supports declarative event listeners

2. **x-parser.js** - HTML template parser
   - Strict parser for tagged template literals
   - Validates HTML structure and prevents common mistakes
   - Generates tokens for template engine consumption
   - Supports custom element names and standard HTML elements

3. **x-template.js** - Default template engine
   - Efficient DOM diffing and updates
   - Supports various binding types (attributes, properties, content, boolean)
   - Handles arrays, keyed lists, and nested templates
   - Character reference decoding and fragment management

### Property System

Properties have extensive configuration options:
- `type` - Type checking and coercion
- `attribute` - Attribute-property synchronization
- `reflect` - Property-to-attribute reflection
- `compute`/`input` - Computed properties with dependencies
- `observe` - Property change callbacks
- `initial`/`default` - Default value handling
- `readOnly`/`internal` - Access control

### Template System

- Uses native template literals with `html` tagged templates
- Supports interpolation in text content, attributes, and properties
- Special syntax: `?attr` (boolean), `??attr` (defined), `.prop` (property)
- Automatic DOM diffing and minimal updates
- Built-in support for arrays and keyed lists

## Testing

Tests are located in `/test` directory with individual HTML files for each test suite. Tests use a custom testing framework (@netflix/x-test) and run in the browser environment.

### Test Execution

- To test a specific test, you should test through `npm test` and then find the relevant lines in the output.

## Project Philosophy

1. Zero compilation step required
2. Minimal, generalized functionality
3. Few opinionated design decisions
4. Assumes browser expertise (stays out of the way)
5. Follows web platform precedents
6. Compatible with all modern browsers supporting custom elements
7. Simple, commented code
8. No proprietary learning required
9. Zero dependencies

## TypeScript Support

TypeScript definitions are generated and available in `/types` directory:
- x-element.d.ts
- x-parser.d.ts  
- x-template.d.ts

## Demo Structure

The `/demo` directory contains examples showing different template engines and use cases:
- Basic hello-world example
- Chess piece component
- Performance comparisons with React, lit-html, uhtml
- Integration examples for different templating approaches

## Browser and Node Targets

The `x-parser.js` file should be valid in the latest LTS for Node and the latest
versions of Chrome, Firefox, and Safari. The `x-template.js` and `x-element.js`
files should be valid in the latest versions of Chrome, Firefox, and Safari.

## Performance Insights

- Simple looping functions are more performant than even loops like `for .. of`
- Switch statements are more performant for small enumerations of known values than a map, the browser heavily optimizes this

## File Fetching and Server Root

- The files that you may want to fetch from the server are _exactly_ the files in the repository where you should consider the project root as equivalent to the web server root. I.e., you do not need to web-fetch the test links to look at the code, you can just read the files in the repository.

## DOM Manipulation Strategies

- While it might be tempting to stop using comments as DOM cursors — the current two-cursor approach offers robustness and predictability for DOM manipulation.

## Miscellaneous Development Tips

- Use the `--suffix` argument to save things like `--suffix=before` and `--suffix=after` for easier A/B testing. Don't forget to clean up these files after you are finished with all your tasks.
```