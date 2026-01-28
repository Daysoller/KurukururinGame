import fateHonkai from "../assets/fateHonkai.jpeg";
import caelus from "../assets/caelus.gif";
import { SurpriseModal } from "../Modals/SurpriseModal";
import { useState } from "react";
import confetti from "canvas-confetti";
// eslint-disable-next-line react/prop-types
const Menu = ({ onStart }) => {
  const [openModal, setOpenModal] = useState(false);
  function handleActiveSurprise() {
    confetti();
    setOpenModal(true);
  }
  return (
    <div>
      <div
        className="menu w-full flex flex-col items-center justify-center text-white h-screen relative dynamic-bg"
        style={{ "--bg-image": `url(${fateHonkai})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-20 flex flex-col items-center w-full max-w-4xl px-4">
          <img
            src={caelus}
            alt="Welcome Animation"
            className="w-48 h-48 mb-4 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          />

          <div className="text-center mb-12 bg-black/30 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl">
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-200 via-white to-blue-200 drop-shadow-lg tracking-wider mb-2">
              HOLA MALI
            </h1>
            <p className="text-blue-100 text-lg md:text-xl font-medium tracking-wide">
              ¿Lista para tu{" "}
              <span className="text-yellow-300 font-bold animate-pulse">
                sorpresa
              </span>
              ?
            </p>
          </div>

          <div className="flex flex-col gap-6 w-full max-w-sm">
            <button
              onClick={handleActiveSurprise}
              className="group relative w-full py-3 px-7 rounded-xl bg-linear-to-r from-blue-950 to-blue-900 border-2 border-blue-800 shadow-[0_0_20px_rgba(30,58,138,0.5)] hover:shadow-[0_0_30px_rgba(30,58,138,0.8)] hover:scale-105 transition-all duration-300 ease-out overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10 text-2xl font-black text-white tracking-widest uppercase flex items-center justify-center gap-3">
                <span className="text-yellow-400">★</span>
                Sorpresa
                <span className="text-yellow-400">★</span>
              </span>
            </button>

            <button
              onClick={onStart}
              className="group relative w-full py-3 px-7 rounded-xl bg-linear-to-r from-blue-900 to-blue-800 border-2 border-blue-700 shadow-[0_0_20px_rgba(29,78,216,0.5)] hover:shadow-[0_0_30px_rgba(29,78,216,0.8)] hover:scale-105 transition-all duration-300 ease-out overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10 text-2xl font-black text-white tracking-widest uppercase">
                Iniciar Juego
              </span>
            </button>
          </div>
        </div>
      </div>
      <SurpriseModal setOpen={setOpenModal} open={openModal} />
    </div>
  );
};

export default Menu;
