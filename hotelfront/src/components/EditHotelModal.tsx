import { useState, useContext, useEffect } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";
import { toast } from "react-toastify";

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
  const auth = useContext(AuthContext);

  const [nombre, setNombre] = useState(hotel.nombre);
  const [direccion, setDireccion] = useState(hotel.direccion);
  const [ciudades, setCiudades] = useState<{ id: string; nombre: string }[]>([]);
  const [ciudadId, setCiudadId] = useState<string>("");
  const [nit, setNit] = useState(hotel.nit);
  const [capacidad, setCapacidad] = useState(hotel.capacidad);
  const [loading, setLoading] = useState(false);

  // **Actualizar los estados cuando cambia el hotel seleccionado**
  useEffect(() => {
    setNombre(hotel.nombre);
    setDireccion(hotel.direccion);
    setNit(hotel.nit);
    setCapacidad(hotel.capacidad);

    // Buscar la ciudad actual del hotel
    if (ciudades.length > 0) {
      const ciudadActual = ciudades.find((c) => c.nombre === hotel.ciudad);
      setCiudadId(ciudadActual ? ciudadActual.id : "");
    }
  }, [hotel, ciudades]); // Se ejecuta cuando cambia `hotel` o `ciudades`

  // **Cargar las ciudades desde la API**
  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const response = await api.get("/ciudades", {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });

        if (Array.isArray(response.data)) {
          setCiudades(response.data);

          // Buscar la ciudad actual del hotel basado en su nombre
          const ciudadActual = response.data.find((c) => c.nombre === hotel.ciudad);
          setCiudadId(ciudadActual ? ciudadActual.id : "");
        } else {
          setCiudades([]);
        }
      } catch (error) {
        console.error("Error al obtener ciudades", error);
        setCiudades([]);
      }
    };

    if (show) {
      fetchCiudades();
    }
  }, [show, auth?.token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth?.token) {
      toast.error("No tienes autorización. Inicia sesión nuevamente.");
      return;
    }

    setLoading(true);
    try {
      await api.put(
        `/hotels/${hotel.id}`,
        { nombre, direccion, ciudad: ciudadId, capacidad },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      toast.success("Hotel actualizado correctamente");
      refreshHotels();
      handleClose();
    } catch (error) {
      toast.error("Error al actualizar el hotel");
      console.error("Error al actualizar el hotel", error);
    } finally {
      setLoading(false);
    }
  };

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
