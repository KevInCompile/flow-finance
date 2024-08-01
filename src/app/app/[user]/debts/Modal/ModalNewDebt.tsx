import Input from "@/app/components/Input/Input";
import Modal from "@/app/components/Modal/Modal";
import useModal from "@/app/components/Modal/useModal";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useState } from "react";
import createDebt from "../actions/createDebts.action";

export default function ModalNewDebt({refresh} : {refresh: (value: boolean) => void}) {

  const [valuesState, setValuesState] = useState({
    totalDue: '',
    feeValue: ''
  })
  const [loading, setLoading] = useState(false)
  const {user} = useParams()
  const {handleCloseModal} = useModal()

  async function createAccount(formData: FormData) {
    setLoading(true)
    const [error] = await createDebt(formData);
    handleCloseModal()
    if (error) return toast.warning('Error al registrar la deuda...')
    refresh(true)
    // reset form and values
    const $form = document.querySelector('#form') as HTMLFormElement
    $form.reset()
    setValuesState({
      totalDue: '',
      feeValue: ''
    })
    // Finally create
    setLoading(false)
    return toast.success('Deuda registrada!')
  }

  const formatedValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    const validateNumber =  /^[0-9,]*$/.test(value)
    if (value === '') return setValuesState({...valuesState, [name]: '0'})
    if(!validateNumber) return
    let numberWithoutComma = parseFloat(value.replace(/,/g, ''))
    return setValuesState({ ...valuesState, [name]: Number(numberWithoutComma).toLocaleString() })
  }

  return (
    <Modal>
      <div className="p-5">
        <div className="border-b pb-2">
          <h1 className="text-3xl font-medium text-yellow-400">Nueva deuda</h1>
        </div>
        <form id='form' action={createAccount} className="my-5 flex flex-col gap-5">
          <Input type="text" label="Cuenta" value={user as string} name='username' hidden readOnly/>
          <Input type="text" label="Descripción" name='description' autoComplete="off" />
          <Input type="text" label="Dinero a deber" name='totalDue' onChange={formatedValue} value={valuesState.totalDue} />
          <Input type='number' label='Cuotas' name='fee' />
          <Input type='text' label='Valor de la cuota' name='feeValue' onChange={formatedValue} value={valuesState.feeValue} />
          <Input type='number' max='31' min='1' label='Día de pago' name='payday' />
          <div>
            <button disabled={loading} type='submit' className="bg-palette text-black rounded-md p-2 w-3/12 float-right disabled:opacity-30 disabled:cursor-not-allowed">
              Añadir
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
