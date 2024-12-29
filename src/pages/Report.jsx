import React, { useEffect, useState } from "react";
import GraphvizViewer from "../components/GraphvizViewer";
import '../styles/report.module.css'; // Importa los estilos
import {buildParseTree, generateDotForD3 } from "../services/dotService"

const TreeGenerator = () => {
    const [dotString, setDotString] = useState("");

    const handleGenerateTree = () => {
        const root = buildParseTree(`
            "Operaciones": [
                {"operacion": "suma", "nombre": "operacion3", "valor1": 2.3, "valor2": [{"operacion": "multiplicacion", "valor1": 10, "valor2": [{"operacion": "raiz", "valor1": 10, "valor2": 2}]}]}
            ]`);
        console.log(root)
        const dot = generateDotForD3(root);
        setDotString(dot);
    };

    const downloadDotFile = (dotString) => {
        const blob = new Blob([dotString], { type: 'text/plain' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "tree.dot";
        link.click();
    };

    useEffect(() => {
        handleGenerateTree();
        if (dotString) {
            console.log("Rendering DOT string:", dotString);
        } else {
            console.error("DOT string vacío o inválido.");
        }
    }, [dotString]);
    

    return (
        <div className="tree-generator-container">
            <button className="tree-generator-button" onClick={handleGenerateTree}>
                Generar Árbol
            </button>
            <button className="tree-generator-button" onClick={() => downloadDotFile(dotString)}>
                Exportar DOT
            </button>
            { dotString && <div className="tree-generator-output">
                <GraphvizViewer dotString={dotString} />
            </div>}
        </div>
    );
};

export default TreeGenerator;
