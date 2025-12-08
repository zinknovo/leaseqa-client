import {FaTimes} from "react-icons/fa";
import dynamic from "next/dynamic";
import {Folder} from "../../types";

const ReactQuill = dynamic(() => import("react-quill-new"), {ssr: false});

type EditPostFormProps = {
    folders: Folder[];
    editSummary: string;
    editDetails: string;
    editUrgency: "low" | "medium" | "high";
    editFolders: string[];
    onSummaryChange: (val: string) => void;
    onDetailsChange: (val: string) => void;
    onUrgencyChange: (val: "low" | "medium" | "high") => void;
    onFoldersChange: (val: string[]) => void;
    onSave: () => void;
    onCancel: () => void;
};

export default function EditPostForm({
                                         folders,
                                         editSummary,
                                         editDetails,
                                         editUrgency,
                                         editFolders,
                                         onSummaryChange,
                                         onDetailsChange,
                                         onUrgencyChange,
                                         onFoldersChange,
                                         onSave,
                                         onCancel,
                                     }: EditPostFormProps) {
    const handleFolderAdd = (folderName: string) => {
        if (folderName && !editFolders.includes(folderName)) {
            onFoldersChange([...editFolders, folderName]);
        }
    };

    const handleFolderRemove = (folderName: string) => {
        onFoldersChange(editFolders.filter(f => f !== folderName));
    };

    return (
        <div className="post-edit-form">
            <input
                type="text"
                className="post-edit-title"
                value={editSummary}
                onChange={(e) => onSummaryChange(e.target.value.slice(0, 100))}
                placeholder="Post title"
            />

            <div className="post-edit-row">
                <div className="post-edit-group">
                    <label className="post-edit-label">Urgency</label>
                    <div className="post-edit-options">
                        {(["low", "medium", "high"] as const).map((level) => (
                            <label key={level} className="post-edit-radio">
                                <input
                                    type="radio"
                                    checked={editUrgency === level}
                                    onChange={() => onUrgencyChange(level)}
                                />
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="post-edit-group">
                    <label className="post-edit-label">Folders</label>
                    <select
                        className="post-edit-select"
                        value=""
                        onChange={(e) => handleFolderAdd(e.target.value)}
                    >
                        <option value="">Add folder...</option>
                        {folders
                            .filter(f => !editFolders.includes(f.name))
                            .map(f => (
                                <option key={f._id} value={f.name}>{f.displayName}</option>
                            ))
                        }
                    </select>
                </div>
            </div>

            {editFolders.length > 0 && (
                <div className="post-edit-tags">
                    {editFolders.map(folderName => {
                        const folder = folders.find(f => f.name === folderName);
                        return (
                            <span key={folderName} className="post-edit-tag">
                                {folder?.displayName || folderName}
                                <button type="button" onClick={() => handleFolderRemove(folderName)}>
                                    <FaTimes size={10}/>
                                </button>
                            </span>
                        );
                    })}
                </div>
            )}

            <div className="post-editor-box">
                <ReactQuill theme="snow" value={editDetails} onChange={onDetailsChange}/>
            </div>

            <div className="post-editor-actions">
                <button className="post-btn primary" onClick={onSave}>Save</button>
                <button className="post-btn secondary" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}
