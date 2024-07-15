import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';

const Dashboard: React.FC = () => {
  const { data, loading, error } = useDashboardData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="dashboard">
      <h1>SMS Campaign Dashboard</h1>
      <div className="metrics-overview">
        <div className="metric">
          <h2>Overall Response Rate</h2>
          <p>{data.overallResponseRate.toFixed(2)}%</p>
        </div>
        <div className="metric">
          <h2>Overall Deliverability</h2>
          <p>{data.overallDeliverability.toFixed(2)}%</p>
        </div>
      </div>
      <div className="detailed-metrics-placeholder">
        <h2>Detailed Metrics</h2>
        <p>Placeholder for more detailed metrics and charts</p>
      </div>
    </div>
  );
};

export default Dashboard;
