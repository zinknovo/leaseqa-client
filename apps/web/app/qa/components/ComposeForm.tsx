"use client";

import dynamic from "next/dynamic";
import {FaPaperclip, FaTimes} from "react-icons/fa";
import {ComposeState} from "../constants";
import {Folder} from "../types";
import React from "react";

const ReactQuill = dynamic(() => import("react-quill-new"), {ssr: false});

type ComposeFormProps = {
    composeState: ComposeState;
    folders: Folder[];
    posting: boolean;
    postError: string;
    onUpdate: (updates: Partial<ComposeState>) => void;
    onSubmit: () => void;
    onCancel: () => void;
};

export default function ComposeForm({
                                        composeState,
                                        folders,
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

    const getFolderLabel = (name: string) => {
        const folder = folders.find(f => f.name === name);
        return folder?.displayName || name;
    };

    return (
        <div className="compose-form">
            <div className="compose-form-header">
                <div>
                    <h3 className="compose-form-title">Create a new post</h3>
                    <p className="compose-form-subtitle">
                        Share a question or experience to help other renters. Replies marked ⚖️ are from verified
                        attorneys.
                    </p>
                </div>
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
                        {(["question", "note", "announcement"] as const).map((type) => (
                            <label key={type} className="compose-form-radio">
                                <input
                                    type="radio"
                                    name="postType"
                                    checked={composeState.postType === type}
                                    onChange={() => onUpdate({postType: type})}
                                />
                                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="compose-form-row">
                    <span className="compose-form-label">Urgency</span>
                    <div className="compose-form-options">
                        {(["low", "medium", "high"] as const).map((level) => (
                            <label key={level} className={`compose-form-radio urgency-${level}`}>
                                <input
                                    type="radio"
                                    name="urgency"
                                    checked={composeState.urgency === level}
                                    onChange={() => onUpdate({urgency: level})}
                                />
                                <span>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
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
                    <p className="compose-form-hint">Pick at least one section so attorneys and tenants can find the
                        right context.</p>
                    <select
                        className="compose-form-select"
                        value=""
                        onChange={(e) => handleAddFolder(e.target.value)}
                    >
                        <option value="">Select section...</option>
                        {folders.map(folder => (
                            <option key={folder.name} value={folder.name}>{folder.displayName}</option>
                        ))}
                    </select>
                    {composeState.folders.length > 0 && (
                        <div className="compose-form-tags">
                            {composeState.folders.map((f) => (
                                <span key={f} className="compose-form-tag">
                                    {getFolderLabel(f)}
                                    <button type="button" onClick={() => handleRemoveFolder(f)}>
                                        <FaTimes size={10}/>
                                    </button>
                                </span>
                            ))}
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
                        placeholder='One-line summary, e.g., "Is a three-month deposit legal in MA?"'
                        value={composeState.summary}
                        onChange={(e) => onUpdate({summary: e.target.value.slice(0, 100)})}
                        maxLength={100}
                    />
                </div>

                <div className="compose-form-group">
                    <label className="compose-form-label">Details</label>
                    <p className="compose-form-hint">Describe the situation, timeline, and any communication you have
                        had.</p>
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
