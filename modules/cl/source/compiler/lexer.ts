export function is_alpha(c: string|null): boolean {
    if (!c) {
        return false;
    }

    const code = c.charCodeAt(0);

    return (code >= 97 && code <= 122) || (code >= 65 && code <= 90);
}

export function is_num(c: string|null): boolean {
    if (!c) {
        return false;
    }

    const code = c.charCodeAt(0);

    return code >= 48 && code <= 57;
}

export function is_alnum(c: string|null): boolean {
    return is_alpha(c) || is_num(c);
}

export function is_space(c: string): boolean {
    return c === " " || c === "\t" || c === "\n" || c === "\r" || c === "\v" || c === "\f";
}

export const KEYWORDS = [
    "await",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "finally",
    "for",
    "from",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "let",
    "new",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield"
];

export const BOOL_LITERALS = [
    "true",
    "false",
];

export enum TOKEN_TYPE {
    KEYWORD,
    IDENTIFIER,
    OPERATOR,
    DELIMITER,
    LITERAL_STRING,
    LITERAL_NUMBER,
    LITERAL_BOOL,
    LITERAL_NULL,
    LITERAL_REGEX,
    ARROW
};

export class token_t {
    type: TOKEN_TYPE;
    value: string;
};

export function token_new(type: TOKEN_TYPE, value: string): token_t {
    const out = new token_t();
    out.type = type;
    out.value = value;

    return out;
}

export class lexer_t {
    line: string;
    l: number;
    i: number;
};

export function lexer_new(line: string, l: number, i: number): lexer_t {
    const out = new lexer_t();
    out.line = line;
    out.l = l;
    out.i = i;

    return out;
}

export function lexer_prev(lexer: lexer_t): boolean {
    if (lexer.i < 0) {
        return false;
    }

    lexer.i -= 1;

    return true;
}

export function lexer_next(lexer: lexer_t, i = 1): boolean {
    if (lexer.i >= lexer.l) {
        return false;
    }

    lexer.i += i;

    return true;
}

export function lexer_curr(lexer: lexer_t): string|null {
    if (lexer.i < 0 || lexer.i >= lexer.l) {
        return null;
    }

    return lexer.line[lexer.i];
}

export function lexer_peek(lexer: lexer_t, n: number): string|null {
    if ((lexer.i + n) < 0 || (lexer.i + n) >= lexer.l) {
        return null;
    }

    return lexer.line[lexer.i + n];
}

export function lex(line: string): token_t[] {
    const lexer = lexer_new(line, line.length, 0);
    const tokens: token_t[] = [];

    let c: string|null = null;

    while (c = lexer_curr(lexer)) {
        // skip whitespace
        if (is_space(c)) {
            lexer_next(lexer);

            continue;
        }

        // skip comment
        if (c === "/") {
            const p1 = lexer_peek(lexer, 1);

            if (p1 === "/") {
                while ((c = lexer_curr(lexer))) {
                    lexer_next(lexer);
                }

                continue;
            }

            if (p1 === "*") {
                while ((c = lexer_curr(lexer)) && !(c === "*" && lexer_peek(lexer, 1) === "/")) {
                    lexer_next(lexer);
                }

                lexer_next(lexer, 2);

                continue;
            }
        }

        // keyword/identifier/word literal
        if (is_alpha(c) || c === "_" || c === "$") {
            let token = c;

            lexer_next(lexer);

            while ((c = lexer_curr(lexer)) && (is_alnum(c) || c === "_" || c === "$")) {
                token += c;
                lexer_next(lexer);
            }

            if (KEYWORDS.indexOf(token) > -1) {
                tokens.push(token_new(TOKEN_TYPE.KEYWORD, token));
            } else if (BOOL_LITERALS.indexOf(token) > - 1) {
                tokens.push(token_new(TOKEN_TYPE.LITERAL_BOOL, token));
            } else if (token === "NaN") {
                tokens.push(token_new(TOKEN_TYPE.LITERAL_NUMBER, token));
            } else if (token === "null") {
                tokens.push(token_new(TOKEN_TYPE.LITERAL_NULL, token));
            } else {
                tokens.push(token_new(TOKEN_TYPE.IDENTIFIER, token));
            }

            continue;
        }

        // number literal
        if (is_num(c) || (c === "." && is_num(lexer_peek(lexer, 1)))) {
            let token = c;

            lexer_next(lexer);

            while ((c = lexer_curr(lexer)) && (is_alnum(c) || c === ".")) {
                token += c;
                lexer_next(lexer);
            }

            tokens.push(token_new(TOKEN_TYPE.LITERAL_NUMBER, token));

            continue;
        }

        // string literal
        if ("\"'`".includes(c)) {
            let token = c;
            const quote = c;

            lexer_next(lexer);

            while ((c = lexer_curr(lexer)) && c !== quote) {
                token += c;
                lexer_next(lexer);
            }

            if (c) {
                token += c;
                lexer_next(lexer);
            }

            tokens.push(token_new(TOKEN_TYPE.LITERAL_STRING, token));

            continue;
        }

        // TODO: regex literal

        // ... operators
        if (c === ".") {
            const p1 = lexer_peek(lexer, 1);
            const p2 = lexer_peek(lexer, 2);

            if (p1 === "." && p2 === ".") {
                tokens.push(token_new(TOKEN_TYPE.OPERATOR, c + p1 + p2));

                lexer_next(lexer, 3);

                continue;
            }
        }

        // arrow
        if (c === "=") {
            const p1 = lexer_peek(lexer, 1);

            if (p1 === ">") {
                lexer_next(lexer, 2);

                tokens.push(token_new(TOKEN_TYPE.ARROW, c + p1));

                continue;
            }
        }

        // operator
        if ("+-*/%=!&|^<>?".includes(c)) {
            let token = c;
            const p1 = lexer_peek(lexer, 1);

            if (p1 && p1 === c && !"/%^!".includes(c)) {
                token += p1;
                lexer_next(lexer);
            }

            if (token.length === 1) {
                if (p1 && p1 === "=") {
                    token += p1;
                    lexer_next(lexer);
                }
            } else if (token.length === 2 && !"+-".includes(c)) {
                const p2 = lexer_peek(lexer, 1);

                if (p2 && p2 === "=") {
                    token += p2;
                    lexer_next(lexer);
                }
            }

            lexer_next(lexer);

            tokens.push(token_new(TOKEN_TYPE.OPERATOR, token));

            continue;
        }

        // delimiter
        if ("[](){}:;,.".includes(c)) {
            lexer_next(lexer);

            tokens.push(token_new(TOKEN_TYPE.DELIMITER, c));

            continue;
        }

        // invalid token
        break;
    }

    return tokens;
}
