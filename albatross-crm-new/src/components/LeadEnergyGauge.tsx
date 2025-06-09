import { useEffect, useState } from 'react';

export function LeadEnergyGauge({ leadId }: { leadId: string }) {
  const [energy, setEnergy] = useState(0);
  
  useEffect(() => {
    const ws = new WebSocket(`wss://${window.location.host}/api/realtime`);
    ws.onopen = () => ws.send(JSON.stringify({ leadId }));
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setEnergy(data.energy);
    };
    
    return () => ws.close();
  }, [leadId]);

  return (
    <div className="relative h-4 w-full bg-gray-200 rounded-full">
      <div 
        className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
        style={{ width: `${energy}%` }}
      />
    </div>
  );
}