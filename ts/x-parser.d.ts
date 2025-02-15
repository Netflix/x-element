/** Strict HTML parser meant to handle interpolated HTML. */
export class XParser {
    static "__#1@#errorContextKey": symbol;
    /**
     * Additional error context.
     * @typedef {object} ErrorContext
     * @property {number} stringsIndex
     * @property {string} string
     * @property {number} stringIndex
     */
    /**
     * Get additional context for parsing errors.
     * @param {Error} error
     * @returns {ErrorContext|void}
     */
    static getErrorContext(error: Error): {
        stringsIndex: number;
        string: string;
        stringIndex: number;
    } | void;
    /**
     * Instantiation options.
     * @typedef {object} XParserOptions
     * @property {window} [window]
     */
    /**
     * Creates an XParser instance. Mock the “window” for validation-only usage.
     * @param {XParserOptions} [options]
     */
    constructor(options?: {
        window?: Window & typeof globalThis;
    });
    /**
     * The onBoolean callback.
     * @callback onBoolean
     * @param {string} attributeName
     * @param {number[]} path
     */
    /**
     * The onDefined callback.
     * @callback onDefined
     * @param {string} attributeName
     * @param {number[]} path
     */
    /**
     * The onAttribute callback.
     * @callback onAttribute
     * @param {string} attributeName
     * @param {number[]} path
     */
    /**
     * The onProperty callback.
     * @callback onProperty
     * @param {string} propertyName
     * @param {number[]} path
     */
    /**
     * The onContent callback.
     * @callback onContent
     * @param {number[]} path
     */
    /**
     * The onText callback.
     * @callback onText
     * @param {number[]} path
     */
    /**
     * The core parse function takes in the “strings” from a tagged template
     * function and returns a document fragment. The “on*” callbacks are an
     * optimization to allow a subscriber to store future lookups without
     * needing to re-walk the resulting document fragment.
     * @param {TemplateStringsArray} strings
     * @param {onBoolean} onBoolean
     * @param {onDefined} onDefined
     * @param {onAttribute} onAttribute
     * @param {onProperty} onProperty
     * @param {onContent} onContent
     * @param {onText} onText
     * @param {("svg"|"html")} [language]
     * @returns {DocumentFragment}
     */
    parse(strings: TemplateStringsArray, onBoolean: (attributeName: string, path: number[]) => any, onDefined: (attributeName: string, path: number[]) => any, onAttribute: (attributeName: string, path: number[]) => any, onProperty: (propertyName: string, path: number[]) => any, onContent: (path: number[]) => any, onText: (path: number[]) => any, language?: ("svg" | "html")): DocumentFragment;
    #private;
}
//# sourceMappingURL=x-parser.d.ts.map