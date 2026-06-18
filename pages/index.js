import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Home() {
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("pipeline_view")
        .select("*")

      setData(data || [])
    }

    fetchData()
  }, [])

  function getPriority(item) {
    const today = new Date()
    const actionDate = new Date(item.next_action_date)

    const diff = Math.ceil((actionDate - today) / (1000 * 60 * 60 * 24))

    if (item.status === "Settled") return "No Action Required"
    if (diff < 0) return "Overdue"
    if (diff === 0) return "Urgent"
    if (diff <= 3) return "Medium"
    return "Low"
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Broker Portal - Pipeline</h1>

      {data.map((item, i) => (
        <div key={i} style={{
          padding: 10,
          marginBottom: 10,
          border: "1px solid #ccc"
        }}>
          <h3>{item.client_name}</h3>
          <p>Status: {item.status}</p>
          <p>Next Action: {item.next_action_date}</p>
          <strong>Priority: {getPriority(item)}</strong>
        </div>
      ))}
    </div>
  )
}
