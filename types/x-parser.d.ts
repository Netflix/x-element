/** Strict HTML parser meant to handle interpolated HTML. */
export class XParser {
    static #errorContextKey: symbol;
    static #delimiter: string;
    static #voidHtmlElements: Set<string>;
    static #htmlElements: Set<string>;
    static #deniedHtmlElements: Set<string>;
    static #allowedHtmlElements: Set<string>;
    static #initial: RegExp;
    static #boundContent: RegExp;
    static #text: RegExp;
    static #comment: RegExp;
    static #startTagOpen: RegExp;
    static #endTag: RegExp;
    static #startTagClose: RegExp;
    static #startTagSpace: RegExp;
    static #boolean: RegExp;
    static #attribute: RegExp;
    static #boundBoolean: RegExp;
    static #boundDefined: RegExp;
    static #boundAttribute: RegExp;
    static #boundProperty: RegExp;
    static #danglingQuote: RegExp;
    static #throughTextarea: RegExp;
    static #entity: RegExp;
    static #htmlEntityStart: RegExp;
    static #cdataStart: RegExp;
    static #startTagOpenMalformed: RegExp;
    static #startTagSpaceMalformed: RegExp;
    static #startTagCloseMalformed: RegExp;
    static #endTagMalformed: RegExp;
    static #booleanMalformed: RegExp;
    static #attributeMalformed: RegExp;
    static #boundBooleanMalformed: RegExp;
    static #boundDefinedMalformed: RegExp;
    static #boundAttributeMalformed: RegExp;
    static #boundPropertyMalformed: RegExp;
    static #danglingQuoteMalformed: RegExp;
    /**
     * Simple mapping of all the errors which can be thrown by the parser. The
     *  parsing errors are allotted numbers #100-#199.
     * @param {string | undefined} key
     * @returns {string | undefined}
     */
    static #getErrorMessage(key: string | undefined): string | undefined;
    /**
     * Block #100-#119 — Invalid transition errors.
     * @param {RegExp} value
     * @returns {string | undefined}
     */
    static #getErrorMessageKeyFromValue(value: RegExp): string | undefined;
    /**
     * Block #120-#139 — Common mistakes.
     * @param {RegExp} valueMalformed
     * @returns {string | undefined}
     */
    static #getErrorMessageKeyFromValueMalformed(valueMalformed: RegExp): string | undefined;
    /**
     * Block #140-#149 — Forbidden transitions.
     * @param {RegExp} valueForbidden
     * @returns {string | undefined}
     */
    static #getErrorMessageKeyFromValueForbidden(valueForbidden: RegExp): string | undefined;
    /**
     * Block #150+ — Special, named issues.
     * @param {string} errorName
     * @returns {string | undefined}
     */
    static #getErrorMessageKeyFromErrorName(errorName: string): string | undefined;
    /**
     * Returns the first valid state-machine transition (if one exists).
     * @param {string} string
     * @param {number} stringIndex
     * @param {...RegExp} values
     * @returns {RegExp | undefined}
     */
    static #try(string: string, stringIndex: number, ...values: RegExp[]): RegExp | undefined;
    /**
     * Special cases we want to warn about, but which are not just malformed
     *  versions of valid transitions.
     * @param {string} string
     * @param {number} stringIndex
     * @param {RegExp} value
     * @returns {RegExp | undefined}
     */
    static #forbiddenTransition(string: string, stringIndex: number, value: RegExp): RegExp | undefined;
    /**
     * This should roughly match our “valid” transition mapping, but for errors.
     * @param {string} string
     * @param {number} stringIndex
     * @param {RegExp} value
     * @returns {RegExp | undefined}
     */
    static #invalidTransition(string: string, stringIndex: number, value: RegExp): RegExp | undefined;
    /**
     * This is the core of the state machine. It describes every valid traversal
     *  through a set of html template “strings” array.
     * @param {string} string
     * @param {number} stringIndex
     * @param {RegExp} value
     * @returns {RegExp | undefined}
     */
    static #validTransition(string: string, stringIndex: number, value: RegExp): RegExp | undefined;
    /**
     * Common functionality to help print out template context when displaying
     *  helpful error messages to developers.
     * @param {TemplateStringsArray} strings
     * @param {number} stringsIndex
     * @param {string} string
     * @param {number} stringIndex
     * @returns {{ parsed: string, notParsed: string }}
     */
    static #getErrorInfo(strings: TemplateStringsArray, stringsIndex: number, string: string, stringIndex: number): {
        parsed: string;
        notParsed: string;
    };
    /**
     * When we cannot transition to a valid state in our state machine — we must
     *  throw an error. Because we have to halt execution anyhow, we can use it as
     *  an opportunity to test some additional patterns to improve our messaging.
     *  This would otherwise be non-performant — but we are about to error anyhow.
     * @param {TemplateStringsArray} strings
     * @param {number} stringsIndex
     * @param {string} string
     * @param {number} stringIndex
     * @param {RegExp} value
     * @returns {never}
     */
    static #throwTransitionError(strings: TemplateStringsArray, stringsIndex: number, string: string, stringIndex: number, value: RegExp): never;
    /**
     * Character escapes like “\n”, “\u” or “\x” are a JS-ism. We want developers
     *  to use HTML here, not JS. You can of course interpolate whatever you want.
     *  https://w3c.github.io/html-reference/syntax.html#character-encoding
     *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Character_escape
     * Note that syntax highlighters expect the text after the “html” tag to be
     *  real HTML. Another reason to reject JS-y unicode is that it won’t be
     *  interpreted correctly by tooling that expects _html_.
     * Escapes for the “$”, “\”, and “`” characters are required within a template
     *  literal — users will need to use “&dollar;”, “&bsol;”, and “&grave;”.
     * Examples:
     *  - ok: html`&#8230;`, html`&#x2026;`, html`&mldr;`, html`&hellip;`
     *  - not ok: html`\nhi\nthere`, html`\x8230`, html`\u2026`, html`\s\t\o\p\ \i\t\.`
     * @param {string} rawString
     */
    static #validateRawString(rawString: string): void;
    /**
     * Before a successful exit, the parser ensures that all non-void opening tags
     *  have been matched successfully to prevent any unexpected behavior.
     * @param {RegExp} value
     * @param {TagName} tagName
     */
    static #validateExit(value: RegExp, tagName: string | null): void;
    /**
     * Certain parts of an html document may contain character references (html
     *  entities). We find them via a performant pattern, and then parse them out
     *  via a non-performant pattern. This way, the cost is only as high as the
     *  number of character references used (which is often low).
     *  Note that malformed references or ambiguous ampersands will cause errors.
     *  https://html.spec.whatwg.org/multipage/named-characters.html
     * Note that we test against the “content”, but ensure to report tokens as
     *  compared to the original “string”. This is significantly more performant.
     * @param {onToken} onToken
     * @param {string} string
     * @param {number} index
     * @param {number} start
     * @param {number} end
     * @param {string} plaintextType
     * @param {string} referenceType
     */
    static #sendInnerTextTokens(onToken: (type: string, index: number, start: number, end: number, substring: string) => any, string: string, index: number, start: number, end: number, plaintextType: string, referenceType: string): void;
    /**
     * In addition to the allow-list of html tag names, any tag with a hyphen in
     *  the middle is considered a valid custom element. Therefore, we must allow
     *  for such declarations.
     * @param {string} tagName
     */
    static #validateTagName(tagName: string): void;
    /**
     * This validates a specific case where we need to reject “template” elements
     *  which have “declarative shadow roots” via a “shadowrootmode” attribute.
     * @param {TagName} tagName
     * @param {string} attributeName
     */
    static #validateNoDeclarativeShadowRoots(tagName: string | null, attributeName: string): void;
    /**
     * This can only happen with a “textarea” element, currently. Note that the
     *  subscriber is notified about this as a “text” binding not a “content”
     *  binding so that it correctly bind _any_ interpolated value to the
     *  “textContent” property as a string — no matter the type.
     * @param {onToken} onToken
     * @param {number} stringsIndex
     * @param {string} string
     * @param {number} stringIndex
     * @param {boolean} sloppyStartInterpolation
     */
    static #sendBoundTextTokens(onToken: (type: string, index: number, start: number, end: number, substring: string) => any, stringsIndex: number, string: string, stringIndex: number, sloppyStartInterpolation: boolean): void;
    /**
     * Bound content is simply an interpolation in the template which exists in a
     *  location destined to be bound as “textContent” on some node.
     * @param {onToken} onToken
     * @param {number} stringsIndex
     * @param {string} string
     * @param {number} stringIndex
     */
    static #sendBoundContentTokens(onToken: (type: string, index: number, start: number, end: number, substring: string) => any, stringsIndex: number, string: string, stringIndex: number): void;
    /**
     * This handles literal text in a template that needs to become text content.
     * @param {onToken} onToken
     * @param {number} stringsIndex
     * @param {string} string
     * @param {number} stringIndex
     * @param {number} nextStringIndex
     */
    static #sendTextTokens(onToken: (type: string, index: number, start: number, end: number, substring: string) => any, stringsIndex: number, string: string, stringIndex: number, nextStringIndex: number): void;
    /**
     * A comment is just a basic html comment. Comments may not be interpolated
     *  and follow some specific rules from the html specification. Note that
     *  character references are not replaced in comments.
     *  https://w3c.github.io/html-reference/syntax.html#comments
     * @param {onToken} onToken
     * @param {number} stringsIndex
     * @param {string} string
     * @param {number} stringIndex
     * @param {number} nextStringIndex
     */
    static #sendCommentTokens(onToken: (type: string, index: number, start: number, end: number, substring: string) => any, stringsIndex: number, string: string, stringIndex: number, nextStringIndex: number): void;
    /**
     * The beginning of a start tag — e.g., “<div”.
     * @param {onToken} onToken
     * @param {number} stringsIndex
     * @param {string} string
     * @param {number} stringIndex
     * @param {number} nextStringIndex
     * @returns {string}
     */
    static #sendStartTagOpenTokens(onToken: (type: string, index: number, start: number, end: number, substring: string) => any, stringsIndex: number, string: string, stringIndex: number, nextStringIndex: number): string;
    /**
     * Simple spaces and newlines withing a start tag.
     * @param {onToken} onToken
     * @param {number} stringsIndex
     * @param {string} string
     * @param {number} stringIndex
     * @param {number} nextStringIndex
     */
    static #sendStartTagSpaceTokens(onToken: (type: string, index: number, start: number, end: number, substring: string) => any, stringsIndex: number, string: string, stringIndex: number, nextStringIndex: number): void;
    /**
     * A single double-quote after a binding in a start tag.
     * @param {onToken} onToken
     * @param {number} stringsIndex
     * @param {string} string
     * @param {number} stringIndex
     * @param {number} nextStringIndex
     */
    static #sendDanglingQuoteTokens(onToken: (type: string, index: number, start: number, end: number, substring: string) => any, stringsIndex: number, string: string, stringIndex: number, nextStringIndex: number): void;
    /**
     * A boolean is a literal boolean attribute declaration with no value.
     * @param {onToken} onToken
     * @param {TagName} tagName
     * @param {number} stringsIndex
     * @param {string} string
     * @param {number} stringIndex
     * @param {number} nextStringIndex
     */
    static #sendBooleanTokens(onToken: (type: string, index: number, start: number, end: number, substring: string) => any, tagName: string | null, stringsIndex: number, string: string, stringIndex: number, nextStringIndex: number): void;
    /**
     * An attribute is a literal attribute declaration. It has an associated value
     *  which forms a key-value pair.
     * @param {onToken} onToken
     * @param {TagName} tagName
     * @param {number} stringsIndex
     * @param {string} string
     * @param {number} stringIndex
     * @param {number} nextStringIndex
     */
    static #sendAttributeTokens(onToken: (type: string, index: number, start: number, end: number, substring: string) => any, tagName: string | null, stringsIndex: number, string: string, stringIndex: number, nextStringIndex: number): void;
    /**
     * A bound boolean is a boolean attribute flag with an associated value
     *  binding. It has a single, preceding “?” character.
     * @param {onToken} onToken
     * @param {number} stringsIndex
     * @param {string} string
     * @param {number} stringIndex
     * @param {number} nextStringIndex
     */
    static #sendBoundBooleanTokens(onToken: (type: string, index: number, start: number, end: number, substring: string) => any, stringsIndex: number, string: string, stringIndex: number, nextStringIndex: number): void;
    /**
     * Similar to a bound boolean, but with two preceding “??” characters. We
     *  notify subscribers about this attribute which exists only when defined.
     * @param {onToken} onToken
     * @param {number} stringsIndex
     * @param {string} string
     * @param {number} stringIndex
     * @param {number} nextStringIndex
     */
    static #sendBoundDefinedTokens(onToken: (type: string, index: number, start: number, end: number, substring: string) => any, stringsIndex: number, string: string, stringIndex: number, nextStringIndex: number): void;
    /**
     * This is an attribute with a name / value pair where the “value” is bound
     *  as an interpolation.
     * @param {onToken} onToken
     * @param {number} stringsIndex
     * @param {string} string
     * @param {number} stringIndex
     * @param {number} nextStringIndex
     */
    static #sendBoundAttributeTokens(onToken: (type: string, index: number, start: number, end: number, substring: string) => any, stringsIndex: number, string: string, stringIndex: number, nextStringIndex: number): void;
    /**
     * This is an property with a name / value pair where the “value” is bound
     *  as an interpolation.
     * @param {onToken} onToken
     * @param {number} stringsIndex
     * @param {string} string
     * @param {number} stringIndex
     * @param {number} nextStringIndex
     */
    static #sendBoundPropertyTokens(onToken: (type: string, index: number, start: number, end: number, substring: string) => any, stringsIndex: number, string: string, stringIndex: number, nextStringIndex: number): void;
    /**
     * Because void elements to not have an end tag, we close them slightly
     *  differently so downstream consumers can track DOM paths easily.
     * @param {onToken} onToken
     * @param {number} stringsIndex
     * @param {number} stringIndex
     * @param {number} nextStringIndex
     */
    static #sendVoidElementTokens(onToken: (type: string, index: number, start: number, end: number, substring: string) => any, stringsIndex: number, stringIndex: number, nextStringIndex: number): void;
    /**
     * Textarea contains so-called “replaceable” character data. We throw an error
     *  if a “complex” interpolation exists — anything other than a perfectly-fit
     *  content interpolation between the opening and closing tags.
     * @param {onToken} onToken
     * @param {number} stringsIndex
     * @param {string} string
     * @param {number} stringIndex
     * @param {number} nextStringIndex
     * @returns {number}
     */
    static #sendTextareaTokens(onToken: (type: string, index: number, start: number, end: number, substring: string) => any, stringsIndex: number, string: string, stringIndex: number, nextStringIndex: number): number;
    /**
     * Literally just indicating the “>” to close a start tag.
     * @param {onToken} onToken
     * @param {number} stringsIndex
     * @param {number} stringIndex
     * @param {number} nextStringIndex
     */
    static #sendStartTagCloseTokens(onToken: (type: string, index: number, start: number, end: number, substring: string) => any, stringsIndex: number, stringIndex: number, nextStringIndex: number): void;
    /**
     * An end tag — e.g., “</div>”.
     * @param {onToken} onToken
     * @param {TagName} tagName
     * @param {TemplateStringsArray} strings
     * @param {number} stringsIndex
     * @param {string} string
     * @param {number} stringIndex
     * @param {number} nextStringIndex
     */
    static #sendEndTagTokens(onToken: (type: string, index: number, start: number, end: number, substring: string) => any, tagName: string | null, strings: TemplateStringsArray, stringsIndex: number, string: string, stringIndex: number, nextStringIndex: number): void;
    static tokenTypes: {
        startTagOpen: string;
        startTagSpace: string;
        startTagEquals: string;
        startTagQuote: string;
        startTagClose: string;
        voidTagClose: string;
        boundBooleanPrefix: string;
        boundDefinedPrefix: string;
        boundPropertyPrefix: string;
        endTagOpen: string;
        endTagClose: string;
        commentOpen: string;
        commentClose: string;
        startTagName: string;
        endTagName: string;
        comment: string;
        attributeName: string;
        booleanName: string;
        textStart: string;
        textReference: string;
        textPlaintext: string;
        textEnd: string;
        attributeValueStart: string;
        attributeValueReference: string;
        attributeValuePlaintext: string;
        attributeValueEnd: string;
        boundAttributeName: string;
        boundBooleanName: string;
        boundDefinedName: string;
        boundPropertyName: string;
        boundTextValue: string;
        boundContentValue: string;
        boundAttributeValue: string;
        boundBooleanValue: string;
        boundDefinedValue: string;
        boundPropertyValue: string;
    };
    /**
     * Additional error context.
     * @typedef {object} ErrorContext
     * @property {number} index
     * @property {number | null} start
     * @property {number | null} end
     */
    /**
     * A tag name, or null when at root level (not inside any tag).
     * @typedef {string | null} TagName
     */
    /**
     * Get additional context for parsing errors.
     * @param {Error} error
     * @returns {ErrorContext|void}
     */
    static getErrorContext(error: Error): {
        index: number;
        start: number | null;
        end: number | null;
    } | void;
    /**
     * Main parsing callback.
     * @callback onToken
     * @param {string} type
     * @param {number} index
     * @param {number} start
     * @param {number} end
     * @param {string} substring
     */
    /**
     * The core parse function takes in the “strings” from a tagged template
     * function and returns an array of tokens representing the parsed result.
     * @param {TemplateStringsArray} strings
     * @param {onToken} onToken
     */
    static parse(strings: TemplateStringsArray, onToken: (type: string, index: number, start: number, end: number, substring: string) => any): void;
}
//# sourceMappingURL=x-parser.d.ts.map