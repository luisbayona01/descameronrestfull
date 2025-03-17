import { Modal, Button, Form } from "react-bootstrap";
import useAddHotel from "../hooks/useAddHotel";

interface Props {
  show: boolean;
  onClose: () => void;
  onCreate: () => void;
}

const AddHotelModal = ({ show, onClose, onCreate }: Props) => {
  const { hotelData, setHotelData, ciudades, validated, handleSubmit } = useAddHotel(onCreate);

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Hotel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate className={validated ? "was-validated" : ""} onSubmit={(e) => handleSubmit(e, onClose)}>
          {/* Nombre */}
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control 
              type="text" 
              value={hotelData.nombre} 
              onChange={(e) => setHotelData({ ...hotelData, nombre: e.target.value })} 
              required 
            />
            <div className="invalid-feedback">El nombre es obligatorio.</div>
          </Form.Group>

          {/* Dirección */}
          <Form.Group className="mt-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control 
              type="text" 
              value={hotelData.direccion} 
              onChange={(e) => setHotelData({ ...hotelData, direccion: e.target.value })} 
              required 
            />
            <div className="invalid-feedback">La dirección es obligatoria.</div>
          </Form.Group>

          {/* Ciudad (Select) */}
          <Form.Group className="mt-3">
            <Form.Label>Ciudad</Form.Label>
            <Form.Select 
              value={hotelData.ciudad} 
              onChange={(e) => setHotelData({ ...hotelData, ciudad: e.target.value })} 
              required
            >
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
            <div className="invalid-feedback">Debe seleccionar una ciudad.</div>
          </Form.Group>

          {/* NIT */}
          <Form.Group className="mt-3">
            <Form.Label>NIT</Form.Label>
            <Form.Control 
              type="text" 
              value={hotelData.nit} 
              onChange={(e) => setHotelData({ ...hotelData, nit: e.target.value })} 
              pattern="^\d{10}-\d{1}$"
              required 
            />
            <div className="invalid-feedback">Ingrese un NIT válido (ej: 1234567890-1).</div>
          </Form.Group>

          {/* Número de Habitaciones */}
          <Form.Group className="mt-3">
            <Form.Label>Número de Habitaciones</Form.Label>
            <Form.Control 
              type="number" 
              value={hotelData.capacidad} 
              onChange={(e) => setHotelData({ ...hotelData, capacidad: Number(e.target.value) })} 
              min="1"
              required 
            />
            <div className="invalid-feedback">Debe ingresar un número válido.</div>
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddHotelModal;
