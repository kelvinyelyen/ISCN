"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { Slider } from "@/components/ui/slider";
import { Activity, FunctionSquare } from "lucide-react";
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
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
    
    const [stats, setStats] = useState({
        coinCounts: { heads: 0, total: 0 },
        spikeCount: 0 
    });
    const lastUiUpdateRef = useRef(0);

    const getLabels = (m: Mode) => {
        switch (m) {
            case 'coin': return {
                header: "Bernoulli Process",
                param: "Probability (p)",
                formula: `P(X=k) = p^k (1-p)^{1-k}`,
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
                formula: `P(X=k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}`,
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
            ctx.fillStyle = "#09090b"; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (mode === 'coin') {
                // PHYSICS
                const flipRate = 5;
                if (Math.random() < flipRate * dt) {
                    const outcome = Math.random() < rate ? 1 : 0;
                    coinHistoryRef.current = [...coinHistoryRef.current, outcome].slice(-200);
                }

                const history = coinHistoryRef.current;
                const bottomY = canvas.height - 70;
                const maxH = 160;

                // 1. DRAW STREAM
                history.forEach((outcome, i) => {
                    const ageIndex = (history.length - 1) - i;
                    const x = canvas.width - 50 - (ageIndex * 15);
                    if (x < 0) return;
                    ctx.beginPath();
                    ctx.arc(x, 80, 5, 0, Math.PI * 2);
                    ctx.fillStyle = outcome === 1 ? "#10b981" : "#ef4444";
                    ctx.fill();
                });

                // 2. DRAW BARS
                const heads = history.filter(c => c === 1).length;
                const total = history.length || 1;
                const barW = 70;

                // Closed
                const hTails = ((total - heads) / total) * maxH;
                ctx.fillStyle = "#ef4444";
                ctx.fillRect(canvas.width / 4 - barW / 2, bottomY - hTails, barW, hTails);
                
                // Open
                const hHeads = (heads / total) * maxH;
                ctx.fillStyle = "#10b981";
                ctx.fillRect(3 * canvas.width / 4 - barW / 2, bottomY - hHeads, barW, hHeads);

                // Labels
                ctx.font = "12px ui-monospace, monospace";
                ctx.fillStyle = "#fff";
                ctx.fillText(`Closed: ${((total - heads) / total).toFixed(2)}`, canvas.width / 4 - 40, bottomY + 30);
                ctx.fillText(`Open: ${(heads / total).toFixed(2)}`, 3 * canvas.width / 4 - 35, bottomY + 30);

                // Target p line
                const targetY = bottomY - (rate * maxH);
                ctx.strokeStyle = "#fbbf24";
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(50, targetY); ctx.lineTo(canvas.width - 50, targetY);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = "#fbbf24";
                ctx.fillText(`Target p = ${rate.toFixed(2)}`, 60, targetY - 10);

            } else {
                // PHYSICS
                const realRate = 5 + (rate * 45); 
                if (Math.random() < realRate * dt) {
                    spikeTimesRef.current.push(now);
                    spikeTimesRef.current = spikeTimesRef.current.filter(t => t >= now - 5.0);
                }

                const spikes = spikeTimesRef.current;
                const histBottom = canvas.height - 70;
                const histH = 160;

                // 1. RASTER
                ctx.strokeStyle = "#a855f7"; 
                ctx.lineWidth = 2;
                ctx.beginPath();
                spikes.forEach(t => {
                    const x = canvas.width - 50 - ((now - t) * 150);
                    if (x > 0 && x < canvas.width) {
                        ctx.moveTo(x, 50);
                        ctx.lineTo(x, 90);
                    }
                });
                ctx.stroke();

                // 2. ISI HISTOGRAM
                const isis: number[] = [];
                for (let i = 1; i < spikes.length; i++) {
                    isis.push(spikes[i] - spikes[i - 1]);
                }

                if (isis.length > 2) {
                    const maxIsi = 0.25;
                    const binCount = 40;
                    const bins = new Array(binCount).fill(0);
                    isis.forEach(v => {
                        const idx = Math.floor(v / (maxIsi / binCount));
                        if (idx < binCount) bins[idx]++;
                    });

                    const histX = 100;
                    const histW = canvas.width - 200;
                    const maxB = Math.max(...bins, 1);

                    ctx.fillStyle = "rgba(168, 85, 247, 0.25)";
                    bins.forEach((b, i) => {
                        const h = (b / maxB) * histH;
                        const x = histX + (i * (histW / binCount));
                        ctx.fillRect(x, histBottom - h, (histW / binCount) - 1, h);
                    });

                    // Theory Curve
                    ctx.beginPath();
                    ctx.strokeStyle = "#0ed3cf";
                    ctx.lineWidth = 2;
                    for (let x = 0; x < histW; x++) {
                        const tVal = (x / histW) * maxIsi;
                        const yVal = Math.exp(-realRate * tVal);
                        if (x === 0) ctx.moveTo(histX + x, histBottom - (yVal * histH));
                        else ctx.lineTo(histX + x, histBottom - (yVal * histH));
                    }
                    ctx.stroke();

                    ctx.fillStyle = "#0ed3cf";
                    ctx.font = "10px ui-monospace, monospace";
                    ctx.fillText("Theoretical Exponential Decay", histX, histBottom - histH - 10);
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
        <div className="h-screen bg-zinc-950 text-zinc-200 flex flex-col overflow-hidden select-none">
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
                        <SelectTrigger className="w-[180px] h-9 bg-zinc-900 border-zinc-800 text-sm text-zinc-200 focus:ring-0">
                            <SelectValue placeholder="Mode" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 border-white/5">
                            <SelectItem value="coin" className="text-white hover:bg-zinc-800 cursor-pointer">Bernoulli (Coin)</SelectItem>
                            <SelectItem value="poisson" className="text-white hover:bg-zinc-800 cursor-pointer">Poisson (Spikes)</SelectItem>
                        </SelectContent>
                    </Select>
                    <ConceptDialog title={guideContent.title} subtitle={guideContent.subtitle} sections={guideContent.sections} />
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden p-8 gap-8">
                {/* Control Panel */}
                <aside className="w-80 flex flex-col gap-6 shrink-0">
                    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl space-y-8 flex flex-col shadow-lg backdrop-blur-md">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 font-mono">{labels.param}</label>
                                <span className={cn("text-base font-bold font-mono", labels.color)}>{rate.toFixed(2)}</span>
                            </div>
                            <Slider
                                value={[rate]} min={0.01} max={0.99} step={0.01}
                                onValueChange={([v]) => setRate(v)}
                                className={cn("py-2", mode === 'poisson' ? "[&_[role=slider]]:bg-purple-500" : "[&_[role=slider]]:bg-emerald-500")}
                            />
                            <p className="text-xs text-zinc-500 leading-relaxed italic">{labels.desc}</p>
                        </div>

                        <div className="pt-6 border-t border-zinc-800/50 space-y-4">
                            <div className="flex items-center gap-2">
                                <FunctionSquare className="w-3.5 h-3.5 text-zinc-600" />
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 font-mono">Model Formula</span>
                            </div>
                            <div className="bg-black/30 rounded-xl p-4 flex items-center justify-center border border-zinc-800/30 min-h-[100px] text-white">
                                <BlockMath math={labels.formula} />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-zinc-800/50 space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 font-mono">Live Statistics</span>
                            <div className="text-sm font-bold font-mono text-white bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center tracking-tighter">
                                {labels.live()}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Simulation Canvas */}
                <section className="flex-1 min-w-0 bg-zinc-900/20 border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col relative shadow-inner backdrop-blur-sm">
                    <div className="flex-1 flex items-center justify-center p-6">
                        <div className="w-full max-w-4xl relative group">
                            <div className={cn("absolute -inset-2 rounded-2xl blur-3xl opacity-5 transition duration-1000", mode === 'coin' ? "bg-emerald-500" : "bg-purple-500")} />
                            <canvas ref={canvasRef} width={800} height={400} className="relative w-full h-auto bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-800/50" />
                        </div>
                    </div>
                    
                    <div className="p-4 px-10 border-t border-zinc-800/50 flex justify-between items-center bg-zinc-950/50">
                        <div className="flex items-center gap-3">
                            <div className={cn("w-2 h-2 rounded-full animate-pulse", mode === 'coin' ? "bg-emerald-500" : "bg-purple-500")} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 font-mono">Workstation Status: Optimal</span>
                        </div>
                        <span className="text-[10px] text-zinc-700 uppercase tracking-widest font-mono">Engine_v.2.0.4 // 60FPS</span>
                    </div>
                </section>
            </main>
        </div>
    );
}
