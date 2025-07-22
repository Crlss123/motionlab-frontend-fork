import api from ".";

export const setGameMode = async (gameMode: string) => {
  try {
    const payload = {
      mode: gameMode
    };
    
    const res = await api.post("???????????????", payload);
    console.log("Modo de juego configurado:", gameMode);
    return res.data;
  } catch (error) {
    console.error("Error al configurar el modo de juego.", error);
    throw error;
  }
};