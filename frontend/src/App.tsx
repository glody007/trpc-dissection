import { useEffect, useState } from 'react'
import './App.css'
import rpc from './rpc-client.ts'

const client = rpc.createClient('http://localhost:8000/rpc')

function App() {
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function getShinobi() {
    setLoading(true)
    try {
      const response = await client.api.getShinobi()
      setResult(JSON.stringify(response))
    } catch(e) {
      setError(JSON.stringify(e))
    }
    setLoading(false)
  }

  useEffect(() => {
    getShinobi()
  }, [])

  if(loading) {
    return <p>Loading...</p>
  }

  if(error) {
    return <p>{error}</p>
  }

  return (
    <p>{result}</p>
  )
}

export default App
