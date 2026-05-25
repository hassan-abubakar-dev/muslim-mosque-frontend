import { X } from "lucide-react";

const ToastToCreateAccount = ({toastToCreateAccountMessage, setToastToCreateAccountMessage}) => {
    setTimeout(() => {
        setToastToCreateAccountMessage(null);
    }, 3000)

    return (
         <div className="fixed top-24 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300 mt-2">
                  <div className="bg-white border-l-4 border-emerald-600 shadow-xl p-4 rounded-lg flex items-center gap-4">
                    <p className="text-sm font-medium text-gray-800">{toastToCreateAccountMessage}</p>
                    <button onClick={() => setToastToCreateAccountMessage(null)} className="p-1 hover:bg-gray-100 rounded text-gray-400"><X size={16} /></button>
                  </div>
                </div>
    )
};

export default ToastToCreateAccount;