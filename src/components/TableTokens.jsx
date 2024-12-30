import React, { useEffect, useState } from "react";
import { useFile } from "../contexts/FileContext";
import { analyzeCode } from "../utils/lexerUtils";

const TableTokens = () => {
  const { fileContent } = useFile();
  const [tokens, setTokens] = useState([]);
  const [htmlCode, setHtmlCode] = useState("");

  useEffect(() => {
    const result = analyzeCode(fileContent);
    setTokens(result.tokens);

    // Genera el código HTML de la tabla
    const generatedHtml = `
<table>
  <thead>
    <tr>
      <th>Tipo</th>
      <th>Lexema</th>
      <th>Línea</th>
      <th>Columna</th>
    </tr>
  </thead>
  <tbody>
    ${result.tokens
      .map(
        (token) =>
          `<tr>
      <td>${token.type}</td>
      <td>${token.lexeme}</td>
      <td>${token.line}</td>
      <td>${token.col}</td>
    </tr>`
      )
      .join("\n")}
  </tbody>
</table>`;
    setHtmlCode(generatedHtml);
  }, [fileContent]);

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      {/* Sección izquierda: Código HTML */}
      <div style={{ flex: 1, padding: "20px", borderRight: "1px solid #ccc", overflow: "auto" }}>
        <h3>Código HTML de la Tabla</h3>
        <pre className="pre-code">
          {htmlCode}
        </pre>
      </div>

      {/* Sección derecha: Tabla generada */}
      <div style={{ flex: 1, padding: "20px", overflow: "auto" }}>
        <h3>Tokens</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tipo</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Lexema</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Línea</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Columna</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{token.type}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{token.lexeme}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{token.line}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{token.col}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableTokens;
