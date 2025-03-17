import { useState, useEffect, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

interface TipoHabitacion {
  id: number;
  nombre: string;
}

interface Acomodacion {
  id: number;
  nombre: string;
}

export const useFetchRoomEditData = (roomId: string | undefined) => {
  const auth = useContext(AuthContext);
  const [tiposHabitacion, setTiposHabitacion] = useState<TipoHabitacion[]>([]);
  const [acomodaciones, setAcomodaciones] = useState<Acomodacion[]>([]);
  const [roomData, setRoomData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiposHabitacionRes, acomodacionesRes, roomRes] = await Promise.all([
          api.get("/tipos-habitacion", { headers: { Authorization: `Bearer ${auth?.token}` } }),
          api.get("/acomodaciones", { headers: { Authorization: `Bearer ${auth?.token}` } }),
          api.get(`/habitaciones/${roomId}`, { headers: { Authorization: `Bearer ${auth?.token}` } }),
        ]);

        setTiposHabitacion(tiposHabitacionRes.data);
        setAcomodaciones(acomodacionesRes.data);
        setRoomData(roomRes.data);
      } catch (error) {
        console.error("Error al cargar los datos", error);
        toast.error("Error al cargar los datos de la habitación");
      }
    };

    if (roomId) {
      fetchData();
    }
  }, [roomId, auth?.token]);

  return { tiposHabitacion, acomodaciones, roomData };
};