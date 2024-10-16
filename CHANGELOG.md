# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New support for static `styles` getter for `adoptedStyleSheets` ergonomics (#52).

### Fixed

- The `map` function now works with properties / attributes bound across template contexts (#179).
- The `x-element.d.ts` file now reflects the actual interface. Previously, it
  has some issues (e.g., improper module export).

### Changed

- The `x-element.js` file is now “typed” via JSDoc. The validity of the JSDoc
  comments are linted alongside the rest of the code and the annotations there
  are exported into a generated `x-element.d.ts` file. Previously, that file was
  hand-curated.

## [1.0.0] - 2024-02-29

### Added

- Initial interface for `1.x` is locked down.
