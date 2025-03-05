'use client'

import Head from "@/app/components/Head/Head"
import OpenButton from "../accounts/OpenButton/OpenButton"
import ModalNewCategory from "./modal/new-category"
import useCategories from "../resume/hooks/useCategories"
import SkeletonCategory from "./skeleton/skeleton-category"
import { deleteCategory } from "./actions/deleteCategory"
import { toast } from "sonner"
import DeleteConfirmation from "@/app/components/DeleteConfirmation/DeleteConfirmation"

export default function Categories() {
  const { categories, setCategories, loading } = useCategories()

  const handleDelete = async (categoryId: number) => {
    try {
      const action = await deleteCategory(categoryId)
      if(action.success){
        toast.success(action.success)
        setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId))
      }
    } catch (error) {
      toast.error('Error al eliminar la categoria')
    }
  }
  return (
    <>
      <Head />
      <section className="mb-8">
        <div className="flex items-center justify-center pb-3">
          <h1 className="text-2xl font-medium text-center text-purple-500">
            Categorias
          </h1>
          <OpenButton />
        </div>
        <p className="text-sm text-gray-500 max-w-80 text-center m-auto mb-6">
          Bienvenido a la sección de categorias, aquí podrás crear, editar y eliminar categorías para categorizar tus transacciones.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
          {loading ? (
           <SkeletonCategory />
          ) : categories && categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="bg-background rounded-lg p-4 flex items-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className="w-10 h-10 rounded-full mr-3"
                  style={{ backgroundColor: category.color }}
                ></div>
                <div className="flex-1">
                  <h3 className="text-white text-lg font-medium">{category.name}</h3>
                </div>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <DeleteConfirmation
                    deleteItem={() => handleDelete(category.id)}
                    message={<p>Se eliminará la categoria y los registros asociados</p>}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">
              No hay categorías disponibles. Crea una nueva categoría para empezar.
            </div>
          )}
        </div>
      </section>
      <ModalNewCategory setCategories={setCategories} />
    </>
  )
}
