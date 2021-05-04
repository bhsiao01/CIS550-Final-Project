import React, { useState } from 'react'
import {
  FlexibleWidthXYPlot,
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  YAxis,
  LineSeries,
  Crosshair,
  DiscreteColorLegend,
} from 'react-vis'

const StockChart = ({ prices }) => {
  const [openValue, setOpenValue] = useState(false)
  const [closeValue, setCloseValue] = useState(false)

  const formatData = (prices, open) => {
    const data = []
    prices.forEach((price) => {
      if (open) {
        data.unshift({
          x: new Date(price.Date),
          y: price.Open,
        })
      } else {
        data.unshift({
          x: new Date(price.Date),
          y: price.Close,
        })
      }
    })

    return data
  }

  return (
    <div>
      <FlexibleWidthXYPlot
        xType="time"
        height={300}
        onMouseLeave={() => setOpenValue(false)}
      >
        <DiscreteColorLegend
          style={{ position: 'absolute', right: '50px', top: '10px' }}
          orientation="horizontal"
          items={[
            {
              title: 'Open Price',
              color: '#12939A',
            },
            {
              title: 'Close Price',
              color: '#c51162',
            },
          ]}
        />
        <HorizontalGridLines />
        <VerticalGridLines />
        <XAxis title="Date" />
        <YAxis title="Price ($)" />
        <LineSeries
          data={formatData(prices, true)}
          animation={true}
          onNearestX={(d) => {
            setOpenValue(d)
          }}
        />
        <LineSeries
          data={formatData(prices, false)}
          animation={true}
          lineStyle={{ stroke: '#c51162' }}
          onNearestX={(d) => setCloseValue(d)}
          color={'#c51162'}
        />
        {openValue && (
          <Crosshair
            values={[openValue, closeValue]}
            titleFormat={(d) => ({
              title: 'Date',
              value: new Date(d[0].x).toLocaleDateString(),
            })}
            itemsFormat={(d) => [
              { title: 'Open', value: '$' + d[0].y },
              { title: 'Close', value: '$' + d[1].y },
            ]}
          />
        )}
      </FlexibleWidthXYPlot>
    </div>
  )
}

export default StockChart
