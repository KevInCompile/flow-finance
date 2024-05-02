"use client";

import CloseModalIcon from "@/app/icons/CloseModalIcon";
import "./modal.css";
import useModal from "./useModal";

export default function Modal({ children }: { children: React.ReactNode }) {
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
        {children}
      </div>
    </dialog>
  );
}
