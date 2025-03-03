"use client"

import { useEffect, useState, useCallback } from "react"
import ReactMarkdown from "react-markdown"
import { getChatAdvice } from "../../actions/ai-message"

export default function AIResponse({totalMoney}: {totalMoney: any}) {
  const [displayedContent, setDisplayedContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [response, setResponse] = useState('')

  const speed = 15

  const typeWriter = useCallback(() => {
    let currentIndex = 0
    let text = ''
    setDisplayedContent('')

    const interval = setInterval(() => {
      if (currentIndex < response.length) {
        text += response[currentIndex]
        setDisplayedContent(text)
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [response])

  useEffect(() => {
    const cleanup = typeWriter()
    return cleanup
  }, [typeWriter])

  const handleSubmit = async () => {
    const fetching = await fetch('/api/chat', {method: 'POST', body: JSON.stringify({ income: totalMoney('income'), expense: totalMoney('expense'), currency: 'COP' })})
     const data = await fetching.json()
     setResponse(data.message)
     setLoading(false)
    }

    useEffect(() => {
      if(totalMoney('income') === 0 || totalMoney('expense') === 0) {
        setLoading(false)
        setResponse('No hay suficientes datos.')
      } else {
        handleSubmit()
      }
    }, [totalMoney('income'), totalMoney('expense')])


  return (
      <div className="bg-zinc-800 rounded p-1">
          <div className="relative group">
            {/* Borde animado con gradiente */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse animate-gradient-xy"></div>
            <div className="relative rounded bg-background border-0 shadow-2xl">
              {
                loading ? (
                  <div className="animate-pulse flex space-x-4 p-6 pt-10">
                    <div className="flex-1 space-y-2">
                      <div className="h-2 bg-zinc-700 rounded w-3/4"></div>
                      <div className="h-2 bg-zinc-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ) :(
                  <div className="relative p-6">
                    {/* Contenido principal */}
                    <div className="prose prose-sm">
                      <div className="relative">
                        <div className="min-h-[20px] text-gray-400">
                          {<ReactMarkdown>{displayedContent}</ReactMarkdown>}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
      </div>
  )
}
