// eslint-disable-next-line react/prop-types
const PauseMenu = ({ onResume, onQuit }) => {
  return (
    <div className="pause-menu fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80 text-white z-50">
      <div className="text-center p-6 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Juego Pausado</h1>
        <button
          onClick={onResume}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded mb-4 transition m-2"
        >
          Reanudar
        </button>
        <button
          onClick={onQuit}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded transition"
        >
          Salir al Menú Principal
        </button>
      </div>
    </div>
  );
};

export default PauseMenu;
