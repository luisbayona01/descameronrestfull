import { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import HotelCard from "../components/HotelCard";
import AddHotelModal from "../components/AddHotelModal";
import EditHotelModal from "../components/EditHotelModal"; // Importar el nuevo modal
import { toast } from "react-toastify";
import NavbarComponent from "../components/Navbar";
interface Hotel {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  nit: string;
  capacidad: number;
}

const HotelsPage = () => {
  const auth = useContext(AuthContext);
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchHoteles();
  }, [auth?.token]);

  const fetchHoteles = async () => {
    try {
      const response = await api.get("/hotels", {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      setHoteles(response.data.data);
    } catch (error) {
      console.error("Error al obtener hoteles", error);
    }
  };

  const handleCreate = async (nombre: string, direccion: string, ciudad: string, nit: string, capacidad: number) => {
    try {
      const response = await api.post(
        "/hotels",
        { nombre, direccion, ciudad, nit, capacidad },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      setHoteles([...hoteles, response.data.data]);
      setShowModal(false);
    } catch (error: any) {
      if (error.response?.data?.errors?.nit) {
        toast.error(error.response.data.errors.nit[0]);
      } else {
        toast.error("Error al agregar el hotel");
      }
      console.error("Error al agregar hotel", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este hotel?")) return;
    try {
      await api.delete(`/hotels/${id}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      setHoteles(hoteles.filter((hotel) => hotel.id !== id));
    } catch (error) {
      console.error("Error al eliminar hotel", error);
    }
  };

  const handleEdit = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowEditModal(true);
  };

  return (
    <Container>
      <NavbarComponent />
      <h2 className="text-center my-4">Lista de Hoteles</h2>
      
      <Col  md={4} lg={3} className="mb-4">
      <Button className="btn btn-primary mt-4" onClick={() => setShowModal(true)}>
        Agregar Hotel
      </Button>
      </Col>
      
      <Row>
        {hoteles.map((hotel) => (
          <Col key={hotel.id} md={4} lg={3} className="mb-4">
            <HotelCard hotel={hotel} onEdit={() => handleEdit(hotel)} onDelete={handleDelete} />
          </Col>
        ))}
      </Row>
    

      {/* Modal para Agregar Hotel */}
      <AddHotelModal show={showModal} onClose={() => setShowModal(false)} onCreate={handleCreate} />

      {/* Modal para Editar Hotel */}
      {selectedHotel && (
        <EditHotelModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          hotel={selectedHotel}
          refreshHotels={fetchHoteles}
        />
      )}
    </Container>
  );
};

export default HotelsPage;
