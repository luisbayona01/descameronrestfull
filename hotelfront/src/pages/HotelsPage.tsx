import { Container, Row, Col, Button } from "react-bootstrap";
import HotelCard from "../components/HotelCard";
import AddHotelModal from "../components/AddHotelModal";
import EditHotelModal from "../components/EditHotelModal";
import NavbarComponent from "../components/Navbar";
import { useHotels } from "../hooks/useHotels";

const HotelsPage = () => {
  const {
    hoteles,
    showModal,
    setShowModal,
    selectedHotel,
    showEditModal,
    setShowEditModal,
    fetchHoteles,
    handleDelete,
    handleEdit,
  } = useHotels();

  return (
    <Container>
      <NavbarComponent />
      <h2 className="text-center my-4">Lista de Hoteles</h2>
      
      <Col md={4} lg={3} className="mb-4">
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
      <AddHotelModal show={showModal} onClose={() => setShowModal(false)} onCreate={fetchHoteles} />

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
