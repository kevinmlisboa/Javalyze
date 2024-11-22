import { Token, TokenType } from "./lexicalAnalysis";

//TODO: get error messages and display in frontend
//example output
/* wrong syntax
{
  "type": "VariableDeclaration",
  "dataType": "int",
  "identifier": "x",
  "value": "42",
  "errors": ["Expected ';' at the end of the declaration. Found 'EOF' instead."]
}
  */
/* correct syntax 
 {
  "type": "VariableDeclaration",
  "dataType": "int",
  "identifier": "x",
  "value": "42",
  "errors": []
}*/

type SyntaxInterpreter = {
  type: "VariableDeclaration";
  dataType?: string;
  identifier?: string;
  value?: string;
  errors?: string[]; // List of errors encountered during parsing
};

export class SyntaxAnalyzer {
  private tokens: Token[];
  private current = 0;
  private errors: string[] = [];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): SyntaxInterpreter {
    const result: SyntaxInterpreter = {
      type: "VariableDeclaration",
      errors: this.errors,
    };

    // Parse datatype
    const dataType = this.consume("IDENTIFIER", "Expected a datatype");
    if (dataType.token?.value) {
      if (
        !["int", "String", "boolean", "double", "char"].includes(
          dataType.token.value
        )
      ) {
        this.errors.push(`Invalid datatype '${dataType.token.value}'`);
      } else {
        result.dataType = dataType.token.value;
      }
    } else {
      this.errors.push(dataType.message);
    }

    // Parse identifier
    const identifier = this.consume("IDENTIFIER", "Expected an identifier");
    if (identifier.token?.value) {
      result.identifier = identifier.token.value;
    } else {
      this.errors.push(identifier.message);
    }

    // Parse assignment operator
    const assignment = this.consume("ASSIGNMENT", "Expected '='");
    if (!assignment.token) {
      this.errors.push(assignment.message);
    }

    // Parse literal
    const literal = this.parseLiteral();
    if (literal.token?.value) {
      result.value = literal.token.value;
    } else {
      this.errors.push(literal.message);
    }

    // Parse semicolon
    const semicolon = this.consume(
      "SEMICOLON",
      "Expected ';' at the end of the declaration"
    );
    if (!semicolon.token) {
      this.errors.push(semicolon.message);
    }

    // Return the result with errors
    return result;
  }

  private consume(
    expectedType: TokenType,
    message: string
  ): { token: Token | null; message: string } {
    const token = this.tokens[this.current];
    console.log(`Consuming token:`, token); 
    if (token && token.type === expectedType) {
      this.current++;
      return { token, message: "Success" };
    } else {
      return {
        token: null,
        message: `${message}. Found '${token?.value}' instead.`,
      };
    }
  }

  private parseLiteral(): { token: Token | null; message: string } {
    const token = this.tokens[this.current];
    if (token?.type === "LITERAL") {
      this.current++;
      return { token, message: "Success" };
    } else {
      return {
        token: null,
        message: `Expected a literal but found '${token?.value}' instead.`,
      };
    }
  }
}
