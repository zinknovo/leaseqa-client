import {FaTimes} from "react-icons/fa";

type ManageAlertsProps = {
    error: string;
    success: string;
    onClearError: () => void;
    onClearSuccess: () => void;
};

export default function ManageAlerts({
                                         error,
                                         success,
                                         onClearError,
                                         onClearSuccess,
                                     }: ManageAlertsProps) {
    if (!error && !success) return null;

    return (
        <>
            {error && (
                <div className="manage-alert error">
                    {error}
                    <button onClick={onClearError}><FaTimes size={12}/></button>
                </div>
            )}
            {success && (
                <div className="manage-alert success">
                    {success}
                    <button onClick={onClearSuccess}><FaTimes size={12}/></button>
                </div>
            )}
        </>
    );
}
