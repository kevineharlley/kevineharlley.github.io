"use client";

import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="chip-card relative rounded-lg w-full max-w-lg max-h-[85vh] overflow-y-auto"
        style={{ boxShadow: "0 0 40px rgb(from var(--color-emerald) r g b / 0.15)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5"
          style={{ borderBottom: "1px solid rgba(255, 184, 48, 0.15)" }}
        >
          <h5
            className="text-base font-semibold text-slate-100"
            style={{ fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.04em" }}
          >
            {title}
          </h5>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-200 text-xl leading-none transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        <div
          className="flex justify-end p-4"
          style={{ borderTop: "1px solid rgba(255, 184, 48, 0.1)" }}
        >
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-200"
            style={{ color: "var(--color-emerald)", borderColor: "rgb(from var(--color-emerald) r g b / 0.4)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--color-emerald)";
              (e.currentTarget as HTMLElement).style.color = "#000";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--color-emerald)";
            }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

