import {Dropdown} from "react-bootstrap";

type ProfileMenuItemsProps = {
    isAuthenticated: boolean;
    isGuest?: boolean;
    navigate: (href: string) => void;
    onSignOut: () => void;
};

export default function ProfileMenuItems({
                                             isAuthenticated,
                                             isGuest = false,
                                             navigate,
                                             onSignOut
                                         }: ProfileMenuItemsProps) {
    if (!isAuthenticated && !isGuest) {
        return (
            <>
                <Dropdown.Item onClick={() => navigate("/auth/login")}>Sign In</Dropdown.Item>
                <Dropdown.Item onClick={() => navigate("/auth/register")}>Create Account</Dropdown.Item>
            </>
        );
    }

    if (isGuest) {
        return (
            <>
                <Dropdown.Item onClick={() => navigate("/account")}>View Profile</Dropdown.Item>
                <Dropdown.Divider/>
                <Dropdown.Item onClick={() => navigate("/auth/login")}>Sign In for Full Access</Dropdown.Item>
                <Dropdown.Item onClick={() => navigate("/auth/register")}>Create Account</Dropdown.Item>
            </>
        );
    }

    return (
        <>
            <Dropdown.Item onClick={() => navigate("/account")}>Go to Account</Dropdown.Item>
            <Dropdown.Item className="text-danger" onClick={onSignOut}>Sign out</Dropdown.Item>
        </>
    );
}