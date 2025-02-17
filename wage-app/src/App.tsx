
import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { fetchData, getByJob, getByPrefecture, getJobs, getPrefectures } from './lib/data-fetching'
import { WageData } from './lib/types'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState<WageData | null>(null);

  const values = data?.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE;
  if (values) {
    console.log(getByPrefecture(values, getPrefectures()[2].code))
    console.log('salaries for ', getJobs()[0].name, ': ', getByJob(values, getJobs()[0].code));
  }

  useEffect(() => {
    fetchData().then(jsonData => setData(jsonData)).catch(err => console.log(err))
  }, [])
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
