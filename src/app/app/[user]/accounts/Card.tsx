import { AccountModel } from "./models/account.model";

export default function Card({ data }: { data: AccountModel[] }) {
  return (
    <>
      {data.length >= 1 &&
        data.map((item) => (
          <div
            key={item.id}
            className="bg-[#242424]/50 rounded-md py-2 text-white"
          >
            <div className="py-1 text-center font-medium border-b border-gray-500 flex gap-2 items-center justify-center">
              <h3>{item.name}</h3>
              {/* <img src="estrella.png" className="w-5 h-5" loading="lazy" /> */}
            </div>
            <h3 className="text-palette text-center font-bold py-2">
              $ {parseInt(item.value).toLocaleString()}
            </h3>
          </div>
        ))}
    </>
  );
}
