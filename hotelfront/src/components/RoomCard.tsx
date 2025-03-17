import { Col, Card, Button } from "react-bootstrap";
import { FaHome, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface RoomCardProps {
  room: {
    id: number;
    tipo: string;
    acomodacion: string;
    cantidad: number;
  };
  hotelId: string;
  onDelete: (roomId: number) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, hotelId, onDelete }) => {
  const navigate = useNavigate();

  return (
    <Col md={4} lg={3} className="mb-4">
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
            <Button variant="outline-danger" onClick={() => onDelete(room.id)}>
              <FaTrash />
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default RoomCard;