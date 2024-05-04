import DeleteIcon from "@/app/icons/DeleteIcon";
import { useState } from "react";

export default function DeleteConfirmation ({deleteItem}: {deleteItem: () => void}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteConfirmation = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    deleteItem();
    setConfirmDelete(false);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  return (
    <>
      <button onClick={() => handleDeleteConfirmation()}>
        <DeleteIcon />
      </button>
      {confirmDelete && (
        <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm">
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#242424] text-white p-5 rounded-md w-[80%] md:w-auto">
            <h3 className="font-medium text-xl text-center text-palette">Confirmación</h3>
            <p className="text-center">¿Deseas eliminar esta cuenta?</p>
            <div className="flex justify-between pt-5">
              <button className="bg-red-500 hover:bg-red-700 rounded-xl p-2" onClick={handleConfirmDelete}>Confirmar</button>
              <button className="border rounded-xl p-2 hover:bg-slate-500" onClick={handleCancelDelete}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
