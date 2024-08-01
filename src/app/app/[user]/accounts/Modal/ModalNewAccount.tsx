
import Input from "@/app/components/Input/Input";
import Modal from "@/app/components/Modal/Modal";
import createItem from "../actions/createAccount.action";
import useModal from "@/app/components/Modal/useModal";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ModalNewAccount({refresh} : {refresh: (value: boolean) => void}) {

  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const {user} = useParams()
  const {handleCloseModal} = useModal()

  async function createAccount(formData: FormData) {
    setLoading(true)
    const [error] = await createItem(formData);
    handleCloseModal()
    if(error) return toast.warning('Error al crear la cuenta...')
    refresh(true)
    // reset form and values
    const $form = document.querySelector('#form') as HTMLFormElement
    $form.reset()
    setValue('')
    // Finally create
    setLoading(false)
    return toast.success('Cuenta creada!')
  }

  const formatedValue = (value: string) => {
    const validateNumber =  /^[0-9,]*$/.test(value)
    if(value === '') return setValue('0')
    if(!validateNumber) return
    let numberWithoutComma = parseFloat(value.replace(/,/g, ''))
    return setValue(Number(numberWithoutComma).toLocaleString())
  }

  return (
    <Modal>
      <div className="p-5">
        <div className="border-b pb-2">
          <h1 className="text-3xl font-medium text-yellow-400">Nueva cuenta</h1>
        </div>
        <form id='form' action={createAccount} className="my-5 flex flex-col gap-5">
          <Input type="text" label="Cuenta" value={user as string} name='username' hidden readOnly/>
          <Input type="text" label="Nombre" name='name' autoComplete="off" />
          <Input type="text" label="Total" name='value' onChange={(e) => formatedValue(e.target.value)} value={value} />
          <select className="selectField" name='type'>
            <option disabled selected>
              Escoge un tipo
            </option>
            <option value='principal'>Principal (De aca sacas para tus gastos diaros)</option>
            <option value='ahorros'>Ahorros</option>
            <option value='inversion'>Inversiones</option>
            <option value='otra'>Otra</option>
          </select>
          <div>
            <button disabled={loading} type='submit' className="bg-palette text-black rounded-md p-2 w-3/12 float-right disabled:bg-opacity-70 disabled:cursor-not-allowed">
              Añadir
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
