import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Form, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import NavbarComponent from "../components/Navbar";
interface TipoHabitacion {
  id: number;
  nombre: string;
}

interface Acomodacion {
  id: number;
  nombre: string;
}

const acomodacionesPermitidas: Record<string, string[]> = {
  "Estándar": ["Sencilla", "Doble"],
  "Junior": ["Triple", "Cuádruple"],
  "Suite": ["Sencilla", "Doble", "Triple"]
};

const EditRoomPage = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();

  const [tiposHabitacion, setTiposHabitacion] = useState<TipoHabitacion[]>([]);
  const [acomodaciones, setAcomodaciones] = useState<Acomodacion[]>([]);
  const [tipoHabitacionId, setTipoHabitacionId] = useState("");
  const [acomodacionId, setAcomodacionId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [acomodacionesFiltradas, setAcomodacionesFiltradas] = useState<Acomodacion[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar tipos de habitación y acomodaciones
        const [tiposHabitacionRes, acomodacionesRes, roomRes] = await Promise.all([
          api.get("/tipos-habitacion", { headers: { Authorization: `Bearer ${auth?.token}` } }),
          api.get("/acomodaciones", { headers: { Authorization: `Bearer ${auth?.token}` } }),
          api.get(`/habitaciones/${roomId}`, { headers: { Authorization: `Bearer ${auth?.token}` } }),
        ]);

        setTiposHabitacion(tiposHabitacionRes.data);
        setAcomodaciones(acomodacionesRes.data);

        // Establecer los valores actuales de la habitación
        const roomData = roomRes.data;
        //console.log("rooms", roomData);
        setTipoHabitacionId(roomData.tipo_habitacion_id);
        setCantidad(roomData.cantidad);

    
        const tipoSeleccionado = tiposHabitacionRes.data.find((tipo:any) => tipo.id === roomData.tipo_habitacion_id);
        if (tipoSeleccionado) {
          const acomodacionesValidas = acomodacionesPermitidas[tipoSeleccionado.nombre] || [];
          const filtradas = acomodacionesRes.data.filter((acom:any) => acomodacionesValidas.includes(acom.nombre));
          setAcomodacionesFiltradas(filtradas);

        
          if (!filtradas.find((acom:any) => acom.id === roomData.acomodacion_id)) {
            console.log('filter', filtradas)
            setAcomodacionId(filtradas.length > 0 ? filtradas[0].id.toString() : "");
          } else {
            setAcomodacionId(roomData.acomodacion_id);
          }
        }
      } catch (error) {
        console.error("Error al cargar los datos", error);
        toast.error("Error al cargar los datos de la habitación");
      }
    };

    fetchData();
  }, [roomId, auth?.token]);

  useEffect(() => {
    if (!tipoHabitacionId) {
      setAcomodacionesFiltradas([]);
      return;
    }

    const tipoSeleccionado = tiposHabitacion.find((tipo) => tipo.id.toString() === tipoHabitacionId);
    if (!tipoSeleccionado) return;

    const acomodacionesValidas = acomodacionesPermitidas[tipoSeleccionado.nombre] || [];
    const filtradas = acomodaciones.filter((acom) => acomodacionesValidas.includes(acom.nombre));

    setAcomodacionesFiltradas(filtradas);

    // Si la acomodación seleccionada ya no es válida, resetearla
    if (!filtradas.find((acom) => acom.id.toString() === acomodacionId)) {
      setAcomodacionId(filtradas.length > 0 ? filtradas[0].id.toString() : "");
    }
  }, [tipoHabitacionId, tiposHabitacion, acomodaciones]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(
        `/habitaciones/${roomId}`,
        {
          tipo_habitacion_id: tipoHabitacionId,
          acomodacion_id: acomodacionId,
          hotel_id: hotelId, 
          cantidad,
        },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );

      toast.success("Habitación actualizada con éxito");
      navigate(`/rooms/${hotelId}`);
    } catch (error: any) {
      toast.error("Error al actualizar la habitación");
      console.error("Error en la actualización", error);
    }
  };

  return (
    <Container className="mt-5">
        <NavbarComponent />
      <h2>Editar Habitación</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="tipoHabitacionSelect" className="mt-3">
          <Form.Label>Tipo de Habitación</Form.Label>
          <Form.Select value={tipoHabitacionId} onChange={(e) => setTipoHabitacionId(e.target.value)} required>
            {tiposHabitacion.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="acomodacionSelect" className="mt-3">
          <Form.Label>Acomodación</Form.Label>
          <Form.Select value={acomodacionId} onChange={(e) => setAcomodacionId(e.target.value)} required>
            {acomodacionesFiltradas.map((acomodacion) => (
              <option key={acomodacion.id} value={acomodacion.id}>
                {acomodacion.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="cantidadInput" className="mt-3">
          <Form.Label>Cantidad</Form.Label>
          <Form.Control type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required min="1" />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Guardar Cambios
        </Button>
      </Form>
    </Container>
  );
};

export default EditRoomPage;
