
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api/api";

interface HotelData {
  nombre: string;
  direccion: string;
  ciudad: string;
  nit: string;
  capacidad: number;
}

interface Option {
  id: string;
  nombre: string;
}

const useAddHotel = (refreshHotels: () => void) => {
  const [hotelData, setHotelData] = useState<HotelData>({
    nombre: "",
    direccion: "",
    ciudad: "",
    nit: "",
    capacidad: 1,
  });
  const [ciudades, setCiudades] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/ciudades", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCiudades(response.data);
      } catch (error) {
        toast.error("Error cargando ciudades");
      }
    };
    fetchCiudades();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, handleClose: () => void) => {
    event.preventDefault();
    setValidated(true);
    if (event.currentTarget.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    setLoading(true);
    try {
  const token = localStorage.getItem("token");
  await api.post("/hotels", hotelData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  toast.success("Hotel agregado correctamente");
  refreshHotels();
  handleClose();
    } catch (error:any) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errores = error.response.data.errors; // Accede a 'errors' directamente

        if (errores) {
          if (errores.nombre) {
            toast.error(errores.nombre[0]);
          }
          if (errores.nit) {
            toast.error(errores.nit[0]);
          }
        }
      } else {
        toast.error("Error al agregar el hotel");
      }
    } finally {
      setLoading(false);
    }
  };

  return { hotelData, setHotelData, ciudades, loading, validated, handleSubmit };
};

export default useAddHotel;