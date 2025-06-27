# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- The current “forgiving” html parser is replaced for a more “unforgiving” html
  parser in the default template engine. This is stricter in terms of what
  elements are allowed, the formatting of the html, the lower-casing of names,
  and the usage of spaces and newlines (#239).
- There are now three files in this repo — “x-element.js” which is all about
  element interfaces, “x-template.js” which is all about DOM management, and
  “x-parser.js” which is all about interpolated html markup interpretation.

### Removed

- The `unsafeHTML`, `live`, `nullish`, and `map` updaters are gone (#208, #216).
- The `<style>` element is now restricted. The spec and conventions for `style`
  differ a lot from `html` and a faster / more-maintainable parser can be built
  if we stop supporting this (#237).
- The `<svg>` element, the `unsafeSVG` updater, and the `svg` tagged template
  function are gone. The spec and conventions for `svg` differ a lot from `html`
  and a faster / more-maintainable parser can be built if we stop supporting
  this (#236).
- Support for the `<math>` element is removed from the default template engine.
  This worked before because `innerHTML` was being used under-the-hood. But a
  strict allow-list is now used to accomplish parsing (#238).
- Support for CDATA sections is removed. Authors should prefer to use character
  references (html entities) instead. Previously, this was implicitly supported
  due to underlying usage of `innerHTML`, but is now strictly forbidden (#241).
- Reject JS-y unicode escapes in html template strings. E.g., you cannot write
  something like `this\u2026` — instead, you would have to write something like
  `this&hellip;`, or `this&#x2026;`, etc. This mirrors the html spec (#242).
- Restrict element tags to an allow-list of what we’re willing to parse in the
  default template engine. This causes us to reject elements like `<title>`,
  `<body>`, `<link>`, `<script>`, `<canvas>`, `<meta>`, etc. (#239).

### Fixed

- When re-rendering a mapping where elements at the beginning or end have been
  removed — no disconnect / connect lifecycle events will occur. Previously,
  because we didn’t specifically guard this case, the low-level APIs would cause
  this to occur, which is unexpected from an integration standpoint (#253).
- When re-rendering arrays of changing length, where the length is getting
  smaller or is zero — the internal bookkeeping was getting messed up. This
  caused runtime errors in these cases (#303).

## [1.1.2] - 2024-12-16

### Added

- You can now bind attributes with `??foo="${bar}"` syntax in the default
  template engine. This is functionally equivalent to the `nullish` updater from
  the default template engine and will replace that functionality later (#204).

### Changed

- Template errors now include approximate line numbers from the offending
  template in the default template engine. They also print the registered custom
  element tag name (#201).
- The `ifDefined` updater now deletes the attribute on `null` in addition to
  `undefined` in the default template engine. This makes it behave identically
  to `nullish` in the default template engine. However, both updaters are
  deprecated — the `??attr` binding should be used instead when using the
  default template engine (#204).
- Interpolation of `textarea` is more strict in the default template engine.
  This used to be handled with some leniency for newlines in templates —
  `<textarea>\n ${value} \n</textarea>`. Now, you have to interpolate exactly —
  `<textarea>${value}</textarea>` (#219).
- You may now bind values of type `DocumentFragment` within the template engine.
  In particular, this was added to enable advanced flows without needing to
  bloat the default template engine interface (#207, #216).
- Pull “x-template.js” into a separate file. Conceptually it solves a totally
  different problem than “x-element” (#226).
- Throw immediately with parsing errors in default template engine. This is done
  as an improvement to developer feedback (#233).

### Deprecated

- The `ifDefined` and `nullish` updaters are deprecated, update templates to use
  syntax like `??foo="${bar}"` (#204).
- The `repeat` and `map` updaters are deprecated, use native arrays (#204).
- The `unsafeHTML` and `unsafeSVG` updaters are deprecated, bind a
  `DocumentFragment` value instead (#207, #216).
- The `plaintext` tag is no longer handled. This is a deprecated html tag which
  required special handling… but it’s unlikely that anyone is using that (#220).
- The `live` updater is deprecated. Use a delegated event listener for the
  `change` event if you need tight control over DOM state in forms (#208).

### Fixed

- Transitions from different content values should all now work for the default
  template engine. For example, you previously could not change from a text
  value to an array. Additionally, state is properly cleared when going from one
  value type to another — e.g., when going from `unsafe` back to `null` (#223).
- The `map` updater throws immediately when given non-array input for the
  default template engine. Previously, it only threw when it was bound (#222).
- The `map` updater throws if the return value from the provided `identify`
  callback returns a duplicate value (#218).
- Dummy content cursor is no longer appended to end of template for the default
  template engine. This was an innocuous off-by-one error when creating
  instrumented html from the tagged template strings (#221).

## [1.1.1] - 2024-11-09

### Fixed

- The default template engine now renders _fully_ depth-first. Previously, this
  could lead to bugs where a child element’s `connectedCallback` would be called
  before initial dom updates could be applied. In particular, this caused issues
  with default initial values causing unexpected `observe` callbacks (#197).

## [1.1.0] - 2024-10-18

### Added

- New support for static `styles` getter for `adoptedStyleSheets` ergonomics
  (#52).

### Changed

- The `x-element.js` file is now “typed” via JSDoc. The validity of the JSDoc
  comments are linted alongside the rest of the code and the annotations there
  are exported into a generated `x-element.d.ts` file. Previously, that file was
  hand-curated.

### Fixed

- The `map` function now works with properties / attributes bound across
  template contexts (#179).
- The `x-element.d.ts` file now reflects the actual interface. Previously, it
  has some issues (e.g., improper module export).

## [1.0.0] - 2024-02-29

### Added

- Initial interface for `1.x` is locked down.
