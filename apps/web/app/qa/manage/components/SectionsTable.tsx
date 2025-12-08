import {FaCheck, FaEdit, FaTimes, FaTrash} from "react-icons/fa";
import {Folder, FolderDraft} from "../../types";

type SectionsTableProps = {
    folders: Folder[];
    editingId: string | null;
    drafts: Record<string, FolderDraft>;
    onEdit: (id: string) => void;
    onDraftChange: (id: string, field: keyof FolderDraft, value: string) => void;
    onSave: (id: string) => void;
    onCancelEdit: (id: string) => void;
    onDelete: (id: string) => void;
};

export default function SectionsTable({
                                          folders,
                                          editingId,
                                          drafts,
                                          onEdit,
                                          onDraftChange,
                                          onSave,
                                          onCancelEdit,
                                          onDelete,
                                      }: SectionsTableProps) {
    return (
        <div className="manage-card">
            <div className="manage-card-header">
                <h2>Existing Sections</h2>
                <span className="manage-count">{folders.length} sections</span>
            </div>
            <div className="manage-card-body no-padding scrollable">
                {!folders.length ? (
                    <div className="manage-empty-state">
                        No sections found. Create one to get started.
                    </div>
                ) : (
                    <div className="manage-table">
                        <div className="manage-table-header">
                            <div className="manage-table-cell name">Display Name</div>
                            <div className="manage-table-cell slug">Slug</div>
                            <div className="manage-table-cell desc">Description</div>
                            <div className="manage-table-cell actions">Actions</div>
                        </div>
                        {folders.map((folder) => {
                            const editing = editingId === folder._id;
                            const draft = drafts[folder._id] || {
                                name: folder.name,
                                displayName: folder.displayName,
                                description: folder.description,
                                color: folder.color,
                            };
                            const locked = folder.name === "uncategorized";

                            return (
                                <div
                                    key={folder._id}
                                    className={`manage-table-row ${editing ? "editing" : ""}`}
                                >
                                    <div className="manage-table-cell name">
                                        {editing ? (
                                            <input
                                                type="text"
                                                value={draft.displayName}
                                                onChange={(e) => onDraftChange(folder._id, "displayName", e.target.value)}
                                            />
                                        ) : (
                                            <span className="manage-folder-name">{folder.displayName}</span>
                                        )}
                                    </div>
                                    <div className="manage-table-cell slug">
                                        <span className="manage-slug">{folder.name}</span>
                                    </div>
                                    <div className="manage-table-cell desc">
                                        {editing ? (
                                            <textarea
                                                rows={2}
                                                value={draft.description}
                                                onChange={(e) => onDraftChange(folder._id, "description", e.target.value)}
                                            />
                                        ) : (
                                            <span className="manage-description">
                                                {folder.description || "—"}
                                            </span>
                                        )}
                                    </div>
                                    <div className="manage-table-cell actions">
                                        {editing ? (
                                            <>
                                                <button
                                                    className="manage-icon-btn save"
                                                    onClick={() => onSave(folder._id)}
                                                    title="Save"
                                                >
                                                    <FaCheck size={12}/>
                                                </button>
                                                <button
                                                    className="manage-icon-btn cancel"
                                                    onClick={() => onCancelEdit(folder._id)}
                                                    title="Cancel"
                                                >
                                                    <FaTimes size={12}/>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="manage-icon-btn edit"
                                                    onClick={() => onEdit(folder._id)}
                                                    title="Edit"
                                                >
                                                    <FaEdit size={12}/>
                                                </button>
                                                <button
                                                    className="manage-icon-btn delete"
                                                    onClick={() => onDelete(folder._id)}
                                                    disabled={locked}
                                                    title={locked ? "Default section cannot be deleted" : "Delete"}
                                                >
                                                    <FaTrash size={12}/>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
