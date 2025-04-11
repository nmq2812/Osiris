import ProtectedRoute from "@/components/ProtectedRoute";
import { ReactNode } from "react";

export default function UserLayout({ children }: { children: ReactNode }) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}
