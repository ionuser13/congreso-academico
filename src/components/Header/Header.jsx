import './Header.css';
import '../../styles/variables.css';
function Header() {
    return (
        <div className="headerContainer">
            <header className="header">
                <div id="navIzq">
                    <span id="logo">C</span>
                    <div className="navInfo">
                        <p id="congreso">Congreso Académico Estudiantil</p>
                        <p id="universidad" className="etiqueta">Universidad de Lima - Edición 2026</p>
                    </div>
                </div>
                <div id="navDer">
                    <p id="estadoEdicion" className='etiqueta'>Estado de la edición</p>
                    <p id="recepcion">Recepción abierta</p> {/*Cambiar a un estado dinamico */}
                </div>
            </header>
        </div>
    )
}
export default Header