"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { Slider } from "@/components/ui/slider";
import { Activity } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { cn } from "@/lib/utils";
import { ConceptDialog } from '@/components/guide/ConceptDialog';
import { getProbabilityContent } from './content';

type Mode = 'coin' | 'poisson';

export default function ProbabilityPage() {
    const [mode, setMode] = useState<Mode>('poisson');
    const [rate, setRate] = useState(0.5); 
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const coinHistoryRef = useRef<number[]>([]);
    const spikeTimesRef = useRef<number[]>([]);

    const [stats, setStats] = useState<{
        coinCounts: { heads: number; total: number };
        spikeCount: number;
    }>({ coinCounts: { heads: 0, total: 0 }, spikeCount: 0 });

    const lastUiUpdateRef = useRef(0);

    const getLabels = (m: Mode) => {
        switch (m) {
            case 'coin': return {
                header: "Bernoulli Process",
                param: "Probability (p)",
                color: "text-emerald-400",
                accent: "bg-emerald-500",
                desc: "Simulating independent binary events (Ion Channels).",
                live: () => {
                    const { heads, total } = stats.coinCounts;
                    return `Heads: ${heads}/${total} (${total > 0 ? (heads / total).toFixed(2) : '0.00'})`;
                }
            };
            case 'poisson': return {
                header: "Poisson Process",
                param: "Firing Rate (λ)",
                color: "text-purple-400",
                accent: "bg-purple-500",
                desc: "Simulating random spike arrival times.",
                live: () => `Count: ${stats.spikeCount} spikes`
            };
        }
    };

    const labels = getLabels(mode);
    const guideContent = getProbabilityContent(mode);

    useEffect(() => {
        coinHistoryRef.current = [];
        spikeTimesRef.current = [];
        setStats({ coinCounts: { heads: 0, total: 0 }, spikeCount: 0 });
    }, [mode]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let lastFrameTime = performance.now() / 1000;

        const render = () => {
            const now = performance.now() / 1000;
            const dt = now - lastFrameTime;
            lastFrameTime = now;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#09090b"; // zinc-950
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (mode === 'coin') {
                const flipRate = 5;
                if (Math.random() < flipRate * dt) {
                    const outcome = Math.random() < rate ? 1 : 0;
                    coinHistoryRef.current = [...coinHistoryRef.current, outcome].slice(-200);
                }

                const history = coinHistoryRef.current;
                const coinSize = 10;
                const streamY = 100;
                
                history.forEach((outcome, i) => {
                    const ageIndex = (history.length - 1) - i;
                    const x = canvas.width - 50 - (ageIndex * (coinSize + 5));
                    if (x < 0) return;
                    ctx.beginPath();
                    ctx.arc(x, streamY, coinSize / 2, 0, Math.PI * 2);
                    ctx.fillStyle = outcome === 1 ? "#10b981" : "#ef4444";
                    ctx.fill();
                });

                const heads = history.filter(c => c === 1).length;
                const tails = history.filter(c => c === 0).length;
                const total = history.length || 1;
                const barWidth = 60;
                const maxBarHeight = 150;

                ctx.font = "12px sans-serif";
                const hTails = (tails / total) * maxBarHeight;
                ctx.fillStyle = "#ef4444";
                ctx.fillRect(canvas.width / 4 - barWidth / 2, canvas.height - 50 - hTails, barWidth, hTails);
                ctx.fillStyle = "#fff";
                ctx.fillText(`0 (Closed): ${(tails / total).toFixed(2)}`, canvas.width / 4 - 40, canvas.height - 30);

                const hHeads = (heads / total) * maxBarHeight;
                ctx.fillStyle = "#10b981";
                ctx.fillRect(3 * canvas.width / 4 - barWidth / 2, canvas.height - 50 - hHeads, barWidth, hHeads);
                ctx.fillStyle = "#fff";
                ctx.fillText(`1 (Open): ${(heads / total).toFixed(2)}`, 3 * canvas.width / 4 - 35, canvas.height - 30);

                const targetY = canvas.height - 50 - (rate * maxBarHeight);
                ctx.strokeStyle = "#fbbf24";
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(canvas.width / 2, targetY);
                ctx.lineTo(canvas.width, targetY);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = "#fbbf24";
                ctx.fillText(`Target p=${rate.toFixed(2)}`, canvas.width - 100, targetY - 5);

            } else {
                const realRate = 5 + (rate * 45); 
                if (Math.random() < realRate * dt) {
                    spikeTimesRef.current.push(now);
                    const cutoff = now - 5.0;
                    spikeTimesRef.current = spikeTimesRef.current.filter(t => t >= cutoff);
                }
                const spikes = spikeTimesRef.current;
                const rasterY = 80;
                const histBottom = canvas.height - 40;
                const histHeight = 150;
                const histX = 60;
                const histWidth = canvas.width - 120;
                const scrollSpeed = 150;

                ctx.fillStyle = "#a1a1aa";
                ctx.font = "12px sans-serif";
                ctx.fillText(`RASTER PLOT (Rate: ~${realRate.toFixed(0)}Hz)`, 20, 30);

                ctx.strokeStyle = "#27272a";
                ctx.beginPath();
                ctx.moveTo(0, rasterY);
                ctx.lineTo(canvas.width, rasterY);
                ctx.stroke();

                ctx.strokeStyle = "#a855f7"; 
                ctx.lineWidth = 2;
                ctx.beginPath();
                spikes.forEach(t => {
                    const age = now - t;
                    const x = canvas.width - 50 - (age * scrollSpeed);
                    if (x > 0 && x < canvas.width) {
                        ctx.moveTo(x, rasterY - 15);
                        ctx.lineTo(x, rasterY + 15);
                    }
                });
                ctx.stroke();

                const isis: number[] = [];
                for (let i = 1; i < spikes.length; i++) {
                    isis.push(spikes[i] - spikes[i - 1]);
                }

                if (isis.length > 2) {
                    const maxIsi = 0.2;
                    const binCount = 30;
                    const binSize = maxIsi / binCount;
                    const bins = new Array(binCount).fill(0);

                    isis.forEach(interval => {
                        if (interval < maxIsi) {
                            const binIndex = Math.floor(interval / binSize);
                            if (binIndex < binCount) bins[binIndex]++;
                        }
                    });

                    ctx.fillStyle = "#a1a1aa";
                    ctx.fillText("ISI HISTOGRAM (Inter-Spike Intervals)", 20, histBottom - histHeight - 20);
                    const maxBinVal = Math.max(...bins, 1);
                    const barW = histWidth / binCount;

                    ctx.fillStyle = "rgba(168, 85, 247, 0.2)";
                    ctx.strokeStyle = "rgba(168, 85, 247, 0.5)";
                    ctx.lineWidth = 1;

                    bins.forEach((count, i) => {
                        const h = (count / maxBinVal) * histHeight;
                        const x = histX + (i * barW);
                        const y = histBottom - h;
                        ctx.fillRect(x, y, barW - 1, h);
                        ctx.strokeRect(x, y, barW - 1, h);
                    });

                    ctx.beginPath();
                    ctx.strokeStyle = "#0ed3cf";
                    ctx.lineWidth = 2;
                    for (let px = 0; px <= histWidth; px += 2) {
                        const tVal = (px / histWidth) * maxIsi;
                        const theoryVal = Math.exp(-realRate * tVal);
                        const y = histBottom - (theoryVal * histHeight);
                        if (px === 0) ctx.moveTo(histX + px, y);
                        else ctx.lineTo(histX + px, y);
                    }
                    ctx.stroke();
                }
            }

            if (now - lastUiUpdateRef.current > 0.1) {
                lastUiUpdateRef.current = now;
                setStats({
                    coinCounts: {
                        heads: coinHistoryRef.current.filter(x => x === 1).length,
                        total: coinHistoryRef.current.length || 1
                    },
                    spikeCount: spikeTimesRef.current.length
                });
            }

            animationId = requestAnimationFrame(render);
        };

        animationId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationId);
    }, [mode, rate]);

    return (
        <div className="h-screen bg-zinc-950 text-zinc-200 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="h-14 border-b border-zinc-900 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur-sm z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Activity className={cn("w-5 h-5", mode === 'coin' ? "text-emerald-500" : "text-purple-500")} />
                    <h1 className="text-lg font-semibold tracking-tight text-white">
                        <Link href="/" className="hover:opacity-80 transition-opacity">ISCN</Link>
                        <span className="mx-3 text-zinc-700">/</span>
                        <span className="text-zinc-400 font-medium">Neural Stochasticity</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
                        <SelectTrigger className="w-[180px] h-9 bg-zinc-900 border-zinc-800 text-sm text-zinc-200">
                            <SelectValue placeholder="Mode" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="coin">Bernoulli (Coin)</SelectItem>
                            <SelectItem value="poisson">Poisson (Spikes)</SelectItem>
                        </SelectContent>
                    </Select>
                    <ConceptDialog
                        title={guideContent.title}
                        subtitle={guideContent.subtitle}
                        sections={guideContent.sections}
                    />
                </div>
            </header>

            {/* Main Application Area */}
            <main className="flex-1 flex overflow-hidden p-8 gap-8">
                
                {/* 1. Left Control Panel (The small box in your sketch) */}
                <aside className="w-80 flex flex-col gap-6">
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl shadow-sm space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                    {labels.param}
                                </label>
                                <span className={cn("text-sm font-bold px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800", labels.color)}>
                                    {rate.toFixed(2)}
                                </span>
                            </div>
                            
                            <Slider
                                value={[rate]}
                                min={0.01}
                                max={0.99}
                                step={0.01}
                                onValueChange={([v]) => setRate(v)}
                                className={cn(
                                    "py-2",
                                    mode === 'poisson' ? "[&_[role=slider]]:bg-purple-500" : "[&_[role=slider]]:bg-emerald-500"
                                )}
                            />
                            
                            <p className="text-xs text-zinc-500 leading-relaxed italic">
                                {labels.desc}
                            </p>
                        </div>

                        <div className="pt-6 border-t border-zinc-800/50">
                            <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Live Data</span>
                                <div className="text-sm font-medium text-white tabular-nums">
                                    {labels.live()}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* 2. Right Visualization Panel (The large box in your sketch) */}
                <section className="flex-1 min-w-0 bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden flex items-center justify-center relative shadow-inner">
                    <div className="w-full max-w-4xl p-4">
                        <canvas
                            ref={canvasRef}
                            width={800}
                            height={400}
                            className="w-full h-auto bg-zinc-950 rounded-lg shadow-2xl border border-zinc-800"
                        />
                    </div>
                    
                    {/* Status indicator in the corner of the large box */}
                    <div className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/50 border border-zinc-800 backdrop-blur-md">
                        <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", mode === 'coin' ? "bg-emerald-500" : "bg-purple-500")} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-zinc-500">Engine_Running</span>
                    </div>
                </section>
            </main>
        </div>
    );
}
