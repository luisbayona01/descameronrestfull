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

export const useFetchRoomData = () => {
  const auth = useContext(AuthContext);
  const [tiposHabitacion, setTiposHabitacion] = useState<TipoHabitacion[]>([]);
  const [acomodaciones, setAcomodaciones] = useState<Acomodacion[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tiposHabitacionRes = await api.get("/tipos-habitacion", {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        setTiposHabitacion(tiposHabitacionRes.data);

        const acomodacionesRes = await api.get("/acomodaciones", {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        setAcomodaciones(acomodacionesRes.data);
      } catch (error) {
        console.error("Error al obtener datos", error);
        toast.error("Error al cargar opciones");
      }
    };

    fetchData();
  }, [auth?.token]);

  return { tiposHabitacion, acomodaciones };
};