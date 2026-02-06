import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    // Инициализация JS кода из FlyonUI если убрать модалки работать не будут!
    if (window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, []);
  return (
    <>
      <h1 className="text-blue-800 text-5xl text-center mb-3 select-none">ElectronJS + Vite + React + TS</h1>
    </>
  )
}

