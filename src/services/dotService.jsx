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

// Generar DOT
function generarDot(entrada) {

    // Extraer contenido por secciones
    const operacionesRaw = extractAnidado(entrada.replace(/\s+/g, ' ').trim(), "Operaciones=[");
    const configuracionesLexRaw = extractAnidado(entrada.replace(/\s+/g, ' ').trim(), "ConfiguracionesLex = [");
    const configuracionesParserRaw = extractAnidado(entrada.replace(/\s+/g, ' ').trim(), "ConfiguracionesParser = [");

    const funcionesRegex = /(\w+\(.*?\))/g;
    const comentariosRegex = /(\/\/.*$|\/\*.*?\*\/)/gsm;

    // Procesar secciones
    const operaciones = operacionesRaw
        ? JSON.parse(`[${operacionesRaw.replace(/(\w+):/g, '"$1":')}]`)
        : [];
    const configuracionesLex = configuracionesLexRaw
        ? configuracionesLexRaw.split(",").map(config => config.trim())
        : [];
    const configuracionesParser = configuracionesParserRaw
        ? configuracionesParserRaw.split(",").map(config => config.trim())
        : [];
    const funciones = entrada.match(funcionesRegex) || [];
    const comentarios = entrada.match(comentariosRegex) || [];

    let dot = "digraph {\n";
    let contadorNodo = 0;

    // Crear nodo raíz
    const raiz = `nodo${contadorNodo++}`;
    dot += `  ${raiz} [label="Archivo"];\n`;

    // Generar sección de Operaciones
    const nodoOperaciones = `nodo${contadorNodo++}`;
    dot += `  ${nodoOperaciones} [label="Operaciones"];\n  ${raiz} -> ${nodoOperaciones};\n`;

    const generarNodoOperaciones = (operacion, padre) => {
        const nodoId = `nodo${contadorNodo++}`;
        dot += `  ${nodoId} [label="${operacion.operacion.replace(/"/g, '\\"')}"];\n  ${padre} -> ${nodoId};\n`;

        if (operacion.valor1 && typeof operacion.valor1 === "object") {
            generarNodoOperaciones(operacion.valor1, nodoId);
        } else if (operacion.valor1 !== undefined) {
            const valorNodo = `nodo${contadorNodo++}`;
            dot += `  ${valorNodo} [label="${operacion.valor1}"];\n  ${nodoId} -> ${valorNodo};\n`;
        }

        if (operacion.valor2 && typeof operacion.valor2 === "object") {
            if (Array.isArray(operacion.valor2)) {
                operacion.valor2.forEach(op => generarNodoOperaciones(op, nodoId));
            } else {
                generarNodoOperaciones(operacion.valor2, nodoId);
            }
        } else if (operacion.valor2 !== undefined) {
            const valorNodo = `nodo${contadorNodo++}`;
            dot += `  ${valorNodo} [label="${operacion.valor2}"];\n  ${nodoId} -> ${valorNodo};\n`;
        }
    };
    console.log(operaciones)

    operaciones.forEach(op => generarNodoOperaciones(op, nodoOperaciones));

    // Generar sección de Configuraciones
    const nodoConfiguraciones = `nodo${contadorNodo++}`;
    dot += `  ${nodoConfiguraciones} [label="Configuraciones"];\n  ${raiz} -> ${nodoConfiguraciones};\n`;

    const nodoLex = `nodo${contadorNodo++}`;
    dot += `  ${nodoLex} [label="ConfiguracionesLex"];\n  ${nodoConfiguraciones} -> ${nodoLex};\n`;
    configuracionesLex.forEach(config => {
        const nodoConfig = `nodo${contadorNodo++}`;
        dot += `  ${nodoConfig} [label="${config.trim().replace(/"/g, '\\"')}"];\n  ${nodoLex} -> ${nodoConfig};\n`;
    });

    const nodoParser = `nodo${contadorNodo++}`;
    dot += `  ${nodoParser} [label="ConfiguracionesParser"];\n  ${nodoConfiguraciones} -> ${nodoParser};\n`;
    configuracionesParser.forEach(config => {
        const nodoConfig = `nodo${contadorNodo++}`;
        dot += `  ${nodoConfig} [label="${config.trim().replace(/"/g, '\\"')}"];\n  ${nodoParser} -> ${nodoConfig};\n`;
    });

    // Generar sección de Funciones
    const nodoFunciones = `nodo${contadorNodo++}`;
    dot += `  ${nodoFunciones} [label="Funciones"];\n  ${raiz} -> ${nodoFunciones};\n`;
    funciones.forEach(func => {
        const nodoFunc = `nodo${contadorNodo++}`;
        dot += `  ${nodoFunc} [label="${func.trim().replace(/"/g, '\\"')}"];\n  ${nodoFunciones} -> ${nodoFunc};\n`;
    });

    // Generar sección de Comentarios
    const nodoComentarios = `nodo${contadorNodo++}`;
    dot += `  ${nodoComentarios} [label="Comentarios"];\n  ${raiz} -> ${nodoComentarios};\n`;
    comentarios.forEach(comentario => {
        const nodoComentario = `nodo${contadorNodo++}`;
        dot += `  ${nodoComentario} [label="${comentario.trim().replace(/"/g, '\\"')}"];\n  ${nodoComentarios} -> ${nodoComentario};\n`;
    });

    dot += "}\n";
    return dot;
}
// Utilidad para extraer bloques anidados
function extractAnidado(input, startKey) {
    const start = input.indexOf(startKey);
    console.log(input)
    console.log('comienzo',start)
    if (start === -1) return null;

    let openBrackets = 0;
    let end = -1;
    
    for (let i = start + (startKey.length - 1); i < input.length; i++) {
        if (input[i] === "[") openBrackets++;
        if (input[i] === "]") openBrackets--;
        console.log('entrada input ',input[i])
        console.log('abiertos',openBrackets)
        if (openBrackets === 0) {
            end = i;
            break;
        }
    }

    if (end === -1) return null; // No se encontró cierre correspondiente
    console.log( input.substring(start + startKey.length + 1, end).trim())
    return input.substring(start + startKey.length + 1, end).trim();
}

export {buildParseTree, generarDot, generateDot, extractAnidado};