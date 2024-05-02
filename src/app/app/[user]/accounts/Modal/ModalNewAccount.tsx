import Input from "@/app/components/Input/Input";
import Modal from "@/app/components/Modal/Modal";
import { useState } from "react";

interface NewAccountModel {
  name: string;
  value: number;
  main: boolean;
}

export default function ModalNewAccount() {
  const [newAccount, setNewAccount] = useState<NewAccountModel>();
  return (
    <Modal>
      <div className="p-5">
        <div className="border-b pb-2">
          <h1 className="text-3xl font-medium text-yellow-400">Nueva cuenta</h1>
        </div>
        <form action="" className="my-5 flex flex-col gap-5">
          <Input type="text" label="Nombre" name='name' />
          <Input type="number" label="Total" name='value' />
          <div>
            <button className="bg-palette text-black rounded-md p-2 w-3/12 float-right">
              Añadir
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
