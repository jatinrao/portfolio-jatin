import { Icon } from "@web-portfolio/icons";
import type { ComparisonTable as ComparisonTableData } from "@/sanity.types";
import "./comparison-table.css";

export interface ComparisonTableProps {
  table: ComparisonTableData;
}

type Row = NonNullable<ComparisonTableData["rows"]>[number];
type DataRow = Extract<Row, { _type: "tableDataRow" }>;

interface Category {
  key: string;
  label?: string;
  rows: DataRow[];
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

export function ComparisonTable({ table }: ComparisonTableProps) {
  const columns = table.columns ?? [];
  const categories = splitIntoCategories(table.rows ?? []);

  return (
    <div className="comparison-table">
      {table.caption && <p className="comparison-table-caption">{table.caption}</p>}

      {categories.map((category) => (
        <section key={category.key} className="comparison-table-category">
          {category.label && <h3 className="comparison-table-category-label">{category.label}</h3>}
          <div className="comparison-table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col" className="comparison-table-row-label" />
                  {columns.map((col) => (
                    <th
                      key={col._key}
                      scope="col"
                      className={col.highlight ? "comparison-table-col comparison-table-col--highlight" : "comparison-table-col"}
                    >
                      <div className="comparison-table-col-name">{col.name}</div>
                      {col.descriptor && (
                        <div className="comparison-table-col-descriptor">{col.descriptor}</div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {category.rows.map((row) => (
                  <tr key={row._key}>
                    <th scope="row" className="comparison-table-row-label">
                      {row.label}
                    </th>
                    {(row.cells ?? []).map((cell) => (
                      <td key={cell._key}>
                        <div className="comparison-table-cell">
                          {cell.icon && <Icon name={cell.icon} size={28} />}
                          {cell.note && <span className="comparison-table-note">{cell.note}</span>}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {table.footnote && <p className="comparison-table-footnote">{table.footnote}</p>}
    </div>
  );
}

export default ComparisonTable;
