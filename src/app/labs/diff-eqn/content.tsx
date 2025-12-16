import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

type Mode = 'math' | 'eco' | 'neuro' | 'exp' | 'harmonic' | 'logistic';

export const getPhaseContent = (mode: Mode) => {
    switch (mode) {
        case 'eco':
            return {
                title: "Predator-Prey Dynamics",
                subtitle: "Lotka-Volterra Model",
                sections: [
                    {
                        title: "The Story",
                        color: "amber",
                        content: (
                            <div className="space-y-2 text-sm text-zinc-300">
                                <p>This system models the cycle of life between two species:</p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                    <li><strong className="text-emerald-400">Prey (<InlineMath>x</InlineMath>):</strong> Rabbits. They grow exponentially in the absence of predators.</li>
                                    <li><strong className="text-amber-400">Predators (<InlineMath>y</InlineMath>):</strong> Foxes. They starve without prey.</li>
                                </ul>
                            </div>
                        )
                    },
                    {
                        title: "The Equations",
                        color: "blue",
                        content: (
                            <div className="text-sm text-zinc-300">
                                <BlockMath>
                                    {"\\begin{cases} \\dot{x} = \\alpha x - \\beta xy \\\\ \\dot{y} = \\delta xy - \\gamma y \\end{cases}"}
                                </BlockMath>
                                <p className="mt-2">
                                    The term <InlineMath>{"xy"}</InlineMath> represents <strong>encounters</strong>. More encounters = fewer rabbits, more foxes.
                                </p>
                            </div>
                        )
                    },
                    {
                        title: "Key Features",
                        color: "emerald",
                        content: (
                            <div className="space-y-2 text-sm text-zinc-300">
                                <p><strong>Fixed Point (Center):</strong> The ecosystem can exist in a perfect stable balance.</p>
                                <p><strong>Limit Cycles:</strong> Usually, populations oscillate. A boom in rabbits leads to a boom in foxes, which crashes the rabbits, which crashes the foxes, and the cycle repeats.</p>
                            </div>
                        )
                    }
                ]
            };

        case 'neuro':
            return {
                title: "Neuroscience: Excitability",
                subtitle: "FitzHugh-Nagumo Model",
                sections: [
                    {
                        title: "The Story",
                        color: "emerald",
                        content: (
                            <div className="space-y-2 text-sm text-zinc-300">
                                <p>How does a neuron spike? It&apos;s a battle between two forces:</p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                    <li><strong className="text-emerald-400">Excitation (<InlineMath>V</InlineMath>):</strong> Sodium channels opening. Fast positive feedback.</li>
                                    <li><strong className="text-amber-400">Recovery (<InlineMath>w</InlineMath>):</strong> Potassium channels / Leaking. Slow negative feedback.</li>
                                </ul>
                            </div>
                        )
                    },
                    {
                        title: "The Threshold",
                        color: "rose",
                        content: (
                            <div className="text-sm text-zinc-300">
                                <p>
                                    The <strong>Nullclines</strong> define the &quot;tipping point&quot;.
                                </p>
                                <p className="mt-2">
                                    If you inject enough Current (<InlineMath>I</InlineMath>), you push the state past the threshold. The system must then take a long &quot;excursion&quot; (a spike) before returning to rest. This is an <strong>Action Potential</strong>.
                                </p>
                            </div>
                        )
                    }
                ]
            };

        case 'exp':
            return {
                title: "Linear Dynamics",
                subtitle: "Exponential Growth & Decay",
                sections: [
                    {
                        title: "Building Blocks",
                        color: "purple",
                        content: (
                            <div className="space-y-2 text-sm text-zinc-300">
                                <p>Complex systems are built from these simple linear parts:</p>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800">
                                        <strong className="text-emerald-400 block mb-1">Growth</strong>
                                        <InlineMath>{"\\dot{x} = x"}</InlineMath>
                                        <p className="text-xs text-zinc-500 mt-1">Explodes to infinity.</p>
                                    </div>
                                    <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800">
                                        <strong className="text-rose-400 block mb-1">Decay</strong>
                                        <InlineMath>{"\\dot{y} = -y"}</InlineMath>
                                        <p className="text-xs text-zinc-500 mt-1">Dies to zero.</p>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    {
                        title: "Saddle Point",
                        color: "blue",
                        content: (
                            <div className="text-sm text-zinc-300">
                                <p>
                                    When you mix growth in one direction and decay in another, you get a <strong>Saddle</strong>. The Fixed Point is unstable—most paths curve away from it.
                                </p>
                            </div>
                        )
                    }
                ]
            };

        case 'harmonic':
            return {
                title: "Harmonic Oscillator",
                subtitle: "Springs & Pendulums",
                sections: [
                    {
                        title: "Energy Conservation",
                        color: "cyan",
                        content: (
                            <div className="space-y-2 text-sm text-zinc-300">
                                <p>
                                    Energy sloshes back and forth between <strong>Potential</strong> (Position <InlineMath>x</InlineMath>) and <strong>Kinetic</strong> (Velocity <InlineMath>v</InlineMath>).
                                </p>
                                <BlockMath>{"\\dot{x} = v"}</BlockMath>
                                <BlockMath>{"\\dot{v} = -k x"}</BlockMath>
                            </div>
                        )
                    },
                    {
                        title: "Damping (Friction)",
                        color: "amber",
                        content: (
                            <div className="text-sm text-zinc-300">
                                <p>
                                    In the real world, friction (<InlineMath>{"\\delta"}</InlineMath>) steals energy.
                                </p>
                                <BlockMath>{"\\dot{v} = -x - \\delta v"}</BlockMath>
                                <p>
                                    This causes the perfect circles to spiral inwards. The system loses energy until it stops at the center (<InlineMath>0,0</InlineMath>).
                                </p>
                            </div>
                        )
                    }
                ]
            };

        case 'logistic':
            return {
                title: "Logistic Growth",
                subtitle: "Resource Limits",
                sections: [
                    {
                        title: "Carrying Capacity",
                        color: "rose",
                        content: (
                            <div className="space-y-2 text-sm text-zinc-300">
                                <p>
                                    Nothing grows forever. Resources (food, space) run out.
                                </p>
                                <BlockMath>{"\\dot{x} = r x (1 - \\frac{x}{K})"}</BlockMath>
                                <p>
                                    When <InlineMath>x</InlineMath> is small, it grows like an exponential. When it hits <InlineMath>K</InlineMath> (Capacity), <InlineMath>(1 - x/K)</InlineMath> becomes zero, so growth stops.
                                </p>
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
                        title: "What am I looking at?",
                        color: "blue",
                        content: (
                            <div className="text-sm text-zinc-300">
                                <p>
                                    This isn&apos;t a graph of <InlineMath>x</InlineMath> vs time. It&apos;s a map where every point is a <strong>possible state</strong> of the system.
                                </p>
                                <p className="mt-2">
                                    The arrows form a <strong>Vector Field</strong>. They tell you: &quot;If you are here, this is where you go next.&quot;
                                </p>
                            </div>
                        )
                    },
                    {
                        title: "The Nullclines (Skeleton)",
                        color: "orange",
                        content: (
                            <div className="space-y-2 text-sm text-zinc-300">
                                <div className="p-2 border border-emerald-500/30 rounded bg-emerald-500/10">
                                    <strong className="text-emerald-400">Green Line (<InlineMath>dx/dt=0</InlineMath>)</strong>
                                    <p>Horizontal flow only. <InlineMath>x</InlineMath> stops changing here.</p>
                                </div>
                                <div className="p-2 border border-amber-500/30 rounded bg-amber-500/10">
                                    <strong className="text-amber-400">Orange Line (<InlineMath>dy/dt=0</InlineMath>)</strong>
                                    <p>Vertical flow only. <InlineMath>y</InlineMath> stops changing here.</p>
                                </div>
                            </div>
                        )
                    }
                ]
            };
    }
};
