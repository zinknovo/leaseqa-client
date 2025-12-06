"use client";

import React, {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {setSession} from "@/app/store";
import {Alert, Button, Card, CardBody, Form, Modal} from "react-bootstrap";
import * as client from "../client";

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
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const user = await client.registerUser({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: "tenant"
            });
            dispatch(setSession(user.data || user));
            setShowSuccess(true);
        } catch (err: any) {
            const message = err.response?.data?.error?.message
                || err.message
                || "Registration failed";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center loading-container">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status"/>
                    <div className="text-secondary">Loading stats...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-container-narrow">
                <div className="text-center mb-4">
                    <h1 className="h3 fw-bold">Create Account</h1>
                    <p className="text-secondary">Join the LeaseQA community</p>
                </div>

                <Card className="card-base">
                    <CardBody className="p-4">
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleRegister}>
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="input-rounded"
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
                                    className="input-rounded"
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
                                    className="input-rounded"
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
                                    className="input-rounded"
                                    required
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 mb-3 btn-pill"
                                disabled={loading}
                            >
                                {loading ? "Creating Account..." : "Sign Up"}
                            </Button>
                        </Form>

                        <div className="text-center text-secondary small">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-primary text-decoration-none">
                                Sign In
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Account Created!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-0">Your account was created successfully.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSuccess(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => router.push("/account")}>
                        Go to Account
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
