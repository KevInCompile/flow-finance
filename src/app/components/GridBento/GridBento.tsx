import './grid-bento.css'
import Image from 'next/image'

export default function GridBento() {
  return (
    <div className="flex flex-col max-w-[450px] m-auto lg:grid lg:grid-cols-10 lg:[grid-template-rows:repeat(11,_minmax(30px,_1fr))] gap-3 my-10 w-full animate-fade-in-down lg:max-w-[1200px] lg:m-auto lg:py-10 text-white">
      <div className="lg:[grid-column:1/5] lg:[grid-row:1/6] bg-gray-700 rounded-md zoom-in [animation-delay:600ms] relative card-bento">
        <div>
          <img src="/graphic.png" className="h-20 m-auto" alt="graphic" />
          <h1 className="text-palette text-lg">Simple analytics</h1>
          <p className="py-2 md:py-0 opacity-70">
            You will be able to view your expenses in a graph, which will allow
            you to easily identify the moments in which you incurred losses ⚡
          </p>
        </div>
      </div>
      <div className="block py-1 md:[grid-column:5/7] md:[grid-row:1/6] bg-gray-700 rounded-md zoom-in [animation-delay:700ms] card-bento">
        <div className="flex flex-col gap-2">
          <Image
            src="/divisas.webp"
            className="h-24 m-auto"
            width={96}
            height={40}
            alt="divisas representation"
          />
          <h1 className="text-lg text-center font-semibold text-palette">
            Variety of currencies
          </h1>
        </div>
      </div>
      <div className="block lg:[grid-column:1/3] lg:[grid-row:6/11] bg-gray-700 rounded-md zoom-in 0 [animation-delay:800ms] card-bento relative">
        <div className="flex flex-col gap-5">
          <Image
            src="/saving.png"
            className="h-24 m-auto"
            width={96}
            height={40}
            alt="saving of goals representation"
          />
          <h1 className="text-lg text-palette">Goals of savings</h1>
        </div>
      </div>
      <div className="block lg:[grid-column:3/7] lg:[grid-row:6/11] bg-gray-700 rounded-md zoom-in [animation-delay:900ms] card-bento">
        <div>
          <Image
            src="/debts-picture.png"
            className="h-24 m-auto"
            width={96}
            height={40}
            alt="divisas representation"
          />
          <h1 className="text-lg text-palette">Debt register</h1>
          <p className="py-2 md:py-0 opacity-70">
            Enter your debts and keep track of the payments or deposits you
            make.
          </p>
        </div>
      </div>
      <div className="block p-5 lg:py-5 md:[grid-column:7/11] md:[grid-row:1/11] bg-gray-700 rounded-md zoom-in [animation-delay:1000ms] border-effect">
        <div className="[z-index:1] text-white">
          <Image
            src="/notifications.png"
            className="h-24 m-auto"
            width={96}
            height={40}
            alt="notifications and automatic payments representation"
          />
          <h1 className="text-lg text-purple-500">
            Notifications and Automatic Payments
          </h1>
          <p className="py-2 opacity-70">
            Receive notifications when a registered debt payment is approaching
            to remind you and make automatic records of each debt payment.
            Additionally, get advice on your expense record using artificial
          </p>
          <p className="text-sm text-palette-secondary inline-flex gap-2 items-center mt-4 rounded-md bg-transparent border px-3 py-2 shadow-sm border-gray-500 opacity-50 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
              <path d="M20 3v4"></path>
              <path d="M22 5h-4"></path>
              <path d="M4 17v2"></path>
              <path d="M5 18H3"></path>
            </svg>
            Coming Soon
          </p>
        </div>
      </div>
    </div>
  )
}
