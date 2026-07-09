import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, onChange, language }) {
  const editorRef = useRef(null);

  // Handle editor focus mounting actions safely
  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  return (
    <div className="w-full h-full flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Upper Panel Ribbon Bar (Nordic Twilight Style) */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <span className="ml-2 text-xs font-mono text-zinc-400 tracking-wider uppercase">
            Workspace // <span className="text-emerald-400">{language}</span>
          </span>
        </div>
      </div>

      {/* Embedded Core Monaco Component */}
      <div className="flex-1 w-full bg-zinc-950">
        <Editor
          height="100%"
          width="100%"
          language={language}
          value={code}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          onChange={onChange}
          options={{
            fontSize: 14,
            fontFamily: 'Fira Code, JetBrains Mono, monospace',
            minimap: { enabled: false },
            wordWrap: 'on',
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            lineHeight: 22
          }}
        />
      </div>
    </div>
  );
}
