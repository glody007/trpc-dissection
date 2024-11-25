import { useEffect, useState } from 'react'
import './App.css'
import rpc from './rpc-client.ts'
import { AppRouter } from '../../backend/router.ts'

const client = rpc.createClient<AppRouter>('http://localhost:8000/rpc')

function App() {
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function getShinobi() {
    setLoading(true)
    try {
      const response = await client.api.getShinobi(undefined)
      setResult(JSON.stringify(response))
    } catch(e) {
      setError(JSON.stringify(e))
    }
    setLoading(false)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')?.toString()
    if(!name) {
      return
    }
    setLoading(true)
    try {
      const response = await client.api.addShinobi({ name })
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
    <div>
      <p>{result}</p>
      <form onSubmit={onSubmit}>
        <input type="text" name="name" />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default App
