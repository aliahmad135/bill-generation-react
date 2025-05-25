import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeText?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeText,
  changeType = 'neutral'
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="rounded-full bg-gray-100 p-2">{icon}</div>
      </div>
      <p className="mt-4 text-2xl font-semibold text-gray-900">{value}</p>
      
      {change && (
        <div className="mt-2 flex items-center">
          {changeType === 'positive' ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : changeType === 'negative' ? (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          ) : null}
          
          <span 
            className={`text-sm ${
              changeType === 'positive' 
                ? 'text-green-600' 
                : changeType === 'negative' 
                  ? 'text-red-600' 
                  : 'text-gray-500'
            }`}
          >
            {change} {changeText && <span className="text-gray-500">{changeText}</span>}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;