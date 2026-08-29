"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@web-portfolio/icons";
import type { ComparisonTable as ComparisonTableData } from "@/sanity.types";
import { useDisclosure } from "@/hooks/use-disclousre";
import "./comparison-table.css";

export interface ComparisonTableProps {
  table: ComparisonTableData;
}

type Row = NonNullable<ComparisonTableData["rows"]>[number];
type DataRow = Extract<Row, { _type: "tableDataRow" }>;
type ColumnData = NonNullable<ComparisonTableData["columns"]>[number];

interface Category {
  key: string;
  label?: string;
  rows: DataRow[];
}

// Apple systemGreen / systemRed (the latter matches --color-error). Passed
// via <Icon>'s own `color` prop rather than a CSS class — the component
// forces both the SVG fill attribute and an inline style.color from that
// prop internally, which would silently out-rank any external stylesheet
// rule targeting the icon by class or currentColor.
const VERDICT_GOOD_COLOR = "#34c759";
const VERDICT_BAD_COLOR = "#ff383c";

/** Colors the two verdict icons actually used by the seeded content
 * (registry keys "check" / "close") green/red — any other icon (e.g.
 * "remove" for a partial/trade-off verdict) keeps the neutral ink color. */
function verdictIconColor(icon?: string | null) {
  if (icon === "check") return VERDICT_GOOD_COLOR;
  if (icon === "close") return VERDICT_BAD_COLOR;
  return undefined;
}

/** Splits the flat rows array on each tableGroupRow into one category per
 * group, each rendered as its own table instead of a divider row inside
 * one continuous table — apple.com/mac/compare groups specs the same way
 * (Chip, Display, Battery, … each their own section). Any data rows before
 * the first group become an unlabeled leading category. */
function splitIntoCategories(rows: Row[]): Category[] {
  const categories: Category[] = [];
  let current: Category = { key: "leading", rows: [] };

  for (const row of rows) {
    if (row._type === "tableGroupRow") {
      if (current.rows.length > 0) categories.push(current);
      current = { key: row._key, label: row.label, rows: [] };
    } else {
      current.rows.push(row);
    }
  }
  if (current.rows.length > 0) categories.push(current);

  return categories;
}

/** Reverses column order (and each row's cells to match, since cells are
 * matched to columns positionally, not by a shared key) — puts the
 * highlighted "ours" column(s) first instead of last. */
function reverseColumns(columns: ColumnData[], categories: Category[]) {
  return {
    columns: [...columns].reverse(),
    categories: categories.map((category) => ({
      ...category,
      rows: category.rows.map((row) => ({
        ...row,
        cells: row.cells ? [...row.cells].reverse() : row.cells,
      })),
    })),
  };
}

// Must stay in sync with comparison-table.css's .comparison-table-row-label
// / .comparison-table-col min-widths — used to compute how far left: to
// pin each frozen column, since sticky offsets can't be derived from CSS
// alone without a runtime layout measurement.
const ROW_LABEL_WIDTH = 120;
const COL_WIDTH = 140;

/** The highlighted column(s) are frozen in place while the rest scroll —
 * only a *leading* run of highlighted columns freezes (mirrors a
 * spreadsheet's "freeze first N columns"); a highlighted column after a
 * non-highlighted one wouldn't have a contiguous frozen strip to sit in. */
function computeStickyLefts(columns: ColumnData[]): (number | undefined)[] {
  let cursor = ROW_LABEL_WIDTH;
  let leading = true;
  return columns.map((col) => {
    if (!leading || !col.highlight) {
      leading = false;
      return undefined;
    }
    const left = cursor;
    cursor += COL_WIDTH;
    return left;
  });
}

/** The category tables themselves — shared between the inline (compact)
 * view and the expanded modal, so the two never drift out of sync. */
