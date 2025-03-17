import { useState, useEffect, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

interface City {
  id: string;
  nombre: string;
}

interface Hotel {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  nit: string;
  capacidad: number;
}

export const useEditHotelModal = (hotel: Hotel, refreshHotels: () => void, handleClose: () => void) => {
  const auth = useContext(AuthContext);

  const [nombre, setNombre] = useState(hotel.nombre);
  const [direccion, setDireccion] = useState(hotel.direccion);
  const [ciudades, setCiudades] = useState<City[]>([]);
  const [ciudadId, setCiudadId] = useState<string>("");
  const [nit, setNit] = useState(hotel.nit);
  const [capacidad, setCapacidad] = useState(hotel.capacidad);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNombre(hotel.nombre);
    setDireccion(hotel.direccion);
    setNit(hotel.nit);
    setCapacidad(hotel.capacidad);

    if (ciudades.length > 0) {
      const ciudadActual = ciudades.find((c) => c.nombre === hotel.ciudad);
      setCiudadId(ciudadActual ? ciudadActual.id : "");
    }
  }, [hotel, ciudades]);

  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const response = await api.get("/ciudades", {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });

        if (Array.isArray(response.data)) {
          setCiudades(response.data);
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

    fetchCiudades();
  }, [auth?.token]);

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

  return {
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
  };
};