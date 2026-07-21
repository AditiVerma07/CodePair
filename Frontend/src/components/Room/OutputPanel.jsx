import React, { useState,useEffect } from 'react';

export default function OutputPanel({ isRunning, outputData, onRunCode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  //auto-expand the console output panel when new output arrives or when code is running
  useEffect(() => {
    if (isRunning || outputData?.stdout || outputData?.stderr) {
      setIsExpanded(true);
    }
  }, [isRunning, outputData]);
  
  return (
    <div className={`w-full ${isExpanded ? 'h-56' : 'h-12'} bg-zinc-950 border-t border-zinc-800 flex flex-col font-mono shadow-inner transition-all duration-200`}>
      {/* Control Status Header Ribbon */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          <span>Console Execution Output</span>
        </button>

        <button
          onClick={onRunCode}
          disabled={isRunning}
          className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-500 text-xs font-bold font-mono rounded-lg transition-all shadow-md active:scale-95 cursor-pointer disabled:cursor-not-allowed"
        >
          {isRunning ? 'Compiling...' : 'Run Script'}
        </button>
      </div>

      {/* Output Console Readout Block */}
      {isExpanded && (
        <div className="flex-1 p-4 overflow-y-auto text-sm leading-6 selection:bg-emerald-500/20">
          {outputData?.stderr && (
            <pre className="text-rose-400 whitespace-pre-wrap font-mono antialiased bg-rose-950/20 p-3 rounded-lg border border-rose-900/30">
              {outputData.stderr}
            </pre>
          )}
          {outputData?.stdout && !outputData?.stderr && (
            <pre className="text-zinc-200 whitespace-pre-wrap font-mono antialiased">
              {outputData.stdout}
            </pre>
          )}
          {!isRunning && !outputData?.stdout && !outputData?.stderr && (
            <div className="text-zinc-600 text-xs italic flex items-center justify-center h-full">
              Press "Run Script" to compile your solution...
            </div>
          )}
        </div>
      )}
    </div>
  );
}