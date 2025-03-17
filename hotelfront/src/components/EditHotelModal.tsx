import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { useEditHotelModal } from "../hooks/useEditHotelModal";

interface EditHotelModalProps {
  show: boolean;
  handleClose: () => void;
  hotel: {
    id: number;
    nombre: string;
    direccion: string;
    ciudad: string;
    nit: string;
    capacidad: number;
  };
  refreshHotels: () => void;
}

const EditHotelModal: React.FC<EditHotelModalProps> = ({ show, handleClose, hotel, refreshHotels }) => {
  const {
    nombre,
    setNombre,
    direccion,
    setDireccion,
    ciudades,
    ciudadId,
    setCiudadId,
    nit,
    capacidad,
    setCapacidad,
    loading,
    handleSubmit,
  } = useEditHotelModal(hotel, refreshHotels, handleClose);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Hotel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ciudad</Form.Label>
            <Form.Select value={ciudadId} onChange={(e) => setCiudadId(e.target.value)} required>
              <option value="">Seleccione una ciudad</option>
              {ciudades.length > 0 ? (
                ciudades.map((ciudad) => (
                  <option key={ciudad.id} value={ciudad.id}>
                    {ciudad.nombre}
                  </option>
                ))
              ) : (
                <option disabled>Cargando ciudades...</option>
              )}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>NIT</Form.Label>
            <Form.Control type="text" value={nit} readOnly required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Capacidad</Form.Label>
            <Form.Control type="number" value={capacidad} onChange={(e) => setCapacidad(parseInt(e.target.value))} required />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100" disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditHotelModal;
