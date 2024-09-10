import './grid-bento.css'

export default function GridBento() {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-10 lg:[grid-template-rows:repeat(11,_minmax(30px,_1fr))] gap-3 my-10 w-full animate-fade-in-down lg:max-w-[1200px] lg:m-auto lg:py-10 text-white">
      <div className="lg:[grid-column:1/5] lg:[grid-row:1/6] bg-gray-700 rounded-md zoom-in [animation-delay:600ms] relative card-bento">
        <div>
          <img src="/graphic.png" className="h-20 m-auto" alt="graphic" />
          <h1 className="text-palette text-lg">Simple analytics</h1>
          <p className="py-2 md:py-0 opacity-70">
            You will be able to view your expenses in a graph, which will allow you to easily identify the moments in
            which you incurred losses ⚡
          </p>
        </div>
      </div>
      <div className="block py-1 md:[grid-column:5/7] md:[grid-row:1/6] bg-gray-700 rounded-md zoom-in [animation-delay:700ms] card-bento">
        <div className="flex flex-col gap-2">
          <img src="/divisas.webp" className="h-24 m-auto" />
          <h1 className="text-lg text-center font-semibold text-palette">Variety of currencies</h1>
        </div>
      </div>
      <div className="block lg:[grid-column:1/3] lg:[grid-row:6/11] bg-gray-700 rounded-md zoom-in 0 [animation-delay:800ms] card-bento relative">
        <div className="flex flex-col gap-5">
          <img src="/saving.png" className="h-24 m-auto" />
          <h1 className="text-lg text-palette">Goals of savings</h1>
        </div>
      </div>
      <div className="block lg:[grid-column:3/7] lg:[grid-row:6/11] bg-gray-700 rounded-md zoom-in [animation-delay:900ms] card-bento">
        <div></div>
      </div>
      <div className="block md:[grid-column:7/11] md:[grid-row:1/11] bg-gray-700 rounded-md zoom-in [animation-delay:1000ms] border-effect">
        <div className="[z-index:1] text-white"></div>
      </div>
    </div>
  )
}
