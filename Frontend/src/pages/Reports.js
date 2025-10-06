import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './Reports.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      'sales': '💰',
      'customers': '👥',
      'revenue': '📊',
      'products': '📦'
    };
    return icons[type] || '📄';
  };

  return (
    <div className="reports">
      <div className="reports-header">
        <h1>Reports</h1>
      </div>

      {loading ? (
        <div className="loading">Loading reports...</div>
      ) : (
        <div className="reports-grid">
          {reports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <span className="report-icon">
                  {getTypeIcon(report.type)}
                </span>
                <div className="report-title">
                  <h3>{report.title}</h3>
                  <span className="report-type">{report.type}</span>
                </div>
              </div>
              <div className="report-description">
                {report.description}
              </div>
              <div className="report-meta">
                <div className="report-downloads">
                  📥 {report.downloads} downloads
                </div>
                <div className="report-date">
                  {new Date(report.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="report-actions">
                <button className="btn-download">Download</button>
                <button className="btn-view">View</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;