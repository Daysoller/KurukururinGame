export const SurpriseModal = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <form className="relative bg-blue-800 p-6 px-7 py-8 rounded-lg shadow-lg">
        <button className="absolute top-2 right-2 text-white text-lg font-bold hover:text-red-500">
          X
        </button>
        <div className="border-lime-400 border-2 font-semibold p-4 text-center">
          <p className="text-yellow-400 text-lg">☆☆ ¡FELIZ CUMPLEAÑOS! ☆☆</p>
        </div>
      </form>
    </div>
  );
};
