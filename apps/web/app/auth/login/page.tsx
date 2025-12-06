"use client";

import React, {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import {setSession} from "@/app/store";
import {Alert, Button, Card, CardBody, Form} from "react-bootstrap";
import * as client from "../client";

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({email: "", password: ""});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const user = await client.loginUser(formData);
            dispatch(setSession(user.data || user));
            router.push("/account");
        } catch (err: any) {
            const message = err.response?.data?.error?.message
                || err.message
                || "Invalid email or password";
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
                    <h1 className="h3 fw-bold">Welcome Back</h1>
                    <p className="text-secondary">Sign in to continue to LeaseQA</p>
                </div>

                <Card className="card-base">
                    <CardBody className="p-4">
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
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

                            <Form.Group className="mb-4">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
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
                                {loading ? "Signing In..." : "Sign In"}
                            </Button>
                        </Form>

                        <div className="text-center text-secondary small">
                            Don't have an account?{" "}
                            <Link href="/auth/register" className="text-primary text-decoration-none">
                                Create Account
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
