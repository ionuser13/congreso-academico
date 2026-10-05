function Header() {
    return (
        <header>
            <div id="navIzq">
                <div id="logo">C</div>
                <div class="navInfo">
                    <p>Congreso Académico Estudiantil</p>
                    <p>Universidad de Lima - Edición 2026</p>
                </div>
            </div>
            <div id="navDer">
                <p>Estado de la edición</p>
                <p>Recepción abierta</p> {/*Cambiar a un estado dinamico */}
            </div>
        </header>
    )
}
export default Header