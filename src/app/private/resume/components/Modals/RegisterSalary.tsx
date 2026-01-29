import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RegisterSalaryModal() {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const salary_net_monthly = Number(formData.get('salary_net_monthly'));
    const hire_date = new Date(formData.get('hire_date') as string);
    const pay_frequency = formData.get('pay_frequency') as string;

    try {
      const response = await axios.post('/api/salary', { salary_net_monthly, hire_date, pay_frequency });
      const result = response.data;
      setOpen(false);
      toast.success("Salary registered successfully!")
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button onClick={() => setOpen(!open)} className="bg-[#242424] shadow-lg rounded-lg py-2 px-4 hover:-translate-y-[2px] transition-transform">Ingresa tu salario</button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-purple-500 text-2xl">Register Salary</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block'>Salario mensual neto:</label>
            <input id="salary_net_monthly" name="salary_net_monthly" type="number" className="w-full bg-gray-700 p-2 rounded" />
          </div>
          <div className='mb-4'>
            <label className='block'>Fecha de ingreso:</label>
            <input id="hire_date" name="hire_date" type="date" className="w-full bg-gray-700 p-2 rounded" />
          </div>
          <div className='mb-4'>
            <label>Frecuencia de pago</label>
            <select name="pay_frequency" className="w-full bg-gray-700 p-2 rounded">
              <option value="weekly">Semanal</option>
              <option value="biweekly">Quincenal</option>
              <option value="monthly">Mensual</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-purple-600 px-4 py-2 rounded mr-2"
            >
              Registrar
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
