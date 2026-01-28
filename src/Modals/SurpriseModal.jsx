import doro from "../assets/doro-nikke.gif";
// eslint-disable-next-line react/prop-types
export const SurpriseModal = ({ setOpen, open }) => {
  return (
    <div>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className="relative bg-blue-900 rounded-xl shadow-2xl w-full max-w-md p-8 border border-blue-700">
            <button
              type="button"
              className="absolute top-3 right-3 text-blue-200 text-xl font-bold hover:text-red-400 transition-colors bg-blue-950/50 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setOpen(false)}
            >
              X
            </button>
            <div className="flex flex-col items-center justify-center gap-6 border-2 border-lime-400/80 rounded-lg p-8 bg-blue-950/50 shadow-inner">
              <p className="text-yellow-300 text-xl font-bold tracking-wider text-center drop-shadow-md">
                ☆☆ ¡¡¡¡FELIZ CUMPLEAÑOS!!!! ☆☆
              </p>
              <img
                src={doro}
                alt="doro surprise"
                className="w-40 h-40 object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
