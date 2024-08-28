import React, { SetStateAction, useState } from "react"
import { toast } from "sonner"
import createPayment from "./services/createPayment"
import Button from "@/app/components/Button/Button"

interface Props {
  debtID: number
  setIsPay: React.Dispatch<boolean>
  setRefresh:  React.Dispatch<boolean>
}

export default function FormAbono (props: Props) {
  const {debtID, setIsPay, setRefresh} = props

  const [data, setData] = useState({
    paymentType: 'Abono',
    payValue: ''
  })

  const [loading, setLoading] = useState<boolean>(false)

  const createAbono = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const [error] = await createPayment({
      debtID,
      paymentType: data.paymentType,
      payValue: data.payValue
    });
      if(error){
        toast.warning('Error al hacer el abono...')
      }else{
        setData({...data, payValue: ''})
        setIsPay(false)
        setRefresh(true)
        toast.success('Abono registrado!')
      }
      setLoading(false)
  }

  // async function createAbono() {

  // }

  const formatedValue = (value: string) => {
    const validateNumber =  /^[0-9,]*$/.test(value)
    if (value === '') return setData({...data, payValue: value})
    if (!validateNumber) return
    let numberWithoutComma = parseFloat(value.replace(/,/g, ''))
    return setData({ ...data, payValue: Number(numberWithoutComma).toLocaleString()})
  }

  return (
    <form id='form' onSubmit={createAbono}>
      <label className="block text-[var(--color-usage)] text-md font-medium pb-2 text-center">Cuanto quiere abonar a la deuda?</label>
      <input type='text' className="bg-[#242424] border border-gray-200 w-full p-2 rounded-md text-white" name='payValue' onChange={(e) => formatedValue(e.target.value)} value={data.payValue} autoComplete="off" required />
      <Button className="block w-1/2 md:w-3/6 m-auto bg-[var(--color-usage)] text-black p-2 rounded-full mt-3 font-medium text-sm" type='submit' text="Registrar abono" isLoading={loading} />
    </form>
  )
}
