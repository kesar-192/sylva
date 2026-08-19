const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center max-w-7xl mx-auto w-full">
    <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-glassBorder flex items-center justify-center mb-4">
      <Icon size={24} className="text-teal" />
    </div>
    <h2 className="text-lg font-semibold text-paper mb-1.5">{title}</h2>
    <p className="text-sm text-fog max-w-sm">{description}</p>
  </div>
);

export default EmptyState;
