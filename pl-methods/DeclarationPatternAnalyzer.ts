export class DeclarationPatternAnalyzer {
  private input: string;
  private declarations: string[] = [];

  constructor(input: string) {
    this.input = input;
  }

  public getDeclarations() {
    return this.declarations;
  }

  public analyze(): void {
    const declarationPattern =
      /\b(int|float|double|boolean|char|String|long|short|byte)\b\s+\w+\s*(=\s*[^;]*)?;/g;
    let match: RegExpExecArray | null;
    while ((match = declarationPattern.exec(this.input)) !== null) {
      this.declarations.push(match[0]);
    }
  }
}

//example usage
/* 
const javaCode = `
    int x = 10;
    String name;
    boolean isReady = true;
    System.out.println("Hello World!");
    float height = 5.9;
`;

const analyzer = new VariableDeclarationAnalyzer(javaCode);
analyzer.analyze();

console.log(analyzer.getDeclarations()); // Output: ["int x = 10;", "String name;", "boolean isReady = true;", "float height = 5.9;"]
*/
