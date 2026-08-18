import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImagePlus, Loader2 } from "lucide-react";
import { uploadMediaFile } from "../utils/cloudinaryUpload.js";
import { createPost } from "../api/postsApi.js";
import { useToast } from "../context/ToastContext.jsx";

const MAX_ITEMS = 10;

// One locally-picked file, tracked through its own upload lifecycle so
// several files (mixed image/video) can upload in parallel with
// independent progress bars.
const useDraftMedia = () => {
  const [items, setItems] = useState([]); // { id, file, previewUrl, progress, status, result }

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList).slice(0, MAX_ITEMS - items.length);
    const newItems = incoming.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: "pending", // pending | uploading | done | error
      result: null,
    }));
    setItems((prev) => [...prev, ...newItems]);
    return newItems;
  };

  const updateItem = (id, patch) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const removeItem = (id) => {
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((it) => it.id !== id);
    });
  };

  const reset = () => {
    items.forEach((it) => URL.revokeObjectURL(it.previewUrl));
    setItems([]);
  };

  return { items, addFiles, updateItem, removeItem, reset };
};

const CreatePostModal = ({ open, onClose, onPosted }) => {
  const { items, addFiles, updateItem, removeItem, reset } = useDraftMedia();
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  if (!open) return null;

  const handleFilePick = (e) => {
    const newItems = addFiles(e.target.files);
    newItems.forEach((item) => uploadOne(item));
    e.target.value = ""; // allow picking the same file again later
  };

  const uploadOne = async (item) => {
    updateItem(item.id, { status: "uploading" });
    try {
      const result = await uploadMediaFile(item.file, (progress) =>
        updateItem(item.id, { progress })
      );
      updateItem(item.id, { status: "done", result, progress: 100 });
    } catch (err) {
      updateItem(item.id, { status: "error" });
    }
  };

  const allDone = items.length > 0 && items.every((it) => it.status === "done");
  const anyUploading = items.some((it) => it.status === "uploading");

  const handleClose = () => {
    if (submitting) return;
    reset();
    setCaption("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!allDone) return;
    setSubmitting(true);
    try {
      const post = await createPost({
        caption,
        mediaItems: items.map((it) => it.result),
      });
      showToast("Post shared");
      onPosted?.(post);
      window.dispatchEvent(new CustomEvent("sylva:post-created", { detail: post }));
      reset();
      setCaption("");
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || "Couldn't share post", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-40 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.stopPropagation()}
          className="glass rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto border border-glassBorder"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-glassBorder">
            <h2 className="text-sm font-semibold text-paper">Create post</h2>
            <button
              onClick={handleClose}
              className="text-fog hover:text-paper transition"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value.slice(0, 2200))}
              placeholder="What's the vibe?"
              rows={3}
              className="w-full bg-charcoal/40 rounded-xl px-3.5 py-3 text-sm text-paper placeholder:text-fog/70 resize-none focus:outline-none focus:ring-1 focus:ring-teal"
            />

            {items.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="relative aspect-square rounded-lg overflow-hidden bg-charcoal/60"
                  >
                    {item.file.type.startsWith("video/") ? (
                      <video src={item.previewUrl} className="w-full h-full object-cover" muted />
                    ) : (
                      <img
                        src={item.previewUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}

                    {item.status !== "done" && (
                      <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
                        {item.status === "error" ? (
                          <span className="text-xs text-red-400">Failed</span>
                        ) : (
                          <>
                            <Loader2 size={18} className="animate-spin text-teal" />
                            <span className="absolute bottom-1.5 left-1.5 text-[10px] font-mono text-paper/80">
                              {item.progress}%
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={submitting}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-ink/70 flex items-center justify-center text-paper hover:bg-ink"
                      aria-label="Remove"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {items.length < MAX_ITEMS && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-glassBorder py-4 text-sm text-fog hover:text-teal hover:border-teal/50 transition"
              >
                <ImagePlus size={18} />
                Add photos or videos
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              hidden
              onChange={handleFilePick}
            />
          </div>

          <div className="px-5 py-4 border-t border-glassBorder flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!allDone || anyUploading || submitting}
              className="px-5 py-2 rounded-full bg-teal text-ink text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreatePostModal;
