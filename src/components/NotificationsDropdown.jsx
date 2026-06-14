import { useState } from 'react';
import { useUserContext } from '../context/UserContext';
import { Loader2 } from 'lucide-react';
import formatDate from '../util/formatDate';

const NotificationsDropdown = ({
  showNotifications,
    setShowNotifications,
    currentMosqueId, // It is here
    navigate,
    location 
}) => {
    
    const { 
        notifications, 
        followedMosques, 
        fetchNotifications, 
        hasMoreNotifications, 
        isFetchingNotifications,
        resetNotificationCount 
    } = useUserContext();

    if (!showNotifications) return null;


    const handleLoadMore = async () => {
        fetchNotifications(false);
    };

   return (
        <div className="absolute top-14 -right-10 md:right-2 left-auto z-50 w-[min(100vw-1.5rem,320px)] rounded-3xl border border-gray-200 bg-white text-gray-900 shadow-2xl sm:right-0 sm:left-auto flex flex-col max-h-[50vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 ">
                <h3 className="text-sm font-semibold">Notifications</h3>
                <button
    type="button"
    onClick={() => {
        setShowNotifications(false);
        resetNotificationCount();
        
        navigate('/notifications');
    }}
    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
>
    See all
</button>
            </div>

            {/* Scrollable Notification List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 ">
                {notifications.length > 0 ? (
                    notifications.map((notification) => {
                        const mosque = followedMosques.find((m) => String(m.id) === String(notification.mosqueId));
                        return (
                            <div key={notification.id} className="rounded-2xl border  border-gray-100 bg-gray-50 p-3">
                                <div className="flex items-start gap-3">
                                    <img src={mosque?.mosqueProfile?.image || '/'} alt={mosque?.name || 'Mosque'} className="h-12 w-12 rounded-lg object-cover bg-slate-100" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-semibold text-gray-900 truncate">{mosque?.name || notification.mosqueId}</h4>
                                            <span className="text-xs text-gray-400">{formatDate(notification.createdAt)}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-4 text-sm text-gray-500 text-center">No new notifications.</div>
                )}
            </div>

            {/* Sticky Footer for Load More */}
            {hasMoreNotifications && (
                <div className="border-t border-gray-200 p-3 bg-white rounded-b-3xl">
                    <button
                        type="button"
                        onClick={handleLoadMore}
                        disabled={isFetchingNotifications}
                        className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isFetchingNotifications ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load More'}
                    </button>
                </div>
            )} 
        </div>
    );
};

export default NotificationsDropdown;