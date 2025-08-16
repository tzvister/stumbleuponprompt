import { useState } from "react";
import { CreatorModal } from "@/components/creator-modal";

export default function Create() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <CreatorModal 
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            // Navigate back to home when modal closes
            window.location.href = '/';
          }
        }}
      />
    </div>
  );
}
