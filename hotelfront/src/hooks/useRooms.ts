import { useState, useEffect, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

interface Room {
  id: number;
  tipo: string;
  acomodacion: string;
  cantidad: number;
}

interface Hotel {
  nombre: string;
  capacidad: number;
}

export const useRooms = (hotelId: string | undefined) => {
  const auth = useContext(AuthContext);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotel, setHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const hotelResponse = await api.get(`/hotels/${hotelId}`, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        setHotel(hotelResponse.data.data);

        const roomsResponse = await api.get(`/hotels/${hotelId}/rooms`, {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        setRooms(roomsResponse.data);
      } catch (error) {
        console.error("Error al obtener habitaciones", error);
      }
    };

    if (hotelId) {
      fetchRooms();
    }
  }, [hotelId, auth?.token]);

  return { rooms, hotel, setRooms };
};
