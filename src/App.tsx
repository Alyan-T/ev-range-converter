import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Converter from "@/pages/Converter";
import Compare from "@/pages/Compare";
import Cars from "@/pages/Cars";
import VehicleDetail from "@/pages/VehicleDetail";
import Methodology from "@/pages/Methodology";
import About from "@/pages/About";
import { useEffect } from "react";

function App() {
  // Simple theme initialization (could be expanded to a context provider)
  useEffect(() => {
    const isDark = localStorage.getItem("theme") !== "light";
    if (isDark) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 md:py-12">
        <Routes>
          <Route path="/" element={<Converter />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id" element={<VehicleDetail />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
