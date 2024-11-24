export type TokenType =
  | "IDENTIFIER"
  | "ASSIGNMENT"
  | "LITERAL"
  | "SEMICOLON"
  | "UNKNOWN";

export type Token = {
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
    this.currentChar = this.input[this.position] || null;
  }

  private advance(): void {
    this.position++;
    this.currentChar =
      this.position < this.input.length ? this.input[this.position] : null;
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
      result += this.currentChar;
      this.advance();
    }
    return { value: result, type: "IDENTIFIER" };
  }

  private readBooleanLiteral(): Token | null {
    if (this.input.startsWith("true", this.position)) {
      this.position += 4;
      this.currentChar = this.input[this.position] || null;
      return { value: "true", type: "LITERAL" };
    }
    if (this.input.startsWith("false", this.position)) {
      this.position += 5;
      this.currentChar = this.input[this.position] || null;
      return { value: "false", type: "LITERAL" };
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
    if (this.currentChar !== null && this.currentChar !== "'") {
      result = this.currentChar;
      this.advance();
    }
    this.advance(); 
    return { value: result, type: "LITERAL" };
  }

  private readNumberLiteral(): Token {
    let result = "";
    while (this.currentChar !== null && this.isNumeric(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }

    if (this.currentChar === ".") {
      result += this.currentChar;
      this.advance();
      while (this.currentChar !== null && this.isNumeric(this.currentChar)) {
        result += this.currentChar;
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
        const booleanToken = this.readBooleanLiteral();
        if (booleanToken) {
          tokens.push(booleanToken);
        } else {
          tokens.push(this.readIdentifier());
        }
      } else if (this.isNumeric(this.currentChar)) {
        tokens.push(this.readNumberLiteral());
      } else if (this.currentChar === '"') {
        tokens.push(this.readStringLiteral());
      } else if (this.currentChar === "'") {
        tokens.push(this.readCharLiteral());
      } else if (this.currentChar === "=") {
        tokens.push({ value: "=", type: "ASSIGNMENT" });
        this.advance();
      } else if (this.currentChar === ";") {
        tokens.push({ value: ";", type: "SEMICOLON" });
        this.advance();
      } else {
        tokens.push({ value: this.currentChar, type: "UNKNOWN" });
        this.advance();
      }
    }

    return tokens;
  }
}
