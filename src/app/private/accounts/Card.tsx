import DeleteConfirmation from "@/app/components/DeleteConfirmation/DeleteConfirmation";
import EditIcon from "@/app/icons/EditIcon";
import { toast } from "sonner";
import { AccountModel } from "./models/account.model";
import { useState } from "react";
import SaveIcon from "@/app/icons/SaveIcon";

const INITIAL_STATE = {
  id: 0,
  name: "",
  value: "",
  type: "",
};

export default function Card({
  data,
  setData,
}: {
  data: AccountModel[];
  setData: any;
}) {
  const [itemSelected, setItemSelected] = useState<AccountModel>(INITIAL_STATE);

  const selectItem = (data: AccountModel) => {
    setItemSelected(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItemSelected({ ...itemSelected, [name]: value });
  };

  async function updateItem() {
    try {
      const res = await fetch(`/api/account?id=${itemSelected?.id}`, {
        method: "PUT",
        body: JSON.stringify(itemSelected),
      });
      const json = await res.json();

      if (json.message) {
        setData([
          ...data.filter((item) => item.id !== itemSelected.id),
          itemSelected,
        ]);
        setItemSelected(INITIAL_STATE);
        toast.success(json.message);
      }
    } catch (error) {
      toast.error(error as string);
    }
  }

  async function deleteItem(id: number) {
    try {
      const response = await fetch(`/api/account?id=${id}`, {
        method: "DELETE",
      });
      if(response.ok){
        setData(data.filter((item) => item.id !== id));
        return toast.success("Account deleted");
      }
    } catch (error) {
      toast.error("Error deleting account");
    }
  }

  return (
    <>
      {data.length >= 1 &&
        data.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-[#191919] text-card-foreground shadow text-white"
          >
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-md font-medium text-palette">
                {item.name}
              </h3>
              <div className="flex gap-3">
                {itemSelected?.id === item.id ? (
                  <button onClick={updateItem}>
                    <SaveIcon />
                  </button>
                ) : (
                  <button onClick={() => selectItem(item)}>
                    <EditIcon />
                  </button>
                )}
                <DeleteConfirmation
                  deleteItem={() => deleteItem(item.id)}
                  message={<p>¿Deseas eliminar esta cuenta? <br />Todos los gastos asociados se perderán</p>}
                />
              </div>
            </div>
            <div className="p-6 pt-0">
              {itemSelected?.id === item.id ? (
                <input
                  onChange={handleChange}
                  name="value"
                  type="text"
                  value={itemSelected.value}
                  className="bg-transparent border-b-2 text-2xl outline-none w-full"
                  autoFocus
                />
              ) : (
                <div className="text-2xl font-semibold">
                  {parseInt(item?.value).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
    </>
  );
}
