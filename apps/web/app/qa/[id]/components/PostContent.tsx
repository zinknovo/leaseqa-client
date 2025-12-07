import {FaEdit, FaTrash, FaEye} from "react-icons/fa";
import {format} from "date-fns";
import dynamic from "next/dynamic";
import {PostContentProps} from "../../types";

const ReactQuill = dynamic(() => import("react-quill-new"), {ssr: false});

export default function PostContent({
    post,
    canEdit,
    isEditing,
    editSummary,
    editDetails,
    onEdit,
    onDelete,
    onSave,
    onCancel,
    onSummaryChange,
    onDetailsChange,
}: PostContentProps) {
    return (
        <div className="post-detail-card">
            <div className="post-detail-header">
                <div className="post-detail-meta">
                    <span className={`post-urgency-badge ${post.urgency || "low"}`}>
                        {post.urgency || "low"}
                    </span>
                    <span className="post-detail-folders">{post.folders?.join(" · ")}</span>
                    <span className="post-detail-date">
                        {post.createdAt ? format(new Date(post.createdAt), "MMM d, yyyy HH:mm") : ""}
                    </span>
                    <span className="post-detail-author">
                        {post.author?.username || post.author?.email || "Anonymous"}
                    </span>
                    <span className="post-detail-views">
                        <FaEye size={12}/>
                        {post.viewCount || 0}
                    </span>
                </div>
                {canEdit && !isEditing && (
                    <div className="post-detail-actions">
                        <button className="post-action-btn" onClick={onEdit}>
                            <FaEdit size={14}/>
                        </button>
                        <button className="post-action-btn danger" onClick={onDelete}>
                            <FaTrash size={14}/>
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="post-edit-form">
                    <input
                        type="text"
                        className="post-edit-title"
                        value={editSummary}
                        onChange={(e) => onSummaryChange(e.target.value.slice(0, 100))}
                        placeholder="Post title"
                    />
                    <div className="post-editor-box">
                        <ReactQuill theme="snow" value={editDetails} onChange={onDetailsChange}/>
                    </div>
                    <div className="post-editor-actions">
                        <button className="post-btn primary" onClick={onSave}>Save</button>
                        <button className="post-btn secondary" onClick={onCancel}>Cancel</button>
                    </div>
                </div>
            ) : (
                <>
                    <h1 className="post-detail-title">{post.summary}</h1>
                    <div className="post-detail-content" dangerouslySetInnerHTML={{__html: post.details}}/>
                </>
            )}

            {post.attachments && post.attachments.length > 0 && (
                <div className="post-attachments">
                    <div className="post-attachments-title">Attachments</div>
                    <div className="post-attachments-list">
                        {post.attachments.map((file) => (
                            <a
                                key={file.url}
                                href={file.url}
                                target="_blank"
                                rel="noreferrer"
                                className="post-attachment-item"
                            >
                                <span>{file.filename}</span>
                                {file.size && <span>{(file.size / 1024).toFixed(1)} KB</span>}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
