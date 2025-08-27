import AjustesContainer from '../components/AjustesContainer';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CustomButton from '../components/CustomButtonT4';
import { setGameMode } from '../api/modojuegoAPI';
import '../pages/pages.css';
import '../styles/ModoJuego.css';

const ModoJuego = () => {
  const navigate = useNavigate();
  const [modoSeleccionado, setModoSeleccionado] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSiguiente = async () => {
    if (!modoSeleccionado) {
      const buttons = document.querySelectorAll('.modo-button');
      buttons.forEach(button => {
        button.classList.add('shake-error');
        setTimeout(() => button.classList.remove('shake-error'), 500);
      });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      await setGameMode(modoSeleccionado);

      navigate('/ajuste-equipos', {
        state: {
          modoJuego: modoSeleccionado
        }
      });
    } catch (error) {
      console.error('Error al configurar el modo de juego:', error);
      alert('Hubo un error al configurar el modo de juego. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModoSelection = (modo: string) => {
    setModoSeleccionado(modo);
  };

  return (
    <>
      <div className="background-container">
        <div className="main-content">
          <AjustesContainer label="MODO DE JUEGO" pag_anterior="/">

            {/* Contenedor de los botones de modo */}
            <div className="modo-juego-container">

              {/* Botón Constante */}
              <div
                className={`modo-button ${modoSeleccionado === 'constante' ? 'selected' : ''}`}
                onClick={() => handleModoSelection('constante')}
              >
                <div className="modo-icon">
                  <img src="/modo1.png" alt="Modo Constante" />
                </div>
                <span className="modo-label">Constante</span>
              </div>

              {/* Botón Impulso */}
              <div
                className={`modo-button ${modoSeleccionado === 'impulso' ? 'selected' : ''}`}
                onClick={() => handleModoSelection('impulso')}
              >
                <div className="modo-icon">
                  <img src="/modo2.png" alt="Modo Impulso" />
                </div>
                <span className="modo-label">Impulso</span>
              </div>

            </div>

            <div className="text-center mt-5">
              <CustomButton
                label={isLoading ? "CARGANDO..." : "SIGUIENTE >"}
                onClick={handleSiguiente}
                disabled={isLoading || !modoSeleccionado}
              />
            </div>

          </AjustesContainer>

        </div>
        <Footer />
      </div>
    </>
  );
};

export default ModoJuego;
