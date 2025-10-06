import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './Sales.css';

const Sales = () => {
  const [deals, setDeals] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const [dealsResponse, statsResponse] = await Promise.all([
        fetch('http://localhost:5000/api/sales', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/sales/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      const dealsData = await dealsResponse.json();
      const statsData = await statsResponse.json();
      
      setDeals(dealsData.deals || []);
      setStats(statsData || {});
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      'discovery': 'stage-discovery',
      'proposal': 'stage-proposal',
      'negotiation': 'stage-negotiation',
      'closed-won': 'stage-won',
      'closed-lost': 'stage-lost'
    };
    return colors[stage] || 'stage-discovery';
  };

  return (
    <div className="sales">
      <div className="sales-header">
        <h1>Sales Pipeline</h1>
      </div>

      {stats.stats && (
        <div className="sales-stats">
          <div className="stat-card">
            <h3>Total Pipeline</h3>
            <p className="stat-value">${stats.stats.totalPipeline}</p>
          </div>
          <div className="stat-card">
            <h3>Win Rate</h3>
            <p className="stat-value">{stats.stats.winRate}%</p>
          </div>
          <div className="stat-card">
            <h3>Avg Deal Size</h3>
            <p className="stat-value">${stats.stats.avgDealSize}</p>
          </div>
          <div className="stat-card">
            <h3>Total Deals</h3>
            <p className="stat-value">{stats.stats.totalDeals}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading sales data...</div>
      ) : (
        <div className="deals-grid">
          {deals.map((deal) => (
            <div key={deal.id} className="deal-card">
              <div className="deal-header">
                <h3>{deal.title}</h3>
                <span className={`deal-stage ${getStageColor(deal.stage)}`}>
                  {deal.stage}
                </span>
              </div>
              <div className="deal-company">{deal.company}</div>
              <div className="deal-amount">${deal.amount}</div>
              <div className="deal-probability">
                Probability: {deal.probability}
              </div>
              <div className="deal-owner">
                Owner: {deal.owner_name}
              </div>
              <div className="deal-days">
                Days in stage: {deal.days_in_stage}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sales;