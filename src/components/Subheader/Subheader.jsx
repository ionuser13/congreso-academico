import './Subheader.css';
import '../../styles/variables.css';
function Subheader() {
    return (
        <div className="subheaderContainer">
            <header className="subheader">
                <nav className="options">
                    <div className='option subtituloInterfaz'>Inicio</div>
                    <div className='option subtituloInterfaz'>Nuevo trabajo</div>
                    <div className='option subtituloInterfaz'>Mis trabajos</div>
                    <div className='option subtituloInterfaz'>Mi presentación</div>
                    <div className='option subtituloInterfaz'>Mi cuenta</div>
                </nav>
                <nav className="subhDer">
                    <span className="recuadro"></span>
                    <div className="cuenta">
                        <span className="nombre subtituloInterfaz">Rosa Quispe Tito</span> {/*dinamico */}
                        <span className="rol auxiliar">Rol: autor</span> {/*Dinámico */}
                    </div>
                    <span className="profile">RQ</span>
                </nav>
            </header>
        </div>
    )

}

export default Subheader;