// components/social/TwitterPreview.tsx
"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Repeat2, Heart, BarChart2, Copy, Check, MoreHorizontal, Share } from "lucide-react";

interface TwitterPreviewProps {
  content: string;
  userEmail?: string;
}

interface Tweet {
  number: string;
  text: string;
}

function parseTweets(content: string): Tweet[] {
  const tweetRegex = /(\d+\/)\s*([\s\S]*?)(?=\d+\/|$)/g;
  const matches = [...content.matchAll(tweetRegex)];

  if (matches.length > 0) {
    return matches.map((m) => ({
      number: m[1],
      text: m[2].trim(),
    }));
  }
  return [{ number: "1/", text: content }];
}

export default function TwitterPreview({ content, userEmail }: TwitterPreviewProps) {
  const [liked, setLiked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Guardamos contadores estáticos para evitar que cambien en cada re-render
  const [stats, setStats] = useState({ replies: 0, retweets: 0, likes: 0, views: "" });

  useEffect(() => {
    setStats({
      replies: Math.floor(Math.random() * 40 + 5),
      retweets: Math.floor(Math.random() * 80 + 15),
      likes: Math.floor(Math.random() * 250 + 40),
      views: (Math.random() * 15 + 2).toFixed(1) + "K"
    });
  }, [content]);

  const tweets = parseTweets(content);
  const username = userEmail?.split("@")[0]?.replace(/[^a-zA-Z0-9]/g, "") ?? "tuusuario";
  const displayName = username.charAt(0).toUpperCase() + username.slice(1);
  const initial = userEmail?.[0]?.toUpperCase() ?? "U";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#000000] border border-[#1E2640] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all">
      
      {/* Header superior estilo SaaS */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#151B2E] bg-[#05070F]">
        <div className="flex items-center gap-2">
          <span className="font-black text-lg text-white tracking-tighter">𝕏</span>
          <span className="text-xs font-semibold text-[#64748B] bg-[#111726] px-2 py-0.5 rounded-full border border-[#1E2640]">
            {tweets.length > 1 ? `Hilo de ${tweets.length} posts` : "Post único"}
          </span>
        </div>
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
      </div>

      {/* Cuerpo del Feed / Hilo */}
      <div className="p-5 space-y-0 bg-[#000000]">
        {tweets.map((tweet, index) => (
          <div key={index} className="flex gap-3">
            
            {/* Avatar de 𝕏 + Línea Conectora */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center text-white font-bold text-sm tracking-wide shadow-md">
                {initial}
              </div>
              {index < tweets.length - 1 && (
                <div className="w-[2px] flex-1 bg-[#2F3336] my-1 min-h-[25px]" />
              )}
            </div>

            {/* Contenido del Post */}
            <div className="flex-1 pb-4 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0 text-[15px]">
                  <span className="font-bold text-[#E7E9EA] truncate hover:underline cursor-pointer">
                    {displayName}
                  </span>
                  <span className="text-[#71767B] truncate">
                    @{username}
                  </span>
                  <span className="text-[#71767B] shrink-0">·</span>
                  <span className="text-[#71767B] shrink-0 hover:underline cursor-pointer">
                    Ahora
                  </span>
                </div>
                <button className="text-[#71767B] hover:text-[#1D9BF0] transition-colors p-1 rounded-full hover:bg-[#1D9BF0]/10">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              {/* El texto del post */}
              <p className="text-[15px] text-[#E7E9EA] leading-normal mt-0.5 whitespace-pre-wrap break-words tracking-normal font-normal">
                {tweet.text}
              </p>

              {/* Módulo de Acciones (Estilo nativo interactivo) */}
              {index === tweets.length - 1 && (
                <div className="flex items-center justify-between mt-3 text-[#71767B] max-w-sm text-xs border-t border-[#151B2E]/70 pt-2.5">
                  
                  {/* Comentarios */}
                  <button className="flex items-center gap-1 group transition-colors hover:text-[#1D9BF0]">
                    <div className="p-2 rounded-full group-hover:bg-[#1D9BF0]/10 transition-colors">
                      <MessageCircle size={16} />
                    </div>
                    <span className="font-medium">{stats.replies}</span>
                  </button>

                  {/* Retweets */}
                  <button 
                    onClick={() => setRetweeted(!retweeted)}
                    className={`flex items-center gap-1 group transition-colors ${retweeted ? "text-[#00BA7C]" : "hover:text-[#00BA7C]"}`}
                  >
                    <div className={`p-2 rounded-full group-hover:bg-[#00BA7C]/10 transition-colors ${retweeted ? "bg-[#00BA7C]/10" : ""}`}>
                      <Repeat2 size={16} className={retweeted ? "stroke-[2.5]" : ""} />
                    </div>
                    <span className="font-medium">{retweeted ? stats.retweets + 1 : stats.retweets}</span>
                  </button>

                  {/* Likes */}
                  <button 
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center gap-1 group transition-colors ${liked ? "text-[#F91880]" : "hover:text-[#F91880]"}`}
                  >
                    <div className={`p-2 rounded-full group-hover:bg-[#F91880]/10 transition-colors ${liked ? "bg-[#F91880]/10" : ""}`}>
                      <Heart size={16} style={{ fill: liked ? "#F91880" : "none" }} />
                    </div>
                    <span className="font-medium">{liked ? stats.likes + 1 : stats.likes}</span>
                  </button>

                  {/* Views */}
                  <button className="flex items-center gap-1 group transition-colors hover:text-[#1D9BF0]">
                    <div className="p-2 rounded-full group-hover:bg-[#1D9BF0]/10 transition-colors">
                      <BarChart2 size={16} />
                    </div>
                    <span className="font-medium">{stats.views}</span>
                  </button>

                  {/* Compartir */}
                  <button className="text-[#71767B] hover:text-[#1D9BF0] transition-colors p-2 rounded-full hover:bg-[#1D9BF0]/10">
                    <Share size={16} />
                  </button>

                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer del contenedor */}
      <div className="px-5 py-3 flex items-center justify-between border-t border-[#151B2E] bg-[#05070F]">
        <span className="text-[11px] font-bold tracking-wide uppercase text-[#475569]">
          {content.length} caracteres
        </span>
        <span className="text-[11px] font-bold tracking-wide uppercase text-emerald-500 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Formato optimizado
        </span>
      </div>
    </div>
  );
}