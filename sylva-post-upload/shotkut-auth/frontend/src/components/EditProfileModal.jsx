import { useState } from "react";
import Modal from "./Modal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const EditProfileModal = ({ onClose }) => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await updateProfile(form);
      showToast("Profile updated");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Edit Profile" onClose={onClose}>
      {error && (
        <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-fog mb-1.5">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg bg-ink border border-glassBorder px-3.5 py-2.5 text-sm text-paper outline-none focus:border-teal transition"
          />
        </div>
        <div>
          <label className="block text-xs text-fog mb-1.5">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            maxLength={160}
            rows={3}
            placeholder="Tell people what your vibe is..."
            className="w-full rounded-lg bg-ink border border-glassBorder px-3.5 py-2.5 text-sm text-paper placeholder-fog outline-none focus:border-teal transition resize-none"
          />
          <p className="text-[11px] text-fog mt-1 text-right">{form.bio.length}/160</p>
        </div>
        <div>
          <label className="block text-xs text-fog mb-1.5">Avatar image URL</label>
          <input
            name="avatarUrl"
            value={form.avatarUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-lg bg-ink border border-glassBorder px-3.5 py-2.5 text-sm text-paper placeholder-fog outline-none focus:border-teal transition"
          />
          <p className="text-[11px] text-fog mt-1">Leave blank to keep your initials avatar.</p>
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-glassBorder text-sm text-paper py-2.5 hover:bg-white/[0.05] transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-lg bg-teal text-ink text-sm font-semibold py-2.5 hover:brightness-110 transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
