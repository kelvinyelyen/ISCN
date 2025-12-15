import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

type Mode = 'math' | 'neuro';

export const getLinearContent = (mode: Mode) => {
    switch (mode) {
        case 'neuro': // Neuroscience Context
            return {
                title: "Synaptic Integration",
                subtitle: "The Dendritic Tree",
                sections: [
                    {
                        title: "Spatial Summation",
                        color: "emerald",
                        content: (
                            <div className="space-y-2 text-sm text-zinc-300">
                                <p>
                                    Thousands of synapses fire onto a single neuron. The cell body (Soma) adds them all up.
                                </p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                    <li><strong className="text-blue-400">Firing Rate ($x_i$):</strong> How fast the input neuron is spiking.</li>
                                    <li><strong className="text-amber-400">Synaptic Weight ($w_i$):</strong> How strong the connection is.</li>
                                </ul>
                                <BlockMath>{"I_{soma} = \\sum w_i \\cdot x_i"}</BlockMath>
                            </div>
                        )
                    },
                    {
                        title: "Inhibition",
                        color: "rose",
                        content: (
                            <div className="text-sm text-zinc-300">
                                <p>
                                    <strong>GABAergic neurons</strong> have negative weights. They suppress activity and prevent seizures.
                                </p>
                            </div>
                        )
                    }
                ]
            };

        default: // 'math' - The Synaptic Mixer
            return {
                title: "The Synaptic Mixer",
                subtitle: "The Dot Product",
                sections: [
                    {
                        title: "Mixing Inputs",
                        color: "emerald",
                        content: (
                            <div className="space-y-2 text-sm text-zinc-300">
                                <p>
                                    A single neuron acts like a DJ's mixing board.
                                </p>
                                <ul className="list-disc list-inside ml-2 space-y-1">
                                    <li><strong className="text-blue-400">Inputs ($x_i$):</strong> The signals coming in (Channels).</li>
                                    <li><strong className="text-amber-400">Weights ($w_i$):</strong> The volume faders.</li>
                                </ul>
                                <BlockMath>{"y = \\vec{w} \\cdot \\vec{x} = \\sum w_i x_i"}</BlockMath>
                            </div>
                        )
                    },
                    {
                        title: "Negative Weights?",
                        color: "rose",
                        content: (
                            <div className="text-sm text-zinc-300">
                                <p>
                                    In math, "Phase Inversion". In audio, this cancels out sound. In the brain, this is called <strong>Inhibition</strong>.
                                </p>
                            </div>
                        )
                    }
                ]
            };
    }
};
