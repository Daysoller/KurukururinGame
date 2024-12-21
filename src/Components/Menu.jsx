import fateHonkai from "../assets/fateHonkai.jpeg";
// eslint-disable-next-line react/prop-types
const Menu = ({ onStart }) => {
  return (
    <div className="">
      <div
        className="menu w-full flex flex-col items-center justify-center text-white h-screen"
        style={{
          backgroundImage: `url(${fateHonkai})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          src="caelus.gif"
          alt="Welcome Animation"
          className="w-40 h-40 mb-6 object-contain"
        />

        <h1 className="text-4xl font-bold mb-6">¡Kururin Game!</h1>

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
