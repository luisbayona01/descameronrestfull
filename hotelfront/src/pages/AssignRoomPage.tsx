import { useEffect, useState, useContext } from "react";
import { useParams,useNavigate} from "react-router-dom";
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

const AssignRoomPage = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { hotelId } = useParams<{ hotelId: string }>(); // Extraer ID desde la URL
  //console.log('aaaasss',hotelId)
  const [tiposHabitacion, setTiposHabitacion] = useState<TipoHabitacion[]>([]);
  const [acomodaciones, setAcomodaciones] = useState<Acomodacion[]>([]);
  const [tipoHabitacionId, setTipoHabitacionId] = useState("");
  const [acomodacionId, setAcomodacionId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [acomodacionesFiltradas, setAcomodacionesFiltradas] = useState<Acomodacion[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tiposHabitacionRes = await api.get("/tipos-habitacion", {
          headers: { Authorization: `Bearer ${auth?.token}` }
        });
        setTiposHabitacion(tiposHabitacionRes.data);

        const acomodacionesRes = await api.get("/acomodaciones", {
          headers: { Authorization: `Bearer ${auth?.token}` }
        });
        setAcomodaciones(acomodacionesRes.data);
      } catch (error) {
        console.error("Error al obtener datos", error);
        toast.error("Error al cargar opciones");
      }
    };

    fetchData();
  }, [auth?.token]);

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
    setAcomodacionId(""); 
  }, [tipoHabitacionId, tiposHabitacion, acomodaciones]);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(
        "/habitaciones",
        {
          hotel_id: hotelId, 
          tipo_habitacion_id: tipoHabitacionId,
          acomodacion_id: acomodacionId,
          cantidad,
        },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
  
      toast.success("Habitación asignada con éxito");
      navigate(`/rooms/${hotelId}`);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = error.response.data.errors;
  
        // error de cantidad
        if (validationErrors.cantidad) {
          toast.error(validationErrors.cantidad[0]);
        }
        
        //  error de habitación  de  acomodacion
        if (validationErrors.habitacion) {
          const errorMensaje = validationErrors.habitacion[0];
          if (errorMensaje.includes("Ya existe un registro con este tipo de habitación y acomodación para este hotel")) {
            toast.error("Este tipo de habitación y acomodación ya existe para este hotel.");
          }
        }
      } else {
        toast.error("Error al asignar la habitación");
      }
  
      console.error("Error en la asignación", error.response);
    }
  };

  return (
    <Container className="mt-5">
      <NavbarComponent />
           <div className="d-flex justify-content-between align-items-center my-4">
       
        <Button variant="secondary" onClick={() => navigate(`/rooms/${hotelId}`)}>
  ← Volver
</Button>
</div>
      <h2>Asignar Habitación</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="tipoHabitacionSelect" className="mt-3">
          <Form.Label>Tipo de Habitación</Form.Label>
          <Form.Select value={tipoHabitacionId} onChange={(e) => setTipoHabitacionId(e.target.value)} required>
            <option value="">Seleccione un tipo de habitación</option>
            {tiposHabitacion.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="acomodacionSelect" className="mt-3">
          <Form.Label>Acomodación</Form.Label>
          <Form.Select value={acomodacionId} onChange={(e) => setAcomodacionId(e.target.value)} required disabled={!tipoHabitacionId}>
            <option value="">Seleccione una acomodación</option>
            {acomodacionesFiltradas.map((acomodacion) => (
              <option key={acomodacion.id} value={acomodacion.id}>
                {acomodacion.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="cantidadInput" className="mt-3">
          <Form.Label>Cantidad</Form.Label>
          <Form.Control
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
            min="1"
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Asignar Habitación
        </Button>
      </Form>
    </Container>
  );
};

export default AssignRoomPage;
