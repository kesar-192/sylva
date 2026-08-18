import { MessageCircle } from "lucide-react";
import EmptyState from "../components/EmptyState.jsx";

const Messages = () => (
  <EmptyState
    icon={MessageCircle}
    title="No messages yet"
    description="Direct messaging isn't wired up on the backend yet - this is where your conversations will live once it is."
  />
);

export default Messages;
