/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import starsBG from "../assets/starsBG.jpg";
import Meteor from "../assets/Meteor.png";
import GiantMeteor from "../assets/GiantMeteor.png";
import kururin from "../assets/kururin.gif";
import PauseMenu from "./PauseMenu";
import confetti from "canvas-confetti";

// ===== CONFIGURACIÓN DEL JUEGO =====

const GAME_CONFIG = {
  GRAVITY: 0.0045,
  JUMP_STRENGTH: -1.2,
  BOSS_SPAWN_DISTANCES: {
    1: 6000,
    2: 12000,
    3: 18000,
  },
  BOSS_CONFIGS: {
    1: {
      lives: 3,
      width: 100,
      height: 100,
      shootInterval: 1500,
      speed: 0.12, // px/ms
      color: "rgb(220, 50, 50)",
    },
    2: {
      lives: 5,
      width: 120,
      height: 120,
      shootInterval: 1000,
      speed: 0.16,
      color: "rgb(200, 100, 0)",
    },
    3: {
      lives: 7,
      width: 150,
      height: 150,
      shootInterval: 800,
      speed: 0.20,
      color: "rgb(150, 0, 150)",
    },
  },
  OBSTACLE_SPAWN_INTERVAL: 900,
  GIANT_ROCK_CONFIG: {
    width: 50,
    height: 50,
    velocity: -0.25, // px/ms
  },
};

