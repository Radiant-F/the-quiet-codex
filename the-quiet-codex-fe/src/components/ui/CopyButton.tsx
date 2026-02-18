import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiCheck, FiCopy } from "react-icons/fi";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-all ${className}`}
      style={{
        borderColor: copied
          ? "var(--color-success)"
          : "var(--color-glass-border)",
        color: copied ? "var(--color-success)" : "var(--color-text-dim)",
        background: copied
          ? "rgba(107, 203, 119, 0.1)"
          : "rgba(255, 255, 255, 0.03)",
      }}
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="check"
            className="flex items-center gap-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <FiCheck size={12} />
            Copied!
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            className="flex items-center gap-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <FiCopy size={12} />
            Copy
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
