import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FaHome, FaEdit, FaTrash } from "react-icons/fa";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import NavbarComponent from "../components/Navbar";
interface Room {
  id: number;
  tipo: string;
  acomodacion: string;
  cantidad: number;
}

const RoomsPage = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotel, setHotel] = useState<{ nombre: string; capacidad: number } | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const hotelResponse = await api.get(`/hotels/${hotelId}`, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        setHotel(hotelResponse.data.data);

        const roomsResponse = await api.get(`/hotels/${hotelId}/rooms`, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        setRooms(roomsResponse.data);
      } catch (error) {
        console.error("Error al obtener habitaciones", error);
      }
    };

    fetchRooms();
  }, [hotelId, auth?.token]);


  const totalAsignadas = rooms.reduce((sum, room) => sum + room.cantidad, 0);
  const habitacionesRestantes = (hotel?.capacidad || 0) - totalAsignadas;

  return (
    <Container>
      
      <NavbarComponent />
      <div className="d-flex justify-content-between align-items-center my-4">
        <h3>
          Habitaciones: {hotel?.nombre}
        </h3>
        <Button variant="success" onClick={() => navigate(`/assign-room/${hotelId}`)}>
          + Asignar Habitación
        </Button>
        <Button variant="secondary" onClick={() => navigate("/hoteles")}>
          ← Volver
        </Button>
      </div>
      
      <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded">
    <p className="mb-0"><strong>Capacidad Total:</strong> {hotel?.capacidad}</p>
    <p className="mb-0"><strong>Habitaciones Asignadas:</strong> {totalAsignadas}</p>
    <p className="mb-0"><strong>Habitaciones Restantes:</strong> {habitacionesRestantes < 0 ? 0 : habitacionesRestantes}</p>
  </div>

      <Row>
        {rooms.map((room) => (
          <Col key={room.id} md={4} lg={3} className="mb-4">
            <Card className="shadow-sm p-3 text-center">
              <Card.Body>
                <FaHome size={50} className="text-primary mb-2" />
                <Card.Title className="fw-bold">Habitación: {room.tipo}</Card.Title>
                <Card.Text>{room.acomodacion}</Card.Text>
                <Card.Text><strong>Cantidad:</strong> {room.cantidad}</Card.Text>
                <div className="d-flex justify-content-center gap-2 mt-2">
                <Button variant="outline-success" onClick={() => navigate(`/edit-room/${hotelId}/${room.id}`)}>
                <FaEdit />
              </Button>
                  <Button variant="outline-danger">
                    <FaTrash />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RoomsPage;
