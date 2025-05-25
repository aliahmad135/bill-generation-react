import React from 'react';

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    label: string;
  }[];
}

interface ChartProps {
  type: 'line' | 'bar' | 'doughnut' | 'pie';
  data: ChartData;
}

// This is a mockup component to visually represent charts
const Chart: React.FC<ChartProps> = ({ type, data }) => {
  // For a real implementation, you would use a charting library like Chart.js

  if (type === 'doughnut' || type === 'pie') {
    return (
      <div className="relative h-64 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-40 w-40 rounded-full border-8 border-blue-500 flex items-center justify-center relative">
            <div className="h-32 w-32 rounded-full bg-white absolute"></div>
            <div className="z-10 text-center">
              <div className="text-2xl font-bold text-gray-800">₹32,450</div>
              <div className="text-xs text-gray-500">Pending Amount</div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 flex flex-col space-y-2">
          {data.labels.map((label, index) => (
            <div key={index} className="flex items-center">
              <div 
                className={`h-3 w-3 rounded-full mr-2`}
                style={{ backgroundColor: getColor(index) }}
              ></div>
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full relative">
      {/* X axis */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4">
        {data.labels.map((label, index) => (
          <div key={index} className="text-xs text-gray-500">{label}</div>
        ))}
      </div>
      
      {/* Y axis */}
      <div className="absolute top-0 bottom-8 left-0 flex flex-col justify-between">
        <div className="text-xs text-gray-500">₹20,000</div>
        <div className="text-xs text-gray-500">₹15,000</div>
        <div className="text-xs text-gray-500">₹10,000</div>
        <div className="text-xs text-gray-500">₹5,000</div>
        <div className="text-xs text-gray-500">₹0</div>
      </div>
      
      {/* Chart area */}
      <div className="absolute top-0 right-4 bottom-8 left-10">
        {type === 'line' && (
          <svg className="w-full h-full">
            <path
              d="M0,150 L40,120 L80,140 L120,90 L160,110 L200,60"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
            />
            <circle cx="0" cy="150" r="4" fill="#3B82F6" />
            <circle cx="40" cy="120" r="4" fill="#3B82F6" />
            <circle cx="80" cy="140" r="4" fill="#3B82F6" />
            <circle cx="120" cy="90" r="4" fill="#3B82F6" />
            <circle cx="160" cy="110" r="4" fill="#3B82F6" />
            <circle cx="200" cy="60" r="4" fill="#3B82F6" />
          </svg>
        )}
        
        {type === 'bar' && (
          <div className="flex h-full items-end justify-around">
            {data.datasets[0].data.map((value, index) => (
              <div 
                key={index} 
                className="w-8 bg-blue-500 rounded-t-sm"
                style={{ height: `${(value / 20000) * 100}%` }}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get chart colors
const getColor = (index: number): string => {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
  ];
  
  return colors[index % colors.length];
};

export default Chart;