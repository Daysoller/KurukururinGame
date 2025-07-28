/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import starsBG from "../assets/starsBG.jpg";
import Meteor from "../assets/Meteor.png";
import kururin from "../assets/kururin.gif";
import PauseMenu from "./PauseMenu";

const Game = ({ onStart, onGameOver }) => {
  const canvasRef = useRef(null);
  const meteorImgRef = useRef(null);
  const animationRef = useRef(null);
  const positionRef = useRef({ x: 100, y: 300 });
  const velocityRef = useRef(0);
  const fragmentsRef = useRef([]);
  const obstaclesRef = useRef([]);
  const bossBulletsRef = useRef([]);
  const explodingRockRef = useRef(null);
  const bossRef = useRef(null);
  const livesRef = useRef(3);
  const distanceRef = useRef(0);
  const jumpQueueRef = useRef(0);
  const bossDirectionRef = useRef(1);
  const [isPaused, setIsPaused] = useState(false);
  const [bossActive, setBossActive] = useState(false);
  const [bossLives, setBossLives] = useState(3);
  const [victory, setVictory] = useState(false);
  const [isOpenPauseMenu, setIsOpenPauseMenu] = useState(false);
  const [, forceUpdate] = useState(0);

  const gravity = 0.2;
  const jumpStrength = -10;

  useEffect(() => {
    const img = new Image();
    img.src = Meteor;
    meteorImgRef.current = img;
  }, []);

  const handleJump = () => {
    jumpQueueRef.current += 1;
  };

  const spawnObstacle = () => {
    const { innerWidth, innerHeight } = window;
    const lanes = [
      innerHeight * 0.1,
      innerHeight * 0.3,
      innerHeight * 0.5,
      innerHeight * 0.7,
      innerHeight * 0.85,
    ];
    const y = lanes[Math.floor(Math.random() * lanes.length)];
    obstaclesRef.current.push({
      x: innerWidth,
      y,
      width: innerWidth * 0.05,
      height: innerHeight * 0.05,
    });
  };

  const spawnExplodingRock = () => {
    if (!bossRef.current) return;
    const { x, y, width, height } = bossRef.current;
    explodingRockRef.current = {
      x: x + width / 2,
      y: y + height / 2,
      width: 50,
      height: 50,
      vx: -7,
      returning: false, // ← importante para saber si se está regresando
    };
  };

  const spawnBossBullet = () => {
    if (!bossRef.current) return;
    const { x, y, width, height } = bossRef.current;
    bossBulletsRef.current.push(
      ...[0, -1, 1].map((dy) => ({
        x: x + width / 2, // ← aquí usamos `width`
        y: y + height / 2,
        width: 20,
        height: 20,
        vx: -7,
        vy: dy * 2,
      }))
    );
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { innerWidth, innerHeight } = window;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    let lastObstacleTime = Date.now();
    let lastRockTime = Date.now();
    let lastShootTime = Date.now();

    const gameLoop = () => {
      if (isPaused) {
        animationRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      const now = Date.now();
      const pos = positionRef.current;
      const charWidth = innerWidth * 0.05;
      const charHeight = innerHeight * 0.05;

      if (!bossActive && distanceRef.current >= 1000) {
        setBossActive(true);
        bossRef.current = {
          x: innerWidth - 150,
          y: innerHeight / 2 - 50,
          width: 100,
          height: 100,
        };
        if (bossRef.current && bossLives > 0) {
          ctx.fillStyle = "red";
          const boss = bossRef.current;
          ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
        }
      }

      if (jumpQueueRef.current > 0) {
        velocityRef.current = jumpStrength;
        jumpQueueRef.current -= 1;
      }

      velocityRef.current += gravity;
      positionRef.current.y += velocityRef.current;
      if (positionRef.current.y < 0) positionRef.current.y = 0;
      if (positionRef.current.y > innerHeight - 100) {
        positionRef.current.y = innerHeight - 100;
        velocityRef.current = 0;
      }

      obstaclesRef.current = obstaclesRef.current
        .map((obs) => ({ ...obs, x: obs.x - 5 }))
        .filter((obs) => obs.x + obs.width > 0);

      if (bossActive && bossRef.current && now - lastShootTime > 1500) {
        spawnBossBullet();
        lastShootTime = now;
      }

      bossBulletsRef.current = bossBulletsRef.current
        .map((b) => ({ ...b, x: b.x + b.vx, y: b.y + b.vy }))
        .filter((b) => b.x + b.width > 0);

      if (bossRef.current) {
        bossRef.current.y += bossDirectionRef.current * 2;
        if (
          bossRef.current.y <= 0 ||
          bossRef.current.y + bossRef.current.height >= innerHeight
        ) {
          bossDirectionRef.current *= -1;
        }
      }

      if (
        bossActive &&
        (!explodingRockRef.current || explodingRockRef.current.x < 0) &&
        now - lastRockTime > 4000
      ) {
        spawnExplodingRock();
        lastRockTime = now;
      }

      if (explodingRockRef.current) {
        const rock = explodingRockRef.current;

        if (!rock.returning) {
          rock.x += rock.vx;

          // Verificar colisión con el jugador
          const isHit =
            rock.x < pos.x + charWidth &&
            rock.x + rock.width > pos.x &&
            rock.y < pos.y + charHeight &&
            rock.y + rock.height > pos.y;

          if (isHit) {
            // Calculamos trayectoria hacia el jefe
            const boss = bossRef.current;
            rock.vx = (boss.x - rock.x) / 10;
            rock.vy = (boss.y - rock.y) / 10;
            rock.returning = true;
          }
        } else {
          rock.x += rock.vx;
          rock.y += rock.vy;

          // Colisión con el jefe
          const boss = bossRef.current;
          const collides =
            rock.x < boss.x + boss.width &&
            rock.x + rock.width > boss.x &&
            rock.y < boss.y + boss.height &&
            rock.y + rock.height > boss.y;

          if (collides) {
            setBossLives((prev) => {
              const updated = prev - 1;
              if (updated <= 0) {
                explodingRockRef.current = null;
                bossRef.current = null;
                setVictory(true);
                setBossActive(false);
                setIsPaused(true);
                livesRef.current = 3; // Reiniciar vidas del jugador
                distanceRef.current = 0; // Reiniciar distancia
              }
              return updated;
            });
            fragmentsRef.current.push({
              x: rock.x,
              y: rock.y,
              vx: (boss.x - rock.x) / 15,
              vy: (boss.y - rock.y) / 15,
            });
            explodingRockRef.current = null;
          }
        }
      }

      fragmentsRef.current = fragmentsRef.current.map((f) => ({
        ...f,
        x: f.x + f.vx,
        y: f.y + f.vy,
      }));

      obstaclesRef.current.forEach((obs) => {
        const isColliding =
          pos.x < obs.x + obs.width &&
          pos.x + charWidth > obs.x &&
          pos.y < obs.y + obs.height &&
          pos.y + charHeight > obs.y;

        if (isColliding) {
          livesRef.current -= 1;
          obstaclesRef.current = obstaclesRef.current.filter((o) => o !== obs);
        }
      });

      bossBulletsRef.current.forEach((b) => {
        const isHit =
          pos.x < b.x + b.width &&
          pos.x + charWidth > b.x &&
          pos.y < b.y + b.height &&
          pos.y + charHeight > b.y;
        if (isHit) {
          livesRef.current -= 1;
          bossBulletsRef.current = bossBulletsRef.current.filter(
            (x) => x !== b
          );
        }
      });

      if (livesRef.current <= 0) {
        cancelAnimationFrame(animationRef.current);
        onGameOver();
        return;
      }

      if (!bossActive && now - lastObstacleTime > 1000) {
        spawnObstacle();
        lastObstacleTime = now;
      }

      distanceRef.current += 1;
      ctx.clearRect(0, 0, innerWidth, innerHeight);

      if (meteorImgRef.current) {
        obstaclesRef.current.forEach((obs) => {
          ctx.drawImage(
            meteorImgRef.current,
            obs.x,
            obs.y,
            obs.width,
            obs.height
          );
        });
      }

      if (explodingRockRef.current) {
        ctx.fillStyle = "orange";
        const rock = explodingRockRef.current;
        ctx.fillRect(rock.x, rock.y, rock.width, rock.height);
      }

      if (bossRef.current && bossLives > 0) {
        ctx.fillStyle = "red";
        const boss = bossRef.current;
        ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
      }

      bossBulletsRef.current.forEach((b) => {
        ctx.fillStyle = "cyan";
        ctx.fillRect(b.x, b.y, b.width, b.height);
      });

      fragmentsRef.current.forEach((frag) => {
        ctx.fillStyle = "yellow";
        ctx.fillRect(frag.x, frag.y, 4, 4);
      });

      forceUpdate((v) => v + 1);
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [jumpStrength, isPaused, bossActive, bossLives]);

  const getLifePercentage = () => (livesRef.current / 3) * 100;
  const getBarColor = () => {
    if (livesRef.current === 3) return "bg-green-500";
    if (livesRef.current === 2) return "bg-yellow-500";
    if (livesRef.current === 1) return "bg-red-500";
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
      <PauseMenu
        SetIsOpenPauseMenu={setIsOpenPauseMenu}
        onQuit={onStart}
        isPauseMenuOpen={isOpenPauseMenu}
        setIsPaused={setIsPaused}
      />
      <canvas ref={canvasRef} className="w-full h-full block" />

      <div
        className="absolute"
        style={{
          top: positionRef.current.y,
          left: positionRef.current.x,
          width: "100px",
          height: "100px",
        }}
      >
        <img
          src={kururin}
          alt="Character"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="absolute top-4 right-4 bg-gray-800 text-zinc-200 p-4 rounded-lg font-semibold bg-opacity-60">
        Distancia:
        <p className="text-amber-300">{distanceRef.current}m</p>
      </div>

      <button
        onClick={() => {
          setIsPaused(true);
          setIsOpenPauseMenu(true);
        }}
        className="absolute top-4 left-4 px-4 py-2 text-zinc-100 bg-blue-500 rounded hover:bg-blue-400 transition bg-opacity-60"
      >
        Pausa
      </button>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-48 h-4 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getBarColor()} transition-all duration-500`}
          style={{ width: `${getLifePercentage()}%` }}
        ></div>
      </div>

      {bossActive && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xl z-40">
          {"\u2764\uFE0F".repeat(bossLives)}
        </div>
      )}

      {victory && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-600 text-black p-8 rounded-xl shadow-lg">
            <h1 className="text-4xl font-bold mb-4"> Ganaste!</h1>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
              onClick={onStart}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
