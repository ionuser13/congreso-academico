import './Header.css'
function Header() {
    return (
        <header className="header">
            <div id="navIzq">
                <span id="logo">C</span>
                <div className="navInfo">
                    <p id="congreso">Congreso Académico Estudiantil</p>
                    <p id="universidad">Universidad de Lima - Edición 2026</p>
                </div>
            </div>
            <div id="navDer">
                <p id="estadoEdicion">Estado de la edición</p>
                <p id="recepcion">Recepción abierta</p> {/*Cambiar a un estado dinamico */}
            </div>
        </header>
    )
}
export default Header