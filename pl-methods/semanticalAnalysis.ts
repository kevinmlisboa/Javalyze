import { SyntaxInterpreter } from "./type/SyntaxInterpreter";
import { Token } from "./type/Token";

type SemanticError = {
  message: string;
  token: Token;
};

/*
duplicate like this is not allowed
int x = 10;
int x = 30;

int x = "Hello Rom"; will not be accepted
 Expected message: Type mismatch: Cannot assign value '"Hello Rom"' to type 'int'
*/

export class SemanticAnalyzer {
  private symbolTable: Map<string, string>;
  private errors: SemanticError[];

  constructor() {
    this.symbolTable = new Map();
    this.errors = [];
  }

  analyze(syntaxTree: SyntaxInterpreter): void {
    const { dataType, identifier, value } = syntaxTree;

    // Check for duplicate identifier
    if (this.symbolTable.has(identifier!)) {
      this.errors.push({
        message: `Duplicate declaration of identifier '${identifier}'`,
        token: { type: "IDENTIFIER", value: identifier! },
      });
    } else {
      // Add to symbol table
      this.symbolTable.set(identifier!, dataType!);
    }

    // Validate the value based on the data type
    if (!this.validateType(dataType!, value!)) {
      this.errors.push({
        message: `Type mismatch: Cannot assign value '${value}' to type '${dataType}'`,
        token: { type: "LITERAL", value: value! },
      });
    }
  }

  private validateType(dataType: string, value: string): boolean {
    switch (dataType) {
      case "int":
        return /^-?\d+$/.test(value); // Allow negative integers with optional `-`
      case "String":
        return /^".*"$/.test(value); // String enclosed in quotes
      case "boolean":
        return /^(true|false)$/.test(value); // Boolean values
      case "double":
        return /^-?\d+(\.\d+)?$/.test(value); // Floating-point numbers, positive or negative
      case "char":
        return /^'.{1}'$/.test(value); // Single character enclosed in single quotes
      default:
        return false; // Unknown data type
    }
  }

  getErrors(): SemanticError[] {
    return this.errors;
  }
}
