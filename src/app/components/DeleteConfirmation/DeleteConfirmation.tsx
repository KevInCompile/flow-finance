import DeleteIcon from '@/app/icons/DeleteIcon'
import { useState } from 'react'

export default function DeleteConfirmation({
  deleteItem,
  message,
}: {
  deleteItem: () => void
  message: string
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
      <button onClick={() => handleDeleteConfirmation()}>
        <DeleteIcon />
      </button>
      {confirmDelete && (
        <div className="fixed top-0 left-0 min-w-full min-h-full backdrop-blur-sm z-10">
          <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#242424] text-white p-5 rounded-md w-[80%] md:w-auto border-purple-300 border">
            <h3 className="font-medium text-xl text-center text-palette">
              you&apos;re sure?
            </h3>
            <p className="text-center">{message}</p>
            <div className="flex justify-between pt-5 gap-5">
              <button
                className="bg-red-500 hover:bg-red-700 rounded-xl p-2 px-10"
                onClick={handleConfirmDelete}
              >
                Yes
              </button>
              <button
                className="border rounded-xl p-2 hover:bg-slate-500 px-10"
                onClick={handleCancelDelete}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
