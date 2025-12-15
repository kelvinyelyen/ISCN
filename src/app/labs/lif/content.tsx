import React from 'react';

export const lifContent = {
    title: "I.S.C.N. Concept Map",
    subtitle: "Interactive Reference Guide",
    sections: [
        {
            title: "0. The Big Picture",
            color: "emerald",
            content: (
                <div className="p-4 bg-zinc-900/40 rounded-lg border border-zinc-800/50 text-sm leading-relaxed text-zinc-300 shadow-inner">
                    <p>
                        We are simulating a single <strong>Neuron</strong> (brain cell). Think of it like a tiny biological battery that charges up and then &quot;fires&quot; a signal.
                    </p>
                    <p className="mt-3 text-zinc-400">
                        Everything you see in the dashboard is calculating three things:
                        <br />
                        1. How it charges (Input)
                        <br />
                        2. How it leaks energy (Rest)
                        <br />
                        3. When it reaches the limit and zaps (Spike on the chart).
                    </p>
                </div>
            )
        },
        {
            title: "1. The 'Leaky Bucket' Analogy",
            color: "blue",
            content: (
                <div className="p-4 bg-zinc-900/40 rounded-lg border border-zinc-800/50 text-sm leading-relaxed text-zinc-300 shadow-inner">
                    <p className="mb-3">
                        Imagine a bucket with a hole in the bottom:
                    </p>
                    <ul className="space-y-2 ml-1">
                        <li className="flex items-start gap-2">
                            <div className="mt-1.5 w-1 h-1 bg-emerald-500 rounded-full shrink-0" />
                            <span><strong className="text-emerald-400">Water Hose (Input):</strong> Pours water IN. This is the stimulation from the sliders.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="mt-1.5 w-1 h-1 bg-cyan-500 rounded-full shrink-0" />
                            <span><strong className="text-cyan-400">The Hole (Leak):</strong> Lets water OUT. It constantly tries to empty the bucket to a resting level.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="mt-1.5 w-1 h-1 bg-white rounded-full shrink-0" />
                            <span><strong className="text-zinc-100">Water Level (Voltage):</strong> The height of the water (or line on the chart).</span>
                        </li>
                    </ul>
                    <p className="mt-3 text-zinc-400 italic border-l-2 border-zinc-800 pl-3">
                        If you pour water fast enough, the bucket overflows. In a neuron, this overflow is a <strong>Spike</strong>!
                    </p>
                </div>
            )
        },
        {
            title: "2. Key Terms",
            color: "amber",
            content: (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded hover:border-zinc-700 transition-colors">
                        <strong className="text-zinc-200 text-xs uppercase block mb-1">Membrane Potential (V)</strong>
                        <p className="text-xs text-zinc-400">The &quot;Charge&quot; of the cell. Measured in millivolts (mV). Watch the Green Line.</p>
                    </div>
                    <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded hover:border-zinc-700 transition-colors">
                        <strong className="text-zinc-200 text-xs uppercase block mb-1">Resting Potential (E_L)</strong>
                        <p className="text-xs text-zinc-400">The cell&apos;s &quot;Comfort Zone&quot;. Where it sits when idle (usually -70mV).</p>
                    </div>
                    <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded hover:border-zinc-700 transition-colors">
                        <strong className="text-zinc-200 text-xs uppercase block mb-1">Threshold</strong>
                        <p className="text-xs text-zinc-400">The &quot;Limit&quot;. If Voltage crosses this red line, the cell fires!</p>
                    </div>
                    <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded hover:border-zinc-700 transition-colors">
                        <strong className="text-zinc-200 text-xs uppercase block mb-1">Tau (τ)</strong>
                        <p className="text-xs text-zinc-400">&quot;Sluggishness&quot;. High Tau = Heavy bucket (changes slowly). Low Tau = Light bucket.</p>
                    </div>
                </div>
            )
        },
        {
            title: "3. The Circuit (Advanced)",
            color: "indigo",
            content: (
                <div className="p-4 bg-zinc-900/40 rounded-lg border border-zinc-800/50 text-sm leading-relaxed text-zinc-300 shadow-inner">
                    <p>
                        For the engineers: We model this as an RC Circuit.
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                        <li><strong className="text-zinc-300">Capacitor (C):</strong> The membrane itself. It holds the charge (Voltage).</li>
                        <li><strong className="text-zinc-300">Resistor (R):</strong> The ion channels. A high resistance means channels are closed (hard to leak). Low resistance means they are open.</li>
                        <li><strong className="text-zinc-300">Battery (E_L):</strong> The stable Resting Potential defined by the ion gradient.</li>
                    </ul>
                </div>
            )
        },
        {
            title: "4. The Equation (Math)",
            color: "indigo",
            content: (
                <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800/50 text-sm leading-relaxed text-zinc-400">
                    <p className="font-mono bg-black/50 p-2 rounded text-center text-zinc-200 mb-2">
                        τ · (dV / dt) = -(V - E_L) + R · I
                    </p>
                    <p>
                        Think of this as a <strong>Tug of War</strong>:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                        <li><strong className="text-emerald-400">Drive (R · I):</strong> The input current pushing voltage UP.</li>
                        <li><strong className="text-rose-400">Leak -(V - E_L):</strong> The restorative force pulling voltage DOWN towards rest.</li>
                        <li><strong className="text-zinc-300">Tau (τ):</strong> The &quot;Time Constant&quot;. It&apos;s the inertia of the system. Larger τ means voltage changes slower.</li>
                    </ul>
                </div>
            )
        },
        {
            title: "5. The Code (Simulation)",
            color: "amber",
            content: (
                <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800/50 text-sm leading-relaxed text-zinc-400">
                    <p>
                        Computers can&apos;t do &quot;continuous&quot; math perfectly, so we use the <strong>Forward Euler</strong> method.
                    </p>
                    <p className="mt-2">
                        We chop time into tiny steps (dt). At every single frame, we:
                    </p>
                    <ol className="list-decimal list-inside mt-2 space-y-1 ml-2">
                        <li>Calculate the Net Force (Leak + Drive).</li>
                        <li>Determine how much Voltage changes (dV) over that tiny time step.</li>
                        <li>Add that change to the current Voltage.</li>
                        <li>Repeat!</li>
                    </ol>
                </div>
            )
        }
    ]
};
