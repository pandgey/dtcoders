import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import City from "./components/City"

function App() {
  return (
    <Canvas camera={{ position: [10, 10, 10] }} style={{ height: "100vh" }}>
      <ambientLight />
      <directionalLight position={[5, 10, 5]} />
      <City />
      <OrbitControls />
    </Canvas>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)