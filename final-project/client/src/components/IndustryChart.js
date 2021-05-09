import React, { useState } from 'react'
import {
  FlexibleWidthXYPlot,
  ChartLabel,
  YAxis,
  XAxis,
  VerticalBarSeries,
  Crosshair,
} from 'react-vis'

const IndustryChart = ({ prices }) => {
  const [value, setValue] = useState(false)

  const formatData = (prices) => {
    const data = []
    prices.forEach((price) => {
      data.push({
        id: price.StockSymbol,
        x: price.StockSymbol,
        y: price.MaxPrice,
      })
    })

    return data
  }

  return (
    <div>
      <FlexibleWidthXYPlot
        xType="ordinal"
        height={300}
        onMouseLeave={() => setValue(false)}
        margin={{ left: 50 }}
      >
        <XAxis title="Stock" />
        <YAxis title="Price ($)" />
        <VerticalBarSeries
          data={formatData(prices)}
          onNearestX={(d) => {
            setValue(d)
          }}
        />
        {value && (
          <Crosshair
            values={[value]}
            titleFormat={(d) => ({
              title: 'Stock',
              value: d[0].x,
            })}
            itemsFormat={(d) => [
              { title: 'Price', value: '$' + Number(d[0].y).toFixed(2) },
            ]}
          />
        )}
      </FlexibleWidthXYPlot>
    </div>
  )
}

export default IndustryChart
