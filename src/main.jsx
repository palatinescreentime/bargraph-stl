import React from 'react'
import ReactDOM from 'react-dom/client'
import BarGraph from './BarGraph'
import { CITY, CATEGORIES, BARS } from './data/stl'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BarGraph city={CITY} bars={BARS} categories={CATEGORIES} />
  </React.StrictMode>
)
