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
    static #getErrorMessage(key: any): "Could not parse template markup (at template start)." | "Could not parse template markup (after text content)." | "Could not parse template markup (after a comment)." | "Could not parse template markup (after interpolated content)." | "Could not parse template markup (after a spacing within start tag)." | "Could not parse template markup (after a start tag)." | "Could not parse template markup (after a boolean attribute interpolation in a start tag)." | "Could not parse template markup (after a defined attribute interpolation in a start tag)." | "Could not parse template markup (after an attribute interpolation in a start tag)." | "Could not parse template markup (after a property interpolation in a start tag)." | "Could not parse template markup (after an end tag)." | "Invalid tag name - refer to https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#valid_custom_element_names)." | "Invalid tag whitespace (extraneous whitespace in start tag)." | "Invalid start tag (extraneous whitespace at close of start tag)." | "Invalid end tag." | "Invalid tag attribute (must use kebab-case names and double-quoted values)." | "Invalid tag attribute interpolation (must use kebab-case names and double-quoted values)." | "Invalid tag property interpolation (must use kebab-case names and double-quoted values)." | "Invalid closing quote on tag attribute or property." | "CDATA sections are not supported. Use character references instead: https://developer.mozilla.org/en-US/docs/Glossary/Character_reference." | "Bad escape in tagged template string. Use “&bsol;” for “\\”, “&dollar;” for “\\$”, and “&grave;” for “\\`”. All character references are supported: https://developer.mozilla.org/en-US/docs/Glossary/Character_reference." | "Ambiguous ampersand character or invalid hexadecimal character reference." | "Invalid comment. Comments cannot start with “>” or “->” characters, they cannot include a set of “--” characters, and they cannot end with a “-” character." | "Unsupported native tag - supported native tags are listed here: https://github.com/Netflix/x-element/blob/main/doc/TEMPLATES.md#supported-native-tags." | "Invalid end tag (all non-void start tags much have matching end tags)." | "Unsupported <textarea> interpolation. Interpolation must be exact (<textarea>${…}</textarea>)." | "Unsupported declarative shadow root on <template>. The “shadowrootmode” attribute is not supported." | "Missing closing quote on bound attribute or property." | undefined;
    static #getErrorMessageKeyFromValue(value: any): "#100" | "#101" | "#102" | "#103" | "#104" | "#105" | "#106" | "#107" | "#108" | "#109" | "#110" | undefined;
    static #getErrorMessageKeyFromValueMalformed(valueMalformed: any): "#120" | "#121" | "#122" | "#123" | "#124" | "#125" | "#126" | "#127" | undefined;
    static #getErrorMessageKeyFromValueForbidden(valueForbidden: any): "#140" | undefined;
    static #getErrorMessageKeyFromErrorName(errorName: any): "#150" | "#151" | "#152" | "#153" | "#154" | "#155" | "#156" | "#157" | undefined;
    static #try(string: any, stringIndex: any, ...values: any[]): any;
    static #forbiddenTransition(string: any, stringIndex: any, value: any): any;
    static #invalidTransition(string: any, stringIndex: any, value: any): any;
    static #validTransition(string: any, stringIndex: any, value: any): any;
    static #getErrorInfo(strings: any, stringsIndex: any, string: any, stringIndex: any): {
        parsed: any;
        notParsed: string;
    };
    static #throwTransitionError(strings: any, stringsIndex: any, string: any, stringIndex: any, value: any): void;
    static #validateRawString(rawString: any): void;
    static #validateExit(value: any, tagName: any): void;
    static #sendInnerTextTokens(onToken: any, string: any, index: any, start: any, end: any, plaintextType: any, referenceType: any): void;
    static #validateTagName(tagName: any): void;
    static #validateNoDeclarativeShadowRoots(tagName: any, attributeName: any): void;
    static #sendBoundTextTokens(onToken: any, stringsIndex: any, string: any, stringIndex: any, sloppyStartInterpolation: any): void;
    static #sendBoundContentTokens(onToken: any, stringsIndex: any, string: any, stringIndex: any): void;
    static #sendTextTokens(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static #sendCommentTokens(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static #sendStartTagOpenTokens(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): any;
    static #sendStartTagSpaceTokens(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static #sendDanglingQuoteTokens(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static #sendBooleanTokens(onToken: any, tagName: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static #sendAttributeTokens(onToken: any, tagName: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static #sendBoundBooleanTokens(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static #sendBoundDefinedTokens(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static #sendBoundAttributeTokens(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static #sendBoundPropertyTokens(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static #sendVoidElementTokens(onToken: any, stringsIndex: any, stringIndex: any, nextStringIndex: any): void;
    static #sendTextareaTokens(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): number;
    static #sendStartTagCloseTokens(onToken: any, stringsIndex: any, stringIndex: any, nextStringIndex: any): void;
    static #sendEndTagTokens(onToken: any, tagName: any, strings: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
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
     * @property {number} start
     * @property {number} end
     */
    /**
     * Get additional context for parsing errors.
     * @param {Error} error
     * @returns {ErrorContext|void}
     */
    static getErrorContext(error: Error): {
        index: number;
        start: number;
        end: number;
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