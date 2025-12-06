"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {RootState, setSession, signOut} from "@/app/store";
import {Badge, Button, Card, CardBody, Col, Form, Row, Stack} from "react-bootstrap";
import {
    FaBookmark,
    FaComments,
    FaEnvelope,
    FaFileAlt,
    FaHistory,
    FaIdBadge,
    FaRobot,
    FaShieldAlt,
    FaSignInAlt,
    FaUserPlus,
} from "react-icons/fa";
import * as client from "../auth/client";

//TODO: not in the database yet
const recentActions = [
    {icon: FaFileAlt, text: "Linked AI review to QA post", time: "2 hours ago"},
    {icon: FaBookmark, text: "Saved draft under Maintenance folder", time: "Yesterday"},
    {icon: FaComments, text: "Followed 2 attorney answers", time: "3 days ago"},
];

export default function AccountPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    const session = useSelector((state: RootState) => state.session);
    const user = session.user;
    const isAuthenticated = session.status === "authenticated" && !!user;

    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [profileForm, setProfileForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
    });

    useEffect(() => {
        setProfileForm({
            name: user?.name || "",
            email: user?.email || "",
        });
    }, [user]);

    const handleLogout = async () => {
        try {
            await client.logoutUser();
        } finally {
            dispatch(signOut());
            router.push("/");
        }
    };

    const handleSaveProfile = async () => {
        setError("");
        setSaving(true);
        try {
            const response = await client.updateUser({
                username: profileForm.name,
                email: profileForm.email,
            });
            const updatedUser = (response as any)?.data || response;
            dispatch(setSession(updatedUser));
            setEditMode(false);
        } catch (err: any) {
            setError(err.message || "Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setError("");
        setProfileForm({
            name: user?.name || "",
            email: user?.email || "",
        });
        setEditMode(false);
    };

    return (
        <div className="mb-4">
            <Card className="card-hero mb-4">
                <CardBody className="p-4">
                    <Row className="align-items-center">
                        <Col>
                            <div className="d-flex align-items-center gap-4">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold avatar-circle">
                                    {user?.name?.slice(0, 2).toUpperCase() || "?"}
                                </div>
                                <div>
                                    <h2 className="fw-bold mb-1">{user?.name || "Guest User"}</h2>
                                    <div className="opacity-75 mb-2">{user?.email || "Not signed in"}</div>
                                    {user && (
                                        <Badge className="px-3 py-2 role-badge">
                                            {user.role === "lawyer" ? "⚖️" : user.role === "admin" ? "🛡️" : "🏠"} {user.role}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </Col>
                        <Col xs="auto">
                            {isAuthenticated ? (
                                <Button
                                    href="/ai-review"
                                    variant="danger"
                                    className="d-flex align-items-center gap-2 btn-pill-padded"
                                >
                                    <FaRobot/>
                                    Use AI Review
                                </Button>
                            ) : (
                                <div className="d-flex gap-2">
                                    <Button href="/auth/login" variant="light" className="text-dark">
                                        Sign In
                                    </Button>
                                    <Button href="/auth/register" variant="outline-light">
                                        Register
                                    </Button>
                                </div>
                            )}
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            <Row className="g-4">
                <Col lg={6}>
                    <Card className="card-base card-accent-purple">
                        <CardBody className="p-4">
                            {isAuthenticated ? (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded-circle icon-circle-lg icon-bg-purple">
                                            <FaIdBadge className="text-white" size={20}/>
                                        </div>
                                        <div>
                                            <div className="fw-bold">Profile overview</div>
                                            <div className="text-secondary small">Your LeaseQA identity</div>
                                        </div>
                                    </div>

                                    <Stack gap={3}>
                                        <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light-gray">
                                            <FaIdBadge className="text-secondary"/>
                                            <div className="w-100">
                                                <div className="fw-semibold mb-1">Name</div>
                                                {editMode ? (
                                                    <Form.Control
                                                        value={profileForm.name}
                                                        onChange={(e) => setProfileForm(prev => ({
                                                            ...prev,
                                                            name: e.target.value
                                                        }))}
                                                        disabled={saving}
                                                    />
                                                ) : (
                                                    <div className="text-secondary small">{user?.name}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light-gray">
                                            <FaEnvelope className="text-secondary"/>
                                            <div className="w-100">
                                                <div className="fw-semibold mb-1">Email</div>
                                                {editMode ? (
                                                    <Form.Control
                                                        type="email"
                                                        value={profileForm.email}
                                                        onChange={(e) => setProfileForm(prev => ({
                                                            ...prev,
                                                            email: e.target.value
                                                        }))}
                                                        disabled={saving}
                                                    />
                                                ) : (
                                                    <div className="text-secondary small">{user?.email}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light-gray">
                                            <FaShieldAlt className="text-secondary"/>
                                            <div>
                                                <div className="fw-semibold">Role</div>
                                                <div className="text-secondary small text-capitalize">
                                                    {user?.role || "tenant"}
                                                </div>
                                            </div>
                                        </div>

                                        {error && <div className="text-danger small">{error}</div>}

                                        <div className="d-flex gap-2">
                                            {!editMode ? (
                                                <>
                                                    <Button
                                                        variant="outline-secondary"
                                                        className="flex-fill"
                                                        onClick={() => {
                                                            setError("");
                                                            setEditMode(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline-secondary"
                                                        className="flex-fill text-danger border-danger"
                                                        onClick={handleLogout}
                                                    >
                                                        Sign out
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="primary"
                                                        className="flex-fill"
                                                        disabled={saving}
                                                        onClick={handleSaveProfile}
                                                    >
                                                        {saving ? "Saving..." : "Save"}
                                                    </Button>
                                                    <Button
                                                        variant="outline-secondary"
                                                        className="flex-fill"
                                                        disabled={saving}
                                                        onClick={handleCancelEdit}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </Stack>
                                </div>
                            ) : (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded-circle icon-circle-lg icon-bg-purple">
                                            <FaShieldAlt className="text-white" size={20}/>
                                        </div>
                                        <div>
                                            <div className="fw-bold">Access Control</div>
                                            <div className="text-secondary small">Sign in to unlock features</div>
                                        </div>
                                    </div>

                                    <p className="text-secondary mb-4">
                                        AI review, posting questions, and attorney replies require authentication.
                                    </p>

                                    <Stack gap={3}>
                                        <Button
                                            href="/auth/login"
                                            variant="dark"
                                            className="d-flex align-items-center justify-content-center gap-2 btn-pill"
                                        >
                                            <FaSignInAlt/>
                                            Sign In
                                        </Button>
                                        <Button
                                            href="/auth/register"
                                            variant="outline-secondary"
                                            className="d-flex align-items-center justify-content-center gap-2 btn-pill"
                                        >
                                            <FaUserPlus/>
                                            Create Account
                                        </Button>
                                    </Stack>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>

                {isAuthenticated && (
                    <Col lg={6}>
                        <Card className="h-100 activity-card">
                            <CardBody className="p-4">
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-circle icon-circle-lg icon-bg-green">
                                        <FaHistory className="text-white" size={20}/>
                                    </div>
                                    <div>
                                        <div className="fw-bold">Recent Activity</div>
                                        <div className="text-secondary small">Your latest actions</div>
                                    </div>
                                </div>

                                <Stack gap={3}>
                                    {recentActions.map((action, index) => (
                                        <div
                                            key={index}
                                            className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light-gray"
                                        >
                                            <div
                                                className="d-flex align-items-center justify-content-center rounded-circle icon-circle-sm icon-bg-muted">
                                                <action.icon className="text-secondary" size={14}/>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="small">{action.text}</div>
                                                <div className="text-secondary small">{action.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </Stack>
                            </CardBody>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
}
