import { useEffect, useState } from 'react'
import './App.css'
import rpc from './rpc-client'


function App() {
  const [result, setResult] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  async function getShinobi() {
    setLoading(true)
    try {
      const client = rpc.createClient('http://localhost:8000/rpc')
      const response = await client.api.getShinobi()
      setResult(JSON.stringify(response))
    } catch(e) {
      setError(e)
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
    return <p>{error.message}</p>
  }

  return (
    <p>{result}</p>
  )
}

export default App
