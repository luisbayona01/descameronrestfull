import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Card, Spinner } from "react-bootstrap";
import { toast } from "react-toastify"; // Importar toast para mostrar mensajes

const loginImage = "https://decameron.netlify.app/img/decameron.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Estado para el spinner
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!email || !password) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true); // Mostrar el spinner

    try {
      const success = await auth?.login(email, password); // ✅ Ahora recibe un booleano

      if (success) {
        toast.success("Inicio de sesión exitoso");
        navigate("/hoteles"); // ✅ Redirige solo si el login fue exitoso
      }
    } catch (error) {
      console.error("Error en el login", error);
      toast.error("Credenciales incorrectas");
    } finally {
      setLoading(false); // Ocultar el spinner
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "25rem" }} className="shadow">
        <Card.Img variant="top" src={loginImage} alt="Login" className="img-fluid" />
        <Card.Body>
          <Card.Title className="text-center">Iniciar Sesión</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className="mt-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button 
              variant="primary" 
              type="submit" 
              className="mt-3 w-100 d-flex align-items-center justify-content-center" 
              disabled={loading} // Deshabilitar el botón si está cargando
            >
              {loading ? (
                <>
                  <Spinner 
                    as="span" 
                    animation="border" 
                    size="sm" 
                    role="status" 
                    aria-hidden="true" 
                    className="me-2" // Espaciado a la derecha
                  />
                  Cargando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;
