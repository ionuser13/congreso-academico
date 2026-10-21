import './Footer.css';
function Footer() {
    return (
        <div className="footerContainer">
            <footer className="footer">
                <ul className="info">
                    <li>Congreso Académico Estudiantil</li>
                    <li>Facultad de Ingeniería - Universidad de Lima. Av. Javier Prado Este 4600, Santiago de Surco, Lima.</li>
                </ul>
                <ul className="congreso">
                    <li><span>El Congreso</span></li>
                    <li><a>Bases y Requisitos</a></li>
                    <li><a>Ejes temáticos</a></li>
                    <li><a>Programa</a></li>
                </ul>
                <ul className="participantes">
                    <li><span>Participantes</span></li>
                    <li><a>Guía para autores</a></li>
                    <li><a>Guía para revisores</a></li>
                    <li><a>Preguntas frecuentes</a></li>
                </ul>
                <ul className="contacto">
                    <li><span>Contacto</span></li>
                    <li><a>congreso@ulima.edu.pe</a></li>
                    <li><a>(01) 463 6767 anexo 30450</a></li>
                </ul>
            </footer>
        </div>
    )
}
export default Footer;