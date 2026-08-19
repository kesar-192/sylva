import { TrendingUp, Zap } from "lucide-react";

const TrendingPanel = ({ tags, creators }) => {
  return (
    <div className="hidden xl:block w-72 shrink-0 space-y-4">
      <div className="glass rounded-2xl p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-paper mb-4">
          <TrendingUp size={16} className="text-teal" />
          Trending Vibes
        </h3>
        <ul className="space-y-3">
          {tags.map((t) => (
            <li key={t.tag} className="flex items-center justify-between text-sm">
              <span className="text-teal">{t.tag}</span>
              <span className="text-fog text-xs font-mono">{t.posts}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-paper mb-4">
          <Zap size={16} className="text-teal" />
          Popular Creators
        </h3>
        <ul className="space-y-3">
          {creators.map((c) => (
            <li key={c.handle} className="flex items-center justify-between text-sm">
              <span className="text-paper">{c.handle}</span>
              <span className="text-fog text-xs font-mono">{c.aura} ⚡</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrendingPanel;
