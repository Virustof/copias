import { useEffect } from "react";
import { graphviz } from "d3-graphviz";

const GraphvizViewer = ({ dotString }) => {
  useEffect(() => {
    if (dotString) {
      console.log("Rendering DOT string:", dotString);
      try {
        // Renderizar el gráfico dentro del div con id "graph"
        graphviz("#graph")
          .renderDot(dotString)
          .zoom(true); // Activa el zoom por si el gráfico es muy grande
      } catch (error) {
        console.error("Error al renderizar el DOT:", error);
      }
    } else {
      console.error("DOT string vacío o inválido.");
    }
  }, [dotString]);

  return <div id="graph" className="graph-container"></div>;
};

export default GraphvizViewer;
