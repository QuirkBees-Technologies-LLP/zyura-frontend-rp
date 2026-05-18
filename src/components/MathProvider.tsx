import React, { createContext, useContext, useEffect, useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

// ============================================================================
// CONTEXT
// ============================================================================

interface MathContextValue {
  hasMath: (text: string) => boolean;
  renderMath: (text: string, displayMode?: boolean) => string;
}

const MathContext = createContext<MathContextValue | null>(null);

export function useMath(): MathContextValue {
  const context = useContext(MathContext);
  if (!context) {
    return {
      hasMath: (text) => !!text && text.includes("$"),
      renderMath: (text, displayMode = false) => processMath(text, displayMode),
    };
  }
  return context;
}

// ============================================================================
// DOM AUTO-RENDER (the magic part)
// ============================================================================

const PROCESSED_ATTR = "data-math-done";
const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "TEXTAREA", "INPUT", "CODE", "PRE", "SVG",
]);

function processNode(node: Node) {
  // Walk all text nodes inside this element
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
    acceptNode(textNode) {
      // Skip if parent is a tag we don't touch
      const parent = textNode.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      // Skip if already processed
      if (parent.hasAttribute(PROCESSED_ATTR)) return NodeFilter.FILTER_REJECT;
      // Only process if text contains $
      if (!textNode.textContent?.includes("$")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes: Text[] = [];
  let current: Node | null;
  while ((current = walker.nextNode())) {
    textNodes.push(current as Text);
  }

  for (const textNode of textNodes) {
    const parent = textNode.parentElement!;
    const raw = textNode.textContent || "";

    // Only replace if there's a valid $...$ pair
    if (!/\$[^$]+\$/.test(raw)) continue;

    try {
      const html = processMath(raw, false);
      // Wrap in a span, replace the text node
      const span = document.createElement("span");
      span.setAttribute(PROCESSED_ATTR, "true");
      span.innerHTML = html;
      parent.replaceChild(span, textNode);
    } catch {
      // Leave as-is if anything fails
    }
  }
}

function useDomMathObserver() {
  useEffect(() => {
    // Process whatever is already in the DOM
    processNode(document.body);

    // Watch for new content (React rendering new questions, etc.)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              processNode(node);
            }
          });
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);
}

// ============================================================================
// PROVIDER
// ============================================================================

interface MathProviderProps {
  children: React.ReactNode;
  debug?: boolean;
}

export function MathProvider({ children, debug = false }: MathProviderProps) {
  // Auto-process the whole DOM
  useDomMathObserver();

  const value = useMemo((): MathContextValue => ({
    hasMath: (text) => {
      if (!text || typeof text !== "string") return false;
      return text.includes("$");
    },
    renderMath: (text, displayMode = false) => {
      if (!text || typeof text !== "string") return "";
      if (!text.includes("$")) return text;
      return processMath(text, displayMode);
    },
  }), [debug]);

  return (
    <MathContext.Provider value={value}>
      {children}
    </MathContext.Provider>
  );
}

// ============================================================================
// MATH TEXT COMPONENT (optional, still available)
// ============================================================================

interface MathTextProps {
  text?: string;
  children?: React.ReactNode;
  displayMode?: boolean;
  className?: string;
}

export function MathText({ text, children, displayMode = false, className = "" }: MathTextProps) {
  const content = text || (typeof children === "string" ? children : "");
  if (!content) return null;
  if (!content.includes("$")) return <span className={className}>{content}</span>;

  try {
    const html = processMath(content, displayMode);
    return (
      <span
        className={`math-text ${displayMode ? "math-display" : ""} ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <span className={className}>{content}</span>;
  }
}

// ============================================================================
// CORE PROCESSOR
// ============================================================================

function processMath(text: string, displayMode: boolean): string {
  if (!text) return "";

  return text.replace(/\$([^$]+)\$/g, (_, math) => {
    try {
      let processed = math;
      processed = processed.replace(/(\w)\^(\d+)/g, "$1^{$2}");
      processed = processed.replace(/(\w)_(\d+)/g, "$1_{$2}");
      processed = processed.replace(/(\w)\^(\d+)(\w)/g, "$1^{$2}$3");
      processed = processed.replace(/(\d+)%/g, "$1\\%");

      return katex.renderToString(processed, {
        throwOnError: false,
        displayMode,
      });
    } catch {
      return math;
    }
  });
}

export default MathProvider

