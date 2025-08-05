# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm start` - Start development server on http://localhost:8080
- `npm run lint` - Run ESLint with zero warnings tolerance
- `npm run lint-fix` - Auto-fix ESLint issues
- `npm test` - Run tests with tap-parser formatting
- `npm run type` - Run TypeScript type checking
- `./bump.sh` - Bump version and create release

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

TypeScript definitions are generated and available in `/ts` directory:
- x-element.d.ts
- x-parser.d.ts  
- x-template.d.ts

## Demo Structure

The `/demo` directory contains examples showing different template engines and use cases:
- Basic hello-world example
- Chess piece component
- Performance comparisons with React, lit-html, uhtml
- Integration examples for different templating approaches