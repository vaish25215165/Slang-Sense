import { TrendingUp } from "lucide-react"
import { trendingSlang, getToneEmoji } from "@/lib/slang-data"
import { loadCSVDatabase } from "@/lib/slang-csv"
import Link from "next/link"

export function TrendingSlang() {
  const slangDatabase = loadCSVDatabase()
  const trendingEntries = trendingSlang
    .map(word => slangDatabase.find(s => s.word === word))
    .filter(Boolean)
    .slice(0, 4)

  return (
    <section className="trending-section">
      <div className="trending-header">
        <TrendingUp size={24} />
        <h2 className="trending-title">Trending Slang</h2>
      </div>

      <div className="trending-grid">
        {trendingEntries.map((entry, index) => (
          <Link
            key={entry!.word}
            href="/library"
            className="trending-card"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="trending-card-header">
              <span className="trending-card-word">{entry!.word}</span>
              <span className="trending-card-emoji">{getToneEmoji(entry!.tone)}</span>
            </div>
            <p className="trending-card-meaning line-clamp-2">{entry!.meaning}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
