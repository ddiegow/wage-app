
import { useEffect, useState } from 'react'
import './App.css'
import { fetchData, } from './lib/data-fetching'
import { WageData } from './lib/types'
import MapComponent from './MapComponent'

function App() {
  const [data, setData] = useState<WageData | null>(null);

  // const values = data?.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE;
  // if (values) {
  //   console.log(getByPrefecture(values, getPrefectures()[2].code))
  //   console.log('salaries for ', getJobs()[0].name, ': ', getByJob(values, getJobs()[0].code));
  // }

  useEffect(() => {
    fetchData().then(jsonData => {
      setData(jsonData)
    }).catch(err => console.log(err))
  }, [])
  return (
    <>
      <MapComponent wageData={data} />
    </>
  )
}

export default App
