import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import PurchaseEntry from "./pages/PurchaseEntry";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import PurchaseReport from "./pages/PurchaseReport";

import "./App.css";

function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <main>

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/purchase"
            element={<PurchaseEntry />}
          />

          <Route
            path="/purchase-success"
            element={<PurchaseSuccess />}
          />

          <Route
            path="/reports"
            element={<PurchaseReport />}
          />

        </Routes>

      </main>

    </BrowserRouter>

  );

}

export default App;