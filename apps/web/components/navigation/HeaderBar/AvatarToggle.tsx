import React, {forwardRef} from "react";
import {FaUser} from "react-icons/fa";

type AvatarToggleProps = {
    onClick?: (e: React.MouseEvent) => void;
    initials: string;
    isAuthenticated: boolean;
    isGuest?: boolean;
};

const AvatarToggle = forwardRef<HTMLButtonElement, AvatarToggleProps>(
    ({onClick, initials, isAuthenticated, isGuest = false}, ref) => {
        const hasUser = isAuthenticated || isGuest;
        const avatarVariantClass = isGuest ? "icon-bg-muted" : (isAuthenticated ? "icon-bg-purple" : "icon-bg-muted");
        const avatarContent = hasUser ? (
            <span className="fw-semibold avatar-text-sm">{initials}</span>
        ) : (
            <FaUser className="text-secondary" size={18} aria-hidden/>
        );

        return (
            <button
                ref={ref}
                type="button"
                className="border-0 bg-transparent p-0"
                onClick={(e) => {
                    e.preventDefault();
                    onClick?.(e);
                }}
                aria-label="Open profile menu"
            >
                <div className={`icon-circle icon-circle-md ${avatarVariantClass} hover-scale post-item-clickable`}>
                    {avatarContent}
                </div>
            </button>
        );
    }
);

AvatarToggle.displayName = "AvatarToggle";

export default AvatarToggle;
