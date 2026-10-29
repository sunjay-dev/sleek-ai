import { useMemo, memo, useEffect } from "react";
import { Renderer } from "@openuidev/react-lang";
import { openuiChatLibrary } from "@openuidev/react-ui";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  code: string;
  isStreaming?: boolean;
  onAction?: (action: unknown) => void;
};

/**
 * Normalizes common LLM slips into standard OpenUI-Lang AST structure:
 * - Card("Title", "Subtitle", [children]) -> CardHeader + Card([children])
 * - Table(headers, rows) -> Table([Col, Col])
 * - Callout(desc, variant) -> Callout(variant, title, desc)
 */
function normalizeOpenUICode(raw: string): string {
  if (!raw) return "";

  const lines = raw.trim().split("\n");
  const output: string[] = [];
  let headerIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match any: varName = Card("Title", "Subtitle"?, [children])
    const cardMatch = line.match(/^(\w+)\s*=\s*Card\s*\(\s*"([^"]+)"\s*(?:,\s*"([^"]*)")?\s*,\s*\[([\s\S]*?)\]\s*\)/);
    if (cardMatch) {
      const varName = cardMatch[1];
      const title = cardMatch[2];
      const subtitle = cardMatch[3];
      const children = cardMatch[4].trim();

      headerIndex++;
      const hVar = `_hdr_${varName}_${headerIndex}`;
      const hDef = subtitle ? `${hVar} = CardHeader("${title}", "${subtitle}")` : `${hVar} = CardHeader("${title}")`;
      output.push(hDef);

      const newChildren = children ? `[${hVar}, ${children}]` : `[${hVar}]`;
      output.push(`${varName} = Card(${newChildren})`);
      continue;
    }

    // Match: varName = Callout("description", "variant")
    const calloutMatch = line.match(/^(\w+)\s*=\s*Callout\s*\(\s*"([^"]+)"\s*,\s*"(\w+)"\s*\)/);
    if (calloutMatch) {
      const varName = calloutMatch[1];
      const desc = calloutMatch[2];
      const variant = calloutMatch[3];
      output.push(`${varName} = Callout("${variant}", "Note", "${desc}")`);
      continue;
    }

    output.push(line);
  }

  let codeStr = output.join("\n");

  // Match: varName = Table([headers], [rows]) and convert to Col-based Table
  const tableRegex = /(\w+)\s*=\s*Table\s*\(\s*\[([^\]]+)\]\s*,\s*\[([\s\S]*?)\]\s*\)/g;
  codeStr = codeStr.replace(tableRegex, (match, varName, headersStr, rowsStr) => {
    try {
      const headers = JSON.parse(`[${headersStr}]`) as string[];
      const rows = JSON.parse(`[${rowsStr}]`) as (string | number)[][];
      const cols = headers.map((h, colIdx) => {
        const colVar = `_col_${varName}_${colIdx}`;
        const data = rows.map((r) => r[colIdx] ?? "");
        return { varName: colVar, def: `${colVar} = Col("${h}", ${JSON.stringify(data)})` };
      });
      const defs = cols.map((c) => c.def).join("\n");
      const colVars = cols.map((c) => c.varName).join(", ");
      return `${defs}\n${varName} = Table([${colVars}])`;
    } catch {
      return match;
    }
  });

  return codeStr;
}

export const OpenUIBlock = memo(function OpenUIBlock({ code, isStreaming, onAction }: Props) {
  const cleanCode = useMemo(() => normalizeOpenUICode(code), [code]);

  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const openuiTheme = isDark ? "dark" : "light";

  useEffect(() => {
    if (typeof document === "undefined") return;
    const isDarkMode = document.documentElement.classList.contains("dark");
    document.documentElement.setAttribute("data-openui-theme", isDarkMode ? "dark" : "light");
  }, []);

  return (
    <div className="my-3 w-full">
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div className="p-3 text-xs rounded-lg border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400">
            <span className="font-semibold">Unable to display component: </span>
            <span>{(error as Error)?.message || "Invalid syntax"}</span>
          </div>
        )}
        resetKeys={[cleanCode]}
      >
        <div className="openui-container w-full overflow-x-auto min-h-[3rem]" data-openui-theme={openuiTheme}>
          <Renderer response={cleanCode} library={openuiChatLibrary} isStreaming={isStreaming} onAction={onAction} />
        </div>
      </ErrorBoundary>
    </div>
  );
});

export default OpenUIBlock;
