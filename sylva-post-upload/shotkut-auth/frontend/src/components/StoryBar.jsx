import { Plus } from "lucide-react";

const StoryBar = ({ stories }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-1 feed-scroll">
      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-1.5 shrink-0">
          <div className={`aura-ring ${story.unread ? "" : "aura-ring--idle"}`}>
            <div className="w-14 h-14 rounded-full bg-charcoal flex items-center justify-center m-[3px] relative">
              <span className="text-xs font-semibold text-paper">
                {story.name[0]?.toUpperCase()}
              </span>
              {story.isUser && (
                <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-teal flex items-center justify-center">
                  <Plus size={12} className="text-ink" strokeWidth={3} />
                </span>
              )}
            </div>
          </div>
          <span className="text-[11px] text-fog max-w-[56px] truncate">{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default StoryBar;
