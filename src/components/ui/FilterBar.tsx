import { ReactNode, useState } from 'react';
import { Calendar, Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Badge } from './Badge';
import { Button } from './Button';
import { Dropdown, DropdownOption } from './Dropdown';

export interface FilterPillSpec {
  key?: string;
  label: string;
  value: string;
  options?: DropdownOption[];
  icon?: ReactNode;
  onChange?: (next: string) => void;
}

// Auto-generates "All / Single value" options from a static pill label/value
// so existing static FilterBar usages become click-to-cycle dropdowns
// without each page having to construct option lists.
function inferOptions(p: FilterPillSpec): DropdownOption[] {
  if (p.options && p.options.length > 0) return p.options;
  return [
    { value: p.value, label: p.value },
    { value: '__all__', label: `All ${p.label.toLowerCase()}s` },
  ];
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearch?: (q: string) => void;
  pills?: FilterPillSpec[];
  dateRangeOptions?: DropdownOption[];
  dateRangeValue?: string;
  onDateRangeChange?: (v: string) => void;
  activeCount?: number;
  right?: ReactNode;
  onMoreFilters?: () => void;
  className?: string;
}

const DEFAULT_DATE_RANGES: DropdownOption[] = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'qtd', label: 'Quarter to date' },
  { value: 'ytd', label: 'Year to date' },
];

export function FilterBar({
  searchPlaceholder = 'Search shipments, containers, customers...',
  searchValue,
  onSearch,
  pills = [],
  dateRangeOptions = DEFAULT_DATE_RANGES,
  dateRangeValue: dateProp,
  onDateRangeChange,
  activeCount,
  right,
  onMoreFilters,
  className,
}: FilterBarProps) {
  const [internalSearch, setInternalSearch] = useState('');
  const [internalDate, setInternalDate] = useState('30d');
  const search = searchValue ?? internalSearch;
  const dateRange = dateProp ?? internalDate;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 rounded-2xl border border-hairline/[0.08] bg-ink-900/70 p-2 backdrop-blur',
        className,
      )}
    >
      <div className="relative flex-1 min-w-[240px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          value={search}
          onChange={(e) => {
            const v = e.target.value;
            setInternalSearch(v);
            onSearch?.(v);
          }}
          placeholder={searchPlaceholder}
          className="w-full h-9 rounded-lg border border-hairline/[0.08] bg-ink-950/60 pl-9 pr-9 text-sm text-ink-100 placeholder-ink-400 focus-ring"
        />
        {search && (
          <button
            onClick={() => {
              setInternalSearch('');
              onSearch?.('');
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-100"
            aria-label="Clear"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <Dropdown
        label="Date"
        icon={<Calendar className="h-3.5 w-3.5" />}
        value={dateRange}
        options={dateRangeOptions}
        onChange={(v) => {
          setInternalDate(v);
          onDateRangeChange?.(v);
        }}
      />
      {pills.map((p) => (
        <ControlledPill key={p.key ?? p.label} pill={p} />
      ))}
      <Button
        variant="subtle"
        size="md"
        icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
        onClick={onMoreFilters}
      >
        More filters
        {activeCount ? (
          <Badge tone="brand" className="ml-1">
            {activeCount}
          </Badge>
        ) : null}
      </Button>
      <div className="ml-auto flex items-center gap-2">{right}</div>
    </div>
  );
}

export function FilterPill({
  label,
  value,
  icon,
  className,
  onClick,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group inline-flex items-center gap-2 rounded-lg border border-hairline/[0.08] bg-ink-900 px-3 h-9 text-xs transition-colors hover:bg-ink-850 focus-ring',
        className,
      )}
    >
      {icon && <span className="text-ink-400">{icon}</span>}
      <span className="text-ink-400">{label}:</span>
      <span className="font-medium text-ink-100">{value}</span>
    </button>
  );
}

// Internal: handles its own state when a static pill is passed without onChange,
// so users can still click and pick a different value (visual-only).
function ControlledPill({ pill }: { pill: FilterPillSpec }) {
  const opts = inferOptions(pill);
  const [internal, setInternal] = useState(pill.value);
  const value = pill.onChange ? pill.value : internal;
  const handle = (v: string) => {
    if (pill.onChange) pill.onChange(v);
    else setInternal(v);
  };
  return (
    <Dropdown
      label={pill.label}
      icon={pill.icon}
      value={value}
      options={opts}
      onChange={handle}
    />
  );
}

export function FilterChips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Filter className="h-3.5 w-3.5 text-ink-400" />
      {items.map((i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 rounded-full border border-hairline/[0.12] bg-overlay-1/5 px-2 py-0.5 text-[11px] text-ink-200"
        >
          {i}
        </span>
      ))}
    </div>
  );
}
