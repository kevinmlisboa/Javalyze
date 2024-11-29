export type SyntaxInterpreter = {
  type: "VariableDeclaration";
  dataType?: string;
  identifier?: string;
  value?: string;
  errors?: string[];
};
