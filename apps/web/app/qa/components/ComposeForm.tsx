"use client";

import dynamic from "next/dynamic";
import {FaPaperclip, FaTimes} from "react-icons/fa";
import {ComposeState, SECTION_OPTIONS} from "../constants";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {ssr: false});

type ComposeFormProps = {
    composeState: ComposeState;
    posting: boolean;
    postError: string;
    onUpdate: (updates: Partial<ComposeState>) => void;
    onSubmit: () => void;
    onCancel: () => void;
};

export default function ComposeForm({
                                        composeState,
                                        posting,
                                        postError,
                                        onUpdate,
                                        onSubmit,
                                        onCancel,
                                    }: ComposeFormProps) {
    const handleAddFolder = (value: string) => {
        if (!value || composeState.folders.includes(value)) return;
        onUpdate({folders: [...composeState.folders, value]});
    };

    const handleRemoveFolder = (folder: string) => {
        onUpdate({folders: composeState.folders.filter(f => f !== folder)});
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        onUpdate({files});
    };

    return (
        <div className="compose-form">
            <div className="compose-form-header">
                <h3 className="compose-form-title">Create a new post</h3>
                <button
                    type="button"
                    className="compose-form-close"
                    onClick={onCancel}
                    disabled={posting}
                >
                    <FaTimes size={16}/>
                </button>
            </div>

            <div className="compose-form-body">
                <div className="compose-form-row">
                    <span className="compose-form-label">Post type</span>
                    <div className="compose-form-options">
                        {(["question", "note"] as const).map((type) => (
                            <label key={type} className="compose-form-radio">
                                <input
                                    type="radio"
                                    name="postType"
                                    checked={composeState.postType === type}
                                    onChange={() => onUpdate({postType: type})}
                                />
                                <span>{type === "question" ? "Question" : "Note"}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="compose-form-row">
                    <span className="compose-form-label">Post to</span>
                    <div className="compose-form-options">
                        {(["everyone", "admin"] as const).map((aud) => (
                            <label key={aud} className="compose-form-radio">
                                <input
                                    type="radio"
                                    name="audience"
                                    checked={composeState.audience === aud}
                                    onChange={() => onUpdate({audience: aud})}
                                />
                                <span>{aud === "everyone" ? "Everyone" : "Admins only"}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="compose-form-group">
                    <label className="compose-form-label">Sections</label>
                    <select
                        className="compose-form-select"
                        value=""
                        onChange={(e) => handleAddFolder(e.target.value)}
                    >
                        <option value="">Select section...</option>
                        {SECTION_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    {composeState.folders.length > 0 && (
                        <div className="compose-form-tags">
                            {composeState.folders.map((f) => {
                                const label = SECTION_OPTIONS.find(o => o.value === f)?.label || f;
                                return (
                                    <span key={f} className="compose-form-tag">
                                        {label}
                                        <button type="button" onClick={() => handleRemoveFolder(f)}>
                                            <FaTimes size={10}/>
                                        </button>
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="compose-form-group">
                    <label className="compose-form-label">
                        Title
                        <span className="compose-form-count">{composeState.summary.length}/100</span>
                    </label>
                    <input
                        type="text"
                        className="compose-form-input"
                        placeholder="Brief summary of your post"
                        value={composeState.summary}
                        onChange={(e) => onUpdate({summary: e.target.value.slice(0, 100)})}
                        maxLength={100}
                    />
                </div>

                <div className="compose-form-group">
                    <label className="compose-form-label">Content</label>
                    <div className="compose-form-editor">
                        <ReactQuill
                            theme="snow"
                            value={composeState.details}
                            onChange={(val) => onUpdate({details: val})}
                        />
                    </div>
                </div>

                <div className="compose-form-group">
                    <label className="compose-form-label">
                        <FaPaperclip size={12}/>
                        <span>Attachments</span>
                    </label>
                    <input
                        type="file"
                        className="compose-form-file"
                        multiple
                        onChange={handleFileChange}
                    />
                    {composeState.files.length > 0 && (
                        <div className="compose-form-file-count">
                            {composeState.files.length} file(s) selected
                        </div>
                    )}
                </div>

                {postError && (
                    <div className="compose-form-error">{postError}</div>
                )}
            </div>

            <div className="compose-form-footer">
                <button
                    type="button"
                    className="compose-form-btn secondary"
                    onClick={onCancel}
                    disabled={posting}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="compose-form-btn primary"
                    onClick={onSubmit}
                    disabled={posting}
                >
                    {posting ? "Posting..." : "Post"}
                </button>
            </div>
        </div>
    );
}
