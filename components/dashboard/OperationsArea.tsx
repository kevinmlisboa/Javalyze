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
  const [analysisStatus, setAnalysisStatus] = useState<
    "lexical" | "syntactical" | null
  >(null);

  const handleAnalysisStatus = (analysisStatus: string | null) => {
    switch (analysisStatus) {
      case "lexical":
        return lexicalAnalysisPassed;
      case "syntactical":
        return syntacticalAnalysisPassed;
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
    console.log(analyzer.getDeclarations());

    // Generate tokens for each declaration pattern found
    analyzer.getDeclarations().forEach((declaration) => {
      const lexer = new Lexer(declaration);
      const tokensForDeclaration = lexer.getTokens();
      console.log("Tokens for declaration:", tokensForDeclaration);
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

      // Check for errors from the syntactical analysis
      if (result.errors && result.errors.length > 0) {
        setSyntacticalAnalysisPassed(false);
        setCalloutMessage(
          `Syntactical analysis failed. Errors: ${result.errors.join(", ")}`
        );
        // setLastAnalysisStatus("syntactical");
      } else {
        setSyntacticalAnalysisPassed(true);
        setCalloutMessage(
          "Syntactical analysis passed. You can move to the next phase."
        );
        // setAnalysisStatus("syntactical");
      }
    });
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
              status={handleAnalysisStatus(analysisStatus)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OperationsArea;
