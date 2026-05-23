import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { holidays } from '../services/employeeService';
import DashboardLayout from "../layouts/DashboardLayout";
import '../style/holidayCalendar.css';
import { getMyNotifications } from '../services/employeeService';

const CompanyHoliday = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNetification = async () => {
            const response = await getMyNotifications();
            setNotifications(response.data.notifications)
        }
        const fetchHolidays = async () => {
            try {
                const response = await holidays(); 
                console.log(response.data)
                
                // Format the DB data to match FullCalendar's expected structure
                const formattedEvents = response.data.holidays.map(holiday => ({
                    id: holiday.id,
                    title: holiday.name, // Maps your 'name' field to 'title'
                    start: holiday.date, // Maps your 'date' field (YYYY-MM-DD) to 'start'
                    allDay: true,
                    backgroundColor: '#e0f2fe', // Soft blue background matching Akdital theme
                    borderColor: '#0284c7',     // Sharp blue border accent
                    textColor: '#0369a1',       // Clean dark blue text
                }));
                
                setEvents(formattedEvents);
            } catch (error) {
                console.error("Error loading company holidays:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNetification();
        fetchHolidays();
    }, []);
    
    const unreadCount = notifications ? notifications.filter(n => !n.read_at).length : 0;
    if (loading) {
        return (
            <DashboardLayout>
                <div className="dashboard-loading p-6 text-gray-500 text-center">
                    Chargement du tableau de calondra...
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout 
            unreadCount={unreadCount} 
            notifications={notifications} 
        >
            <div className="max-w-[1280px] w-full flex flex-col gap-8">
                <div className="holiday-calendar-card">
                    <div className="calendar-card-header">
                        <h2 className="calendar-card-title">Company Holidays</h2>
                        <p className="calendar-card-subtitle">Official non-working days and corporate holiday periods.</p>
                    </div>
                    
                    <div className="calendar-wrapper">
                        <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: '' // Keeps it clean by showing just the month grid view
                            }}
                            height="auto"
                            fixedWeekCount={false}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CompanyHoliday;