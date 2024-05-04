import Input from "@/app/components/Input/Input";
import Modal from "@/app/components/Modal/Modal";
import useCategories from "../hooks/useCategories";

export default function ModalNewExpense() {
  const {categories} = useCategories()

  return (
    <Modal>
      <div className="p-5">
        <div className="border-b pb-2">
          <h1 className="text-3xl font-medium text-yellow-400">Nuevo gasto</h1>
        </div>
        <section className="py-5 text-white">
          <div className="flex flex-col gap-1 pb-2">
            <Input type="text" label="Valor" />
          </div>
          <div className="flex flex-col gap-1 pb-2">
            <span>
              ¿De que cuenta? <span className="text-red-500">*</span>
            </span>
            <select className="selectField" defaultValue='0' value='0'>
              <option value='0' disabled>Seleccione una cuenta</option>
              <option value='1'>Principal</option>
              <option value='2'>Ahorro</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 pb-2">
            <span>
              ¿En que lo usaste? <span className="text-red-500">*</span>
            </span>
            <select className="selectField" defaultValue='0' value='0'>
              <option value='0' disabled>
                Selecciona una categoria
              </option>
              {
                categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)
              }
            </select>
          </div>
          <div className="flex flex-col gap-1 pb-2">
            <span>Descripción</span>
            <textarea className="rounded-sm p-2" rows={2} placeholder="Tacos" />
          </div>
          <div className="pb-2">
            <button className="bg-palette text-black rounded-md p-2 w-3/12 float-right">
              Añadir
            </button>
          </div>
        </section>
      </div>
    </Modal>
  );
}
