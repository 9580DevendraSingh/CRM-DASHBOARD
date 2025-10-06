import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ChartCard from '../components/ChartCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const stats = [
    { title: 'Total Revenue', value: '$124,563', change: 12.5, chartType: 'line' },
    { title: 'New Clients', value: '1,234', change: 8.2, chartType: 'bar' },
    { title: 'Active Projects', value: '89', change: -2.1, chartType: 'pie' },
    { title: 'Conversion Rate', value: '24.3%', change: 5.7, chartType: 'line' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's what's happening with your business today.</p>
      </div>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <ChartCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            chartType={stat.chartType}
          />
        ))}
      </div>
      
      <div className="dashboard-content">
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">👥</span>
              <div className="activity-details">
                <p>New client "ABC Corp" added</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">💰</span>
              <div className="activity-details">
                <p>Deal "Project X" moved to negotiation</p>
                <span className="activity-time">5 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;