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
    static "__#1@#rawJsEscape": RegExp;
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
    static "__#1@#errorMessages": Map<string, string>;
    static "__#1@#valueToErrorMessagesKey": Map<RegExp, string>;
    static "__#1@#valueMalformedToErrorMessagesKey": Map<RegExp, string>;
    static "__#1@#valueForbiddenToErrorMessagesKey": Map<RegExp, string>;
    static "__#1@#namedErrorsToErrorMessagesKey": Map<string, string>;
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