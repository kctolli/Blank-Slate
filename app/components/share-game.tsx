"use client";

import { QRCodeSVG } from "qrcode.react";
import { Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ShareGameProps {
  gameId: string;
}

export function ShareGame({ gameId }: ShareGameProps) {
  const [baseUrl, setBaseUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // We use useEffect to get the URL only once the component mounts in the browser
  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const joinUrl = `${baseUrl}/join?code=${gameId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center gap-4">
        <div className="bg-white p-3 rounded-xl shadow-inner">
          {baseUrl && (
            <QRCodeSVG 
              value={joinUrl} 
              size={180} 
              level="H" 
              includeMargin={false}
              className="rounded-lg"
            />
          )}
        </div>

        <div className="text-center space-y-1">
          <p className="text-white font-bold text-lg tracking-tight">SCAN TO JOIN</p>
          <p className="text-slate-400 text-xs uppercase tracking-widest">Room Code: {gameId}</p>
        </div>

        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-all group"
        >
          <code className="text-blue-400 text-sm">{joinUrl.replace(/(^\w+:|^)\/\//, '')}</code>
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-slate-400 group-hover:text-white" />
          )}
        </button>
      </CardContent>
    </Card>
  );
}