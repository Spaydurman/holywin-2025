import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface RegistrationCountCardProps {
  className?: string;
}

export default function RegistrationCountCard({ className }: RegistrationCountCardProps) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistrationCount = async () => {
      try {
        const response = await axios.get('/api/registrations/count');
        setCount(response.data.count);
      } catch (err) {
        setError('Failed to load registration count');
        console.error('Error fetching registration count:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationCount();
  }, []);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-16 animate-pulse bg-muted rounded-md"></div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : (
          <div className="text-2xl font-bold">
            {count !== null ? count : 0}
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Registered
        </p>
      </CardContent>
    </Card>
  );
}
