import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/pqrs")({
  component: () => <Outlet />,
});
