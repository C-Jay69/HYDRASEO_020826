import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar as CalendarIcon, Clock, FileText } from 'lucide-react';
import { Calendar } from '../components/ui/calendar';

const CalendarPage = () => {
  const [date, setDate] = React.useState(new Date());

  // Mock upcoming events
  const upcomingEvents = [
    { id: 1, title: 'Publish: SEO Guide 2025', type: 'publish', time: '10:00 AM' },
    { id: 2, title: 'Review: Product Comparison', type: 'review', time: '2:00 PM' },
    { id: 3, title: 'Deadline: Blog Series', type: 'deadline', time: '5:00 PM' },
  ];

  const getEventColor = (type) => {
    switch (type) {
      case 'publish': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'deadline': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Content Calendar</h1>
          <p className="text-gray-400">Schedule and manage your content publishing</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border ${getEventColor(event.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-xs mt-1 opacity-70">{event.time}</p>
                    </div>
                  </div>
                </div>
              ))}

              {upcomingEvents.length === 0 && (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">No upcoming events</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
