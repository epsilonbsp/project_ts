import {token_t} from "./lexer.ts";

export class parser_t {
    tokens: token_t[];
    l: number;
    i: number;
};

export function parser_new(tokens: token_t[], l: number, i: number): parser_t {
    const out = new parser_t();
    out.tokens = tokens;
    out.l = l;
    out.i = i;

    return out;
}

export function parser_prev(lexer: parser_t): boolean {
    if (lexer.i < 0) {
        return false;
    }

    lexer.i -= 1;

    return true;
}

export function parser_next(lexer: parser_t, i = 1): boolean {
    if (lexer.i >= lexer.l) {
        return false;
    }

    lexer.i += i;

    return true;
}

export function parser_curr(lexer: parser_t): token_t|null {
    if (lexer.i < 0 || lexer.i >= lexer.l) {
        return null;
    }

    return lexer.tokens[lexer.i];
}

export function parser_peek(lexer: parser_t, n: number): token_t|null {
    if ((lexer.i + n) < 0 || (lexer.i + n) >= lexer.l) {
        return null;
    }

    return lexer.tokens[lexer.i + n];
}
