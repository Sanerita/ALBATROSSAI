import { Button } from '@/components/ui/button';

export default function CalendarPage() {
  // Mock meetings data
  const meetings = [
    { id: 1, title: 'Meeting with Acme Corp', time: '10:00 AM - 11:00 AM', date: 'Today' },
    { id: 2, title: 'Follow-up with Sarah', time: '2:30 PM - 3:00 PM', date: 'Tomorrow' },
    { id: 3, title: 'Product Demo', time: '11:00 AM - 12:00 PM', date: 'Friday' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Meeting Calendar</h1>
        <Button>Schedule New Meeting</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
          <div className="h-96 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-400">Calendar View Placeholder</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
          {meetings.map((meeting) => (
            <div key={meeting.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <h3 className="font-medium">{meeting.title}</h3>
              <p className="text-sm text-gray-600">{meeting.date} • {meeting.time}</p>
              <div className="mt-2 flex space-x-2">
                <Button variant="outline" size="sm">Details</Button>
                <Button variant="outline" size="sm">Reschedule</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}