import Image from "next/image";
import GithubIcon from "../icons/GithubIcon";

export default function Devs() {
  return (
    <div className="max-w-[800px] m-auto [line-height:3rem] my-10">
      <h2 className="text-center text-3xl font-medium text-secondary">
        Esta app es para ustedes realizada por:
      </h2>
      <div className="flex flex-wrap gap-5 justify-center py-5">
        <button className="bg-[#1e1d1d]/50 p-2 rounded-full w-[250px] btn-11 animate-swing-drop-in [animation-delay:500ms]">
          <div className="flex gap-5 items-center justify-between">
            <div className="w-14 h-14 rounded-full bg-[#3a3838]">
              <Image
                src="https://avatars.githubusercontent.com/u/41650859?v=4"
                width={30}
                height={30}
                className="w-full h-full p-2 rounded-full"
                decoding="async"
                loading="lazy"
                alt="KevBT"
              />
            </div>
            <span className="opacity-70 font-medium text-white">KevBT</span>
            <GithubIcon />
          </div>
        </button>
      </div>
    </div>
  );
}
