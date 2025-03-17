import { useState, useEffect, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useDeleteHotel } from "./useDeleteHotel";

interface Hotel {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  nit: string;
  capacidad: number;
}

export const useHotels = () => {
  const auth = useContext(AuthContext);
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const { handleDelete } = useDeleteHotel((id: number) => {
    setHoteles((prevHoteles) => prevHoteles.filter((hotel) => hotel.id !== id));
  });

  useEffect(() => {
    fetchHoteles();
  }, [auth?.token]);

  const fetchHoteles = async () => {
    try {
      const response = await api.get("/hotels", {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      setHoteles(response.data.data);
    } catch (error) {
      console.error("Error al obtener hoteles", error);
    }
  };

  const handleEdit = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowEditModal(true);
  };

  return {
    hoteles,
    showModal,
    setShowModal,
    selectedHotel,
    showEditModal,
    setShowEditModal,
    fetchHoteles,
    handleDelete,
    handleEdit,
  };
};