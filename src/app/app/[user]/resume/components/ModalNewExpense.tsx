import { formatterValue } from "@/app/app/utils/formatterValue";
import Input from "@/app/components/Input/Input";
import Modal from "@/app/components/Modal/Modal";
import useModal from "@/app/components/Modal/useModal";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import useAccounts from "../../accounts/hooks/useAccounts";
import createExpense from "../actions/expense.actions";
import useCategories from "../hooks/useCategories";

export default function ModalNewExpense({router}: any) {
  const {categories} = useCategories()
  const {data: accounts} = useAccounts()
  const {handleCloseModal} = useModal()
  const [value, setValue] = useState('')
  const {user} = useParams()

  async function postExpense (formData: FormData) {
    const [error] = await createExpense(formData);
    handleCloseModal()
    if(error) return toast.warning('Error al registrar el gasto...')
    // refresh(true)
    router.refresh()
    // reset form and values
    const $form = document.querySelector('#form') as HTMLFormElement
    $form.reset()
    setValue('')
    // Finally create
    return toast.success('Gasto registrado!')
  }
  return (
    <Modal>
      <div className="p-5">
        <div className="border-b pb-2">
          <h1 className="text-3xl font-medium text-yellow-400">Nuevo gasto</h1>
        </div>
        <form id='form' action={postExpense} className="py-5 text-white">
          <Input type="text" label="Cuenta" value={user as string} name='username' hidden readOnly/>
          <div className="flex flex-col gap-1 pb-2">
            <Input type="text" label="Valor" name='value' value={value} onChange={(e) => formatterValue(e.target.value, setValue )} autoComplete="off"/>
          </div>
          <div className="flex flex-col gap-1 pb-2">
            <span>
              ¿De que cuenta? <span className="text-red-500">*</span>
            </span>
            <select className="selectField" name='accountid' defaultValue='0'>
              <option value='0' disabled>Seleccione una cuenta</option>
              {
                accounts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)
              }
            </select>
          </div>
          <div className="flex flex-col gap-1 pb-2">
            <span>
              ¿En que lo usaste? <span className="text-red-500">*</span>
            </span>
            <select className="selectField" name='categoryid' defaultValue='0'>
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
            <textarea className="rounded-md p-2 border-2 bg-transparent" name='description' rows={2} placeholder="Tacos" />
          </div>
          <div className="pb-2">
            <button className="bg-palette text-black rounded-md p-2 w-3/12 float-right">
              Añadir
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
