import { useState } from "react"
import { toast } from "sonner"
import createPayment from "./services/createPayment"

interface Props {
  debtID: number
}

export default function FormAbono (props: Props) {
  const {debtID} = props
  const [data, setData] = useState({
    paymentType: 'Abono',
    payValue: ''
  })

  const [loading, setLoading] = useState(false)

  async function createAbono() {
    setLoading(true)
    const [error] = await createPayment({
      debtID,
      paymentType: data.paymentType,
      payValue: data.payValue
    });
    if(error) return toast.warning('Error al hacer el abono...')
    // reset form and values
    const $form = document.querySelector('#form') as HTMLFormElement
    $form.reset()
    // Finally create
    setLoading(false)
    return toast.success('Cuenta creada!')
  }

  const formatedValue = (value: string) => {
    const validateNumber =  /^[0-9,]*$/.test(value)
    if(value === '') return setData({...data, payValue: value})
    if(!validateNumber) return
    let numberWithoutComma = parseFloat(value.replace(/,/g, ''))
    return setData({ ...data, payValue: Number(numberWithoutComma).toLocaleString()})
  }
  // async function insertItem(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault()
  //   try {
  //     const res = await fetch(`/api/payments`, {
  //       method: 'POST',
  //       body: JSON.stringify({
  //         debtID,
  //         paymentType: data.paymentType,
  //         payValue: data.payValue
  //       })
  //     })
  //     const json = await res.json()
  //     if (json.message) {
  //       toast.success(json.message)
  //     }
  //   } catch (error) {
  //     toast.error(error as string)
  //   }
  // }
  return (
    <form id='form' action={createAbono}>
      <label className="block text-[var(--color-usage)] text-md font-medium pb-2 text-center">Cuanto quiere abonar a la deuda?</label>
      <input type='text' className="bg-[#242424] border border-gray-200 w-full p-2 rounded-md text-white" name='payValue' onChange={(e) => formatedValue(e.target.value)} value={data.payValue} required/>
      <button className="block w-1/2 md:w-3/6 m-auto bg-[var(--color-usage)] text-black p-2 rounded-full mt-3 font-medium text-sm">Registrar abono</button>
    </form>
  )
}
