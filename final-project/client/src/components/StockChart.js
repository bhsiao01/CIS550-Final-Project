import React from 'react'
import {
  XYPlot,
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  YAxis,
  LineSeries,
} from 'react-vis'

const StockChart = ({ prices }) => {
  const formatData = (prices, open) => {
    const data = []
    prices.forEach((price) => {
      console.log(price)
      if (open) {
        data.push({
          x: new Date(price.Date),
          y: price.Open,
        })
      } else {
        data.push({
          x: new Date(price.Date),
          y: price.Close,
        })
      }
    })

    return data
  }

  return (
    <div>
      <XYPlot xType="time" width={1000} height={300}>
        <HorizontalGridLines />
        <VerticalGridLines />
        <XAxis title="Date" />
        <YAxis title="Price ($)" />
        <LineSeries data={formatData(prices, true)} />
        <LineSeries data={formatData(prices, false)} />
      </XYPlot>
      {prices.map((price) => (
        <div>
          <p>Date: {price.Date}</p>
          <p>Open price: ${price.Open}</p>
          <p>Close price: ${price.Close}</p>
        </div>
      ))}
    </div>
  )
}

export default StockChart
