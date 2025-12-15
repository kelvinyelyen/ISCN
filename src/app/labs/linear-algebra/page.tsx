"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { Slider } from "@/components/ui/slider";
import { Activity } from "lucide-react";
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { cn } from "@/lib/utils";
import { ConceptDialog } from '@/components/guide/ConceptDialog';
import { getLinearContent } from './content';
import { BlockMath } from 'react-katex';

type Mode = 'math' | 'neuro';

export default function LinearAlgebraPage() {
    const [mode, setMode] = useState<Mode>('math');

    // Mixer State
    const [weights, setWeights] = useState<number[]>([0.5, -0.2, 0.8]);
    const [inputs, setInputs] = useState<number[]>([0, 0, 0]);
    const requestRef = useRef<number>();

    // Mixer Animation Loop
    const animateMixer = () => {
        const time = Date.now() / 1000;
        setInputs([
            Math.sin(time + 0) * 0.5 + 0.5,
            Math.sin(time + 2) * 0.5 + 0.5,
            Math.sin(time + 4) * 0.5 + 0.5,
        ]);
        requestRef.current = requestAnimationFrame(animateMixer);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animateMixer);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    const dotProduct = weights.reduce((acc, w, i) => acc + w * inputs[i], 0);

    const content = getLinearContent(mode);

    return (
        <div className="h-screen bg-zinc-950 text-zinc-200 font-mono flex flex-col overflow-hidden">
            {/* MOBILE GUARD */}
            <div className="flex md:hidden flex-col items-center justify-center h-full p-8 text-center space-y-6 bg-zinc-950 z-50">
                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                    <Activity className="w-8 h-8 text-emerald-500 animate-pulse" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white mb-2">Scientific Workstation</h1>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto">
                        Please access this simulation on a <span className="text-zinc-300">Desktop</span> or <span className="text-zinc-300">Tablet</span>.
                    </p>
                </div>
            </div>

            {/* DESKTOP CONTENT */}
            <div className="hidden md:flex flex-col h-full">
                {/* Header */}
                <header className="h-12 border-b border-zinc-900 flex items-center justify-between px-4 bg-zinc-950/80 backdrop-blur-sm z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-2 h-2 rounded-full animate-pulse", mode === 'neuro' ? "bg-purple-500" : "bg-emerald-500")} />
                        <h1 className="text-lg font-bold tracking-tight text-white">
                            <Link href="/" className="hover:text-emerald-400 transition-colors">ISCN</Link> <span className="text-zinc-400 font-normal text-base">| Linear Algebra</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <Select value={mode} onValueChange={(v: Mode) => setMode(v)}>
                            <SelectTrigger className="w-[180px] h-8 bg-zinc-900 border-zinc-800 text-xs text-zinc-200">
                                <SelectValue placeholder="Select Context" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                <SelectItem value="math" className="text-zinc-300 focus:text-white focus:bg-zinc-800 cursor-pointer">Math (Dot Product)</SelectItem>
                                <SelectItem value="neuro" className="text-zinc-300 focus:text-white focus:bg-zinc-800 cursor-pointer">Neuro (Synapses)</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="h-4 w-px bg-zinc-800" />
                        <ConceptDialog {...content} />
                    </div>
                </header>

                <main className="flex-1 grid grid-cols-12 gap-0 overflow-hidden h-full">
                    {/* LEFT COLUMN: Controls */}
                    <div className="col-span-4 lg:col-span-3 flex flex-col border-r border-zinc-900 bg-zinc-925 relative">
                        <div className="absolute inset-0 overflow-y-auto [&::-webkit-scrollbar]:hidden scrollbar-hide p-6 space-y-6">

                            {/* Controls */}
                            <div className="space-y-6">
                                <div className="bg-zinc-900/40 border border-zinc-800 rounded p-4 text-center">
                                    <h3 className="text-xs text-zinc-500 uppercase tracking-widest mb-4 font-semibold">
                                        {mode === 'neuro' ? "Somatic Current" : "Dot Product"}
                                    </h3>
                                    <BlockMath>{mode === 'neuro' ? "I_{sum} = \\sum w_i \\cdot x_i" : "y = \\sum w_i \\cdot x_i"}</BlockMath>
                                    <div className="mt-4 text-3xl font-bold font-mono">
                                        <span className={cn(dotProduct < 0 ? "text-rose-400" : "text-emerald-400")}>
                                            {dotProduct.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {weights.map((w, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-zinc-400">
                                                    {mode === 'neuro' ? `Synapse ${i + 1} Strength` : `Weight ${i + 1}`}
                                                </span>
                                                <span className={cn("font-mono", w < 0 ? "text-rose-400" : "text-emerald-400")}>
                                                    {w.toFixed(2)}
                                                </span>
                                            </div>
                                            <Slider
                                                min={-1} max={1} step={0.1}
                                                value={[w]}
                                                onValueChange={([val]) => {
                                                    const newW = [...weights];
                                                    newW[i] = val;
                                                    setWeights(newW);
                                                }}
                                                className={cn(w < 0 ? "bg-rose-950/20" : "bg-emerald-950/20")}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT COLUMN: Visuals */}
                    <div className="col-span-8 lg:col-span-9 flex flex-col bg-zinc-950 relative overflow-hidden items-center justify-center">
                        <div className="flex items-end justify-center h-full w-full gap-8 p-12">
                            {/* Inputs */}
                            <div className="flex gap-4 items-end">
                                {inputs.map((inVal, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className="w-12 bg-zinc-800 rounded-t overflow-hidden relative border border-zinc-700 h-64">
                                            <div
                                                className="absolute bottom-0 w-full bg-blue-500/80 transition-all duration-100 ease-linear"
                                                style={{ height: `${Math.abs(inVal) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-zinc-500 font-mono">
                                            {mode === 'neuro' ? `Firing Rate ${i}` : `x_${i}`}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Weights (Visual Connection) */}
                            <div className="h-64 flex flex-col justify-around text-zinc-600">
                                {weights.map((w, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-8 h-px bg-zinc-700" />
                                        <span className="text-xs">× {w.toFixed(1)}</span>
                                        <div className="w-8 h-px bg-zinc-700" />
                                    </div>
                                ))}
                            </div>

                            {/* The SUMMATION TANK */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-32 h-64 bg-zinc-900 rounded-lg border-2 border-zinc-700 relative overflow-hidden shadow-inner">
                                    {/* Liquid */}
                                    <div
                                        className={cn(
                                            "absolute bottom-0 w-full transition-all duration-300 ease-out flex items-center justify-center text-white font-bold",
                                            dotProduct < 0 ? "bg-rose-500/80" : "bg-emerald-500/80"
                                        )}
                                        style={{
                                            height: `${Math.min(Math.abs(dotProduct) * 33, 100)}%`, // Scale appropriately
                                        }}
                                    >
                                        <span className="drop-shadow-md z-10">{dotProduct.toFixed(2)}</span>
                                        {/* Reflection glint */}
                                        <div className="absolute top-0 left-0 w-full h-2 bg-white/20" />
                                    </div>

                                    {/* Grid lines */}
                                    {[0.25, 0.5, 0.75].map((tick) => (
                                        <div key={tick} className="absolute w-full h-px bg-zinc-800" style={{ bottom: `${tick * 100}%` }} />
                                    ))}
                                </div>
                                <span className="text-xs text-zinc-500 font-mono">
                                    {mode === 'neuro' ? "Soma Potential" : "Sum (y)"}
                                </span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
