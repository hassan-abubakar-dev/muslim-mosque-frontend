
import privateAxiosInstance from '../../auth/privateAxiosInstance.js';

export const toggleMosqueFollow = async (mosqueId) => {

  try {
    const res = await privateAxiosInstance.post(`/mosques/${mosqueId}/follow`);
    if (res.status < 400) {
      return { success: true, newStatus: res.data.status, mosqueId: res.data.mosqueId, follow: res.data.follow };
    }
    return { success: false, error: res.data.error };
  } catch (err) {
    return { success: false, error: err };
  }
};