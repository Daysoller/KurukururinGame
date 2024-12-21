import { useEffect, useRef, useState } from "react";
import starsBG from "../assets/starsBG.jpg";
import Meteor from "../assets/Meteor.png";
// eslint-disable-next-line react/prop-types
const Game = ({ onPause, onGameOver }) => {
  const [position, setPosition] = useState({ x: 100, y: 300 });
  const [obstacles, setObstacles] = useState([]);
  const [distance, setDistance] = useState(0);
  const [lives, setLives] = useState(3);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpQueue, setJumpQueue] = useState(0);
  const canvasRef = useRef(null);
  const meteorImgRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = Meteor;
    meteorImgRef.current = img;
  }, []);

  const handleJump = () => {
    setJumpQueue((prev) => prev + 1);
    setIsJumping(true);

    setTimeout(() => {
      setIsJumping(false);
    }, 900);
  };

  const getCanvasDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return { width, height };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const { width, height } = getCanvasDimensions();

    ctx.clearRect(0, 0, width, height);

    obstacles.forEach((obs) => {
      if (meteorImgRef.current) {
        ctx.drawImage(
          meteorImgRef.current,
          obs.x,
          obs.y,
          obs.width,
          obs.height
        );
      }
    });
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => ({
        ...prev,
        y: Math.min(prev.y + 5, window.innerHeight - 50),
      }));

      setObstacles((prev) =>
        prev.map((obs) => ({ ...obs, x: obs.x - 5 })).filter((obs) => obs.x > 0)
      );

      setDistance((prev) => prev + 1);

      drawCanvas();
    }, 50);

    return () => clearInterval(interval);
  }, [drawCanvas, obstacles]);

  useEffect(() => {
    const generateObstacle = setInterval(() => {
      const isBottom = Math.random() < 0.5;
      setObstacles((prev) => [
        ...prev,
        {
          x: window.innerWidth,
          y: isBottom
            ? window.innerHeight - window.innerHeight * 0.05
            : Math.random() * window.innerHeight * 0.7,
          width: window.innerWidth * 0.05,
          height: window.innerHeight * 0.05,
        },
      ]);
    }, 2000);

    return () => clearInterval(generateObstacle);
  }, []);

  useEffect(() => {
    if (jumpQueue > 0) {
      setJumpQueue((prev) => prev - 1);
      setPosition((prev) => ({
        ...prev,
        y: Math.max(prev.y - 70, 0),
      }));
    }
  }, [jumpQueue, position]);

  useEffect(() => {
    obstacles.forEach((obs) => {
      if (
        position.x < obs.x + obs.width &&
        position.x + window.innerWidth * 0.05 > obs.x &&
        position.y < obs.y + obs.height &&
        position.y + window.innerHeight * 0.05 > obs.y
      ) {
        setLives((prev) => prev - 1);
        setObstacles((prev) => prev.filter((o) => o !== obs));
      }
    });

    if (lives <= 0) {
      onGameOver();
    }
  }, [obstacles, position, lives, onGameOver]);

  const getLifePercentage = () => (lives / 3) * 100;

  const getBarColor = () => {
    if (lives === 3) return "bg-green-500";
    if (lives === 2) return "bg-yellow-500";
    if (lives === 1) return "bg-red-500";
    return "bg-gray-700";
  };

  return (
    <div
      className="relative w-full h-full bg-gray-900 select-none cursor-pointer"
      onClick={handleJump}
      style={{
        backgroundImage: `url(${starsBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        width={getCanvasDimensions().width}
        height={getCanvasDimensions().height}
      ></canvas>

      <div
        className="absolute"
        style={{
          top: position.y,
          left: position.x,
          width: "100px",
          height: "100px",
        }}
      >
        {isJumping ? (
          <img
            src="kururin.gif"
            alt="Jumping character"
            className="w-full h-full object-contain"
          />
        ) : (
          <img
            src="kururinIDLE.gif"
            alt="Static character"
            className="w-full h-full object-contain"
          />
        )}
      </div>

      <div className="absolute top-4 right-4 bg-gray-800 text-zinc-200 p-4 rounded-lg font-semibold">
        Distancia:<p className="text-amber-300"> {distance}m</p>
      </div>
      <button
        onClick={onPause}
        className="absolute top-4 left-4 px-4 py-2 text-zinc-100 bg-blue-600 rounded hover:bg-blue-500 transition"
      >
        Pausa
      </button>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-64 h-4 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getBarColor()} transition-all duration-500`}
          style={{ width: `${getLifePercentage()}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Game;
