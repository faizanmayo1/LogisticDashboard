import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface Column<T> {
  key: string;
  header: ReactNode;
  width?: string;
  align?: 'left' | 'right' | 'center';
  render: (row: T) => ReactNode;
  sticky?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getKey: (row: T, i: number) => string;
  onRowClick?: (row: T) => void;
  compact?: boolean;
  empty?: ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  getKey,
  onRowClick,
  compact,
  empty,
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        'relative overflow-x-auto rounded-xl border border-hairline/[0.08]',
        className,
      )}
    >
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-[0.14em] text-ink-400">
            {columns.map((c) => (
              <th
                key={c.key}
                style={{ width: c.width }}
                className={cn(
                  'border-b border-hairline/[0.08] bg-ink-900/80 px-4 py-2.5 text-left font-semibold backdrop-blur',
                  c.align === 'right' && 'text-right',
                  c.align === 'center' && 'text-center',
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-ink-400">
                {empty ?? 'No data'}
              </td>
            </tr>
          )}
          {rows.map((row, i) => (
            <tr
              key={getKey(row, i)}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b border-hairline/[0.08] last:border-0 transition-colors',
                onRowClick && 'cursor-pointer hover:bg-overlay-1/[0.03]',
              )}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn(
                    compact ? 'px-4 py-2.5' : 'px-4 py-3.5',
                    c.align === 'right' && 'text-right',
                    c.align === 'center' && 'text-center',
                    'text-ink-200 align-middle',
                  )}
                >
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
