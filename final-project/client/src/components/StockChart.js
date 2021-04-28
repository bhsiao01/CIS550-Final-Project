import React, { useState } from 'react'
import {
  FlexibleWidthXYPlot,
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  YAxis,
  LineSeries,
  Crosshair,
} from 'react-vis'

function getFormattedDate(date) {
  let year = date.getFullYear().toString().substr(-2)
  let month = (1 + date.getMonth()).toString().padStart(2, '0')
  let day = date.getDate().toString().padStart(2, '0')

  return month + '.' + day + '.' + year
}

const StockChart = ({ prices }) => {
  const [openValue, setOpenValue] = useState(false)
  const [closeValue, setCloseValue] = useState(false)

  const formatData = (prices, open) => {
    const data = []
    prices.forEach((price) => {
      if (open) {
        data.unshift({
          x: getFormattedDate(new Date(price.Date)),
          y: price.Open,
        })
      } else {
        data.unshift({
          x: getFormattedDate(new Date(price.Date)),
          y: price.Close,
        })
      }
    })

    return data
  }

  return (
    <div>
      <FlexibleWidthXYPlot
        xType="ordinal"
        height={300}
        onMouseLeave={() => setOpenValue(false)}
      >
        <HorizontalGridLines />
        <VerticalGridLines />
        <XAxis
          title="Date"
          tickLabelAngle={45}
          tickFormat={(t, i) => {
            return t.slice(0, -3)
          }}
        />
        <YAxis title="Price ($)" />
        <LineSeries
          data={formatData(prices, true)}
          animation={true}
          onNearestX={(d) => {
            console.log(d)
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
