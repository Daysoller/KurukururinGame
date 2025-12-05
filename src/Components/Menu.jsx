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
        className="menu w-full flex flex-col items-center justify-center text-white h-screen relative"
        style={{
          backgroundImage: `url(${fateHonkai})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay oscuro para mejor legibilidad */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        <img
          src={caelus}
          alt="Welcome Animation"
          className="w-40 h-40 mb-6 object-contain relative z-10"
        />

        <h1 className="text-2xl md:text-3xl font-bold mb-6 bg-blue-900 bg-opacity-70 p-4 rounded-lg relative z-10 text-center max-w-md border-2 border-blue-500 text-blue-100">
          Hola Hola Mali, da click al
          <span className="text-blue-600 ml-2">botón sorpresa</span>
        </h1>

        <button
          onClick={handleActiveSurprise}
          className="bg-blue-950/90 hover:bg-blue-900/90 border-2 border-blue-800 px-24 py-4 text-3xl m-3 rounded-lg relative z-10 font-bold transition transform hover:scale-105 text-white"
        >
          Sorpresa
        </button>

        <button
          onClick={onStart}
          className="px-24 py-3 bg-blue-900/80 hover:bg-blue-800/80 rounded-lg text-xl font-bold transition relative z-10 border-2 border-blue-700 text-white transform hover:scale-105"
        >
          Iniciar Juego
        </button>
      </div>
      <SurpriseModal setOpen={setOpenModal} open={openModal} />
    </div>
  );
};

export default Menu;
