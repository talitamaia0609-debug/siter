import { StatCard } from '../StatCard';
import { Users } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-6 bg-background">
      <StatCard
        title="Total de Membros"
        value="324"
        subtitle="12 novos membros este mês"
        icon={Users}
        trend={{ value: "+12%", isPositive: true }}
      />
    </div>
  );
}
