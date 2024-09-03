import { formatterValue } from "@/app/app/utils/formatterValue";
import Input from "@/app/components/Input/Input";
import Modal from "@/app/components/Modal/Modal";
import useModal from "@/app/components/Modal/useModal";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import createExpense from "../actions/expense.actions";
import useCategories from "../hooks/useCategories";
import { AccountModel } from "../../accounts/models/account.model";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import createIncome from "../actions/income.actions";

interface Props {
  refresh: React.Dispatch<boolean>
  accounts: AccountModel[]
}

export default function ModalNewExpense(props: Props) {
  const {refresh, accounts} = props
  const [loading, setLoading] = useState(false)
  const {categories} = useCategories()
  const {handleCloseModal} = useModal()
  const [value, setValue] = useState('')
  const {user} = useParams()
  const [movetype, setMoveType] = useState("expense")

  const fecha = new Date().toISOString().split('T')[0]

  const [data, setData] = useState({
    description: '',
    categoryid: 0,
    accountid: 0
  })

  const sendMove = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(movetype === 'expense') {
      postExpense()
    }else{
      handleIncome()
    }
  }

  const handleChange = (e: any) => {
    const {name, value} = e.target
    setData({
      ...data,
      [name]: value
    })

  }

  const handleIncome = async () => {

    const [error] = await createIncome({ accountId: data.accountid, value, typeIncome: data.description, username: user, date: fecha })
    handleCloseModal()
    if (error) {
     toast.error(error)
    } else {
      toast.success('Ingreso eliminado, dinero removido de la cuenta')
    }
  }

  async function postExpense () {
    setLoading(true)
    const [error] = await createExpense({
      accountId: data.accountid,
      categoryId: data.categoryid,
      username: user,
      description: data.description,
      value
    });

    handleCloseModal()
    if(error) return toast.warning('Error al registrar el gasto...')
    refresh(true)
    // reset form and values
    setValue('')
    // Finally create
    setLoading(false)
    return toast.success('Gasto registrado, dinero descontado de la cuenta')
  }
  return (
    <Modal>
      <div className="p-5">
        <div className="border-b pb-2">
          <h1 className="text-3xl font-medium text-yellow-400">Nuevo movimiento</h1>
        </div>
        <form id='form' className="py-5 text-white" onSubmit={sendMove}>
          <RadioGroup defaultValue="expense" onValueChange={setMoveType} className="flex space-x-4 pb-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense">Gasto</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income">Ingreso</Label>
            </div>
          </RadioGroup>
          <div className="flex flex-col gap-1 pb-2">
            <Input type="text" label="Valor" name='value' value={value} onChange={(e) => formatterValue(e.target.value, setValue )} autoComplete="off"/>
          </div>
          <div className="flex flex-col gap-1 pb-2">
            <span>
              Cuenta <span className="text-red-500">*</span>
            </span>
            <select className="selectField" name='accountid' value={data.accountid} defaultValue='0' onChange={handleChange} required>
              <option value='0' disabled>Seleccione una cuenta</option>
              {
                accounts?.map((item) => <option key={item?.id} value={item?.id}>{item?.name}</option>)
              }
            </select>
          </div>
          {
            movetype === 'expense' && (
              <div className="flex flex-col gap-1 pb-2">
                <span>
                  ¿En que lo usaste? <span className="text-red-500">*</span>
                </span>
                <select className="selectField" value={data.categoryid} name='categoryid' defaultValue='0'onChange={handleChange} required>
                  <option value='0' disabled>
                    Selecciona una categoria
                  </option>
                  {
                    categories?.map((item) => <option key={item?.id} value={item?.id}>{item?.name}</option>)
                  }
                </select>
              </div>
            )
          }
          <div className="flex flex-col gap-1 pb-2">
            <span>Concepto</span>
            <textarea className="rounded-md p-2 border-2 bg-transparent" name='description' rows={2} value={data.description} placeholder={movetype === 'expense' ? 'Tacos' : 'Salario, Freelance, etc...'} onChange={handleChange} />
          </div>
          <div className="pb-2">
            <button disabled={loading} className="bg-palette text-black rounded-md p-2 w-3/12 float-right disabled:bg-opacity-70 disabled:cursor-not-allowed">
              Añadir
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
