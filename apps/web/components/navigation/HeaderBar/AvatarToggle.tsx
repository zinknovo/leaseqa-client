import React, {forwardRef} from "react";

type AvatarToggleProps = {
    onClick?: (e: React.MouseEvent) => void;
    initials: string;
};

const AvatarToggle = forwardRef<HTMLButtonElement, AvatarToggleProps>(
    ({onClick, initials}, ref) => (
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
            <div className="icon-circle icon-circle-md icon-bg-purple hover-scale post-item-clickable">
                <span className="fw-semibold avatar-text-sm">{initials}</span>
            </div>
        </button>
    )
);

AvatarToggle.displayName = "AvatarToggle";

export default AvatarToggle;