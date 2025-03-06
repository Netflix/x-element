/** Strict HTML parser meant to handle interpolated HTML. */
export class XParser {
    static "__#1@#errorContextKey": symbol;
    static "__#1@#delimiter": string;
    static "__#1@#voidHtmlElements": Set<string>;
    static "__#1@#htmlElements": Set<string>;
    static "__#1@#deniedHtmlElements": Set<string>;
    static "__#1@#allowedHtmlElements": Set<string>;
    static "__#1@#initial": RegExp;
    static "__#1@#boundContent": RegExp;
    static "__#1@#text": RegExp;
    static "__#1@#comment": RegExp;
    static "__#1@#startTagOpen": RegExp;
    static "__#1@#endTag": RegExp;
    static "__#1@#startTagClose": RegExp;
    static "__#1@#startTagSpace": RegExp;
    static "__#1@#boolean": RegExp;
    static "__#1@#attribute": RegExp;
    static "__#1@#boundBoolean": RegExp;
    static "__#1@#boundDefined": RegExp;
    static "__#1@#boundAttribute": RegExp;
    static "__#1@#boundProperty": RegExp;
    static "__#1@#danglingQuote": RegExp;
    static "__#1@#throughTextarea": RegExp;
    static "__#1@#entity": RegExp;
    static "__#1@#htmlEntityStart": RegExp;
    static "__#1@#cdataStart": RegExp;
    static "__#1@#startTagOpenMalformed": RegExp;
    static "__#1@#startTagSpaceMalformed": RegExp;
    static "__#1@#startTagCloseMalformed": RegExp;
    static "__#1@#endTagMalformed": RegExp;
    static "__#1@#booleanMalformed": RegExp;
    static "__#1@#attributeMalformed": RegExp;
    static "__#1@#boundBooleanMalformed": RegExp;
    static "__#1@#boundDefinedMalformed": RegExp;
    static "__#1@#boundAttributeMalformed": RegExp;
    static "__#1@#boundPropertyMalformed": RegExp;
    static "__#1@#danglingQuoteMalformed": RegExp;
    static "__#1@#getErrorMessage"(key: any): "Could not parse template markup (at template start)." | "Could not parse template markup (after text content)." | "Could not parse template markup (after a comment)." | "Could not parse template markup (after interpolated content)." | "Could not parse template markup (after a start tag name)." | "Could not parse template markup (after a spacing within start tag)." | "Could not parse template markup (after a start tag)." | "Could not parse template markup (after a boolean attribute in a start tag)." | "Could not parse template markup (after an attribute in a start tag)." | "Could not parse template markup (after a boolean attribute interpolation in a start tag)." | "Could not parse template markup (after a defined attribute interpolation in a start tag)." | "Could not parse template markup (after an attribute interpolation in a start tag)." | "Could not parse template markup (after a property interpolation in a start tag)." | "Could not parse template markup (after the closing quote of an interpolated attribute or property in a start tag)." | "Could not parse template markup (after an end tag)." | "Invalid tag name - refer to https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#valid_custom_element_names)." | "Invalid tag whitespace (extraneous whitespace in start tag)." | "Invalid start tag (extraneous whitespace at close of start tag)." | "Invalid end tag." | "Invalid tag attribute (must use kebab-case names and double-quoted values)." | "Invalid tag attribute interpolation (must use kebab-case names and double-quoted values)." | "Invalid tag property interpolation (must use kebab-case names and double-quoted values)." | "Invalid closing quote on tag attribute or property." | "CDATA sections are not supported. Use character references instead: https://developer.mozilla.org/en-US/docs/Glossary/Character_reference." | "Bad escape in tagged template string. Use “&bsol;” for “\\”, “&dollar;” for “\\$”, and “&grave;” for “\\`”. All character references are supported: https://developer.mozilla.org/en-US/docs/Glossary/Character_reference." | "Ambiguous ampersand character or invalid hexadecimal character reference." | "Invalid comment. Comments cannot start with “>” or “->” characters, they cannot include a set of “--” characters, and they cannot end with a “-” character." | "Unsupported native tag - supported native tags are listed here: https://github.com/Netflix/x-element/blob/main/doc/TEMPLATES.md#supported-native-tags." | "Invalid closing tag (all non-void start tags much have matching end tags)." | "Unsupported <textarea> interpolation. Interpolation must be exact (<textarea>${…}</textarea>)." | "Unsupported declarative shadow root on <template>. The “shadowrootmode” attribute is not supported.";
    static "__#1@#getErrorMessageKeyFromValue"(value: any): "#100" | "#101" | "#102" | "#103" | "#104" | "#105" | "#106" | "#107" | "#108" | "#109" | "#110" | "#111" | "#112" | "#113" | "#114";
    static "__#1@#getErrorMessageKeyFromValueMalformed"(valueMalformed: any): "#120" | "#121" | "#122" | "#123" | "#124" | "#125" | "#126" | "#127" | "#128" | "#129" | "#130";
    static "__#1@#getErrorMessageKeyFromValueForbidden"(valueForbidden: any): string;
    static "__#1@#getErrorMessageKeyFromErrorName"(errorName: any): "#150" | "#151" | "#152" | "#153" | "#154" | "#155" | "#156" | "#157";
    static "__#1@#try"(string: any, stringIndex: any, ...values: any[]): any;
    static "__#1@#forbiddenTransition"(string: any, stringIndex: any, value: any): any;
    static "__#1@#invalidTransition"(string: any, stringIndex: any, value: any): any;
    static "__#1@#validTransition"(string: any, stringIndex: any, value: any): any;
    static "__#1@#getErrorInfo"(strings: any, stringsIndex: any, string: any, stringIndex: any): {
        parsed: any;
        notParsed: string;
    };
    static "__#1@#throwTransitionError"(strings: any, stringsIndex: any, string: any, stringIndex: any, value: any): void;
    static "__#1@#validateRawString"(rawString: any): void;
    static "__#1@#validateExit"(tagName: any): void;
    static "__#1@#sendInnerTextTokens"(onToken: any, string: any, index: any, start: any, end: any, plaintextType: any, referenceType: any): void;
    static "__#1@#validateTagName"(tagName: any): void;
    static "__#1@#validateNoDeclarativeShadowRoots"(tagName: any, attributeName: any): void;
    static "__#1@#sendBoundTextTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, sloppyStartInterpolation: any): void;
    static "__#1@#sendBoundContentTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any): void;
    static "__#1@#sendTextTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#1@#sendCommentTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#1@#sendStartTagOpenTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): any;
    static "__#1@#sendStartTagSpaceTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#1@#sendDanglingQuoteTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#1@#sendBooleanTokens"(onToken: any, tagName: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#1@#sendAttributeTokens"(onToken: any, tagName: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#1@#sendBoundBooleanTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#1@#sendBoundDefinedTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#1@#sendBoundAttributeTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#1@#sendBoundPropertyTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#1@#sendVoidElementTokens"(onToken: any, stringsIndex: any, stringIndex: any, nextStringIndex: any): void;
    static "__#1@#sendTextareaTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): number;
    static "__#1@#sendStartTagCloseTokens"(onToken: any, stringsIndex: any, stringIndex: any, nextStringIndex: any): void;
    static "__#1@#sendEndTagTokens"(onToken: any, tagName: any, strings: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
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
     * @param {*} strings
     * @param {onToken} onToken
     */
    static parse(strings: any, onToken: (type: string, index: number, start: number, end: number, substring: string) => any): void;
}
//# sourceMappingURL=x-parser.d.ts.map