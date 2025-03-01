
import { useEffect, useState } from 'react'
import './App.css'
import { fetchData, } from './lib/data-fetching'
import { WageData } from './lib/types'
import ViewComponent from './ViewComponent'

function App() {
  const [data, setData] = useState<WageData | null>(null);
  useEffect(() => {
    fetchData().then(jsonData => {
      setData(jsonData)
    }).catch(err => console.log(err))
  }, [])
  return (
    <>
      <ViewComponent wageData={data} />
    </>
  )
}

export default App
