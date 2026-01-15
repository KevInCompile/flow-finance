import { useState } from 'react'
import Portal from '../Portal/Portal'

export default function DeleteConfirmation({
  deleteItem,
  message,
}: {
  deleteItem: () => void
  message: string | JSX.Element
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDeleteConfirmation = () => {
    setConfirmDelete(true)
  }

  const handleConfirmDelete = () => {
    deleteItem()
    setConfirmDelete(false)
  }

  const handleCancelDelete = () => {
    setConfirmDelete(false)
  }

  return (
    <>
      <button
        className="text-gray-400 hover:text-red-500"
        onClick={() => handleDeleteConfirmation()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {confirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-[999]">
            <div className="bg-[#242424] text-white p-5 rounded-md max-w-md w-full md:w-auto border">
              <h3 className="font-medium text-xl text-center text-purple-500 mb-2">
                ¿Estás seguro?
              </h3>
              <div className="text-center">{message}</div>
              <div className="flex pt-5 gap-5 justify-center">
                <button
                  className="bg-red-500 hover:bg-red-700 rounded-xl p-2 px-10 text-sm 2xl:text-md"
                  onClick={handleConfirmDelete}
                >
                  Sí, elimina
                </button>
                <button
                  className="border rounded-xl p-2 hover:bg-slate-500 px-10 text-sm 2xl:text-md"
                  onClick={handleCancelDelete}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
      )}
    </>
  )
}
