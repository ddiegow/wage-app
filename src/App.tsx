
import { useEffect } from 'react'
import './App.css'
import { fetchData, } from './lib/data-fetching'
import { useAppStore } from './store/store'
import ViewComponent from './ViewComponent'

function App() {
  const { setWageData } = useAppStore()
  useEffect(() => {
    fetchData().then(jsonData => {
      setWageData(jsonData)
    }).catch(err => console.log(err))
  }, [])
  return (
    <>
      <ViewComponent />
    </>
  )
}

export default App
