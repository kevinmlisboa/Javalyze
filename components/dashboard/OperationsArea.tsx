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
  const { file, clearFile } = useFileContext();
  const [lexicalAnalysisPassed, setLexicalAnalysisPassed] = useState(false);
  const [syntacticalAnalysisPassed, setSyntacticalAnalysisPassed] =
    useState(false);
  const [semanticalAnalysisPassed, setSemanticalAnalysisPassed] =
    useState(false);
  const [calloutMessage, setCalloutMessage] = useState("");
  const [tokens, setTokens] = useState<Token[][]>([]);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>(null);
  const [syntaxTree, setSyntaxTree] = useState<SyntaxInterpreter[]>([]);

  const [isLexicalEnabled, setIsLexicalEnabled] = useState(true);
  const [isSyntacticalEnabled, setIsSyntacticalEnabled] = useState(false);
  const [isSemanticalEnabled, setIsSemanticalEnabled] = useState(false);

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

    analyzer.getDeclarations().forEach((declaration) => {
      const lexer = new Lexer(declaration);
      const tokensForDeclaration = lexer.getTokens();
      tokenSets.push(tokensForDeclaration);
    });

    if (tokenSets.length === 0) {
      setLexicalAnalysisPassed(false);
      setCalloutMessage("Lexical analysis failed. No tokens found.");
      console.log("Lexical analysis failed: No tokens generated.");
      return;
    }

    setTokens(tokenSets);
    setLexicalAnalysisPassed(true);
    setCalloutMessage(
      "Lexical analysis passed. You can move to the next phase."
    );

    setIsLexicalEnabled(false);
    setIsSyntacticalEnabled(true);
  };

  const handleSyntacticalAnalysis = () => {
    setAnalysisStatus("syntactical");
    if (tokens.flat().length === 0) {
      setSyntacticalAnalysisPassed(false);
      setCalloutMessage("Syntactical analysis failed. No tokens available.");
      return;
    }
    tokens.forEach((subtokens) => {
      const syntaxAnalyzer = new SyntaxAnalyzer(subtokens);
      const result = syntaxAnalyzer.parse();
      setSyntaxTree((prev) => [...prev, result]);

      if (result.errors && result.errors.length > 0) {
        setSyntacticalAnalysisPassed(false);
        setCalloutMessage(
          `Syntactical analysis failed. Errors: ${result.errors.join(", ")}`
        );
        return;
      }
    });
    setSyntacticalAnalysisPassed(true);
    setCalloutMessage(
      "Syntactical analysis passed. You can move to the next phase."
    );

    setIsSyntacticalEnabled(false);
    setIsSemanticalEnabled(true);
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
      setSemanticalAnalysisPassed(false);
      setCalloutMessage("Semantic analysis failed. See console for details.");
    } else {
      console.log("Semantic analysis passed!");
      setSemanticalAnalysisPassed(true);
      setCalloutMessage("Semantic analysis passed.");
    }

    setIsSemanticalEnabled(false);
  };

  const handleClear = () => {
    setLexicalAnalysisPassed(false);
    setSyntacticalAnalysisPassed(false);
    setSemanticalAnalysisPassed(false);
    setCalloutMessage("");
    setTokens([]);
    setAnalysisStatus(null);
    setSyntaxTree([]);
    clearFile();

    setIsLexicalEnabled(true);
    setIsSyntacticalEnabled(false);
    setIsSemanticalEnabled(false);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Operations Area</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow justify-between space-y-4">
        <div className="flex flex-col flex-grow space-y-4">
          <Button
            className="w-full flex-grow bg-neutral-900 text-white hover:bg-neutral-700"
            onClick={handleLexicalAnalysis}
            disabled={!isLexicalEnabled}
          >
            Lexical
          </Button>
          <Button
            className="w-full flex-grow bg-neutral-900 text-white hover:bg-neutral-700"
            onClick={handleSyntacticalAnalysis}
            disabled={!isSyntacticalEnabled}
          >
            Syntactical
          </Button>
          <Button
            className="w-full flex-grow bg-neutral-900 text-white hover:bg-stone-400"
            onClick={handleSemanticalAnalysis}
            disabled={!isSemanticalEnabled}
          >
            Semantical
          </Button>
          <Button
            className="w-full flex-grow bg-red-600 text-white hover:bg-red-700"
            onClick={handleClear}
          >
            Clear
          </Button>
        </div>
        {analysisStatus && (
          <Callout
            message={calloutMessage}
            status={
              analysisStatus === "lexical"
                ? lexicalAnalysisPassed
                : analysisStatus === "syntactical"
                ? syntacticalAnalysisPassed
                : semanticalAnalysisPassed
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

export default OperationsArea;
