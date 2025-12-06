import {Badge} from "react-bootstrap";
import {FaShieldAlt} from "react-icons/fa";

import {RootState} from "@/app/store";

type ProfileHeaderProps = {
    user: RootState["session"]["user"];
    initials: string;
    isAuthenticated: boolean;
};

export default function ProfileHeader({user, initials, isAuthenticated}: ProfileHeaderProps) {
    if (!isAuthenticated) {
        return (
            <div className="px-3 py-2">
                <div className="fw-bold mb-1">You are not signed in</div>
                <div className="text-muted small">Sign in to access your account and saved posts.</div>
            </div>
        );
    }

    return (
        <div className="px-3 py-2">
            <div className="d-flex align-items-start gap-2">
                <div className="icon-circle icon-circle-sm icon-bg-purple profile-avatar-sm">
                    <span className="fw-semibold avatar-text-xs">{initials}</span>
                </div>
                <div>
                    <div className="fw-bold">{user?.name || "Account"}</div>
                    <div className="text-muted small mb-1">{user?.email}</div>
                    <Badge bg="light" text="dark" className="d-inline-flex align-items-center gap-1">
                        <FaShieldAlt size={12}/>
                        <span className="text-capitalize">{user?.role || "tenant"}</span>
                    </Badge>
                </div>
            </div>
        </div>
    );
}