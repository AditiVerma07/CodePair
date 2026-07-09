import React from 'react';

export default function OutputPanel({ isRunning, outputData, onRunCode }) {
  return (
    <div className="w-full h-56 bg-zinc-950 border-t border-zinc-800 flex flex-col font-mono shadow-inner">
      {/* Control Status Header Ribbon */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <span>Console Execution Output</span>
        </div>

        {/* The Action Button */}
        <button
          onClick={onRunCode}
          disabled={isRunning}
          className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-500 text-xs font-bold font-mono rounded-lg transition-all shadow-md active:scale-95 cursor-pointer disabled:cursor-not-allowed"
        >
          {isRunning ? 'Compiling...' : 'Run Script'}
        </button>
      </div>

      {/* Output Console Readout Block */}
      <div className="flex-1 p-4 overflow-y-auto text-sm leading-6 selection:bg-emerald-500/20">
        {/* Render Error stream if any exist */}
        {outputData?.stderr && (
          <pre className="text-rose-400 whitespace-pre-wrap font-mono antialiased bg-rose-950/20 p-3 rounded-lg border border-rose-900/30">
            {outputData.stderr}
          </pre>
        )}

        {/* Render standard compilation success output */}
        {outputData?.stdout && !outputData?.stderr && (
          <pre className="text-zinc-200 whitespace-pre-wrap font-mono antialiased">
            {outputData.stdout}
          </pre>
        )}

        {/* Standard Neutral State */}
        {!isRunning && !outputData?.stdout && !outputData?.stderr && (
          <div className="text-zinc-600 text-xs italic flex items-center justify-center h-full">
            Press "Run Script" to compile your solution...
          </div>
        )}
      </div>
    </div>
  );
}
