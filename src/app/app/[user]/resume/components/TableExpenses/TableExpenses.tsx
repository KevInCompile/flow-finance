import useExpenses from "../../hooks/useExpenses"

export default function TableExpenses () {
  const {expenses, loading} = useExpenses()
  return (
    <>
    <header className="uppercase text-white border-b pb-5 mt-5 text-sm grid grid-cols-4">
      <span>Categoria</span>
      <span>Descripción</span>
      <span>Fecha</span>
      <span>Valor</span>
    </header>
    <div className='max-h-[500px] overflow-y-auto'>
      {
        expenses.length >= 1 ? 
        expenses.map((item) => (
          <div key={item.id} className="py-5 grid grid-cols-4 border-b">
          <div className="flex gap-2 items-center text-white">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-chef-hat"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="var(--color-palette)"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 3c1.918 0 3.52 1.35 3.91 3.151a4 4 0 0 1 2.09 7.723l0 7.126h-12v-7.126a4 4 0 1 1 2.092 -7.723a4 4 0 0 1 3.908 -3.151z" />
                <path d="M6.161 17.009l11.839 -.009" />
              </svg>
              <span>{item.categoryname}</span>
            </div>
          <p className="text-white opacity-70">{item.description}</p>
          <span className='text-white opacity-70'>{item.date}</span>
          <span className='text-palette font-medium'>$ {item.value.toLocaleString('')}</span>
        </div>
        )) : <></>
      }
      </div>
    </>
  )
}