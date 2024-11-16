# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- You can now bind attributes with `??foo="${bar}"` syntax. This is functionally
  equivalent to the `nullish` updater and will replace that functionality later.
- A new `unsafe` updater was added to replace `unsafeHTML` and `unsafeSVG`. You
  use it like `unsafe(value, 'html')` and `unsafe(value, 'svg')`.

### Changed

- Template errors now include approximate line numbers from the offending
  template. They also print the registered custom element tag name (#201).
- The `ifDefined` updater now deletes the attribute on `null` in addition to
  `undefined`. This makes it behave identically to `nullish`. However, both
  updaters are deprecated and the `??attr` binding should be used instead.
- Interpolation of `textarea` is stricter. This used to be handled with some
  leniency — `<textarea>\n ${value} \n</textarea>`. Now, you have to fit the
  interpolation exactly — `<textarea></textarea>`.

### Deprecated

- The `ifDefined` and `nullish` updaters are deprecated, update templates to use
  syntax like `??foo="${bar}"`.
- The `repeat` updater is deprecated, use `map` instead.
- The `unsafeHTML` and `unsafeSVG` updaters are deprecated, use `unsafe`.
- The `plaintext` tag is no longer handled. This is a deprecated html tag which
  required special handling… but it’s unlikely that anyone is using that.

### Fixed

- Transitions from different content values should all now work. For example,
  you previously could not change from a text value to an array. Additionally,
  state is properly cleared when going from one value type to another — e.g.,
  when going from `unsafe` back to `null`.
- The `map` updater throws immediately when given non-array input. Previously,
  it only threw _just before_ it was bound as content.
- Dummy content cursor is no longer appended to end of template. This was an
  innocuous off-by-one error when creating instrumented html from the tagged
  template strings.

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
