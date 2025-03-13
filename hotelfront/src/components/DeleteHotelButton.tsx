import { Button } from "react-bootstrap";

interface Props {
  hotelId: number;
  onDelete: (id: number) => void;
}

const DeleteHotelButton = ({ hotelId, onDelete }: Props) => {
  const handleDelete = () => {
    if (window.confirm("¿Seguro que deseas eliminar este hotel?")) {
      onDelete(hotelId);
    }
  };

  return (
    <Button variant="danger" size="sm" onClick={handleDelete}>
      Eliminar
    </Button>
  );
};

export default DeleteHotelButton;
