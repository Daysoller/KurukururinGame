import { useState } from "react";
import Menu from "./Components/Menu";
import Game from "./Components/Game";
import GameOver from "./Components/GameOver";

function App() {
  const [screen, setScreen] = useState("menu");

  return (
    <div className="App">
      {screen === "menu" && <Menu onStart={() => setScreen("game")} />}
      {screen === "game" && (
        <Game
          onStart={() => setScreen("menu")}
          onGameOver={() => setScreen("gameover")}
        />
      )}
      {screen === "gameover" && (
        <GameOver
          onStart={() => setScreen("game")}
          onQuit={() => setScreen("menu")}
        />
      )}
    </div>
  );
}

export default App;
