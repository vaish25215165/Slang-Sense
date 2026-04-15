import { Flame } from "lucide-react"
import { loadCSVDatabase } from "@/lib/slang-csv"

export function SlangOfTheDay() {
  const slangDatabase = loadCSVDatabase()
  if (slangDatabase.length === 0) {
    return null
  }

  const dayIndex = Math.floor(Date.now() / 86400000) % slangDatabase.length
  const slangOfTheDay = slangDatabase[dayIndex]

  return (
    <div className="slang-of-day">
      <div className="slang-of-day-header">
        <Flame size={20} />
        <span className="slang-of-day-label">Slang of the Day</span>
      </div>
      
      <h3 className="slang-of-day-word">{slangOfTheDay.word}</h3>
      <p className="slang-of-day-meaning">{slangOfTheDay.meaning}</p>
    </div>
  )
}
