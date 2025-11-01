/** Strict HTML parser meant to handle interpolated HTML. */
export class XParser {
    static "__#private@#errorContextKey": symbol;
    static "__#private@#delimiter": string;
    static "__#private@#voidHtmlElements": Set<string>;
    static "__#private@#htmlElements": Set<string>;
    static "__#private@#deniedHtmlElements": Set<string>;
    static "__#private@#allowedHtmlElements": Set<string>;
    static "__#private@#initial": RegExp;
    static "__#private@#boundContent": RegExp;
    static "__#private@#text": RegExp;
    static "__#private@#comment": RegExp;
    static "__#private@#startTagOpen": RegExp;
    static "__#private@#endTag": RegExp;
    static "__#private@#startTagClose": RegExp;
    static "__#private@#startTagSpace": RegExp;
    static "__#private@#boolean": RegExp;
    static "__#private@#attribute": RegExp;
    static "__#private@#boundBoolean": RegExp;
    static "__#private@#boundDefined": RegExp;
    static "__#private@#boundAttribute": RegExp;
    static "__#private@#boundProperty": RegExp;
    static "__#private@#danglingQuote": RegExp;
    static "__#private@#throughTextarea": RegExp;
    static "__#private@#entity": RegExp;
    static "__#private@#htmlEntityStart": RegExp;
    static "__#private@#cdataStart": RegExp;
    static "__#private@#startTagOpenMalformed": RegExp;
    static "__#private@#startTagSpaceMalformed": RegExp;
    static "__#private@#startTagCloseMalformed": RegExp;
    static "__#private@#endTagMalformed": RegExp;
    static "__#private@#booleanMalformed": RegExp;
    static "__#private@#attributeMalformed": RegExp;
    static "__#private@#boundBooleanMalformed": RegExp;
    static "__#private@#boundDefinedMalformed": RegExp;
    static "__#private@#boundAttributeMalformed": RegExp;
    static "__#private@#boundPropertyMalformed": RegExp;
    static "__#private@#danglingQuoteMalformed": RegExp;
    static "__#private@#getErrorMessage"(key: any): "Could not parse template markup (at template start)." | "Could not parse template markup (after text content)." | "Could not parse template markup (after a comment)." | "Could not parse template markup (after interpolated content)." | "Could not parse template markup (after a spacing within start tag)." | "Could not parse template markup (after a start tag)." | "Could not parse template markup (after a boolean attribute interpolation in a start tag)." | "Could not parse template markup (after a defined attribute interpolation in a start tag)." | "Could not parse template markup (after an attribute interpolation in a start tag)." | "Could not parse template markup (after a property interpolation in a start tag)." | "Could not parse template markup (after an end tag)." | "Invalid tag name - refer to https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#valid_custom_element_names)." | "Invalid tag whitespace (extraneous whitespace in start tag)." | "Invalid start tag (extraneous whitespace at close of start tag)." | "Invalid end tag." | "Invalid tag attribute (must use kebab-case names and double-quoted values)." | "Invalid tag attribute interpolation (must use kebab-case names and double-quoted values)." | "Invalid tag property interpolation (must use kebab-case names and double-quoted values)." | "Invalid closing quote on tag attribute or property." | "CDATA sections are not supported. Use character references instead: https://developer.mozilla.org/en-US/docs/Glossary/Character_reference." | "Bad escape in tagged template string. Use “&bsol;” for “\\”, “&dollar;” for “\\$”, and “&grave;” for “\\`”. All character references are supported: https://developer.mozilla.org/en-US/docs/Glossary/Character_reference." | "Ambiguous ampersand character or invalid hexadecimal character reference." | "Invalid comment. Comments cannot start with “>” or “->” characters, they cannot include a set of “--” characters, and they cannot end with a “-” character." | "Unsupported native tag - supported native tags are listed here: https://github.com/Netflix/x-element/blob/main/doc/TEMPLATES.md#supported-native-tags." | "Invalid end tag (all non-void start tags much have matching end tags)." | "Unsupported <textarea> interpolation. Interpolation must be exact (<textarea>${…}</textarea>)." | "Unsupported declarative shadow root on <template>. The “shadowrootmode” attribute is not supported." | "Missing closing quote on bound attribute or property.";
    static "__#private@#getErrorMessageKeyFromValue"(value: any): "#100" | "#101" | "#102" | "#103" | "#104" | "#105" | "#106" | "#107" | "#108" | "#109" | "#110";
    static "__#private@#getErrorMessageKeyFromValueMalformed"(valueMalformed: any): "#120" | "#121" | "#122" | "#123" | "#124" | "#125" | "#126" | "#127";
    static "__#private@#getErrorMessageKeyFromValueForbidden"(valueForbidden: any): string;
    static "__#private@#getErrorMessageKeyFromErrorName"(errorName: any): "#150" | "#151" | "#152" | "#153" | "#154" | "#155" | "#156" | "#157";
    static "__#private@#try"(string: any, stringIndex: any, ...values: any[]): any;
    static "__#private@#forbiddenTransition"(string: any, stringIndex: any, value: any): any;
    static "__#private@#invalidTransition"(string: any, stringIndex: any, value: any): any;
    static "__#private@#validTransition"(string: any, stringIndex: any, value: any): any;
    static "__#private@#getErrorInfo"(strings: any, stringsIndex: any, string: any, stringIndex: any): {
        parsed: any;
        notParsed: string;
    };
    static "__#private@#throwTransitionError"(strings: any, stringsIndex: any, string: any, stringIndex: any, value: any): void;
    static "__#private@#validateRawString"(rawString: any): void;
    static "__#private@#validateExit"(value: any, tagName: any): void;
    static "__#private@#sendInnerTextTokens"(onToken: any, string: any, index: any, start: any, end: any, plaintextType: any, referenceType: any): void;
    static "__#private@#validateTagName"(tagName: any): void;
    static "__#private@#validateNoDeclarativeShadowRoots"(tagName: any, attributeName: any): void;
    static "__#private@#sendBoundTextTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, sloppyStartInterpolation: any): void;
    static "__#private@#sendBoundContentTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any): void;
    static "__#private@#sendTextTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#private@#sendCommentTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#private@#sendStartTagOpenTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): any;
    static "__#private@#sendStartTagSpaceTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#private@#sendDanglingQuoteTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#private@#sendBooleanTokens"(onToken: any, tagName: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#private@#sendAttributeTokens"(onToken: any, tagName: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#private@#sendBoundBooleanTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#private@#sendBoundDefinedTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#private@#sendBoundAttributeTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#private@#sendBoundPropertyTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
    static "__#private@#sendVoidElementTokens"(onToken: any, stringsIndex: any, stringIndex: any, nextStringIndex: any): void;
    static "__#private@#sendTextareaTokens"(onToken: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): number;
    static "__#private@#sendStartTagCloseTokens"(onToken: any, stringsIndex: any, stringIndex: any, nextStringIndex: any): void;
    static "__#private@#sendEndTagTokens"(onToken: any, tagName: any, strings: any, stringsIndex: any, string: any, stringIndex: any, nextStringIndex: any): void;
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