import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";


import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Analyze from "./pages/Analyze";
import Analyzing from "./pages/Analyzing";
import Results from "./pages/Results";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/analyzing" element={<Analyzing />} />
        <Route path="/results/:sessionId" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
