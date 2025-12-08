import {FaCheck} from "react-icons/fa";

type FolderDraft = {
    name: string;
    displayName: string;
    description?: string;
    color?: string;
};

type CreateSectionFormProps = {
    draft: FolderDraft;
    loading: boolean;
    onDraftChange: (draft: FolderDraft) => void;
    onSave: () => void;
    onCancel: () => void;
};

export default function CreateSectionForm({
                                              draft,
                                              loading,
                                              onDraftChange,
                                              onSave,
                                              onCancel,
                                          }: CreateSectionFormProps) {
    return (
        <div className="manage-card">
            <div className="manage-card-header">
                <h2>Create New Section</h2>
            </div>
            <div className="manage-card-body">
                <div className="manage-form-grid">
                    <div className="manage-form-group">
                        <label>Name (slug)</label>
                        <input
                            type="text"
                            placeholder="e.g. repairs"
                            value={draft.name}
                            onChange={(e) => onDraftChange({...draft, name: e.target.value.trim()})}
                        />
                        <span className="manage-form-hint">Used in URLs and code</span>
                    </div>
                    <div className="manage-form-group">
                        <label>Display Name</label>
                        <input
                            type="text"
                            placeholder="Repairs & Habitability"
                            value={draft.displayName}
                            onChange={(e) => onDraftChange({...draft, displayName: e.target.value})}
                        />
                        <span className="manage-form-hint">Shown to users</span>
                    </div>
                    <div className="manage-form-group full-width">
                        <label>Description</label>
                        <textarea
                            rows={2}
                            placeholder="Optional helper text for this section"
                            value={draft.description}
                            onChange={(e) => onDraftChange({...draft, description: e.target.value})}
                        />
                    </div>
                </div>
                <div className="manage-form-actions">
                    <button className="manage-btn secondary" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="manage-btn primary" onClick={onSave} disabled={loading}>
                        <FaCheck size={12}/>
                        <span>Create Section</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
