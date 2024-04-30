import CloseModalIcon from "@/app/icons/CloseModalIcon";
import "./modal.css";
import useModal from "./useModal";
import Input from "../Input/Input";

export default function Modal() {
  const { handleCloseModal } = useModal();
  return (
    <dialog className="fixed border-none inset-0 m-auto z-10" id="favDialog">
      <div className="w-[90vw] md:max-w-[600px] min-h-72 h-auto bg-[#242424] border-yellow-200 border-[1px] rounded-md relative">
        <button
          className="hover:text-palette absolute right-2 top-2 transition-all rounded-md p-2 px-3 text-white"
          id="cancel"
          onClick={handleCloseModal}
        >
          <CloseModalIcon />
        </button>
        <div className="p-5">
          <div className="border-b pb-2">
            <h1 className="text-3xl font-medium text-yellow-400">
              Nuevo gasto
            </h1>
          </div>
          <section className="py-5 text-white">
            <div className="flex flex-col gap-1 pb-2">
              <Input type="text" label="Valor" />
            </div>
            <div className="flex flex-col gap-1 pb-2">
              <span>
                ¿De que cuenta? <span className="text-red-500">*</span>
              </span>
              <select
                className="rounded-sm p-2"
                defaultValue={1}
                value={1}
                onChange={() => { }}
              >
                <option value={1}>Principal</option>
                <option value={2}>Ahorro</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 pb-2">
              <span>
                ¿En que lo usaste? <span className="text-red-500">*</span>
              </span>
              <select className="rounded-sm p-2">
                <option disabled selected>
                  Escoge una categoria
                </option>
              </select>
            </div>
            <div className="flex flex-col gap-1 pb-2">
              <span>Descripción</span>
              <textarea
                className="rounded-sm p-2"
                rows={2}
                placeholder="Tacos"
              />
            </div>
            <div className="pb-2">
              <button className="bg-palette text-black rounded-md p-2 w-3/12 float-right">
                Add
              </button>
            </div>
          </section>
        </div>
      </div>
    </dialog>
  );
}
