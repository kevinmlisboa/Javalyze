import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useFileContext } from "@/context/FileContext";
import { Lexer } from "@/pl-methods/lexicalAnalysis";
import { Token } from "@/pl-methods/type/Token";
import { useState } from "react";
import Callout from "../Callout";
import { DeclarationPatternAnalyzer } from "@/pl-methods/DeclarationPatternAnalyzer";
import { SyntaxAnalyzer } from "@/pl-methods/syntaxAnalysis";
import { SyntaxInterpreter } from "@/pl-methods/type/SyntaxInterpreter";
import { SemanticAnalyzer } from "@/pl-methods/semanticalAnalysis";

type AnalysisStatus = "lexical" | "syntactical" | "semantical" | null;

const OperationsArea = () => {
  const { file } = useFileContext();
  const [lexicalAnalysisPassed, setLexicalAnalysisPassed] = useState(false);
  const [syntacticalAnalysisPassed, setSyntacticalAnalysisPassed] =
    useState(false);
  const [semanticalAnalysisPassed, setSemanticalAnalysisPassed] =
    useState(false); // ikaw na dito romnonibba
  const [calloutMessage, setCalloutMessage] = useState("");
  const [tokens, setTokens] = useState<Token[][]>([]);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>(null);
  const [syntaxTree, setSyntaxTree] = useState<SyntaxInterpreter[]>([]);

  console.log(syntaxTree);

  const handleAnalysisStatus = (analysisStatus: string | null) => {
    switch (analysisStatus) {
      case "lexical":
        return lexicalAnalysisPassed;
      case "syntactical":
        return syntacticalAnalysisPassed;

      case "semantical":
        return semanticalAnalysisPassed;
      default:
        return false;
    }
  };

  // Guard clause is used for better readability. If no file selected
  const handleLexicalAnalysis = async () => {
    setAnalysisStatus("lexical");
    if (!file) {
      setLexicalAnalysisPassed(false);
      setCalloutMessage("No file selected. Please upload a file to analyze.");
      return;
    }

    const text = await file.text();
    const analyzer = new DeclarationPatternAnalyzer(text);
    analyzer.analyze();
    const tokenSets: Token[][] = [];

    // Generate tokens for each declaration pattern found
    analyzer.getDeclarations().forEach((declaration) => {
      const lexer = new Lexer(declaration);
      const tokensForDeclaration = lexer.getTokens();
      tokenSets.push(tokensForDeclaration);
    });

    // Check if no tokens were generated at all
    if (tokenSets.length === 0) {
      setLexicalAnalysisPassed(false);
      setCalloutMessage("Lexical analysis failed. No tokens found.");
      console.log("Lexical analysis failed: No tokens generated.");
      return;
    }

    // If tokens are found, continue
    setTokens(tokenSets);
    setLexicalAnalysisPassed(true);
    setCalloutMessage(
      "Lexical analysis passed. You can move to the next phase."
    );
  };

  const handleSyntacticalAnalysis = () => {
    setAnalysisStatus("syntactical");
    if (tokens.flat().length === 0) {
      setSyntacticalAnalysisPassed(false);
      setCalloutMessage("Syntactical analysis failed. No tokens available.");
      // setLastAnalysisStatus("syntactical");
      return;
    }
    tokens.forEach((subtokens) => {
      const syntaxAnalyzer = new SyntaxAnalyzer(subtokens);
      const result = syntaxAnalyzer.parse();
      setSyntaxTree((prev) => [...prev, result]);

      // Check for errors from the syntactical analysis
      if (result.errors && result.errors.length > 0) {
        setSyntacticalAnalysisPassed(false);
        setCalloutMessage(
          `Syntactical analysis failed. Errors: ${result.errors.join(", ")}`
        );
        // setLastAnalysisStatus("syntactical");
        return;
      }
    });
    setSyntacticalAnalysisPassed(true);
    setCalloutMessage(
      "Syntactical analysis passed. You can move to the next phase."
    );
  };

  const handleSemanticalAnalysis = () => {
    setAnalysisStatus("semantical");
    const semanticAnalyzer = new SemanticAnalyzer();
    syntaxTree.forEach((tree) => {
      semanticAnalyzer.analyze(tree);
    });
    const errors = semanticAnalyzer.getErrors();
    if (errors.length > 0) {
      console.error("Semantic errors found:", errors);
    } else {
      console.log("Semantic analysis passed!");
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Operations Area</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col flex-grow justify-between space-y-4">
        <div className="flex flex-col flex-grow space-y-4">
          <Button className="w-full flex-grow" onClick={handleLexicalAnalysis}>
            Lexical
          </Button>

          {/* Enable the Syntactical button only after Lexical analysis */}
          <Button
            className="w-full flex-grow"
            onClick={handleSyntacticalAnalysis}
            disabled={!lexicalAnalysisPassed}
          >
            Syntactical
          </Button>

          <Button
            className="w-full flex-grow"
            disabled={!lexicalAnalysisPassed && !semanticalAnalysisPassed}
            onClick={handleSemanticalAnalysis}
          >
            Semantical
          </Button>
          <Button variant="destructive" className="w-full flex-grow">
            Clear
          </Button>
        </div>

        {/* Dynamically set the callout message */}
        <div className="mt-4">
          {calloutMessage && (
            <Callout
              message={calloutMessage}
              status={handleAnalysisStatus(analysisStatus)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OperationsArea;
