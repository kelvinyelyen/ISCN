import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

// Keep your existing types
type PhaseMode = 'math' | 'leak' | 'resonator' | 'spike';
type ProbMode = 'coin' | 'poisson';

// --- NEW FUNCTION FOR PROBABILITY PAGE ---
export const getProbabilityContent = (mode: ProbMode) => {
    switch (mode) {
        case 'coin':
            return {
                title: "Bernoulli Process",
                subtitle: "Ion Channel Stochasticity",
                sections: [
                    {
                        title: "The Bernoulli Trial",
                        content: (
                            <div className="space-y-2 text-sm text-zinc-300">
                                <p>
                                    In neuroscience, many processes are binary. An ion channel is either <strong className="text-emerald-400">Open (1)</strong> or <strong className="text-red-400">Closed (0)</strong>.
                                </p>
                                <BlockMath math="P(X=k) = p^k (1-p)^{1-k}" />
                                <p>
                                    The probability <InlineMath>p</InlineMath> determines the likelihood of finding a channel open at any given snapshot.
                                </p>
                            </div>
                        )
                    },
                    {
                        title: "Statistical Convergence",
                        content: (
                            <div className="text-sm text-zinc-300 italic">
                                <p>
                                    Observe the bars: as the number of trials increases, the ratio of open states converges to your target <InlineMath>p</InlineMath>.
                                </p>
                            </div>
                        )
                    }
                ]
            };
        case 'poisson':
            return {
                title: "Poisson Process",
                subtitle: "Neural Firing Patterns",
                sections: [
                    {
                        title: "Event Arrivals",
                        content: (
                            <div className="space-y-2 text-sm text-zinc-300">
                                <p>
                                    A Poisson process models discrete events (spikes) occurring independently at a constant average rate <InlineMath>\lambda</InlineMath>.
                                </p>
                                <BlockMath math="P(X=k) = \frac{\lambda^k e^{-\lambda}}{k!}" />
                            </div>
                        )
                    },
                    {
                        title: "ISI Distribution",
                        content: (
                            <div className="text-sm text-zinc-300">
                                <p>
                                    The time between spikes (Inter-Spike Interval) follows an <strong className="text-purple-400">Exponential Distribution</strong>. 
                                </p>
                                <p className="mt-2">
                                    Notice how the data histogram matches the cyan theoretical decay curve.
                                </p>
                            </div>
                        )
                    }
                ]
            };
    }
};

// --- YOUR EXISTING PHASE CONTENT ---
export const getPhaseContent = (mode: PhaseMode) => {
    switch (mode) {
        case 'leak':
            return {
                title: "Linear Leak",
                subtitle: "The Passive Membrane",
                sections: [
                    {
                        title: "The RC Circuit",
                        color: "purple",
                        content: (
                            <div className="space-y-2 text-sm text-zinc-300">
                                <p>The simplest model of a neuron is just a leaky capacitor.</p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                    <li><strong className="text-emerald-400">Voltage (<InlineMath>V</InlineMath>):</strong> Uses energy to push ions across the membrane.</li>
                                    <li><strong className="text-amber-400">Leak (<InlineMath>g_L</InlineMath>):</strong> Ions escape through channels, pulling Voltage back to rest (0).</li>
                                </ul>
                            </div>
                        )
                    },
                    {
                        title: "Exponential Decay",
                        color: "blue",
                        content: (
                            <div className="text-sm text-zinc-300">
                                <BlockMath>{"\\dot{V} = -V + I_{ext}"}</BlockMath>
                                <p>Without input (<InlineMath>I=0</InlineMath>), the system decays exponentially to zero.</p>
                            </div>
                        )
                    }
                ]
            };
        case 'resonator':
            return {
                title: "The Resonator",
                subtitle: "Subthreshold Oscillations",
                sections: [
                    {
                        title: "Two Forces",
                        color: "cyan",
                        content: (
                            <div className="space-y-2 text-sm text-zinc-300">
                                <p>Some neurons don&apos;t just decay; they bounce.</p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                    <li><strong className="text-blue-400">Restoring Force:</strong> Pushes voltage back to rest.</li>
                                    <li><strong className="text-amber-400">Slow Negative Feedback:</strong> A delayed current that overshoots.</li>
                                </ul>
                            </div>
                        )
                    },
                    {
                        title: "Damped Oscillations",
                        color: "amber",
                        content: (
                            <div className="text-sm text-zinc-300">
                                <BlockMath>{"\\dot{V} = w"}</BlockMath>
                                <BlockMath>{"\\dot{w} = -V - \\delta w"}</BlockMath>
                                <p>This creates a &quot;preferred frequency&quot; (Resonance).</p>
                            </div>
                        )
                    }
                ]
            };
        case 'spike':
            return {
                title: "The Spike",
                subtitle: "FitzHugh-Nagumo Model",
                sections: [
                    {
                        title: "Excitability",
                        color: "emerald",
                        content: (
                            <div className="space-y-2 text-sm text-zinc-300">
                                <p>The defining feature: <strong>The Action Potential</strong>.</p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                    <li><strong className="text-emerald-400">Fast Na+ (<InlineMath>V</InlineMath>):</strong> Explodes open when voltage rises.</li>
                                    <li><strong className="text-amber-400">Slow K+ (<InlineMath>w</InlineMath>):</strong> Shuts the system down.</li>
                                </ul>
                            </div>
                        )
                    },
                    {
                        title: "Limit Cycles",
                        color: "rose",
                        content: (
                            <div className="text-sm text-zinc-300">
                                <p>If input <InlineMath>I</InlineMath> is high enough, the system enters repetitive firing.</p>
                            </div>
                        )
                    }
                ]
            };
        default: // 'math'
            return {
                title: "The Phase Plane",
                subtitle: "A Map of All Possibilities",
                sections: [
                    {
                        title: "Geometric Thinking",
                        color: "blue",
                        content: (
                            <div className="text-sm text-zinc-300">
                                <p>Instead of simulating time, we look at Geometry.</p>
                            </div>
                        )
                    },
                    {
                        title: "Nullclines",
                        color: "orange",
                        content: (
                            <div className="space-y-2 text-sm text-zinc-300">
                                <div className="p-2 border border-emerald-500/30 rounded bg-emerald-500/10">
                                    <strong className="text-emerald-400">Green Line (<InlineMath>{"\\dot{V}=0"}</InlineMath>)</strong>
                                </div>
                                <div className="p-2 border border-amber-500/30 rounded bg-amber-500/10">
                                    <strong className="text-amber-400">Orange Line (<InlineMath>{"\\dot{w}=0"}</InlineMath>)</strong>
                                </div>
                            </div>
                        )
                    }
                ]
            };
    }
};
