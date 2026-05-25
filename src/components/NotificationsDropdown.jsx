import { useMemo } from 'react';
import { useUserContext } from '../context/UserContext';

const NotificationsDropdown = ({
    showNotifications,
    setShowNotifications,
    visibleNotificationsCount,
    setVisibleNotificationsCount,
    currentMosqueId,
    location,
    navigate,
}) => {
    if (!showNotifications) return null;

    const { notifications = [], followedMosques = [], fetchNotifications } = useUserContext();
    console.log('notifications in header', notifications);
    console.log('followedMosques in header', followedMosques);

    // Only show notifications for mosques the user follows
    const followedNotifications = useMemo(() => {
        if (!notifications || notifications.length === 0) return [];
        return notifications.filter((n) => followedMosques.some((m) => String(m.id) === String(n.mosqueId)));
    }, [notifications, followedMosques]);

    const visible = followedNotifications.slice(0, visibleNotificationsCount || 5);

    const formatDate = (iso) => {
        try {
            const d = new Date(iso);
            return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        } catch (e) {
            return '';
        }
    };

    return (
        <div className="absolute left-1/2 top-14 z-50 w-[min(100vw-2rem,320px)] -translate-x-1/2 overflow-hidden rounded-3xl border border-gray-200 bg-white text-gray-900 shadow-2xl sm:left-auto sm:right-0 sm:translate-x-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold">Notifications</h3>
                <button
                    type="button"
                    onClick={async () => {
                        // fetch latest notifications then navigate with state containing only notifications
                        const fetched = await fetchNotifications?.();
                        const notifsToSend = (fetched && fetched.length > 0)
                            ? fetched.filter((n) => followedMosques.some((m) => String(m.id) === String(n.mosqueId)))
                            : followedNotifications;
                        setShowNotifications(false);
                        const notificationsPath = currentMosqueId ? `/mosque/${currentMosqueId}/notifications` : '/notifications';
                        navigate(notificationsPath, {
                            state: { notifications: notifsToSend },
                        });
                    }}
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                    See all
                </button>
            </div>

            <div className="max-h-96 space-y-2 overflow-y-auto p-3">
                {visible.length > 0 ? (
                    visible.map((notification) => {
                        const mosque = followedMosques.find((m) => String(m.id) === String(notification.mosqueId));
                        return (
                            <div key={notification.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
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
                    <div className="p-4 text-sm text-gray-500">No notifications for your followed mosques.</div>
                )}
            </div>

            {visibleNotificationsCount < followedNotifications.length && (
                <div className="border-t border-gray-200 p-3">
                    <button
                        type="button"
                        onClick={() => setVisibleNotificationsCount(followedNotifications.length)}
                        className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;
