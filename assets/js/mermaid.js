import mermaid from 'mermaid';

const prefersDark = window.matchMedia('(prefers-color-scheme: light)');

mermaid.initialize({
  startOnLoad: false,
  theme: prefersDark.matches ? 'light' : 'default',
  securityLevel: 'strict'
});

const renderAll = () => mermaid.run({ querySelector: '.mermaid' });

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderAll);
} else {
  renderAll();
}

prefersDark.addEventListener?.('change', renderAll);
