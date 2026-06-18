import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Home() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPipeline() {
      const { data, error } = await supabase
        .from("pipeline_view")
        .select("*")

      if (error) {
        console.error(error)
      } else {
        setData(data)
      }

      setLoading(false)
    }

    fetchPipeline()
  }, [])

  if (loading) {
    return <h2 style={{ padding: 40 }}>Loading pipeline...</h2>
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Broker Portal - Pipeline</h1>

      {data.length === 0 ? (
        <p>No applications found</p>
      ) : (
        data.map((item, i) => (
          <div key={i} style={{
            padding: 10,
            marginBottom: 10,
            border: "1px solid #ccc",
            borderRadius: 6
          }}>
            <pre>{JSON.stringify(item, null, 2)}</pre>
          </div>
        ))
      )}
    </div>
  )
}
