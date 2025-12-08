import {useRef} from "react";
import {FaEdit, FaPaperclip, FaTrash} from "react-icons/fa";
import {format} from "date-fns";
import dynamic from "next/dynamic";
import {Answer, AnswersSectionProps} from "../../types";

const ReactQuill = dynamic(() => import("react-quill-new"), {ssr: false});

//TODO: remove unused elements
export default function AnswersSection({
                                           answers,
                                           currentUserId,
                                           currentRole,
                                           isGuest = false,
                                           showAnswerBox,
                                           answerContent,
                                           answerFocused,
                                           answerFiles,
                                           answerEditing,
                                           answerEditContent,
                                           error,
                                           onShowAnswerBox,
                                           onAnswerContentChange,
                                           onAnswerFocus,
                                           onAnswerFilesChange,
                                           onSubmitAnswer,
                                           onClearAnswer,
                                           onEditAnswer,
                                           onEditContentChange,
                                           onSaveEdit,
                                           onCancelEdit,
                                           onDeleteAnswer,
                                       }: AnswersSectionProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const canEditAnswer = (ans: Answer) => !isGuest && (currentRole === "admin" || ans.authorId === currentUserId);

    return (
        <div className="post-detail-card">
            <div className="post-section-header">
                <h2 className="post-section-title">Answers</h2>
            </div>

            {!isGuest && !showAnswerBox && (
                <button className="post-btn primary" onClick={onShowAnswerBox}>
                    Write an answer
                </button>
            )}

            {!isGuest && showAnswerBox && (
                <div className="post-editor-box">
                    <ReactQuill
                        theme="snow"
                        value={answerContent}
                        onChange={onAnswerContentChange}
                        onFocus={onAnswerFocus}
                    />
                    <div className="post-editor-actions">
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            hidden
                            onChange={(e) => onAnswerFilesChange(Array.from(e.target.files || []))}
                        />
                        <button
                            className="post-btn secondary"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <FaPaperclip size={12}/>
                            {answerFiles.length > 0 ? ` ${answerFiles.length} files` : " Attach"}
                        </button>
                        <button className="post-btn primary" onClick={onSubmitAnswer}>
                            Post answer
                        </button>
                        <button className="post-btn secondary" onClick={onClearAnswer}>
                            Cancel
                        </button>
                    </div>
                    {error && <div className="post-error">{error}</div>}
                </div>
            )}

            {answers.length > 0 && (
                <div className="post-answers-list">
                    {answers.map((ans) => (
                        <div key={ans._id} className="post-answer-item">
                            <div className="post-answer-header">
                                <span className="post-answer-author">
                                    {ans.author?.username || ans.author?.email || "Unknown"}
                                </span>
                                <span className="post-answer-type">
                                    {ans.answerType === "lawyer_opinion" ? "⚖️ Lawyer" : "🏠 Community"}
                                </span>
                                <span className="post-answer-date">
                                    {ans.createdAt ? format(new Date(ans.createdAt), "MMM d, yyyy") : ""}
                                </span>
                                {canEditAnswer(ans) && (
                                    <div className="post-answer-actions">
                                        <button onClick={() => onEditAnswer(ans._id, ans.content)}>
                                            <FaEdit size={12}/>
                                        </button>
                                        <button onClick={() => onDeleteAnswer(ans._id)}>
                                            <FaTrash size={12}/>
                                        </button>
                                    </div>
                                )}
                            </div>
                            {answerEditing === ans._id ? (
                                <div className="post-editor-box">
                                    <ReactQuill
                                        theme="snow"
                                        value={answerEditContent}
                                        onChange={onEditContentChange}
                                    />
                                    <div className="post-editor-actions">
                                        <button className="post-btn primary" onClick={() => onSaveEdit(ans._id)}>
                                            Save
                                        </button>
                                        <button className="post-btn secondary" onClick={onCancelEdit}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="post-answer-content" dangerouslySetInnerHTML={{__html: ans.content}}/>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
