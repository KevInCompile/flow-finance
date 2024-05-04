"use client";

export default function useModal() {
  const handleShowModal = () => {
    const $favDialog = document.getElementById(
      "favDialog",
    ) as HTMLDialogElement;
    $favDialog.showModal();
  };

  const handleAnimationEnd = ($favDialog: HTMLDialogElement) => {
    $favDialog.addEventListener(
      "animationend",
      () => {
        $favDialog.removeAttribute("close");
        $favDialog.close();
      },
      { once: true },
    );
  };

  const handleCloseModal = () => {
    const $favDialog = document.getElementById(
      "favDialog",
    ) as HTMLDialogElement;
    $favDialog.setAttribute("close", "");
    handleAnimationEnd($favDialog);
  };

  return { handleShowModal, handleAnimationEnd, handleCloseModal };
}
