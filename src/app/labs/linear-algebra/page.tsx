"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from 'next/link';
import { Slider } from "@/components/ui/slider";
import { Activity, FunctionSquare, ChevronRight } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { cn } from "@/lib/utils";
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// 1. Types & Constants
type Scale = 'synapse' | 'neuron' | 'circuit';

const SCALE_DATA = {
    synapse: {
        title: "Synaptic Gain",
        formula: "y = w \cdot x",
        description: "A single connection scaling a signal.",
        inputCount: 1,
        outputCount: 1
    },
    neuron: {
        title: "Spatial Summation",
        formula: "V_{sum} = \sum_{i=1}^{n} w_i x_i",
        description: "Multiple inputs converging on a single cell body.",
        inputCount: 3,
        outputCount: 1
    },
    circuit: {
        title: "Neural Mapping",
        formula: "\mathbf{y} = \mathbf{W}\mathbf{x}",
        description: "A layer of neurons transforming a pattern of activity.",
        inputCount: 3,
        outputCount: 3
    }
};

export default function WhiteboxCompNeuro() {
    // 2. State
    const [scale, setScale] = useState<Scale>('neuron');
    const [inputs, setInputs] = useState<number[]>([0.5, 0.5, 0.5]);
    const [weights, setWeights] = useState<number[]>([0.6, -0.4, 0.3]);
    // 3x3 Matrix for Circuit Level
    const [matrix, setMatrix] = useState<number[][]>([
        [0.7, 0.2, -0.1],
        [-0.3, 0.8, 0.4],
        [0.2, -0.5, 0.6]
    ]);

    // 3. Animation Loop (Simulating Neural Activity)
    const requestRef = useRef<number>(0);
    const animate = useCallback(() => {
        const time = Date.now() / 1000;
        setInputs([
            Math.sin(time) * 0.4 + 0.5,
            Math.sin(time + 2) * 0.4 + 0.5,
            Math.sin(time + 4) * 0.4 + 0.5,
        ]);
        requestRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [animate]);

    // 4. Mathematical Core
    const getOutputs = (): number[] => {
        if (scale === 'synapse') return [inputs[0] * weights[0]];
        if (scale === 'neuron') return [weights.reduce((acc, w, i) => acc + w * inputs[i], 0)];
        // Matrix Multiplication: W * x
        return matrix.map(row => row.reduce((acc, w, i) => acc + w * inputs[i], 0));
    };

    const outputs = getOutputs();

    return (
        <div className="h-screen bg-zinc-950 text-zinc-200 flex flex-col overflow-hidden font-sans">
            {/* Header */}
            <header className="h-14 border-b border-zinc-900 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <h1 className="text-lg font-semibold text-white tracking-tight">
                         <Link href="/" className="hover:opacity-80 transition-opacity">ISCN</Link>
                        <span className="text-zinc-400 capitalize">{scale} Level</span>
                    </h1>
                </div>

                <Select value={scale} onValueChange={(v: Scale) => setScale(v)}>
                    <SelectTrigger className="w-56 bg-zinc-900 border-zinc-800 font-mono">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                        <SelectItem value="synapse">1. Synapse (Scalar)</SelectItem>
                        <SelectItem value="neuron">2. Neuron (Vector)</SelectItem>
                        <SelectItem value="circuit">3. Circuit (Matrix)</SelectItem>
                    </SelectContent>
                </Select>
            </header>

            <main className="flex-1 flex p-6 gap-6 overflow-hidden">
                {/* Left: Controls */}
                <aside className="w-80 flex flex-col gap-4 overflow-y-auto pr-2">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <FunctionSquare className="w-4 h-4 text-zinc-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Formalism</span>
                            </div>
                            <div className="bg-black/40 rounded-xl p-4 border border-zinc-800/50 text-center">
                                <BlockMath>{SCALE_DATA[scale].formula}</BlockMath>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                {scale === 'circuit' ? "Synaptic Matrix" : "Synaptic Weights"}
                            </span>
                            
                            {scale !== 'circuit' ? (
                                weights.slice(0, scale === 'synapse' ? 1 : 3).map((w, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-[11px] font-mono">
                                            <span className="text-zinc-400">w_{i}</span>
                                            <span className={w < 0 ? "text-rose-400" : "text-emerald-400"}>{w.toFixed(2)}</span>
                                        </div>
                                        <Slider 
                                            min={-1} max={1} step={0.05} value={[w]}
                                            onValueChange={([val]) => {
                                                const next = [...weights];
                                                next[i] = val;
                                                setWeights(next);
                                            }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {matrix.map((row, r) => row.map((val, c) => (
                                        <div key={`${r}-${c}`} className="flex flex-col gap-1">
                                            <input 
                                                type="number"
                                                step="0.1"
                                                className="bg-zinc-800 text-[10px] p-1 rounded border border-zinc-700 text-center focus:outline-none focus:border-emerald-500"
                                                value={val}
                                                onChange={(e) => {
                                                    const next = [...matrix];
                                                    next[r][c] = parseFloat(e.target.value) || 0;
                                                    setMatrix(next);
                                                }}
                                            />
                                        </div>
                                    )))}
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Right: Visualization */}
                <section className="flex-1 bg-zinc-900/20 border border-zinc-800 rounded-2xl relative flex items-center justify-center overflow-hidden">
                    <div className="flex items-center gap-12 lg:gap-24">
                        {/* Input Layer */}
                        <div className="flex flex-col gap-8">
                            {inputs.slice(0, SCALE_DATA[scale].inputCount).map((v, i) => (
                                <Tank key={i} value={v} label={`x_{${i}}`} color="bg-blue-500" />
                            ))}
                        </div>

                        <ChevronRight className="w-8 h-8 text-zinc-800" />

                        {/* Output Layer */}
                        <div className="flex flex-col gap-8">
                            {outputs.map((v, i) => (
                                <Tank 
                                    key={i} 
                                    value={v} 
                                    label={scale === 'circuit' ? `y_{${i}}` : "V_{out}"} 
                                    color={v < 0 ? "bg-rose-500" : "bg-emerald-500"} 
                                    isLarge
                                />
                            ))}
                        </div>
                    </div>

                    {/* Scale Caption */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                        <p className="text-zinc-500 text-xs font-mono uppercase tracking-tighter">
                            {SCALE_DATA[scale].description}
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}

// Sub-component: The "Whitebox" Signal Tank
function Tank({ value, label, color, isLarge = false }: { value: number, label: string, color: string, isLarge?: boolean }) {
    // We normalize height for visual clarity: 0.5 is half full.
    const displayHeight = Math.min(Math.abs(value) * 50, 100);
    
    return (
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
                <div className={cn(
                    "bg-zinc-900 border border-zinc-800 rounded-md relative overflow-hidden transition-all",
                    isLarge ? "w-14 h-32 border-zinc-700 shadow-lg shadow-black/50" : "w-10 h-24"
                )}>
                    {/* Tick Marks */}
                    <div className="absolute inset-0 flex flex-col justify-between p-1 opacity-20">
                        <div className="w-full h-px bg-white" />
                        <div className="w-full h-px bg-white" />
                        <div className="w-full h-px bg-white" />
                    </div>
                    {/* Fluid */}
                    <div 
                        className={cn("absolute bottom-0 w-full transition-all duration-300 ease-out", color, "opacity-60")}
                        style={{ height: `${displayHeight}%` }}
                    />
                    {/* Top Surface Glow */}
                    <div 
                        className={cn("absolute w-full h-1 transition-all duration-300", color)}
                        style={{ bottom: `calc(${displayHeight}% - 2px)` }}
                    />
                </div>
                <div className="text-center">
                    <div className="text-[10px] font-mono text-zinc-500"><InlineMath math={label}/></div>
                    <div className={cn("text-xs font-bold font-mono", value < 0 ? "text-rose-500" : "text-emerald-500")}>
                        {value.toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    );
}
