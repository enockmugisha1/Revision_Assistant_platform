import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const TestDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div style={{
      padding: '40px',
      backgroundColor: '#f3f4f6',
      minHeight: '100vh',
    }}>
      {/* BIG TEST BANNER */}
      <div style={{
        backgroundColor: '#ef4444',
        color: 'white',
        padding: '60px',
        borderRadius: '16px',
        marginBottom: '40px',
        textAlign: 'center',
        fontSize: '48px',
        fontWeight: 'bold',
      }}>
        🎯 DASHBOARD IS WORKING! 🎯
      </div>

      {/* User Info */}
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '16px',
        marginBottom: '40px',
      }}>
        <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>User Information:</h2>
        <p style={{ fontSize: '24px' }}>Name: {user?.firstName} {user?.lastName}</p>
        <p style={{ fontSize: '24px' }}>Email: {user?.email}</p>
        <p style={{ fontSize: '24px' }}>Role: {user?.role}</p>
      </div>

      {/* HUGE Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '40px',
      }}>
        {/* Card 1 - Orange */}
        <div style={{
          background: 'linear-gradient(135deg, #f97316, #ef4444)',
          color: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔥</div>
          <div style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '10px' }}>0</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Study Streak</div>
          <div style={{ fontSize: '18px', opacity: 0.9 }}>days</div>
        </div>

        {/* Card 2 - Blue */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
          color: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>⏱️</div>
          <div style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '10px' }}>0</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Study Time</div>
          <div style={{ fontSize: '18px', opacity: 0.9 }}>hours</div>
        </div>

        {/* Card 3 - Green */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎯</div>
          <div style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '10px' }}>0</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Quiz Score</div>
          <div style={{ fontSize: '18px', opacity: 0.9 }}>%</div>
        </div>

        {/* Card 4 - Purple */}
        <div style={{
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          color: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏆</div>
          <div style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '10px' }}>0</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Achievements</div>
          <div style={{ fontSize: '18px', opacity: 0.9 }}>badges</div>
        </div>
      </div>

      {/* Debug Info */}
      <div style={{
        backgroundColor: '#fef3c7',
        border: '4px solid #f59e0b',
        padding: '30px',
        borderRadius: '16px',
      }}>
        <h3 style={{ fontSize: '28px', marginBottom: '15px' }}>🔍 Debug Info:</h3>
        <p style={{ fontSize: '20px' }}>✅ Dashboard Component Loaded</p>
        <p style={{ fontSize: '20px' }}>✅ User Authenticated: {user ? 'YES' : 'NO'}</p>
        <p style={{ fontSize: '20px' }}>✅ Inline Styles Working: YES</p>
        <p style={{ fontSize: '20px' }}>✅ Component Rendering: YES</p>
        <p style={{ fontSize: '16px', marginTop: '20px', color: '#92400e' }}>
          If you can see this, your dashboard IS working! The issue might be with Tailwind CSS or another component.
        </p>
      </div>
    </div>
  );
};

export default TestDashboard;
