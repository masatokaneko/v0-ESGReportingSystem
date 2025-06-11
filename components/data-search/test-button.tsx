"use client"

import { Button } from "@/components/ui/button"

export function TestButton() {
  const handleClick = () => {
    console.log("Button clicked!")
    alert("Button clicked! Check console for logs.")
    
    // Test API call
    fetch('/api/esg-entries')
      .then(res => {
        console.log("Response status:", res.status)
        return res.json()
      })
      .then(data => {
        console.log("Data received:", data)
        alert(`API Response: ${data.length} entries found`)
      })
      .catch(err => {
        console.error("API Error:", err)
        alert(`API Error: ${err.message}`)
      })
  }

  return (
    <Button onClick={handleClick} className="mb-4">
      Test API Call
    </Button>
  )
}