import { useState, useEffect } from 'react';
import { bonzoApiService } from '../services/bonzoApiService';

interface DashboardData {
  overallResponseRate: number;
  overallDeliverability: number;
}

export const useDashboardData = (): { data: DashboardData | null; loading: boolean; error: string | null } => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch data from BonzoApiService
        const accountsData = await bonzoApiService.getAccountInfo('all');
        
        // Calculate metrics
        const totalMessages = accountsData.reduce((sum: number, account: any) => sum + account.totalMessages, 0);
        const totalResponses = accountsData.reduce((sum: number, account: any) => sum + account.totalResponses, 0);
        const totalDelivered = accountsData.reduce((sum: number, account: any) => sum + account.deliveredMessages, 0);

        const overallResponseRate = totalMessages > 0 ? (totalResponses / totalMessages) * 100 : 0;
        const overallDeliverability = totalMessages > 0 ? (totalDelivered / totalMessages) * 100 : 0;

        setData({
          overallResponseRate,
          overallDeliverability,
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { data, loading, error };
};
