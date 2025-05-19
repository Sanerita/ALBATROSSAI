// components/StatsCards.tsx
interface StatsCardsProps {
  stats: {
    totalLeads: number
    hotLeads: number
    meetingsToday: number
    conversionRate: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div>
      <h2>Stats</h2>
      <p>Total Leads: {stats.totalLeads}</p>
      <p>Hot Leads: {stats.hotLeads}</p>
      <p>Meetings Today: {stats.meetingsToday}</p>
      <p>Conversion Rate: {stats.conversionRate}%</p>
    </div>
  );
}