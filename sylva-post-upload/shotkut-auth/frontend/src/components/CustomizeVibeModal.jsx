import { useState } from "react";
import Modal from "./Modal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const PRESET_TAGS = [
  "⚡ Flirting with Code",
  "🎧 In the Zone",
  "🌙 Night Owl Mode",
  "🚀 Shipping Fast",
  "☕ Running on Caffeine",
  "✨ New Here",
];

const CustomizeVibeModal = ({ onClose }) => {
  const { user, updateProfile } = useAuth();
  const [selected, setSelected] = useState(user?.statusTag || PRESET_TAGS[5]);
  const [custom, setCustom] = useState("");
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const handleSave = async () => {
    const finalTag = custom.trim() || selected;
    setSaving(true);
    try {
      await updateProfile({ statusTag: finalTag });
      showToast("Vibe updated");
      onClose();
    } catch (err) {
      showToast("Could not update vibe", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Customize Vibe" onClose={onClose}>
      <p className="text-xs text-fog mb-3">Pick a status tag, or write your own.</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESET_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setSelected(tag);
              setCustom("");
            }}
            className={`text-xs rounded-full px-3 py-1.5 border transition ${
              selected === tag && !custom
                ? "border-teal bg-teal/10 text-teal"
                : "border-glassBorder text-fog hover:text-paper"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <input
        value={custom}
        onChange={(e) => setCustom(e.target.value)}
        maxLength={40}
        placeholder="Or write a custom status..."
        className="w-full rounded-lg bg-ink border border-glassBorder px-3.5 py-2.5 text-sm text-paper placeholder-fog outline-none focus:border-teal transition mb-5"
      />
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border border-glassBorder text-sm text-paper py-2.5 hover:bg-white/[0.05] transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 rounded-lg bg-teal text-ink text-sm font-semibold py-2.5 hover:brightness-110 transition disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save vibe"}
        </button>
      </div>
    </Modal>
  );
};

export default CustomizeVibeModal;
