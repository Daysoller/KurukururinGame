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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="flex items-center justify-center bg-blue-900/80 rounded-xl h-[250px] shadow-2xl text-white border-2 border-blue-600 flex flex-col gap-8 w-full max-w-md items-center backdrop-blur-sm">
            <h1 className="text-4xl font-bold text-center text-blue-100 drop-shadow-md tracking-wide">
              Juego Pausado
            </h1>
            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={() => {
                  setIsPaused(false);
                  setIsOpenPauseMenu(false);
                }}
                className="w-full px-6 py-4 bg-blue-700/80 hover:bg-blue-600/90 rounded-xl transition font-bold border-2 border-cyan-400 transform hover:scale-105 text-white text-lg shadow-lg"
              >
                Continuar
              </button>
              <button
                onClick={onQuit}
                className="w-full px-6 py-4 bg-rose-800/80 hover:bg-rose-600/90 rounded-xl transition font-bold border-2 border-red-500 transform hover:scale-105 text-white text-lg shadow-lg"
              >
                Salir al Menú Principal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PauseMenu;
