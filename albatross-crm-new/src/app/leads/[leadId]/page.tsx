"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lead } from '@/types'; // Assuming Lead type is defined here or similar path

interface LeadDetailPageProps {

  params: {
    leadId: string;
  };
}

const LeadDetailPage: React.FC<LeadDetailPageProps> = ({ params }) => {
  const router = useRouter();

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/leads/${params.leadId}`); // Access params.leadId directly
        // const { leadId } = React.use(params);
        if (!response.ok) {
          throw new Error(`Failed to fetch lead data: ${response.statusText}`);
        }

        const fetchedLead: Lead = await response.json();
        setLead(fetchedLead);
      } catch (err) {
        setError('Failed to fetch lead data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadData();
  }, [params.leadId]); // Refetch when leadId changes

  return (
    <div>
      <h1>Lead Detail Page</h1>
      <p>Lead ID: {params.leadId}</p>
      {loading && <p>Loading lead details...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {lead && (
        <div>
          <h2>{lead.name}</h2>
          {/* Add more lead details here */}
          <p>Email: {lead.email}</p>
          <p>Budget: ${lead.budget}</p>
          {/* Add more fields as needed */}
        </div>
      )}
    </div>
  );
};

export default LeadDetailPage;