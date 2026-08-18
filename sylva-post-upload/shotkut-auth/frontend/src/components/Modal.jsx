import { X } from "lucide-react";

const Modal = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md glass rounded-2xl p-6 modal-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-paper">{title}</h2>
          <button onClick={onClose} className="text-fog hover:text-paper transition" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
