/* eslint-disable react/prop-types */

const PauseMenu = ({
  onQuit,
  isPauseMenuOpen,
  setIsOpenPauseMenu,
  setIsPaused,
}) => {
  return (
    <>
      {isPauseMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-blue-900/60 p-8 rounded-xl shadow-2xl text-white border-2 border-blue-600">
            <h1 className="text-4xl font-bold mb-8 text-center text-blue-100">
              Juego Pausado
            </h1>
            <button
              onClick={() => {
                setIsPaused(false);
                setIsOpenPauseMenu(false);
              }}
              className="w-full px-6 py-3 bg-blue-700/80 hover:bg-blue-600/80 rounded-lg mb-4 transition font-bold border-2 border-cyan-400 transform hover:scale-105 text-white"
            >
              Continuar
            </button>
            <button
              onClick={onQuit}
              className="w-full px-6 py-3 bg-rose-800/60 hover:bg-rose-600/60 rounded-lg transition font-bold border-2 border-red-600 transform hover:scale-105 text-white"
            >
              Salir al Menú Principal
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PauseMenu;
