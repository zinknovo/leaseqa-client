import {FaEdit, FaTrash, FaReply} from "react-icons/fa";
import {format} from "date-fns";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), {ssr: false});

type Discussion = {
    _id: string;
    authorId: string;
    content: string;
    createdAt: string;
    replies?: Discussion[];
    author?: any;
};

type DiscussionsSectionProps = {
    discussions: Discussion[];
    currentUserId: string | null;
    currentRole: string | null;
    showFollowBox: boolean;
    followFocused: boolean;
    discussionDrafts: Record<string, string>;
    discussionReplying: string | null;
    discussionEditing: string | null;
    onShowFollowBox: () => void;
    onFollowFocus: () => void;
    onDraftChange: (key: string, val: string) => void;
    onSubmit: (parentId: string | null) => void;
    onUpdate: (id: string) => void;
    onDelete: (id: string) => void;
    onReply: (id: string) => void;
    onEdit: (id: string, content: string) => void;
    onCancelReply: () => void;
    onCancelEdit: () => void;
    onClearFollow: () => void;
};

export default function DiscussionsSection({
    discussions,
    currentUserId,
    currentRole,
    showFollowBox,
    followFocused,
    discussionDrafts,
    discussionReplying,
    discussionEditing,
    onShowFollowBox,
    onFollowFocus,
    onDraftChange,
    onSubmit,
    onUpdate,
    onDelete,
    onReply,
    onEdit,
    onCancelReply,
    onCancelEdit,
    onClearFollow,
}: DiscussionsSectionProps) {
    const canEdit = (node: Discussion) => currentRole === "admin" || node.authorId === currentUserId;

    const renderDiscussion = (node: Discussion, depth = 0) => {
        const isReplying = discussionReplying === node._id;
        const isEditing = discussionEditing === node._id;
        const replyKey = `reply_${node._id}`;

        return (
            <div key={node._id} className={`post-discussion-item ${depth > 0 ? "post-discussion-reply" : ""}`}>
                <div className="post-discussion-header">
                    <span className="post-discussion-author">
                        {node.author?.username || node.author?.email || "Anonymous"}
                    </span>
                    <span className="post-discussion-date">
                        {node.createdAt ? format(new Date(node.createdAt), "MMM d, yyyy") : ""}
                    </span>
                    {canEdit(node) && (
                        <div className="post-discussion-actions">
                            <button onClick={() => onEdit(node._id, node.content)}>
                                <FaEdit size={12}/>
                            </button>
                            <button onClick={() => onDelete(node._id)}>
                                <FaTrash size={12}/>
                            </button>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="post-editor-box">
                        <ReactQuill
                            theme="snow"
                            value={discussionDrafts[node._id] || ""}
                            onChange={(val) => onDraftChange(node._id, val)}
                        />
                        <div className="post-editor-actions">
                            <button className="post-btn primary" onClick={() => onUpdate(node._id)}>
                                Save
                            </button>
                            <button className="post-btn secondary" onClick={onCancelEdit}>
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="post-discussion-content" dangerouslySetInnerHTML={{__html: node.content}}/>
                )}

                {!isEditing && (
                    <button className="post-discussion-reply-btn" onClick={() => onReply(node._id)}>
                        <FaReply size={10}/>
                        <span>Reply</span>
                    </button>
                )}

                {isReplying && !isEditing && (
                    <div className="post-editor-box" style={{marginTop: "0.75rem"}}>
                        <ReactQuill
                            theme="snow"
                            value={discussionDrafts[replyKey] || ""}
                            onChange={(val) => onDraftChange(replyKey, val)}
                            placeholder="Write a reply..."
                        />
                        <div className="post-editor-actions">
                            <button className="post-btn primary" onClick={() => onSubmit(node._id)}>
                                Reply
                            </button>
                            <button className="post-btn secondary" onClick={onCancelReply}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {node.replies && node.replies.length > 0 && (
                    <div className="post-discussion-replies">
                        {node.replies.map((r) => renderDiscussion(r, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="post-detail-card">
            <div className="post-section-header">
                <h2 className="post-section-title">Follow-up Discussion</h2>
            </div>

            {!showFollowBox ? (
                <button className="post-btn primary" onClick={onShowFollowBox}>
                    Write follow-up
                </button>
            ) : (
                <div className="post-editor-box">
                    <ReactQuill
                        theme="snow"
                        value={discussionDrafts["root"] || ""}
                        onFocus={onFollowFocus}
                        onChange={(val) => onDraftChange("root", val)}
                        placeholder="Start a discussion..."
                    />
                    <div className="post-editor-actions">
                        <button className="post-btn primary" onClick={() => onSubmit(null)}>
                            Post follow-up
                        </button>
                        <button className="post-btn secondary" onClick={onClearFollow}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {discussions.length > 0 && (
                <div className="post-discussions-list">
                    {discussions.map((d) => renderDiscussion(d))}
                </div>
            )}
        </div>
    );
}
