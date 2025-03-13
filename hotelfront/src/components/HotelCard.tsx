import { Card, Button } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash, FaHotel } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Hotel {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  nit: string;
  capacidad: number;
}

interface Props {
  hotel: Hotel;
  onEdit: (hotel: Hotel) => void;
  onDelete: (id: number) => void;
}

const HotelCard = ({ hotel, onEdit, onDelete }: Props) => {
  const navigate = useNavigate();

  return (
    <Card className="shadow-sm p-3 text-center">
      <Card.Body>
        <FaHotel size={50} className="text-primary mb-2" />
        <Card.Title className="fw-bold">{hotel.nombre}</Card.Title>
        <Card.Text>{hotel.direccion}</Card.Text>
        <Card.Text className="fw-semibold">{hotel.ciudad}</Card.Text>
        <Card.Text className="text-muted">NIT: {hotel.nit}</Card.Text>
        <Card.Text>Capacidad: {hotel.capacidad}</Card.Text>
        <div className="d-flex justify-content-center gap-2 mt-2">
          {/* Redirigir a la página de habitaciones */}
          <Button variant="outline-primary" onClick={() => navigate(`/rooms/${hotel.id}`)}>
            <FaEye />
          </Button>
          <Button variant="outline-success" onClick={() => onEdit(hotel)}>
            <FaEdit />
          </Button>
          <Button variant="outline-danger" onClick={() => onDelete(hotel.id)}>
            <FaTrash />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default HotelCard;
