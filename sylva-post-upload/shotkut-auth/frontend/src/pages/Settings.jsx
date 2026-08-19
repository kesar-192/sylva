import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check, Bell, Shield, Lock, Link2, User, Palette } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import Card from "../components/Card.jsx";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "security", label: "Security", icon: Lock },
  { id: "connected", label: "Connected Accounts", icon: Link2 },
];

const ComingSoon = ({ label }) => (
  <div className="text-center py-14">
    <p className="text-sm text-fog">
      {label} settings aren't backed by the API yet - this panel is a placeholder for when they are.
    </p>
  </div>
);

const ProfileTab = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || "",
    statusTag: user?.statusTag || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await updateProfile(form);
      showToast("Profile updated");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      <div>
        <label className="block text-xs text-fog mb-1.5">Display name</label>
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
        <label className="block text-xs text-fog mb-1.5">Status / vibe tag</label>
        <input
          name="statusTag"
          value={form.statusTag}
          onChange={handleChange}
          maxLength={40}
          className="w-full rounded-lg bg-ink border border-glassBorder px-3.5 py-2.5 text-sm text-paper outline-none focus:border-teal transition"
        />
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
        <p className="text-[11px] text-fog mt-1">
          Leave blank to keep your initials avatar. File upload needs a media service (e.g. Cloudinary) which isn't connected yet.
        </p>
      </div>
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-teal text-ink text-sm font-semibold px-5 py-2.5 hover:brightness-110 transition disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
};

const modeOptions = [
  { id: "dark", label: "Dark" },
  { id: "amoled", label: "AMOLED" },
  { id: "light", label: "Light" },
];
const accentOptions = [
  { id: "teal", label: "Teal", swatch: "rgb(64 161 157)" },
  { id: "purple", label: "Purple", swatch: "rgb(168 85 247)" },
  { id: "rose", label: "Rose", swatch: "rgb(244 63 94)" },
  { id: "amber", label: "Amber", swatch: "rgb(217 119 6)" },
  { id: "blue", label: "Blue", swatch: "rgb(59 130 246)" },
];
const fontSizeOptions = [
  { id: "sm", label: "Small" },
  { id: "md", label: "Medium" },
  { id: "lg", label: "Large" },
];

const AppearanceTab = () => {
  const { mode, accent, fontSize, density, updatePrefs } = useTheme();
  const { showToast } = useToast();

  const set = (key, value) => {
    updatePrefs({ [key]: value });
    showToast("Appearance updated");
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-paper mb-3">Theme mode</h3>
        <div className="flex gap-2">
          {modeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => set("mode", opt.id)}
              className={`rounded-lg px-4 py-2 text-sm border transition ${
                mode === opt.id
                  ? "bg-teal text-ink border-teal font-medium"
                  : "border-glassBorder text-fog hover:text-paper"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-paper mb-3">Accent color</h3>
        <div className="flex gap-3">
          {accentOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => set("accent", opt.id)}
              aria-label={opt.label}
              className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition"
              style={{ backgroundColor: opt.swatch, borderColor: accent === opt.id ? opt.swatch : "transparent" }}
            >
              {accent === opt.id && <Check size={16} className="text-ink" strokeWidth={3} />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-paper mb-3">Font size</h3>
        <div className="flex gap-2">
          {fontSizeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => set("fontSize", opt.id)}
              className={`rounded-lg px-4 py-2 text-sm border transition ${
                fontSize === opt.id
                  ? "bg-teal text-ink border-teal font-medium"
                  : "border-glassBorder text-fog hover:text-paper"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-paper mb-3">Feed density</h3>
        <div className="flex gap-2">
          {["comfortable", "compact"].map((d) => (
            <button
              key={d}
              onClick={() => set("density", d)}
              className={`rounded-lg px-4 py-2 text-sm border capitalize transition ${
                density === d
                  ? "bg-teal text-ink border-teal font-medium"
                  : "border-glassBorder text-fog hover:text-paper"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-paper">Settings</h1>
        <p className="text-sm text-fog mt-1">Manage your profile, appearance, and account.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 feed-scroll">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition ${
              activeTab === id ? "bg-teal text-ink font-medium" : "glass text-fog hover:text-paper"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <Card className="p-6 mt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "appearance" && <AppearanceTab />}
            {activeTab === "notifications" && <ComingSoon label="Notification preference" />}
            {activeTab === "privacy" && <ComingSoon label="Privacy" />}
            {activeTab === "security" && <ComingSoon label="Security" />}
            {activeTab === "connected" && <ComingSoon label="Connected account" />}
          </motion.div>
        </AnimatePresence>
      </Card>

      <Card className="p-6 mt-4">
        <h2 className="text-sm font-semibold text-paper mb-1">Account</h2>
        <p className="text-sm text-fog mb-4">{user?.email}</p>
        <button
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
          className="rounded-lg border border-glassBorder text-sm text-paper px-4 py-2 hover:bg-white/[0.05] transition"
        >
          Log out
        </button>
      </Card>
    </div>
  );
};

export default Settings;
