import { useState } from "react";
import { Plus } from "lucide-react";
import CreatePostModal from "./CreatePostModal.jsx";

// onPosted lets the parent (Dashboard) know a post was created, so a
// mounted Feed can prepend it without waiting for a full refetch.
const FAB = ({ onPosted }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 w-14 h-14 rounded-full bg-teal shadow-glow-teal flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-30"
        aria-label="Create post"
      >
        <Plus size={26} className="text-ink" strokeWidth={2.5} />
      </button>

      <CreatePostModal
        open={open}
        onClose={() => setOpen(false)}
        onPosted={onPosted}
      />
    </>
  );
};

export default FAB;
