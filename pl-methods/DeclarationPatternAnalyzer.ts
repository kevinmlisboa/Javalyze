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
      /\b(int|double|boolean|char|String)\s+\w+\s*=\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')?\s*;\s*/g;
    let match: RegExpExecArray | null;
    while ((match = declarationPattern.exec(this.input)) !== null) {
      // Trim the matched declaration to remove any trailing whitespace or newlines
      this.declarations.push(match[0].trim());
    }
  }
}
