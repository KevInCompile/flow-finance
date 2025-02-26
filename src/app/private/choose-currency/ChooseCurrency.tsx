'use client'

import { useState } from 'react'
import { updateUserCurrency } from '../resume/actions/updateUser.actions'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import Button from '@/app/components/Button/Button'

export default function ChooseCurrency({
  setDataSaved,
}: {
  setDataSaved: (p: boolean) => void
}) {
  const [currency, setCurrency] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useParams()

  const handleCurrencySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    setCurrency(value)
    // Here you would typically save the currency to the user's profile or local storage
  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const [error, result] = await updateUserCurrency(user as string, currency)
      if (error) {
        toast.error(error)
      } else {
        toast.success(result)
        setDataSaved(true)
      }
    } catch (e) {
      toast.error(e as string)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 items-center my-10 h-screen animate-fade-in-down">
      <img
        src="/gravity-falls.gif"
        alt="Welcome to Gravity Falls"
        className="w-64 h-auto mb-4 rounded-lg"
      />
      <h1 className="text-2xl font-bold mb-4 text-purple-500">
        Bienvenido a tu Panel Financiero
      </h1>
      <p className="mb-4">
        Para comenzar, por favor selecciona la moneda de tu país:
      </p>
      <form onSubmit={handleSubmit} className="flex">
        <select
          className="p-2 border rounded text-black"
          value={currency}
          id="currency"
          onChange={handleCurrencySelect}
        >
          <option value="">Select Currency</option>
          <option value="USD">US Dollar (USD)</option>
          <option value="EUR">Euro (EUR)</option>
          <option value="COP">Colombian Peso (COP)</option>
          <option value="MXN">Mexican Peso (MXN)</option>
          <option value="ARS">Argentine Peso (ARS)</option>
          <option value="BRL">Brazilian Real (BRL)</option>
          <option value="CLP">Chilean Peso (CLP)</option>
          <option value="PEN">Peruvian Sol (PEN)</option>
        </select>
        <Button
          isLoading={loading}
          className=" p-2 ml-3 px-10 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          type="submit"
          text="Save"
        />
      </form>
    </div>
  )
}
