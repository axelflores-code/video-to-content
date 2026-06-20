// components/social/InstagramPreview.tsx
"use client";

import { useState } from "react";
import { Heart, MessageCircle, Bookmark, Send, Copy, Check, MoreHorizontal } from "lucide-react";

interface InstagramPreviewProps {
  content: string;
  userEmail?: string;
}

export default function InstagramPreview({ content, userEmail }: InstagramPreviewProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const username = userEmail?.split("@")[0]?.replace(/[^a-zA-Z0-9]/g, "_") ?? "tu_usuario";
  const initial = userEmail?.[0]?.toUpperCase() ?? "U";

  const lines = content.split("\n");
  const hashtagLine = lines.find((l) => l.trim().startsWith("#"));
  const mainText = lines.filter((l) => !l.trim().startsWith("#") || l === lines[0]).join("\n");

  const PREVIEW_LENGTH = 120;
  const isLong = mainText.length > PREVIEW_LENGTH;
  const displayText = expanded || !isLong ? mainText : mainText.slice(0, PREVIEW_LENGTH);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const likes = Math.floor(Math.random() * 800 + 100);

  return (
    <div className="w-full max-w-md mx-auto bg-[#0B0F19] border border-[#1E2640] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#151B2E]">
        <div className="flex items-center gap-3">
          {/* Avatar con gradiente Instagram fino */}
          <div className="p-[1.5px] rounded-full bg-gradient-to-tr from-[#FCAF45] via-[#E1306C] to-[#C13584]">
            <div className="w-9 h-9 rounded-full bg-[#0B0F19] p-[2px] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#7C3AED] flex items-center justify-center text-white font-bold text-sm tracking-wide shadow-inner">
                {initial}
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F1F5F9] tracking-tight leading-none mb-1">
              {username}
            </p>
            <p className="text-[11px] text-[#64748B] font-medium">Publicación</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all border ${
              copied 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                : "bg-[#161C2C] text-[#94A3B8] border-[#222B45] hover:bg-[#1C243A] hover:text-white"
            }`}
          >
            {copied ? <Check size={12} className="stroke-[2.5]" /> : <Copy size={12} />}
            <span>{copied ? "Copiado" : "Copiar"}</span>
          </button>
          <button className="text-[#64748B] hover:text-white transition-colors cursor-pointer p-1">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Imagen placeholder estilizada (Fiel a la imagen generada) */}
      <div className="px-5 pt-5">
        <div className="w-full aspect-square bg-[#111726] rounded-2xl flex flex-col items-center justify-center border border-[#1E2640] text-[#475569] gap-2.5 relative group overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0B0F19]/40 opacity-50" />
          <div className="w-14 h-14 rounded-2xl bg-[#161C2C] border border-[#222B45] flex items-center justify-center text-2xl shadow-md transform transition-transform group-hover:scale-110 z-10">
            🖼️
          </div>
          <p className="text-xs font-medium text-[#64748B] z-10 tracking-wide">Tu imagen o video aquí</p>
        </div>
      </div>

      {/* Botones de Acciones */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setLiked(!liked)}
            className="cursor-pointer transition-transform active:scale-125 group"
          >
            <Heart
              size={22}
              className="transition-all duration-200 hover:text-red-400"
              style={{
                color: liked ? "#EF4444" : "#94A3B8",
                fill: liked ? "#EF4444" : "none",
              }}
            />
          </button>
          <button className="text-[#94A3B8] hover:text-[#7C3AED] transition-colors cursor-pointer">
            <MessageCircle size={22} />
          </button>
          <button className="text-[#94A3B8] hover:text-sky-400 transition-colors cursor-pointer">
            <Send size={22} />
          </button>
        </div>
        <button 
          onClick={() => setSaved(!saved)} 
          className="text-[#94A3B8] hover:text-amber-400 transition-colors cursor-pointer"
        >
          <Bookmark size={22} style={{ fill: saved ? "#94A3B8" : "none" }} />
        </button>
      </div>

      {/* Likes */}
      <div className="px-5 pb-1.5">
        <p className="text-xs font-bold text-[#E2E8F0] tracking-wide">
          {liked ? likes + 1 : likes} Me gusta
        </p>
      </div>

      {/* Caption y Detalles */}
      <div className="px-5 pb-5 space-y-2">
        <p className="text-xs text-[#CBD5E1] leading-relaxed break-words">
          <span className="font-bold text-[#F1F5F9] mr-1.5 hover:underline cursor-pointer">
            {username}
          </span>
          <span className="whitespace-pre-wrap">{displayText}</span>
          {isLong && !expanded && (
            <>
              {"... "}
              <button
                onClick={() => setExpanded(true)}
                className="font-semibold text-[#64748B] hover:text-white cursor-pointer ml-0.5 transition-colors"
              >
                más
              </button>
            </>
          )}
        </p>

        {/* Hashtags con color vibrante */}
        {hashtagLine && (
          <p className="text-xs font-medium text-[#38BDF8] tracking-wide break-words">
            {hashtagLine}
          </p>
        )}

        {/* Fecha/Tiempo de publicación */}
        <p className="text-[10px] uppercase font-bold tracking-wider text-[#475569] pt-1">
          Hace 1 minuto
        </p>
      </div>
    </div>
  );
}