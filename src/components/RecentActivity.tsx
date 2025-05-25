import React from 'react';
import { 
  FileText, 
  AlertCircle, 
  Check, 
  Building2, 
  User,
  Clock
} from 'lucide-react';

const RecentActivity: React.FC = () => {
  // Mock data for recent activities
  const activities = [
    {
      id: 1,
      type: 'bill_generated',
      house: 'H-101',
      resident: 'John Doe',
      amount: '₹2,500',
      date: '2 hours ago',
      status: 'generated'
    },
    {
      id: 2,
      type: 'bill_paid',
      house: 'H-204',
      resident: 'Sarah Johnson',
      amount: '₹3,200',
      date: '5 hours ago',
      status: 'paid'
    },
    {
      id: 3,
      type: 'fine_imposed',
      house: 'H-132',
      resident: 'Robert Williams',
      amount: '₹500',
      date: 'Yesterday',
      status: 'pending'
    },
    {
      id: 4,
      type: 'house_registered',
      house: 'H-503',
      resident: 'Emily Davis',
      date: 'Yesterday',
      status: 'completed'
    },
    {
      id: 5,
      type: 'bill_paid',
      house: 'H-118',
      resident: 'Michael Brown',
      amount: '₹2,800',
      date: '2 days ago',
      status: 'paid'
    }
  ];

  return (
    <div className="overflow-x-auto">
      <ul className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <li key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-center">
              {/* Icon based on activity type */}
              <div className="flex-shrink-0">
                {activity.type === 'bill_generated' && (
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <FileText className="h-5 w-5" />
                  </div>
                )}
                {activity.type === 'bill_paid' && (
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <Check className="h-5 w-5" />
                  </div>
                )}
                {activity.type === 'fine_imposed' && (
                  <div className="p-2 rounded-full bg-red-100 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                )}
                {activity.type === 'house_registered' && (
                  <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                    <Building2 className="h-5 w-5" />
                  </div>
                )}
              </div>
              
              {/* Activity content */}
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.type === 'bill_generated' && 'Bill Generated'}
                    {activity.type === 'bill_paid' && 'Bill Paid'}
                    {activity.type === 'fine_imposed' && 'Fine Imposed'}
                    {activity.type === 'house_registered' && 'House Registered'}
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${activity.status === 'paid' ? 'bg-green-100 text-green-800' : 
                      activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      activity.status === 'generated' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }"
                  >
                    {activity.status}
                  </span>
                </div>
                
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <div className="flex items-center mr-4">
                    <Building2 className="h-4 w-4 mr-1" />
                    <span>{activity.house}</span>
                  </div>
                  
                  <div className="flex items-center mr-4">
                    <User className="h-4 w-4 mr-1" />
                    <span>{activity.resident}</span>
                  </div>
                  
                  {activity.amount && (
                    <div className="flex items-center mr-4">
                      <span className="font-medium">{activity.amount}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-1 flex items-center text-xs text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{activity.date}</span>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="ml-4">
                <button className="text-sm text-blue-600 hover:text-blue-800">View Details</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;