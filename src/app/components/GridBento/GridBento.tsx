import "./grid-bento.css";

export default function GridBento() {
  return (
    <div className="md:grid md:grid-cols-10 px-5 md:[grid-template-rows:repeat(11,_minmax(30px,_1fr))] gap-3 my-10 w-full animate-fade-in-down lg:max-w-[1200px] lg:m-auto lg:py-10 text-white">
      <div className="flex flex-col md:[grid-column:1/5] md:[grid-row:1/6] bg-gray-700 rounded-md zoom-in [animation-delay:600ms] relative card-bento">
        <div>
          <img src="/graphic.png" className="h-20 m-auto" />
          <h1 className="text-white">Analiticas simples</h1>
          <p className="py-2 md:py-0">
            Podrás visualizar tus gastos en una gráfica, lo que te permitirá
            identificar fácilmente los momentos en los que incurriste en
            pérdidas. 🎇
          </p>
        </div>
      </div>
      <div className="block md:[grid-column:5/7] md:[grid-row:1/6] bg-gray-700 rounded-md zoom-in [animation-delay:700ms] card-bento">
        <div>
          <img src="/divisas.webp" className="h-24 m-auto" />
          <h1 className="text-2xl text-center font-semibold text-purple-200">
            Conversor de divisas
          </h1>
        </div>
      </div>
      <div className="md:[grid-column:1/3] md:[grid-row:6/11] bg-gray-700 rounded-md zoom-in 0 [animation-delay:800ms] card-bento"></div>
      <div className="md:[grid-column:3/7] [grid-row:6/11] bg-gray-700 rounded-md zoom-in [animation-delay:900ms] card-bento"></div>
      <div className="md:[grid-column:7/11] md:[grid-row:1/11] bg-gray-700 rounded-md zoom-in [animation-delay:1000ms] border-effect">
        <div className="[z-index:1] text-white"></div>
      </div>
    </div>
  );
}
