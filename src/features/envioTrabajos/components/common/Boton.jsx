import {Link} from "react-router-dom";

export default function Boton({variante = 'primario', to, href, deshabilitado, children, ...rest}) {
    const clase = `et-btn et-btn--${variante}`;
    if(deshabilitado) return <button type="button" className={clase} disabled {...rest}>
        {children}
    </button>;
    if (to) return <Link to={to} className={clase} {...rest}>{children}</Link>;
    if(href) return <a href={href} className={clase} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>   
    return <button type="button" className={clase} {...rest}>
        {children}
    </button>;
}