import { Container, Form, Button } from "react-bootstrap";
import { useParams,useNavigate} from "react-router-dom";
import NavbarComponent from "../components/Navbar";
import { useFetchRoomData } from "../hooks/useFetchRoomData";
import { useAssignRoomForm } from "../hooks/useAssignRoomForm";

const AssignRoomPage = () => {
  const navigate = useNavigate();
  const { hotelId } = useParams<{ hotelId: string }>();
  const { tiposHabitacion, acomodaciones } = useFetchRoomData();
  const {
    tipoHabitacionId,
    setTipoHabitacionId,
    acomodacionId,
    setAcomodacionId,
    cantidad,
    setCantidad,
    acomodacionesFiltradas,
    handleSubmit,
  } = useAssignRoomForm(hotelId || "", tiposHabitacion, acomodaciones);

  return (
    <Container className="mt-5">
      <NavbarComponent />
      <div className="d-flex justify-content-between align-items-center my-4">
        <Button variant="secondary" onClick={() => navigate(`/rooms/${hotelId}`)}>
          ← Volver
        </Button>
      </div>
      <h2>Asignar Habitación</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="tipoHabitacionSelect" className="mt-3">
          <Form.Label>Tipo de Habitación</Form.Label>
          <Form.Select value={tipoHabitacionId} onChange={(e) => setTipoHabitacionId(e.target.value)} required>
            <option value="">Seleccione un tipo de habitación</option>
            {tiposHabitacion.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="acomodacionSelect" className="mt-3">
          <Form.Label>Acomodación</Form.Label>
          <Form.Select value={acomodacionId} onChange={(e) => setAcomodacionId(e.target.value)} required disabled={!tipoHabitacionId}>
            <option value="">Seleccione una acomodación</option>
            {acomodacionesFiltradas.map((acomodacion) => (
              <option key={acomodacion.id} value={acomodacion.id}>
                {acomodacion.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="cantidadInput" className="mt-3">
          <Form.Label>Cantidad</Form.Label>
          <Form.Control
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
            min="1"
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Asignar Habitación
        </Button>
      </Form>
    </Container>
  );
};

export default AssignRoomPage;
