import { Bell } from "lucide-react";
import EmptyState from "../components/EmptyState.jsx";

const Notifications = () => (
  <EmptyState
    icon={Bell}
    title="You're all caught up"
    description="Likes, comments, and follows will show up here once notification events are tracked on the backend."
  />
);

export default Notifications;
