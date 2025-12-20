import './App.css'
import { GameCanvas } from './components/GameCanvas'

function App() {
  return (
    <div id="root">
      <h1 className="game-title">The Legend of Zelda</h1>
      <GameCanvas />
      <div className="controls-hint">
        <div className="hint-item"><span className="key-cap">WASD</span> Move</div>
        <div className="hint-item"><span className="key-cap">SPACE</span> Attack</div>
        <div className="hint-item"><span className="key-cap">Z</span> Bomb</div>
        <div className="hint-item"><span className="key-cap">X</span> Arrow</div>
        <div className="hint-item"><span className="key-cap">B</span> Boomerang</div>
        <div className="hint-item"><span className="key-cap">M</span> Map</div>
      </div>
    </div>
  )
}

export default App
