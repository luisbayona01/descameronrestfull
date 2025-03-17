import { toast } from "react-toastify";
import api from "../api/api";

export const useDeleteHotel = (onDelete: (id: number) => void) => {
  const handleDelete = async (hotelId: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este hotel?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No se encontró el token de autenticación.");
        return;
      }

      await api.delete(`/hotels/${hotelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Hotel eliminado correctamente");
      onDelete(hotelId);
    } catch (error) {
      console.error("Error al eliminar el hotel:", error);
      toast.error("Error al eliminar el hotel");
    }
  };

  return { handleDelete };
};