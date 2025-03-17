import { useState, useEffect,useContext } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const acomodacionesPermitidas: Record<string, string[]> = {
  "Estándar": ["Sencilla", "Doble"],
  "Junior": ["Triple", "Cuádruple"],
  "Suite": ["Sencilla", "Doble", "Triple"]
};

export const useEditRoomForm = (hotelId: string, roomData: any, tiposHabitacion: any[], acomodaciones: any[]) => {
      const auth = useContext(AuthContext);    
  const navigate = useNavigate();
  const [tipoHabitacionId, setTipoHabitacionId] = useState(roomData?.tipo_habitacion_id || "");
  const [acomodacionId, setAcomodacionId] = useState(roomData?.acomodacion_id || "");
  const [cantidad, setCantidad] = useState(roomData?.cantidad || "");
  const [acomodacionesFiltradas, setAcomodacionesFiltradas] = useState<any[]>([]);

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

    if (!filtradas.find((acom) => acom.id.toString() === acomodacionId)) {
      setAcomodacionId(filtradas.length > 0 ? filtradas[0].id.toString() : "");
    }
  }, [tipoHabitacionId, tiposHabitacion, acomodaciones]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(
        `/habitaciones/${roomData.id}`,
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