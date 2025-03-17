import { toast } from "react-toastify";
import api from "../api/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export interface Room {
  id: number;
  tipo: string;
  acomodacion: string;
  cantidad: number;
}

export const useDeleteRoom = (setRooms: React.Dispatch<React.SetStateAction<Room[]>>) => {
  const auth = useContext(AuthContext);

  const handleDelete = async (roomId: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta habitación?")) {
      return;
    }
    try {
      await api.delete(`/habitaciones/${roomId}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });

      toast.success("Habitación eliminada correctamente");

      // Filtrar la habitación eliminada de la lista
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));

    } catch (error) {
      console.error("Error al eliminar la habitación:", error);
      toast.error("Error al eliminar la habitación");
    }
  };

  return { handleDelete };
};
