import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LibraryClient } from "@/components/library-client"
import { loadCSVDatabase } from "@/lib/slang-csv"

export default function LibraryPage() {
  const slangDatabase = loadCSVDatabase()

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content content-section">
        <div className="content-container">
          <LibraryClient entries={slangDatabase} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
