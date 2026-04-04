import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalTestProvider } from "./context/GlobalTestContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ControlPanel from "./pages/ControlPanel";
import HowItWorks from "./pages/HowItWorks";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

const App = () => (
  <GlobalTestProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/control-panel" element={<ControlPanel />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </GlobalTestProvider>
);

export default App;
