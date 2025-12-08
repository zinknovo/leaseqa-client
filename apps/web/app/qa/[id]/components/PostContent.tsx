import {FaEdit, FaEye, FaMapPin, FaTrash} from "react-icons/fa";
import {format} from "date-fns";
import {PostContentProps} from "../../types";
import EditPostForm from "./EditPostForm";

export default function PostContent({
                                        post,
                                        folders,
                                        canEdit,
                                        isEditing,
                                        editSummary,
                                        editDetails,
                                        editUrgency,
                                        editFolders,
                                        resolvedStatus,
                                        isAdmin,
                                        onStatusChange,
                                        onEdit,
                                        onDelete,
                                        onSave,
                                        onCancel,
                                        onSummaryChange,
                                        onDetailsChange,
                                        onUrgencyChange,
                                        onFoldersChange,
                                        onTogglePin,
                                    }: PostContentProps) {
    const isAnonymous = (post as any).isAnonymous;
    const authorName = isAnonymous ? "Anonymous" : (post.author?.username || post.author?.email || "Unknown");
    const authorInitial = isAnonymous ? "?" : authorName.charAt(0).toUpperCase();

    return (
        <div className="post-detail-card">
            <div className="post-detail-header">
                <div className="post-detail-author-section">
                    <div className={`icon-circle icon-circle-md ${isAnonymous ? "icon-bg-muted" : "icon-bg-purple"}`}>
                        {authorInitial}
                    </div>
                    <div className="post-detail-author-info">
                        <div className="post-detail-author-row">
                            <span className="post-detail-author-name">{authorName}</span>
                        </div>
                        <div className="post-detail-meta-row">
                            <span>{post.createdAt ? format(new Date(post.createdAt), "MMM d, yyyy 'at' h:mm a") : ""}</span>
                            <span className="post-detail-meta-dot">·</span>
                            <span>{post.folders?.join(", ")}</span>
                            <span className="post-detail-meta-dot">·</span>
                            <span className="post-detail-views">
                                <FaEye size={11}/>
                                {post.viewCount || 0}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="post-detail-header-right">
                    {post.isPinned && (
                        <span className="post-pinned-badge">
                            <FaMapPin size={12}/>
                            Pinned
                        </span>
                    )}
                    <span className={`post-urgency-badge ${post.urgency || "low"}`}>
                        {(post.urgency || "low").toUpperCase()}
                    </span>
                    {isAdmin && !isEditing && (
                        <button
                            className={`post-action-btn pin ${post.isPinned ? "active" : ""}`}
                            onClick={onTogglePin}
                            title={post.isPinned ? "Unpin post" : "Pin post"}
                        >
                            <FaMapPin size={14}/>
                        </button>
                    )}
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
            </div>

            {isEditing ? (
                <EditPostForm
                    folders={folders}
                    editSummary={editSummary}
                    editDetails={editDetails}
                    editUrgency={editUrgency}
                    editFolders={editFolders}
                    onSummaryChange={onSummaryChange}
                    onDetailsChange={onDetailsChange}
                    onUrgencyChange={onUrgencyChange}
                    onFoldersChange={onFoldersChange}
                    onSave={onSave}
                    onCancel={onCancel}
                />
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

            {canEdit && (
                <div className="post-detail-footer">
                    <div className="post-status-toggle">
                        <span>Status:</span>
                        <div className="post-status-options">
                            <label className={resolvedStatus === "open" ? "active" : ""}>
                                <input
                                    type="radio"
                                    checked={resolvedStatus === "open"}
                                    onChange={() => onStatusChange("open")}
                                />
                                Open
                            </label>
                            <label className={resolvedStatus === "resolved" ? "active" : ""}>
                                <input
                                    type="radio"
                                    checked={resolvedStatus === "resolved"}
                                    onChange={() => onStatusChange("resolved")}
                                />
                                Resolved
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {!canEdit && (
                <div className="post-detail-footer">
                    <span className={`post-status-badge ${resolvedStatus}`}>
                        {resolvedStatus === "resolved" ? "✓ Resolved" : "Open"}
                    </span>
                </div>
            )}
        </div>
    );
}
