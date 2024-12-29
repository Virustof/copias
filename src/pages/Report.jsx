import React, { useEffect, useState, useRef } from "react";
import GraphvizViewer from "../components/GraphvizViewer";
import '../styles/report.module.css'; // Importa los estilos
import { generarDot } from "../services/dotService"
import { useFile } from "../contexts/FileContext"; // Importa el contexto global

const TreeGenerator = () => {
    const [dotString, setDotString] = useState("");
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const svgContainerRef = useRef(null);
    const { fileContent } = useFile(); 

    const handleGenerateTree = () => {
        /* const root = buildParseTree(`
            "Operaciones": [
                {"operacion": "suma", "nombre": "operacion3", "valor1": 2.3, "valor2": [{"operacion": "multiplicacion", "valor1": 10, "valor2": [{"operacion": "raiz", "valor1": 10, "valor2": 2}]}]}
            ]`);
        console.log(dot) */
        const dot = generarDot(fileContent);
        setDotString(dot);
    };

    const downloadDotFile = (dotString) => {
        const blob = new Blob([dotString], { type: 'text/plain' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "tree.dot";
        link.click();
    };

    const downloadSvgAsPng = () => {
        const svgElement = svgContainerRef.current.querySelector("svg");
        if (!svgElement) {
            console.error("No se encontró un elemento SVG para exportar.");
            return;
        }

        // Obtener el elemento <g> por su id
        const gElement = svgElement.querySelector('#graph0');
      
        // Verificar si el elemento <g> existe
        if (gElement) {
            // Obtener las dimensiones del <g> utilizando getBBox()
            const bbox = gElement.getBBox();
            setDimensions({ width: bbox.width, height: bbox.height });

            const svgString = new XMLSerializer().serializeToString(svgElement);
            const canvas = document.getElementById("canvas");
            const ctx = canvas.getContext("2d");
            const DOMURL = window.URL || window.webkitURL || window;
            const img = new Image();
            const svg = new Blob([svgString], {
            type: "image/svg+xml;charset=utf-8"
            });
            const url = DOMURL.createObjectURL(svg);

            img.onload = function() {
            ctx.drawImage(img, 0, 0);
            const imgURL = canvas.toDataURL("image/png");
            DOMURL.revokeObjectURL(imgURL);

            const dlLink = document.createElement('a');
            dlLink.download = "image.png";
            dlLink.href = imgURL;
            dlLink.dataset.downloadurl = ["image/png", dlLink.download, dlLink.href].join(':');
            
            document.body.appendChild(dlLink);
            dlLink.click();
            document.body.removeChild(dlLink);
            }

            img.src = url;
        }
    };

    const handleDownload = () => {
        const svgElement = svgContainerRef.current.querySelector("svg");
        if (!svgElement) {
            console.error("No se encontró un elemento SVG para exportar.");
            return;
        }
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        const DOMURL = window.URL || window.webkitURL || window;
        const img = new Image();
        
        // Crear un Blob del SVG
        const svg = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8"
        });
        const url = DOMURL.createObjectURL(svg);
    
        img.onload = function() {
          // Una vez cargada la imagen SVG, dibujamos en el canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpiar el canvas
          ctx.drawImage(img, 0, 0);  // Dibujar la imagen en el canvas
    
          // Convertimos el canvas a una imagen PNG
          const imgURL = canvas.toDataURL("image/png");
    
          // Crear un enlace de descarga
          const dlLink = document.createElement('a');
          dlLink.download = "graph_image.png";
          dlLink.href = imgURL;
          dlLink.dataset.downloadurl = ["image/png", dlLink.download, dlLink.href].join(':');
          
          // Descargar la imagen
          document.body.appendChild(dlLink);
          dlLink.click();
          document.body.removeChild(dlLink);
    
          // Revocar el objeto URL para liberar memoria
          DOMURL.revokeObjectURL(url);
        };
    
        img.src = url;  // Establecer el origen de la imagen
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
            <canvas id="canvas" width={dimensions.width} height={dimensions.height} style={{ display: 'none' }}></canvas>
            <button className="tree-generator-button" onClick={handleDownload}>
                Exportar PNG
            </button>
            <div ref={svgContainerRef} className="tree-generator-output">
                <GraphvizViewer dotString={dotString} />
            </div>
        </div>
    );
};

export default TreeGenerator;
