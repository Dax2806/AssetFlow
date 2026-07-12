@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@300;400;500;600&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

/* Custom styles for perfect pixel alignments and custom scrollbars */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #e4e4e7;
  border-radius: 9999px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #27272a;
}

::-webkit-scrollbar-thumb:hover {
  background: #d4d4d8;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #3f3f46;
}

body {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
