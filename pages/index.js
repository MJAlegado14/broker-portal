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

  const grouped = {
    Urgent: [],
    Overdue: [],
    Medium: [],
    Low: [],
    "No Action Required": []
  }

  data.forEach(item => {
    const priority = getPriority(item)
    grouped[priority].push(item)
  })

  return (
    <div style={{ padding: 40 }}>
      <h1>Broker Portal - Pipeline</h1>

      <div style={{ display: "flex", gap: 20 }}>

        {Object.keys(grouped).map((key) => (
          <div key={key} style={{
            flex: 1,
            border: "1px solid #ccc",
            padding: 10,
            borderRadius: 6,
            minHeight: 300
          }}>
            <h3>{key}</h3>

            {grouped[key].map((item, i) => (
              <div key={i} style={{
                padding: 8,
                marginBottom: 8,
                border: "1px solid #eee"
              }}>
                <strong>{item.client_name}</strong>
                <div>Status: {item.status}</div>
                <div>Next: {item.next_action_date}</div>
              </div>
            ))}
          </div>
        ))}

      </div>
    </div>
  )
}
