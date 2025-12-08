import {FaPlus, FaSync} from "react-icons/fa";

type ManageHeaderProps = {
    loading: boolean;
    showCreateForm: boolean;
    onRefresh: () => void;
    onShowCreate: () => void;
};

export default function ManageHeader({
                                         loading,
                                         showCreateForm,
                                         onRefresh,
                                         onShowCreate,
                                     }: ManageHeaderProps) {
    return (
        <div className="manage-header">
            <div className="manage-header-content">
                <h1 className="manage-title">Manage Sections</h1>
                <p className="manage-subtitle">
                    Control the scenario buckets used across Q&A. Deleting a section moves its posts to "Uncategorized".
                </p>
            </div>
            <div className="manage-header-actions">
                <button
                    className="manage-btn secondary"
                    onClick={onRefresh}
                    disabled={loading}
                >
                    <FaSync size={12} className={loading ? "spin" : ""}/>
                    <span>Refresh</span>
                </button>
                {!showCreateForm && (
                    <button
                        className="manage-btn primary"
                        onClick={onShowCreate}
                    >
                        <FaPlus size={12}/>
                        <span>New Section</span>
                    </button>
                )}
            </div>
        </div>
    );
}
