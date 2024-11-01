type TokenType =
  | "IDENTIFIER"
  | "ASSIGNMENT"
  | "LITERAL"
  | "SEMICOLON"
  | "UNKNOWN";

type Token = {
  type: TokenType;
  value: string;
};

export class Lexer {
  private input: string;
  private position: number;
  private currentChar: string | null;

  constructor(input: string) {
    this.input = input;
    this.position = 0;
    this.currentChar = this.input[this.position];
  }

  private advance(): void {
    this.position++;
    this.currentChar = this.input[this.position] || null;
  }

  private isAlpha(char: string): boolean {
    return /[a-zA-Z_]/.test(char);
  }

  private isAlphanumeric(char: string): boolean {
    return /[a-zA-Z0-9_]/.test(char);
  }

  private isNumeric(char: string): boolean {
    return /\d/.test(char);
  }

  private skipWhitespace(): void {
    while (this.currentChar !== null && /\s/.test(this.currentChar)) {
      this.advance();
    }
  }

  private readIdentifier(): Token {
    let result = "";
    while (this.currentChar !== null && this.isAlphanumeric(this.currentChar)) {
      result = result.concat(this.currentChar);
      this.advance();
    }
    return { value: result, type: "IDENTIFIER" };
  }

  private readBooleanLiteral(): Token | null {
    const booleanLiteralTrue = this.input.slice(
      this.position,
      this.position + 4
    );
    if (booleanLiteralTrue === "true") {
      this.position += 4;
      this.currentChar = this.input[this.position] || null;
      return { value: booleanLiteralTrue, type: "LITERAL" };
    }
    const booleanLiteralFalse = this.input.slice(
      this.position,
      this.position + 5
    );
    if (booleanLiteralFalse === "false") {
      this.position += 5;
      this.currentChar = this.input[this.position] || null;
      return { value: booleanLiteralFalse, type: "LITERAL" };
    }
    return null;
  }

  private readStringLiteral(): Token {
    let result = "";

    this.advance();
    while (this.currentChar !== null && this.currentChar !== '"') {
      result += this.currentChar;
      this.advance();
    }
    this.advance();
    return { value: result, type: "LITERAL" };
  }

  private readCharLiteral(): Token {
    let result = "";
    this.advance();
    if (this.currentChar !== null && /[^\s]/.test(this.currentChar)) {
      result = result.concat(this.currentChar);
    }
    this.advance();
    return { value: result, type: "LITERAL" };
  }
  private readNumberLiteral(): Token {
    let result = "";
    if (this.currentChar === ".") {
      result = result.concat(this.currentChar);
      this.advance();
    }
    while (this.currentChar !== null && this.isNumeric(this.currentChar)) {
      result = result.concat(this.currentChar);
      this.advance();
    }
    if (this.currentChar === ".") {
      result = result.concat(this.currentChar);
      this.advance();
      while (this.currentChar !== null && this.isNumeric(this.currentChar)) {
        result = result.concat(this.currentChar);
        this.advance();
      }
    }

    return { value: result, type: "LITERAL" };
  }

  public getTokens(): Token[] {
    const tokens: Token[] = [];

    while (this.currentChar !== null) {
      if (/\s/.test(this.currentChar)) {
        this.skipWhitespace();
      } else if (this.isAlpha(this.currentChar)) {
        const token =
          this.currentChar === "t" || this.currentChar === "f"
            ? this.readBooleanLiteral()
            : this.readIdentifier();

        if (token) {
          tokens.push(token);
        }
      } else if (this.isNumeric(this.currentChar) || this.currentChar === ".") {
        tokens.push(this.readNumberLiteral());
      } else if (this.currentChar === '"') {
        tokens.push(this.readStringLiteral());
      } else if (this.currentChar === "'") {
        tokens.push(this.readCharLiteral());
      } else if (this.currentChar === "=") {
        tokens.push({ value: "=", type: "ASSIGNMENT" });
      } else if (this.currentChar === ";") {
        tokens.push({ value: ";", type: "SEMICOLON" });
      } else {
        tokens.push({ value: this.currentChar, type: "UNKNOWN" });
        this.advance();
      }
    }

    return tokens;
  }
}