function CategoryTables({ columns, categories }: { columns: ColumnData[]; categories: Category[] }) {
  const stickyLefts = computeStickyLefts(columns);

  return (
    <>
      {categories.map((category) => (
        <section key={category.key} className="comparison-table-category">
          {category.label && <h3 className="comparison-table-category-label">{category.label}</h3>}
          <div className="comparison-table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col" className="comparison-table-row-label" />
                  {columns.map((col, i) => {
                    const stickyLeft = stickyLefts[i];
                    const classNames = ["comparison-table-col"];
                    if (col.highlight) classNames.push("comparison-table-col--highlight");
                    if (stickyLeft !== undefined) classNames.push("comparison-table-col--sticky");
                    return (
                      <th
                        key={col._key}
                        scope="col"
                        className={classNames.join(" ")}
                        style={stickyLeft !== undefined ? { left: stickyLeft } : undefined}
                      >
                        <div className="comparison-table-col-name">{col.name}</div>
                        {col.descriptor && (
                          <div className="comparison-table-col-descriptor">{col.descriptor}</div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {category.rows.map((row) => (
                  <tr key={row._key}>
                    <th scope="row" className="comparison-table-row-label">
                      {row.label}
                    </th>
                    {(row.cells ?? []).map((cell, i) => {
                      const stickyLeft = stickyLefts[i];
                      return (
                        <td
                          key={cell._key}
                          className={stickyLeft !== undefined ? "comparison-table-col--sticky" : undefined}
                          style={stickyLeft !== undefined ? { left: stickyLeft } : undefined}
                        >
                          <div className="comparison-table-cell">
                            {cell.icon && (
                              <Icon name={cell.icon} size={28} color={verdictIconColor(cell.icon)} />
                            )}
                            {cell.note && <span className="comparison-table-note">{cell.note}</span>}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </>
  );
}

/** Fullscreen glyph — not in the bundled @web-portfolio/icons registry
 * (checked: no "fullscreen"/"expand"/"zoom" key exists in it), so this is
 * a small hand-authored stand-in in the same stroke-icon style. */
function ExpandIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

function ComparisonTableModal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="comparison-table-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="comparison-table-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Comparison table, expanded"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="comparison-table-modal-close"
          onClick={onClose}
          aria-label="Close expanded comparison table"
        >
          <Icon name="close" size={18} />
        </button>
        <div className="comparison-table-modal-body">{children}</div>
      </div>
    </div>
  );
}

export function ComparisonTable({ table }: ComparisonTableProps) {
  const { columns, categories } = reverseColumns(table.columns ?? [], splitIntoCategories(table.rows ?? []));
  const { isOpen, open, close } = useDisclosure();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    // Breaks out of the article's ~692px reading column so wider viewports
    // give the table more room (fewer columns need to scroll) instead of
    // always scrolling at the same narrow width — .comparison-table-inner
    // re-applies a capped, centered, gutter-padded box inside the
    // now-viewport-wide outer element. See comparison-table.css.
    <div className="comparison-table">
      <div className="comparison-table-inner">
        <div className="comparison-table-toolbar">
          {table.caption && <p className="comparison-table-caption">{table.caption}</p>}
          <button
            type="button"
            className="comparison-table-expand"
            onClick={open}
            aria-label="Expand comparison table"
          >
            <ExpandIcon />
            <span>Expand</span>
          </button>
        </div>

        <CategoryTables columns={columns} categories={categories} />

        {table.footnote && <p className="comparison-table-footnote">{table.footnote}</p>}
      </div>

      {mounted && isOpen
        ? createPortal(
            <ComparisonTableModal onClose={close}>
              {table.caption && <p className="comparison-table-caption">{table.caption}</p>}
              <CategoryTables columns={columns} categories={categories} />
              {table.footnote && <p className="comparison-table-footnote">{table.footnote}</p>}
            </ComparisonTableModal>,
            document.body,
          )
        : null}
    </div>
  );
}

export default ComparisonTable;
