import CalendarIcon from "@/app/icons/CalendarIcon";

export default function DateRangeExpense() {
  let date = new Date().toISOString().split("T")[0];

  function getDate(index: number) {
    return date.split("-")[index];
  }

  return (
    <div className="py-5 flex gap-2 items-center justify-center">
      <span className="inline-block relative w-8 h-8">
        <span className="absolute top-0 left-0">
          <CalendarIcon color="var(--color-secondary)" />
        </span>
        <input
          type="date"
          className="opacity-0 absolute top-0 left-0 h-8 w-8 cursor-pointer box-border"
        />
      </span>
      <span className="text-md text-secondary">
        {getDate(1)} - {getDate(2)}
      </span>
    </div>
  );
}
