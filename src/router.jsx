import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Analyze from "./pages/Analyze";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/report" element={<Report />} />
      <Route path="/analyze" element={<Analyze />} />
    </Routes>
  );
};

export default AppRouter;
