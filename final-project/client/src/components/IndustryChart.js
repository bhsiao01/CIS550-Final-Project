import React, { useState } from 'react'
import {
  FlexibleWidthXYPlot,
  ChartLabel,
  XAxis,
  YAxis,
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
      >
        <ChartLabel
          text="Stock"
          className="alt-x-label"
          includeMargin={false}
          xPercent={0.5}
          yPercent={1.1}
        />
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
