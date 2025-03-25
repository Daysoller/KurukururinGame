import fateHonkai from "../assets/fateHonkai.jpeg";
import caelus from "../assets/caelus.gif";
import { SurpriseModal } from "../Modals/SurpriseModal";
import { useState } from "react";
import confetti from "canvas-confetti";
// eslint-disable-next-line react/prop-types
const Menu = ({ onStart }) => {
  const [onActiveSurprise, activeSurprise] = useState(false);

  function handleActiveSurprise() {
    confetti();
    activeSurprise(true);
  }
  return (
    <div>
      <div className="felx flex-center justify-center text-center">
        {onActiveSurprise && <SurpriseModal />}
      </div>

      <div
        className="menu w-full flex flex-col items-center justify-center text-white h-screen"
        style={{
          backgroundImage: `url(${fateHonkai})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          src={caelus}
          alt="Welcome Animation"
          className="w-40 h-40 mb-6 object-contain"
        />

        <h1 className="text-2xl font-bold mb-3 bg-opacity-70 bg-slate-700 p-3 rounded-lg">
          Hola Hola Mali, da click al primer
          <span className="text-green-500 ml-1 ">botón</span> hehe!!
        </h1>
        <button
          onClick={handleActiveSurprise}
          className="bg-green-600 hover:bg-green-500 px-24 py-3 text-3xl m-3 rounded-lg"
        >
          Sorpresa
        </button>
        <button
          onClick={onStart}
          className="px-24 py-1 bg-blue-950 hover:bg-blue-900 rounded text-xl transition"
        >
          Iniciar Juego
        </button>
      </div>
    </div>
  );
};

export default Menu;
