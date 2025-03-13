import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const NavbarComponent = () => {
  const auth = useContext(AuthContext);

  if (!auth) return null; // Si el contexto no está disponible, no renderiza nada

  return (
    <nav className="navbar navbar-light bg-light px-3 d-flex justify-content-between">
      <Link to="/" className="navbar-brand">
        <img src="https://decameron.netlify.app/img/decameron.png" alt="Logo" height="40" />
      </Link>

      {auth.token ? (
        <div className="d-flex align-items-center">
          <span className="me-3">Hola, {auth.user || "Usuario"}</span>
          <button className="btn btn-danger" onClick={auth.logout}>
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <Link to="/login" className="btn btn-primary">
          Iniciar Sesión
        </Link>
      )}
    </nav>
  );
};

export default NavbarComponent;
