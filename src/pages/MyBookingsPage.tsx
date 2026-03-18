import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';
import { formatCurrency } from '../utils/format';
import type { AdminBooking } from '../types/booking';

type MyJoinedBooking = AdminBooking & {
    tourName: string;
    startDate: string;
    imageUrl: string;
};

const MyBookingsPage: React.FC = () => {
    const { user } = useAuth();
    const [myBookings, setMyBookings] = useState<MyJoinedBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchMyBookings = async () => {
            setLoading(true);
            setError(null);
            try {
                // === GỌI API THẬT: POST /api/v1/bookings/my-bookings ===
                // Backend (Java) PHẢI trả về data đã JOIN (tourName, startDate, imageUrl)
                const bookings = await apiService.bookings.getByUserId(user.id);

                // GIẢ LẬP JOIN DATA (Vì FE của ta cần data này, BE nên trả về 1 lần)
                const joinedBookings: MyJoinedBooking[] = [];
                for (const booking of bookings) {
                    const departure = await apiService.tourDepartures.getOne(booking.tourDepartureId);
                    const template = await apiService.tourTemplates.getOne(departure.tourTemplateId);
                    joinedBookings.push({
                        ...booking,
                        tourName: template.name,
                        startDate: departure.startDate,
                        imageUrl: template.imageUrl,
                    } as MyJoinedBooking);
                }
                setMyBookings(joinedBookings);

            } catch (err) {
                setError('Không thể tải danh sách booking của bạn.');
                console.error("Fetch my bookings error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyBookings();
    }, [user]);

    if (loading) return <div className="p-8 text-center">Đang tải các tour đã đặt...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

    return (
        <div className="bg-lightgray py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8 text-secondary">Tour của tôi</h1>
                {myBookings.length === 0 ? (
                    <p className="text-gray-600">Bạn chưa có booking nào.</p>
                ) : (
                    <div className="space-y-6">
                        {myBookings.map((booking) => (
                            <div key={booking.id} className="bg-white p-4 rounded-lg shadow-md flex gap-6 items-center">

                                <img src={booking.imageUrl} alt={booking.tourName} className="w-32 h-20 object-cover rounded-md flex-shrink-0" />

                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-secondary">{booking.tourName}</h2>
                                    <p className="text-gray-600">Mã Booking: <span className="font-medium text-primary">{booking.id}</span></p>
                                </div>

                                <div className="text-center flex-shrink-0">
                                    <p className="text-sm text-gray-500">Khởi hành</p>
                                    <p className="font-bold text-lg text-secondary">{booking.startDate}</p>
                                </div>

                                <div className="text-center flex-shrink-0">
                                    <p className="text-sm text-gray-500">Số khách</p>
                                    <p className="font-bold text-lg text-secondary">{booking.numberOfGuests}</p>
                                </div>

                                <div className="text-right flex flex-col justify-between items-end flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium mb-2 
                    ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`
                  }>
                    {booking.status}
                  </span>
                                    <p className="text-2xl font-bold text-primary">{formatCurrency(booking.totalPrice)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookingsPage;