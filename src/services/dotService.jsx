import TreeNode from "../class/ThreeNode";

const generateDot = (root) => {
    let dot = "digraph Tree {\n";
    let nodeId = 0;

    const traverse = (node) => {
        const currentId = nodeId++;
        dot += `  node${currentId} [label="${node.label}"];\n`;

        node.children.forEach((child) => {
            const childId = traverse(child);
            dot += `  node${currentId} -> node${childId};\n`;
        });

        return currentId;
    };

    traverse(root);
    dot += "}";
    return dot;
};

/* // Construcción del árbol de derivación
const buildParseTree = () => {
    return new TreeNode("Program", [
        new TreeNode("Operaciones", [
            new TreeNode("[", [
                new TreeNode("{", [
                    new TreeNode('"operacion"', []),
                    new TreeNode(":", []),
                    new TreeNode('"resta"', []),
                    new TreeNode('"nombre"', []),
                    new TreeNode(":", []),
                    new TreeNode('"operacion1"', []),
                    new TreeNode('"valor1"', []),
                    new TreeNode(":", []),
                    new TreeNode("6.5", []),
                    new TreeNode('"valor2"', []),
                    new TreeNode(":", []),
                    new TreeNode("3.5", [])
                ]),
                new TreeNode("{", [
                    new TreeNode('"operacion"', []),
                    new TreeNode(":", []),
                    new TreeNode('"multiplicacion"', []),
                    new TreeNode('"nombre"', []),
                    new TreeNode(":", []),
                    new TreeNode('"operacion2"', []),
                    new TreeNode('"valor1"', []),
                    new TreeNode(":", []),
                    new TreeNode("2.3", []),
                    new TreeNode('"valor2"', []),
                    new TreeNode(":", [
                        new TreeNode("[", [
                            new TreeNode("{", [
                                new TreeNode('"operacion"', []),
                                new TreeNode(":", []),
                                new TreeNode('"seno"', []),
                                new TreeNode('"valor1"', []),
                                new TreeNode(":", []),
                                new TreeNode("90", [])
                            ])
                        ])
                    ])
                ]),
                new TreeNode("{", [
                    new TreeNode('"operacion"', []),
                    new TreeNode(":", []),
                    new TreeNode('"suma"', []),
                    new TreeNode('"nombre"', []),
                    new TreeNode(":", []),
                    new TreeNode('"operacion3"', []),
                    new TreeNode('"valor1"', []),
                    new TreeNode(":", []),
                    new TreeNode("2.3", []),
                    new TreeNode('"valor2"', []),
                    new TreeNode(":", [
                        new TreeNode("[", [
                            new TreeNode("{", [
                                new TreeNode('"operacion"', []),
                                new TreeNode(":", []),
                                new TreeNode('"multiplicacion"', []),
                                new TreeNode('"valor1"', []),
                                new TreeNode(":", []),
                                new TreeNode("10", []),
                                new TreeNode('"valor2"', []),
                                new TreeNode(":", [
                                    new TreeNode("[", [
                                        new TreeNode("{", [
                                            new TreeNode('"operacion"', []),
                                            new TreeNode(":", []),
                                            new TreeNode('"raiz"', []),
                                            new TreeNode('"valor1"', []),
                                            new TreeNode(":", []),
                                            new TreeNode("10", []),
                                            new TreeNode('"valor2"', []),
                                            new TreeNode(":", []),
                                            new TreeNode("2", [])
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    ])
                ])
            ])
        ]),
        new TreeNode("ConfiguracionesLex", [
            new TreeNode("[", [
                new TreeNode('"fondo"', []),
                new TreeNode(":", []),
                new TreeNode('"#000000"', []),
                new TreeNode('"fuente"', []),
                new TreeNode(":", []),
                new TreeNode('"#FFFFFF"', []),
                new TreeNode('"forma"', []),
                new TreeNode(":", []),
                new TreeNode('"circle"', []),
                new TreeNode('"tipoFuente"', []),
                new TreeNode(":", []),
                new TreeNode('"Times-Roman"', [])
            ])
        ]),
        new TreeNode("ConfiguracionesParser", [
            new TreeNode("[", [
                new TreeNode('"fondo"', []),
                new TreeNode(":", []),
                new TreeNode('"#f3ff00"', []),
                new TreeNode('"fuente"', []),
                new TreeNode(":", []),
                new TreeNode('"#000000"', []),
                new TreeNode('"forma"', []),
                new TreeNode(":", []),
                new TreeNode('"box"', []),
                new TreeNode('"tipoFuente"', []),
                new TreeNode(":", []),
                new TreeNode('"Arial"', [])
            ])
        ]),
        new TreeNode("Instrucciones", [
            new TreeNode("imprimir", [new TreeNode('("Lenguajes Formales y de Programacion")', [])]),
            new TreeNode("conteo", []),
            new TreeNode("promedio", [new TreeNode('("suma")', [])]),
            new TreeNode("max", [new TreeNode('("multiplicacion")', [])]),
            new TreeNode("min", [new TreeNode('("raiz")', [])]),
            new TreeNode("generarReporte", [new TreeNode('("tokens")', [])]),
            new TreeNode("generarReporte", [new TreeNode('("errores", "201700761")', [])]),
            new TreeNode("generarReporte", [new TreeNode('("arbol", "Nueva derivacion")', [])])
        ])
    ]);
}; */

// Paso 3: Función para convertir datos en un árbol
const buildParseTree = (data) => {
    const traverseObject = (obj, label = "root") => {
        return {
            label,
            children: Object.entries(obj).map(([key, value]) => {
                if (Array.isArray(value)) {
                    return traverseArray(value, key);
                } else if (typeof value === "object") {
                    return traverseObject(value, key);
                } else {
                    return { label: `${key}: ${value}` };
                }
            }),
        };
    };

    const traverseArray = (arr, label = "array") => {
        return {
            label,
            children: arr.map((item, index) =>
                typeof item === "object"
                    ? traverseObject(item, `[${index}]`)
                    : { label: `${index}: ${item}` }
            ),
        };
    };

    return traverseObject(data, "Program");
};

// Paso 4: Generar el string DOT para D3
const generateDotForD3 = (tree) => {
    let result = "digraph {\n";
    let counter = 0;

    const traverse = (node, parentId = null) => {
        const nodeId = `node${counter++}`;
        result += `  ${nodeId} [label="${node.label.replace(/"/g, '\'')}"];\n`;

        if (parentId) {
            result += `  ${parentId} -> ${nodeId};\n`;
        }

        if (node.children) {
            node.children.forEach((child) => traverse(child, nodeId));
        }
    };

    traverse(tree);
    result += "}";
    return result;
};

export {buildParseTree, generateDot, generateDotForD3};