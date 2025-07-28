import doro from "../assets/doro-nikke.gif";
// eslint-disable-next-line react/prop-types
export const SurpriseModal = ({ setOpen, open }) => {
  return (
    <div>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="relative bg-blue-800 p-6 px-7 py-8 rounded-lg shadow-lg">
            <button
              type="button"
              className="absolute top-2 right-2 text-white text-lg font-bold hover:text-red-500"
              onClick={() => setOpen(false)}
            >
              X
            </button>
            <div className="border-lime-400 border-2 rounded-md font-semibold p-4 text-center">
              <p className="text-yellow-400 text-lg">
                ☆☆ ¡¡¡¡FELIZ CUMPLEAÑOS!!!! ☆☆
              </p>
              <img src={doro} alt="doro" className="ml-12" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
