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
