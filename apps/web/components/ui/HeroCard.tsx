"use client";

import {ReactNode} from "react";
import {Card, CardBody} from "react-bootstrap";

type HeroCardProps = {
    children: ReactNode;
    className?: string;
    padding?: string;
};

export default function HeroCard({
                                     children,
                                     className = "",
                                     padding = "p-5"
                                 }: HeroCardProps) {
    return (
        <Card className={`card-base card-hero border-0 ${className}`}>
            <CardBody className={padding}>
                {children}
            </CardBody>
        </Card>
    );
}