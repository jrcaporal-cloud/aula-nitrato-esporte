import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/600.css'
import './index.css'
import App from './App.tsx'
import { BootReady } from './boot/BootReady'
import { registerOfflineCache } from './boot/offline'

registerOfflineCache()

// A aula monta em #app; a capa de entrada (irmã dele em #root) fica por cima até o primeiro desenho.
const container = document.getElementById('app') ?? document.getElementById('root')!

createRoot(container).render(
  <StrictMode>
    <App />
    <BootReady />
  </StrictMode>,
)
