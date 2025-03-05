import Input from "@/app/components/Input/Input";
import Modal from "@/app/components/Modal/Modal";
import useModal from "@/app/components/Modal/useModal";
import { createCategory } from "../actions/createCategory";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { QueryResultRow } from "@vercel/postgres";
import { Category } from "../../resume/hooks/useCategories";

export default function ModalNewCategory({setCategories}: {setCategories: React.Dispatch<React.SetStateAction<Category[] | QueryResultRow[]>>}) {
  const {handleCloseModal} = useModal()
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    try {
      const action = await createCategory(formData);
      handleCloseModal();
      toast.success('Categoria creada exitosamente');
      setCategories(prevCategories => [...prevCategories, action]);
      formRef.current?.reset()
    } catch (error) {
      toast.error(error as string);
    }finally{
      setLoading(false);
    }
  };

  return (
    <Modal>
      <div className="p-5">
        <div className="border-b pb-2">
          <h1 className="text-3xl font-medium text-yellow-400">Nueva categoria</h1>
        </div>
        <form ref={formRef} action={handleSubmit} className="my-5">
          <Input label="Nombre" type='text' name='name' />
          <div className="flex justify-between py-6">
            <label className="text-white">Elige un color para identificarlo:</label>
            <input
              name='color'
              type='color'
              className="h-10 w-16 cursor-pointer"
            />
          </div>
          <div>
            <button
              disabled={loading}
              type="submit"
              className="bg-palette text-black rounded-md p-2 w-3/12 float-right disabled:bg-opacity-70 disabled:cursor-not-allowed"
            >
              Crear categoria
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
