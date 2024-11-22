import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useFileContext } from "@/context/FileContext";
import { Lexer, Token } from "@/pl-methods/lexicalAnalysis";
import { useState } from "react";
import Callout from "../Callout";
import { DeclarationPatternAnalyzer } from "@/pl-methods/DeclarationPatternAnalyzer";
import { SyntaxAnalyzer } from "@/pl-methods/syntaxAnalysis";

const OperationsArea = () => {
  const { file } = useFileContext();
  const [lexicalAnalysisPassed, setLexicalAnalysisPassed] = useState(false);
  const [syntacticalAnalysisPassed, setSyntacticalAnalysisPassed] =
    useState(false);
  const [calloutMessage, setCalloutMessage] = useState("");
  const [tokens, setTokens] = useState<Token[][]>([]);
  const [lastAnalysisStatus, setLastAnalysisStatus] = useState<
    "lexical" | "syntactical" | null
  >(null);

  // Guard clause is used for better readability. If no file selected
  const handleLexicalAnalysis = async () => {
    if (!file) {
      setLexicalAnalysisPassed(false);
      setCalloutMessage("No file selected. Please upload a file to analyze.");
      setLastAnalysisStatus("lexical");
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
      console.log("Tokens for declaration:", tokensForDeclaration);
      tokenSets.push(tokensForDeclaration);
    });

    // Check if no tokens were generated at all
    if (tokenSets.flat().length === 0) {
      setLexicalAnalysisPassed(false);
      setCalloutMessage("Lexical analysis failed. No tokens found.");
      setLastAnalysisStatus("lexical");
      console.log("Lexical analysis failed: No tokens generated.");
      return;
    }

    // If tokens are found, continue
    setTokens(tokenSets);
    setLexicalAnalysisPassed(true);
    setCalloutMessage(
      "Lexical analysis passed. You can move to the next phase."
    );
    console.log("Lexical analysis passed:", tokenSets);

    // Reset syntactical state
    setSyntacticalAnalysisPassed(false);
    setLastAnalysisStatus("lexical");
  };

  const handleSyntacticalAnalysis = () => {
    if (tokens.flat().length === 0) {
      setSyntacticalAnalysisPassed(false);
      setCalloutMessage("Syntactical analysis failed. No tokens available.");
      setLastAnalysisStatus("syntactical");
      return;
    }

    const syntaxAnalyzer = new SyntaxAnalyzer(tokens.flat());
    const result = syntaxAnalyzer.parse();

    console.log("Syntactical analysis result:", result);

    // Check for errors from the syntactical analysis
    if (result.errors && result.errors.length > 0) {
      setSyntacticalAnalysisPassed(false);
      setCalloutMessage(
        `Syntactical analysis failed. Errors: ${result.errors.join(", ")}`
      );
      setLastAnalysisStatus("syntactical");
    } else {
      setSyntacticalAnalysisPassed(true);
      setCalloutMessage(
        "Syntactical analysis passed. You can move to the next phase."
      );
      setLastAnalysisStatus("syntactical");
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

          <Button className="w-full flex-grow">Semantical</Button>
          <Button variant="destructive" className="w-full flex-grow">
            Clear
          </Button>
        </div>

        {/* Dynamically set the callout message */}
        <div className="mt-4">
          {calloutMessage && (
            <Callout
              message={calloutMessage}
              status={
                lastAnalysisStatus === "lexical"
                  ? lexicalAnalysisPassed
                  : syntacticalAnalysisPassed
              }
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OperationsArea;
