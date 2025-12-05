import rin from "../assets/rinTohsaka.gif";
// eslint-disable-next-line react/prop-types
const GameOver = ({ onStart, onQuit }) => {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950 w-full h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Efecto de luz ambiental sutil (Gestalt: agrupación visual) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-slate-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-slate-600 rounded-full blur-3xl"></div>
      </div>

      {/* Contenedor principal con borde sutil y brillo */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* GIF Game Over - Elemento central con marco visual */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-slate-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-300"></div>
          <img
            src={rin}
            alt="Game Over Animation"
            className="relative w-80 h-64 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Título con sombra 3D retro */}
        <h1
          className="text-4xl md:text-6xl font-black mb-12 text-center relative drop-shadow-xl"
          style={{
            color: "#FDE047",
            textShadow: `
            3px 3px 0px rgba(239, 68, 68, 0.8),
            6px 6px 0px rgba(30, 41, 59, 0.6),
            9px 9px 20px rgba(0, 0, 0, 0.8),
            0px 0px 10px rgba(251, 146, 60, 0.5)
          `,
            letterSpacing: "2px",
          }}
        >
          ¡POR TU CULPA SHIROU!
        </h1>

        {/* Botones con efectos mejorados */}
        <div className="flex flex-col gap-8 items-center">
          <button
            onClick={onStart}
            className="relative px-6 py-3 text-slate-300 text-lg md:text-2xl font-black transition-all duration-300 group/btn"
            style={{
              textShadow: `
                2px 2px 0px rgba(30, 41, 59, 0.8),
                4px 4px 0px rgba(239, 68, 68, 0.4)
              `,
            }}
          >
            <span className="absolute -inset-1 bg-gradient-to-r from-gray-500 to-gray-400 rounded opacity-0 group-hover/btn:opacity-20 blur transition duration-300"></span>
            <span className="relative border-b-3 border-transparent group-hover/btn:border-gray-400 pb-1 transition-all duration-300 hover:tracking-wider">
              Intentar de nuevo
            </span>
          </button>

          <button
            onClick={onQuit}
            className="relative px-6 py-3 text-lg md:text-2xl font-black transition-all duration-300 group/btn"
            style={{
              color: "#D1D5DB",
              textShadow: `
                2px 2px 0px rgba(30, 41, 59, 0.6),
                4px 4px 0px rgba(100, 116, 139, 0.3)
              `,
            }}
          >
            <span className="absolute -inset-1 bg-gradient-to-r from-gray-500 to-gray-400 rounded opacity-0 group-hover/btn:opacity-20 blur transition duration-300"></span>
            <span className="relative border-b-3 border-transparent group-hover/btn:border-gray-400 pb-1 transition-all duration-300 hover:tracking-wider">
              Salir
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
