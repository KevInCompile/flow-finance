import EditIcon from "@/app/icons/EditIcon";
import { AccountModel } from "./models/account.model";
import DeleteIcon from "@/app/icons/DeleteIcon";
import { toast } from "sonner";
import DeleteConfirmation from "@/app/components/DeleteConfirmation/DeleteConfirmation";

export default function Card({ data, setData }: { data: AccountModel[], setData: any }) {

  async function deleteItem(id: number) {
    try {
      await fetch(`http://localhost:3000/api/account?id=${id}`, {
        method: "DELETE",
      });
      setData(data.filter((item) => item.id !== id));
      return toast("Cuenta eliminada correctamente!");
    } catch (error) {
      toast("Error al eliminar la cuenta...");
    }
  }

  return (
    <>
      {data.length >= 1 &&
        data.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border bg-[#242424]/50 text-card-foreground shadow text-white"
          >
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-md font-medium text-palette">{item.name}</h3>
              <div className="flex gap-3">
                <EditIcon />
                <DeleteConfirmation deleteItem={() => deleteItem(item.id)} />
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">$ {parseInt(item.value).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Ultimo mes</p>
            </div>
          </div>
        ))}
    </>
  );
}
