import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useFileContext } from "@/context/FileContext";
import { Lexer, Token } from "@/pl-methods/lexicalAnalysis";
import { useState } from "react";
import Callout from "../Callout";
import { DeclarationPatternAnalyzer } from "@/pl-methods/DeclarationPatternAnalyzer";

const OperationsArea = () => {
  const { file } = useFileContext();
  const [lexicalAnalysisPassed, setLexicalAnalysisPassed] = useState(false);
  const [calloutMessage, setCalloutMessage] = useState("");

  // Guard clause is used for better readability. If no file selected
  // return immidiately
  const handleLexicalAnalysis = async () => {
    if (!file) {
      setLexicalAnalysisPassed(false);
      setCalloutMessage("No file selected. Please upload a file to analyze.");
      return;
    }

    const text = await file.text();
    const javaDeclarations = new DeclarationPatternAnalyzer(text);
    javaDeclarations.analyze();
    let lexer: Lexer | null = null;
    const tokens: Token[][] = [];
    javaDeclarations.getDeclarations().forEach((declarations) => {
      lexer = new Lexer(declarations);
      tokens.push(lexer.getTokens());
    });

    // If no tokens, also fail the test
    if (tokens.length === 0) {
      setLexicalAnalysisPassed(false);
      setCalloutMessage("Lexical analysis failed. No tokens found.");
      return;
    }
    console.log(tokens);
    // Otherwise, pass the test with this callout message
    setLexicalAnalysisPassed(true);
    setCalloutMessage(
      "Lexical analysis passed. You can move to the next phase."
    );
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
          <Button className="w-full flex-grow">Syntactical</Button>
          <Button className="w-full flex-grow">Semantical</Button>
          <Button variant="destructive" className="w-full flex-grow">
            Clear
          </Button>
        </div>

        {/* Dynamically set the callout message from this file */}
        <div className="mt-4">
          {calloutMessage && (
            <Callout message={calloutMessage} status={lexicalAnalysisPassed} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OperationsArea;
