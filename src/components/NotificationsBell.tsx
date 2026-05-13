import { Bell, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/lib/notifications";
import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "@/lib/format";

export function NotificationsBell() {
  const { data, unread, markAllRead } = useNotifications();
  const items = data ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          {unread > 0 && (
            <span className="absolute top-1 end-1 min-w-[16px] h-[16px] px-1 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground grid place-items-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div>
            <div className="text-sm font-semibold">Notifications</div>
            <div className="text-xs text-muted-foreground">{unread} unread</div>
          </div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead}>Mark all read</Button>
          )}
        </div>
        <div className="max-h-[420px] overflow-y-auto">
          {items.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              You're all caught up.
            </div>
          )}
          {items.map((n) => {
            const Icon =
              n.severity === "critical" || n.severity === "error" ? AlertTriangle :
              n.severity === "success" ? CheckCircle2 : Info;
            const tone =
              n.severity === "critical" || n.severity === "error" ? "text-destructive" :
              n.severity === "warning" ? "text-warning" :
              n.severity === "success" ? "text-success" : "text-info";
            const Body = (
              <div className={`flex gap-3 p-3 border-b border-border/60 hover:bg-muted/30 ${!n.read_at ? "bg-muted/20" : ""}`}>
                <Icon className={`size-4 mt-0.5 ${tone}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{n.title}</div>
                  {n.body && <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.body}</div>}
                  <div className="text-[10px] text-muted-foreground/70 mt-1">{formatDistanceToNow(n.created_at)}</div>
                </div>
              </div>
            );
            return n.link ? (
              <Link key={n.id} to={n.link as any}>{Body}</Link>
            ) : (
              <div key={n.id}>{Body}</div>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
