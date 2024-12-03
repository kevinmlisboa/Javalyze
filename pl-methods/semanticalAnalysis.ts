import { SyntaxInterpreter } from "./type/SyntaxInterpreter";
import { Token } from "./type/Token";

type SemanticError = {
  message: string;
  token: Token;
};

export class SemanticAnalyzer {
  private symbolTable: Map<string, string>;
  private errors: SemanticError[];

  constructor() {
    this.symbolTable = new Map();
    this.errors = [];
  }

  analyze(syntaxTree: SyntaxInterpreter): void {
    const { dataType, identifier, value } = syntaxTree;

    // Ensure all required fields are present in the syntax tree
    if (!dataType || !identifier || value === undefined) {
      this.errors.push({
        message: `Incomplete variable declaration: Missing data type, identifier, or value.`,
        token: {
          type: "UNKNOWN",
          value: `${dataType} ${identifier} = ${value}`,
        },
      });
      return;
    }

    if (this.symbolTable.has(identifier)) {
      this.errors.push({
        message: `Duplicate declaration of identifier '${identifier}'`,
        token: { type: "IDENTIFIER", value: identifier },
      });
      return;
    }

    this.symbolTable.set(identifier, dataType);

    if (!this.validateType(dataType, value)) {
      this.errors.push({
        message: `Type mismatch: Cannot assign value '${value}' to type '${dataType}'`,
        token: { type: "LITERAL", value: value },
      });
    }
  }

  private validateType(dataType: string, value: string): boolean {
    switch (dataType) {
      case "int":
        return /^-?\d+$/.test(value); // Integers with optional negative sign
      case "String":
        return /^".*"$/.test(value); // Strings enclosed in double quotes
      case "boolean":
        return /^(true|false)$/.test(value); // Boolean values
      case "double":
        return /^-?\d+(\.\d+)?$/.test(value); // Floating-point numbers
      case "char":
        return /^'.{1}'$/.test(value); // Single character enclosed in single quotes
      default:
        return false; // Unsupported data type
    }
  }

  getErrors(): SemanticError[] {
    return this.errors;
  }
}
