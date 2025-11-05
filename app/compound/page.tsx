'use client';

import { useState } from 'react';
import TimeSeriesChart, { DataPoint } from '../../components/TimeSeriesChart';

export default function Page() {
  // Sample data - you can replace this with your own data
  const [chartData, setChartData] = useState<DataPoint[]>([
    { time: new Date('2018-05-01'), value: 3000 },
    { time: new Date('2018-11-01'), value: 50000 },
    { time: new Date('2019-05-01'), value: 100000 },
    { time: new Date('2021-01-01'), value: 200000 },
    { time: new Date('2022-07-01'), value: 300000 },
    { time: new Date('2023-05-01'), value: 400000 },
    { time: new Date('2023-07-01'), value: 500000 },
    { time: new Date('2023-12-01'), value: 600000 },
    { time: new Date('2024-02-01'), value: 700000 },
    { time: new Date('2024-05-01'), value: 800000 },
    { time: new Date('2024-11-01'), value: 900000 },
    { time: new Date('2025-05-01'), value: 1000000 },
    { time: new Date('2025-06-01'), value: 1100000 },
    { time: new Date('2025-09-01'), value: 1200000 },
    { time: new Date('2025-10-01'), value: 1300000 },
  ]);

  // Function to add random data point
  const addRandomDataPoint = () => {
    const lastDate = new Date(Math.max(...chartData.map((d) => new Date(d.time).getTime())));
    const newDate = new Date(lastDate);
    newDate.setDate(newDate.getDate() + 15);

    const newPoint: DataPoint = {
      time: newDate,
      value: Math.random() * 50 + 10, // Random value between 10-60
    };

    setChartData([...chartData, newPoint]);
  };

  // Function to clear data
  const clearData = () => {
    setChartData([]);
  };

  // Function to reset to sample data
  const resetData = () => {
    setChartData([
      { time: new Date('2024-01-01'), value: 10 },
      { time: new Date('2024-01-15'), value: 25 },
      { time: new Date('2024-02-01'), value: 18 },
      { time: new Date('2024-02-15'), value: 35 },
      { time: new Date('2024-03-01'), value: 28 },
      { time: new Date('2024-03-15'), value: 42 },
      { time: new Date('2024-04-01'), value: 38 },
      { time: new Date('2024-04-15'), value: 55 },
      { time: new Date('2024-05-01'), value: 48 },
      { time: new Date('2024-05-15'), value: 62 },
    ]);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#000', color: '#00ff00', minHeight: '100vh', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#00ff00', marginBottom: '20px' }}>Time Series Chart Demo</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={addRandomDataPoint}
          style={{
            backgroundColor: '#003300',
            border: '1px solid #00ff00',
            color: '#00ff00',
            padding: '8px 16px',
            margin: '0 8px 8px 0',
            cursor: 'pointer',
            fontFamily: 'monospace',
          }}
        >
          Add Random Point
        </button>

        <button
          onClick={resetData}
          style={{
            backgroundColor: '#003300',
            border: '1px solid #00ff00',
            color: '#00ff00',
            padding: '8px 16px',
            margin: '0 8px 8px 0',
            cursor: 'pointer',
            fontFamily: 'monospace',
          }}
        >
          Reset Data
        </button>

        <button
          onClick={clearData}
          style={{
            backgroundColor: '#330000',
            border: '1px solid #ff0000',
            color: '#ff0000',
            padding: '8px 16px',
            margin: '0 8px 8px 0',
            cursor: 'pointer',
            fontFamily: 'monospace',
          }}
        >
          Clear Data
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: '#00ff00', marginBottom: '10px' }}>Data Points: {chartData.length}</p>
        <details style={{ color: '#00ff00' }}>
          <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>View Raw Data (Click to expand)</summary>
          <pre
            style={{
              backgroundColor: '#001100',
              padding: '10px',
              border: '1px solid #003300',
              fontSize: '12px',
              overflowX: 'auto',
            }}
          >
            {JSON.stringify(chartData, null, 2)}
          </pre>
        </details>
      </div>

      {chartData.length > 0 ? (
        <TimeSeriesChart data={chartData} width={800} height={400} lineColor="#00ff00" backgroundColor="#000" gridColor="#003300" axisColor="#00ff00" />
      ) : (
        <div
          style={{
            border: '1px solid #333',
            padding: '40px',
            textAlign: 'center',
            color: '#666',
            fontStyle: 'italic',
          }}
        >
          No data to display. Add some data points to see the chart.
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h3 style={{ color: '#00ff00', marginBottom: '10px' }}>Usage:</h3>
        <p>To use this chart component with your own data, pass an array of objects with this structure:</p>
        <pre
          style={{
            backgroundColor: '#001100',
            padding: '10px',
            border: '1px solid #003300',
            fontSize: '12px',
            marginTop: '10px',
          }}
        >
          {`const myData: DataPoint[] = [
  { time: new Date('2024-01-01'), value: 10 },
  { time: '2024-01-02', value: 15 },
  { time: 1704153600000, value: 20 }, // timestamp
  // ... more data points
];

<TimeSeriesChart data={myData} />`}
        </pre>
      </div>
    </div>
  );
}
