import { useCurrency } from "../context/CurrencyContext.jsx";

function formatDate(value) {
  if (!value) return "";
  const d =
    typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function TransactionItem({
  name,
  category,
  amount,
  date,
  note,
  type = "expense",
  onDelete,
}) {
  const { formatCurrency } = useCurrency();
  const isIncome = type === "income";
  const amountColor = isIncome ? "text-emerald-600" : "text-rose-600";
  const sign = isIncome ? "+" : "-";

  return (
    <li className="flex items-center justify-between gap-4 rounded-xl bg-white/6 px-4 py-3 ring-1 ring-white/10 transition hover:bg-white/10">
      <div className="min-w-0">
        <p className="truncate font-bold text-slate-100">{name}</p>
        <p className="mt-0.5 text-sm font-medium text-slate-400">
          {category}
          {date ? ` · ${formatDate(date)}` : ""}
          {note ? ` · ${note}` : ""}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <p
          className={`font-bold ${isIncome ? "text-emerald-400" : "text-rose-400"}`}
        >
          {sign}
          {formatCurrency(amount).replace("-", "")}
        </p>
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="button-secondary rounded-lg px-3 py-1.5 text-xs font-bold"
          >
            Delete
          </button>
        ) : null}
      </div>
    </li>
  );
}