const Game = ({ onStart, onGameOver }) => {
  const canvasRef = useRef(null);
  const charRef = useRef(null);  // DOM Reference para movimiento fluido

  const meteorImgRef = useRef(null);
  const giantMeteorImgRef = useRef(null);
  const animationRef = useRef(null);

  const positionRef = useRef({ x: 100, y: 300 });
  const velocityRef = useRef(0);

  const fragmentsRef = useRef([]);
  const obstaclesRef = useRef([]);
  const bossBulletsRef = useRef([]);
  const explodingRocksRef = useRef([]);
  const bossRef = useRef(null);
  const livesRef = useRef(3);
  const distanceRef = useRef(5000);
  const jumpQueueRef = useRef(0);
  const bossDirectionRef = useRef(1);
  const bossPhaseRef = useRef(0);
  const bossNextAttackRef = useRef('bullet'); // 'bullet' or 'meteor'
  const defeatedBossesRef = useRef(new Set()); // Track defeated bosses

  // Timers para lógica (usando refs para persistencia en loop)
  const lastTimeRef = useRef(0);
  const lastObstacleTimeRef = useRef(0);
  const lastShootTimeRef = useRef(0);

  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const [bossLives, setBossLives] = useState(3);
  const [victory, setVictory] = useState(false);
  const [isOpenPauseMenu, setIsOpenPauseMenu] = useState(false);
  const [showInitialText, setShowInitialText] = useState(true);
  const [showBossText, setShowBossText] = useState(false);
  const [displayDistance, setDisplayDistance] = useState(0);
  const [, forceUpdate] = useState(0); // Force re-render trigger

  const initialTextTimerRef = useRef(null);
  const bossTextTimerRef = useRef(null);

  useEffect(() => {
    isPausedRef.current = isPaused;
    if (!isPaused) {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPaused]);

  useEffect(() => {
    if (!bossRef.current) {
      setShowInitialText(true);
      clearTimeout(initialTextTimerRef.current);
      initialTextTimerRef.current = setTimeout(() => {
        setShowInitialText(false);
      }, 8000);
    }

    if (bossRef.current && bossPhaseRef.current > 0) {
      setShowBossText(true);
      clearTimeout(bossTextTimerRef.current);
      bossTextTimerRef.current = setTimeout(() => {
        setShowBossText(false);
      }, 6000);
    }

    return () => {
      clearTimeout(initialTextTimerRef.current);
      clearTimeout(bossTextTimerRef.current);
    };
  }, [bossPhaseRef.current]);

  useEffect(() => {
    const img = new Image();
    img.src = Meteor;
    meteorImgRef.current = img;

    const giantImg = new Image();
    giantImg.src = GiantMeteor;
    giantMeteorImgRef.current = giantImg;
  }, []);

  const handleJump = (e) => {
    if (!isPaused && !victory) {
      jumpQueueRef.current += 1;
    }
  };

  const spawnBoss = (phase) => {
    const { innerWidth, innerHeight } = window;
    const config = GAME_CONFIG.BOSS_CONFIGS[phase];
    bossPhaseRef.current = phase;
    bossRef.current = {
      x: innerWidth - config.width - 50,
      y: innerHeight / 2 - config.height / 2,
      width: config.width,
      height: config.height,
      phase,
    };
    setBossLives(config.lives);
    bossNextAttackRef.current = 'bullet'; // Reset attack cycle
  };

  const spawnExplosionFragments = (meteorite) => {
    if (bossPhaseRef.current < 1) return;
    if (Math.random() > 0.4) return;

    const speed = 0.3;
    const fragmentPositions = [
      { vx: -speed, vy: -speed * 0.8 },
      { vx: -speed, vy: 0 },
      { vx: -speed, vy: speed * 0.8 },
    ];

    fragmentPositions.forEach((pos) => {
      fragmentsRef.current.push({
        x: meteorite.x,
        y: meteorite.y,
        vx: pos.vx,
        vy: pos.vy,
        life: 60,
        isFragment: true,
        radius: 8,
      });
    });
  };

  const spawnObstacle = () => {
    const { innerWidth, innerHeight } = window;
    const lanes = [
      innerHeight * 0.01, innerHeight * 0.015, innerHeight * 0.02, innerHeight * 0.025,
      innerHeight * 0.06, innerHeight * 0.1, innerHeight * 0.2, innerHeight * 0.38,
      innerHeight * 0.46, innerHeight * 0.5, innerHeight * 0.54, innerHeight * 0.62,
      innerHeight * 0.7, innerHeight * 0.8, innerHeight * 0.9, innerHeight * 0.96,
      innerHeight * 0.97, innerHeight * 0.98, innerHeight * 0.98,
    ];
    const y = lanes[Math.floor(Math.random() * lanes.length)];
    const newObstacle = {
      x: innerWidth,
      y,
      width: innerWidth * 0.05,
      height: innerHeight * 0.05,
    };

    if (bossPhaseRef.current >= 1 && Math.random() < 0.4) {
      newObstacle.exploding = true;
      newObstacle.hasExploded = false;
    }

    obstaclesRef.current.push(newObstacle);
  };

  const spawnExplodingRock = () => {
    if (!bossRef.current) return;
    const { x, y, width, height } = bossRef.current;
    const config = GAME_CONFIG.GIANT_ROCK_CONFIG;
    explodingRocksRef.current.push({
      x: x + width / 2,
      y: y + height / 2,
      width: config.width,
      height: config.height,
      vx: config.velocity,
      vy: 0,
      returning: false,
      exploding: false,
      explosionTime: 0,
    });
  };

  const spawnBossBullet = (phase) => {
    if (!bossRef.current) return;
    const { x, y, width, height } = bossRef.current;
    const bullets = [];
    const speedMultiplier = 0.06;

    if (phase === 1) {
      bullets.push(
        ...[0, -1, 1].map((dy) => ({
          x: x + width / 2,
          y: y + height / 2,
          width: 15,
          height: 15,
          vx: -7 * speedMultiplier,
          vy: dy * 2 * speedMultiplier,
        }))
      );
    } else if (phase === 2) {
      const angles = [-2, -1, 0, 1, 2];
      bullets.push(
        ...angles.map((dy) => ({
          x: x + width / 2,
          y: y + height / 2,
          width: 15,
          height: 15,
          vx: -6 * speedMultiplier,
          vy: dy * 1.5 * speedMultiplier,
        }))
      );
    } else if (phase === 3) {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        bullets.push({
          x: x + width / 2,
          y: y + height / 2,
          width: 12,
          height: 12,
          vx: Math.cos(angle) * -5 * speedMultiplier,
          vy: Math.sin(angle) * 3 * speedMultiplier,
        });
      }
    }

    bossBulletsRef.current.push(...bullets);
  };

  const createExplosion = (x, y) => {
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const speed = 0.2 + Math.random() * 0.3;
      fragmentsRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 30,
      });
    }
  };

  const gameLoop = (time) => {
    if (isPausedRef.current || victory) {
      return;
    }

    if (!lastTimeRef.current) lastTimeRef.current = time;
    const dt = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // Capped dt evitar saltos enormes (por ejemplo al cambiar tabs)
    const cappedDt = Math.min(dt, 64);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { innerWidth, innerHeight } = window;

    // UI Distance Update
    setDisplayDistance(Math.floor(distanceRef.current));

    // ===== SPAWN BOSSES & OBSTACLES =====
    if (!bossRef.current) {
      // Spawn Boss check
      const currentDist = distanceRef.current;
      for (let phase = 1; phase <= 3; phase++) {
        if (
          currentDist >= GAME_CONFIG.BOSS_SPAWN_DISTANCES[phase] &&
          !defeatedBossesRef.current.has(phase)
        ) {
          spawnBoss(phase);
          break; // Only spawn one boss at a time
        }
      }

      // Spawn Meteorites (Solo si no hay boss)
      if (time - lastObstacleTimeRef.current > GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL) {
        spawnObstacle();
        lastObstacleTimeRef.current = time;
      }
    }

    // ===== PHYSICS PERSONAJE =====
    if (jumpQueueRef.current > 0) {
      velocityRef.current = GAME_CONFIG.JUMP_STRENGTH;
      jumpQueueRef.current -= 1;
    }

    velocityRef.current += GAME_CONFIG.GRAVITY * cappedDt;
    positionRef.current.y += velocityRef.current * cappedDt;

    const charHeight = innerHeight * 0.05;
    const charWidth = innerWidth * 0.05;

    // Limites verticales
    if (positionRef.current.y < 0) {
      positionRef.current.y = 0;
      velocityRef.current = 0; // Detener vs techo
    }
    if (positionRef.current.y + charHeight > innerHeight) {
      positionRef.current.y = innerHeight - charHeight;
      velocityRef.current = 0; // Detener vs suelo
    }

    // DOM Update (Fluidez visual)
    if (charRef.current) {
      charRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
    }

    // ===== UPDATE OBSTACLES =====
    obstaclesRef.current = obstaclesRef.current
      .map((obs) => {
        if (obs.exploding && !obs.hasExploded && obs.x < innerWidth - 200) {
          obs.hasExploded = true;
          spawnExplosionFragments(obs);
          return null;
        }

        if (obs.isFragment) {
          return {
            ...obs,
            x: obs.x + obs.vx * cappedDt,
            y: obs.y + obs.vy * cappedDt,
            vy: obs.vy + 0.005 * cappedDt,
            life: obs.life - 1 * (cappedDt / 16),
          };
        }

        // Velocidad obstaculos
        return { ...obs, x: obs.x - 0.3 * cappedDt };
      })
      .filter(
        (obs) =>
          obs !== null &&
          (obs.isFragment ? obs.life > 0 : obs.x + obs.width > 0)
      );

    // ===== UPDATE BOSS =====
    if (bossRef.current) {
      const bossConfig = GAME_CONFIG.BOSS_CONFIGS[bossRef.current.phase];

      // Movimiento vertical
      bossRef.current.y += bossDirectionRef.current * bossConfig.speed * cappedDt;

      if (
        bossRef.current.y <= 0 ||
        bossRef.current.y + bossRef.current.height >= innerHeight
      ) {
        bossDirectionRef.current *= -1;
        bossRef.current.y = Math.max(0, Math.min(bossRef.current.y, innerHeight - bossRef.current.height));
      }

      // Disparos
      if (time - lastShootTimeRef.current > bossConfig.shootInterval) {
        if (bossNextAttackRef.current === 'meteor') {
          console.log('🚀 BOSS SHOOTING GIANT METEOR!');
          spawnExplodingRock();
          bossNextAttackRef.current = 'bullet';
        } else {
          console.log('🔫 Boss shooting bullet');
          spawnBossBullet(bossRef.current.phase);
          bossNextAttackRef.current = 'meteor';
        }
        lastShootTimeRef.current = time;
      }
    }

    // ===== UPDATE BULLETS =====
    bossBulletsRef.current = bossBulletsRef.current
      .map((b) => ({ ...b, x: b.x + b.vx * cappedDt, y: b.y + b.vy * cappedDt }))
      .filter((b) => b.x + b.width > 0 && b.y > 0 && b.y < innerHeight);

    // ===== UPDATE ROCKS (Giant Meteors) =====
    const pos = positionRef.current;

    explodingRocksRef.current = explodingRocksRef.current
      .map((rock) => {
        if (!rock.returning && !rock.exploding) {
          rock.x += rock.vx * cappedDt;
          // Collision player
          const isHit =
            rock.x - rock.width / 2 < pos.x + charWidth &&
            rock.x + rock.width / 2 > pos.x &&
            rock.y - rock.height / 2 < pos.y + charHeight &&
            rock.y + rock.height / 2 > pos.y;

          if (isHit) {
            console.log('🎯 PLAYER HIT GIANT METEOR! Deflecting back to boss');
            const boss = bossRef.current;
            rock.vx = (boss.x - rock.x) / 500; // Return velocity factor
            rock.vy = (boss.y - rock.y) / 500;
            rock.returning = true;
            console.log('✅ Meteor now returning:', { x: rock.x, y: rock.y, vx: rock.vx, vy: rock.vy });
          }
        } else if (rock.returning && !rock.exploding) {
          rock.x += rock.vx * cappedDt * 20;
          rock.y += rock.vy * cappedDt * 20;

          // Collision boss
          const boss = bossRef.current;
          const collides =
            boss &&
            rock.x - rock.width / 2 < boss.x + boss.width &&
            rock.x + rock.width / 2 > boss.x &&
            rock.y - rock.height / 2 < boss.y + boss.height &&
            rock.y + rock.height / 2 > boss.y;

          if (collides) {
            console.log('💥 METEOR HIT BOSS! Damaging boss...');
            rock.exploding = true;
            createExplosion(rock.x, rock.y);
            setBossLives(prev => {
              const updated = prev - 1;
              console.log(`❤️ Boss lives: ${prev} -> ${updated}`);
              if (updated <= 0) {
                console.log('🏆 BOSS DEFEATED!');
                explodingRocksRef.current = [];
                defeatedBossesRef.current.add(bossPhaseRef.current); // Mark boss as defeated
                bossRef.current = null;
                if (bossPhaseRef.current === 3) {
                  setVictory(true);
                  setIsPaused(true);
                } else {
                  livesRef.current = 3;
                }
              }
              return updated;
            });
          } else if (rock.returning) {
            // Debug: Check why collision might not be detected
            if (boss) {
              const rockLeft = rock.x - rock.width / 2;
              const rockRight = rock.x + rock.width / 2;
              const rockTop = rock.y - rock.height / 2;
              const rockBottom = rock.y + rock.height / 2;
              console.log('🔍 Checking collision:', {
                rock: { x: rock.x, y: rock.y, left: rockLeft, right: rockRight, top: rockTop, bottom: rockBottom },
                boss: { x: boss.x, y: boss.y, right: boss.x + boss.width, bottom: boss.y + boss.height },
                checks: {
                  leftCheck: rockLeft < boss.x + boss.width,
                  rightCheck: rockRight > boss.x,
                  topCheck: rockTop < boss.y + boss.height,
                  bottomCheck: rockBottom > boss.y
                }
              });
            }
          }
        } else if (rock.exploding) {
          rock.explosionTime += 1 * (cappedDt / 16);
        }
        return rock;
      })
      .filter(r => !(r.exploding && r.explosionTime > 20));


    // ===== UPDATE FRAGMENTS =====
    fragmentsRef.current = fragmentsRef.current
      .map(f => ({
        ...f,
        x: f.x + f.vx * cappedDt,
        y: f.y + f.vy * cappedDt,
        life: f.life - 1 * (cappedDt / 16),
        vx: f.vx * 0.98,
        vy: f.vy * 0.98 + 0.01 * cappedDt
      }))
      .filter(f => f.life > 0 && f.y < innerHeight);


    // ===== COLLISION DETECTION =====
    obstaclesRef.current.forEach(obs => {
      let isColliding = false;
      if (obs.isFragment) {
        const closestX = Math.max(pos.x, Math.min(obs.x, pos.x + charWidth));
        const closestY = Math.max(pos.y, Math.min(obs.y, pos.y + charHeight));
        const distX = obs.x - closestX;
        const distY = obs.y - closestY;
        const dist = Math.sqrt(distX * distX + distY * distY);
        isColliding = dist < obs.radius + charWidth / 4;
      } else {
        isColliding =
          pos.x < obs.x + obs.width &&
          pos.x + charWidth > obs.x &&
          pos.y < obs.y + obs.height &&
          pos.y + charHeight > obs.y;
      }

      if (isColliding) {
        livesRef.current -= 1;
        obstaclesRef.current = obstaclesRef.current.filter(o => o !== obs);
      }
    });

    bossBulletsRef.current.forEach(b => {
      const isHit =
        pos.x < b.x + b.width &&
        pos.x + charWidth > b.x &&
        pos.y < b.y + b.height &&
        pos.y + charHeight > b.y;
      if (isHit) {
        livesRef.current -= 1;
        bossBulletsRef.current = bossBulletsRef.current.filter(x => x !== b);
      }
    });

    if (livesRef.current <= 0) {
      cancelAnimationFrame(animationRef.current);
      onGameOver();
      return;
    }

    // ===== RENDER =====
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    // Obstaculos
    if (meteorImgRef.current && meteorImgRef.current.complete) {
      obstaclesRef.current.forEach(obs => {
        if (!obs.isFragment) {
          ctx.drawImage(meteorImgRef.current, obs.x, obs.y, obs.width, obs.height);
        }
      });
    }

    // Fragmentos
    obstaclesRef.current.forEach(obs => {
      if (obs.isFragment) {
        const alpha = obs.life / 60;
        ctx.fillStyle = `rgba(255, 150, 100, ${alpha})`;
        ctx.shadowColor = `rgba(255, 150, 100, ${alpha})`;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = "transparent";
      }
    });

    // Giant Meteors (Proyectiles Boss)
    if (giantMeteorImgRef.current && giantMeteorImgRef.current.complete) {
      explodingRocksRef.current.forEach(rock => {
        if (!rock.exploding) {
          ctx.shadowColor = "rgba(255, 220, 0, 0.8)";
          ctx.shadowBlur = 30;
          ctx.drawImage(giantMeteorImgRef.current, rock.x - rock.width / 2, rock.y - rock.height / 2, rock.width, rock.height);
          ctx.shadowColor = "transparent";
        }
      });
    }

    // Boss
    if (bossRef.current && bossLives > 0) {
      const boss = bossRef.current;
      const config = GAME_CONFIG.BOSS_CONFIGS[boss.phase];
      ctx.fillStyle = config.color;
      ctx.shadowColor = config.color;
      ctx.shadowBlur = 20;
      ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 2;
      ctx.strokeRect(boss.x, boss.y, boss.width, boss.height);
    }

    // Boss Bullets
    bossBulletsRef.current.forEach(b => {
      ctx.fillStyle = "rgba(0, 255, 255, 0.8)";
      ctx.shadowColor = "rgb(0, 255, 255)";
      ctx.shadowBlur = 10;
      ctx.fillRect(b.x - b.width / 2, b.y - b.height / 2, b.width, b.height);
      ctx.shadowColor = "transparent";
    });

    // Particles/Fragments
    fragmentsRef.current.forEach(frag => {
      ctx.fillStyle = `rgba(255, 200, 0, ${frag.life / 30})`;
      ctx.fillRect(frag.x, frag.y, 4, 4);
    });

    // Barra Progreso
    const barWidth = 250;
    const barHeight = 4;
    const barX = innerWidth / 2 - barWidth / 2;
    const barY = 50;
    const totalDistance = GAME_CONFIG.BOSS_SPAWN_DISTANCES[3];
    const totalProgress = Math.min(distanceRef.current / totalDistance, 1);

    ctx.fillStyle = "rgba(100, 120, 140, 0.4)";
    ctx.fillRect(barX, barY, barWidth, barHeight);

    ctx.fillStyle = "rgba(100, 150, 200, 0.6)";
    ctx.fillRect(barX, barY, barWidth * totalProgress, barHeight);

    const bossDivisions = [1, 2, 3];
    bossDivisions.forEach((bossNum) => {
      const bossDistance = GAME_CONFIG.BOSS_SPAWN_DISTANCES[bossNum];
      const divisionProgress = bossDistance / totalDistance;
      const divX = barX + barWidth * divisionProgress;
      ctx.fillStyle = distanceRef.current >= bossDistance ? "rgba(220, 140, 60, 0.9)" : "rgba(120, 120, 120, 0.5)";
      ctx.beginPath();
      ctx.arc(divX, barY + barHeight / 2, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(200, 200, 200, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "bold 10px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(bossNum.toString(), divX, barY + barHeight / 2);
    });

    // Increase Distance
    if (!bossRef.current) {
      distanceRef.current += 1 * (cappedDt / 16);
    }

    // Force React re-render to sync UI with game state
    forceUpdate(n => n + 1);

    animationRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const { innerWidth, innerHeight } = window;
    const resizeCanvas = () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const getLifePercentage = () => (livesRef.current / 3) * 100;
  const getBarColor = () => {
    if (livesRef.current === 3) return "bg-green-500";
    if (livesRef.current === 2) return "bg-yellow-500";
    if (livesRef.current === 1) return "bg-red-500";
    return "bg-gray-700";
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-gray-900 select-none cursor-pointer overflow-hidden"
      onClick={handleJump}
      style={{
        backgroundImage: `url(${starsBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <PauseMenu
        setIsOpenPauseMenu={setIsOpenPauseMenu}
        onQuit={onStart}
        isPauseMenuOpen={isOpenPauseMenu}
        setIsPaused={setIsPaused}
      />

      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ display: "block" }}
      />

      {/* Personaje con referencia directa para animacion 60FPS */}
      <div
        ref={charRef}
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: 0,
          willChange: 'transform',
          width: "5vw",
          minWidth: "50px",
          height: "5vh",
          minHeight: "50px",
          maxWidth: "100px",
          maxHeight: "100px",
        }}
      >
        <img
          src={kururin}
          alt="Character"
          className="w-full h-full object-contain"
        />
      </div>

      {/* HUD - Distancia */}
      <div className="absolute top-4 right-4 text-white text-lg md:text-2xl font-bold z-10 opacity-75">
        <p className="text-blue-300">{displayDistance}m</p>
      </div>

      {/* Botón Pausa */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsPaused(true);
          setIsOpenPauseMenu(true);
        }}
        className="absolute top-4 left-4 px-4 py-2 text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition border-2 border-blue-500 font-semibold text-sm md:text-base z-10"
      >
        ⏸ Pausa
      </button>

      {/* Barra de vida */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-40 md:w-48 h-6 bg-gray-800 rounded-full overflow-hidden z-10 border-2 border-gray-600">
        <div
          className={`h-full ${getBarColor()} transition-all duration-500`}
          style={{
            width: `${getLifePercentage()}%`,
            background:
              getLifePercentage() > 66
                ? "linear-gradient(90deg, #10b981, #059669)"
                : getLifePercentage() > 33
                  ? "linear-gradient(90deg, #eab308, #ca8a04)"
                  : "linear-gradient(90deg, #ef4444, #dc2626)",
          }}
        ></div>
      </div>

      {/* Mensaje inicial */}
      {!bossRef.current && showInitialText && (
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 text-center z-40">
          <p className="text-amber-300 text-sm md:text-base font-bold px-4 py-2 bg-gray-600 bg-opacity-20 rounded">
            Derrota a los 3 jefes finales para ganar
          </p>
        </div>
      )}

      {/* Boss HUD */}
      {bossRef.current && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-lg md:text-2xl z-40">
          {"❤️".repeat(bossLives)}
        </div>
      )}

      {/* Boss Fase Texto */}
      {bossRef.current && bossPhaseRef.current > 0 && showBossText && (
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 text-center z-40">
          <p className="text-red-300 text-lg md:text-xl font-bold animate-pulse mb-2">
            BOSS {bossPhaseRef.current}/3
          </p>
          <p className="text-white text-sm md:text-base bg-gray-600 bg-opacity-20 px-4 py-2 rounded animate-bounce">
            ¡Toca el meteorito para devolvérselo al jefe!
          </p>
        </div>
      )}

      {/* Victoria */}
      {victory && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          }}
        >
          <div className="bg-blue-900 text-white p-8 rounded-xl shadow-2xl text-center border-2 border-blue-600">
            <h1 className="text-5xl md:text-6xl font-bold mb-2 text-green-300 animate-bounce">
              ¡GANASTE!
            </h1>
            <p className="text-2xl md:text-3xl mb-4 text-yellow-300 font-bold">
              ¡Felicidades en tu día especial!
            </p>
            <p className="text-lg md:text-xl mb-6 text-blue-100">
              ¡Derrotaste a los 3 bosses con éxito!
            </p>
            <button
              className="mt-6 bg-green-700 hover:bg-green-600 text-white py-3 px-8 rounded-lg font-bold transition transform hover:scale-105 border-2 border-green-600 text-lg"
              onClick={() => {
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 },
                });
                onStart();
              }}
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
