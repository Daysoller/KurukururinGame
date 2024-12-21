// eslint-disable-next-line react/prop-types
const GameOver = ({ onStart, onQuit }) => {
  return (
    <div className="bg-gray-950">
      <div className="menu w-full flex flex-col items-center justify-center bg-gray-900 text-white h-screen">
        <img
          src="rinTohsaka.gif"
          alt="Welcome Animation"
          className="w-70 h-60 mb-6 object-contain fade-border"
        />

        <h1 className="text-4xl font-bold mb-6 text-stone-300 bg-red-950 rounded-full p-10 fade-border">
          ¡PUTO SHIROU!
        </h1>

        <button
          onClick={onStart}
          className="px-6 py-3 bg-green-800 hover:bg-green-700 rounded text-xl transition  "
        >
          Intentar de nuevo
        </button>
        <button
          onClick={onQuit}
          className="px-6 py-2 bg-red-800 hover:bg-red-700 rounded transition mt-3 "
        >
          Salir
        </button>
      </div>
    </div>
  );
};

export default GameOver;
