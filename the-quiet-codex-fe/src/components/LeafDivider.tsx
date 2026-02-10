import { FiFeather } from "react-icons/fi";
import { SAGE } from "../lib/theme";

export default function LeafDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <div className="h-px w-16" style={{ background: `${SAGE}30` }} />
      <FiFeather size={16} style={{ color: `${SAGE}40` }} />
      <div className="h-px w-16" style={{ background: `${SAGE}30` }} />
    </div>
  );
}
