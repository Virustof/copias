import React from "react";
import TableTokensWithHTML from "../components/TableTokens";

const Home = () => {
  console.log("prueba")

  return (
    <div style={{ padding: "20px" }}>
        <h1>Tabla de Tokens</h1>
        <TableTokensWithHTML />
    </div>
  );
};

export default Home;
