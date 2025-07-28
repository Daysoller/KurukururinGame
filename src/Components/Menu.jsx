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
          className="bg-indigo-800 bg-opacity-90 hover:bg-indigo-700 border-2 px-24 py-3 text-3xl m-3 rounded-lg"
        >
          Sorpresa
        </button>
        <button
          onClick={onStart}
          className="px-24 py-1 bg-blue-950 bg-opacity-30 hover:bg-blue-900 rounded text-xl transition"
        >
          Iniciar Juego
        </button>
      </div>
      <SurpriseModal setOpen={setOpenModal} open={openModal} />
    </div>
  );
};

export default Menu;
