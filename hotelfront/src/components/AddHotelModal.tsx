import { useState, useEffect, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";

interface Props {
  show: boolean;
  onClose: () => void;
  onCreate: (
    nombre: string,
    direccion: string,
    ciudadId: string,
    nit: string,
    numeroHabitaciones: number
  ) => void;
}

const AddHotelModal = ({ show, onClose, onCreate }: Props) => {
  const auth = useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudadId, setCiudadId] = useState("");
  const [nit, setNit] = useState("");
  const [numeroHabitaciones, setNumeroHabitaciones] = useState<number>(0);
  const [ciudades, setCiudades] = useState<{ id: string; nombre: string }[]>([]);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const response = await api.get("/ciudades", {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });

        //console.log("Respuesta de API /hoteles:", response.data);

        if (Array.isArray(response.data)) {
          setCiudades(response.data);
        } else {
          //console.error("La API no devolvió un array:", response.data);
          setCiudades([]); // Fallback a un array vacío
        }
      } catch (error) {
        console.error("Error al obtener hoteles", error);
        setCiudades([]); // Manejo de error asegurando un array vacío
      }
    };

    fetchCiudades();
  }, [auth?.token]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity()) {
      onCreate(nombre, direccion, ciudadId, nit, numeroHabitaciones);
      setNombre("");
      setDireccion("");
      setCiudadId("");
      setNit("");
      setNumeroHabitaciones(0);
      setValidated(false);
      onClose();
    } else {
      form.reportValidity();
      setValidated(true);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Hotel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate className={validated ? "was-validated" : ""} onSubmit={handleSubmit}>
          {/* Nombre */}
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
            />
            <div className="invalid-feedback">El nombre es obligatorio.</div>
          </Form.Group>

          {/* Dirección */}
          <Form.Group className="mt-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control 
              type="text" 
              value={direccion} 
              onChange={(e) => setDireccion(e.target.value)} 
              required 
            />
            <div className="invalid-feedback">La dirección es obligatoria.</div>
          </Form.Group>

          {/* Ciudad (Select) */}
          <Form.Group className="mt-3">
            <Form.Label>Ciudad</Form.Label>
            <Form.Select 
              value={ciudadId} 
              onChange={(e) => setCiudadId(e.target.value)} 
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
              value={nit} 
              onChange={(e) => setNit(e.target.value)} 
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
              value={numeroHabitaciones} 
              onChange={(e) => setNumeroHabitaciones(Number(e.target.value))} 
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
