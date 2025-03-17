import React, { useState } from "react";
import { Container, Row, Button, Alert, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import NavbarComponent from "../components/Navbar";
import RoomCard from "../components/RoomCard";
import { useRooms } from "../hooks/useRooms";
import { useDeleteRoom } from "../hooks/useDeleteRoom";

const RoomPage: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const { rooms, hotel, setRooms } = useRooms(hotelId);
  const { handleDelete } = useDeleteRoom(setRooms);
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para controlar el estado de carga
  React.useEffect(() => {
    // Si tenemos datos del hotel o habitaciones, ya no estamos cargando
    if (hotel || rooms.length > 0) {
      setIsLoading(false);
    }
    
    // Si no hay hotelId, no estamos cargando
    if (!hotelId) {
      setIsLoading(false);
    }
    
    // Establecer un tiempo máximo de carga (3 segundos)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [hotel, rooms, hotelId]);

  return (
    <Container className="mt-5">
      <NavbarComponent />
      
      <div className="d-flex justify-content-between align-items-center my-4">
        <Button variant="secondary" onClick={() => navigate("/hoteles")}>
          ← Volver a Hoteles
        </Button>
        <Button variant="primary" onClick={() => navigate(`/assign-room/${hotelId}`)}>
          Asignar Habitación
        </Button>
      </div>
      
      {hotel && (
        <div className="mb-4">
          <h2>{hotel.nombre}</h2>
          <p>Capacidad: {hotel.capacidad} habitaciones</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2">Cargando habitaciones...</p>
        </div>
      ) : rooms.length === 0 ? (
        <Alert variant="info">
          Este hotel no tiene habitaciones asignadas. Haga clic en "Asignar Habitación" para agregar una.
        </Alert>
      ) : (
        <Row>
          {rooms.map((room) => (
            <RoomCard 
              key={room.id} 
              room={room} 
              hotelId={hotelId || ""} 
              onDelete={handleDelete} 
            />
          ))}
        </Row>
      )}
    </Container>
  );
};

export default RoomPage;