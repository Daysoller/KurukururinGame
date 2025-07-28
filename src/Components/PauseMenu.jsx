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
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-white">
            <h1 className="text-3xl font-bold mb-6">Juego Pausado</h1>
            <button
              onClick={() => {
                setIsPaused(false);
                setIsOpenPauseMenu(false);
              }}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded mb-4 transition m-2"
            >
              Continuar
            </button>
            <button
              onClick={onQuit}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded transition"
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
