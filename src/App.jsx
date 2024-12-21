import { useState } from "react";
import Menu from "./Components/Menu";
import Game from "./Components/Game";
import PauseMenu from "./Components/PauseMenu";
import GameOver from "./Components/GameOver";

function App() {
  const [screen, setScreen] = useState("menu");

  return (
    <div className="App">
      {screen === "menu" && <Menu onStart={() => setScreen("game")} />}
      {screen === "game" && (
        <Game
          onPause={() => setScreen("pause")}
          onGameOver={() => setScreen("gameover")}
        />
      )}
      {screen === "gameover" && (
        <GameOver
          onStart={() => setScreen("game")}
          onQuit={() => setScreen("menu")}
        />
      )}
      {screen === "pause" && (
        <PauseMenu
          onResume={() => setScreen("game")}
          onQuit={() => setScreen("menu")}
        />
      )}
    </div>
  );
}

export default App;
