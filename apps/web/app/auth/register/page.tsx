"use client";

import {useState} from "react";
import {Alert, Button, Card, CardBody, Container, Form, Modal} from "react-bootstrap";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {registerUser} from "@/app/lib/api";
import {useDispatch} from "react-redux";
import {setSession} from "@/app/store";

export default function RegisterPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const response = await registerUser({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: "tenant" // 默认为 tenant
            });

            const user = (response as any)?.data || response;
            if (!user || typeof user !== "object") {
                throw new Error("Registration response missing user data");
            }

            dispatch(setSession(user));
            setShowSuccess(true);
        } catch (err: any) {
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Container className="d-flex align-items-center justify-content-center min-vh-100 py-5">
                <div className="auth-container-narrow">
                    <div className="text-center mb-4">
                        <h1 className="h3 fw-bold">Create Account</h1>
                        <p className="text-muted">Join the LeaseQA community</p>
                    </div>

                    <Card className="card-base">
                        <CardBody className="p-4">
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? "Creating Account..." : "Sign Up"}
                                </Button>
                            </Form>

                            <div className="text-center text-muted small">
                                Already have an account? <Link href="/auth/login"
                                                               className="text-primary text-decoration-none">Sign
                                In</Link>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </Container>

            <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Account created</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-3">Your account was created successfully.</p>
                    <Link href="/auth/login" className="btn btn-primary w-100">
                        Go to Login
                    </Link>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSuccess(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
