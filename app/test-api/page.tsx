"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAPIPage() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log("TestAPI component mounted")
  }, [])

  const testAPICall = async () => {
    console.log("Testing API call...")
    setLoading(true)
    setResult("")
    
    try {
      console.log("Calling /api/esg-entries")
      const response = await fetch('/api/esg-entries')
      console.log("Response received:", response)
      console.log("Response status:", response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log("Data received:", data)
      setResult(`Success: ${data.length} entries found`)
    } catch (error) {
      console.error("API call failed:", error)
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>API Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>This is a test page to debug API calls.</p>
          
          <Button 
            onClick={testAPICall}
            disabled={loading}
          >
            {loading ? "Testing..." : "Test API Call"}
          </Button>
          
          {result && (
            <div className="p-4 border rounded">
              <strong>Result:</strong> {result}
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            Check the Console tab in Developer Tools for detailed logs.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}