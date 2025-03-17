import { useState, useEffect,useContext } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
interface Acomodacion {
  id: number;
  nombre: string;
}

const acomodacionesPermitidas: Record<string, string[]> = {
  "Estándar": ["Sencilla", "Doble"],
  "Junior": ["Triple", "Cuádruple"],
  "Suite": ["Sencilla", "Doble", "Triple"],
};

export const useAssignRoomForm = (hotelId: string, tiposHabitacion: any[], acomodaciones: Acomodacion[]) => {
    const auth = useContext(AuthContext);  
  const navigate = useNavigate();
  const [tipoHabitacionId, setTipoHabitacionId] = useState("");
  const [acomodacionId, setAcomodacionId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [acomodacionesFiltradas, setAcomodacionesFiltradas] = useState<Acomodacion[]>([]);

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

        if (validationErrors.cantidad) {
          toast.error(validationErrors.cantidad[0]);
        }

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

  return {
    tipoHabitacionId,
    setTipoHabitacionId,
    acomodacionId,
    setAcomodacionId,
    cantidad,
    setCantidad,
    acomodacionesFiltradas,
    handleSubmit,
  };
};