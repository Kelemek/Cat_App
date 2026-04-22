"use client";

type Props = {
  defaultValue: string;
};

export function DiaryDatePicker({ defaultValue }: Props) {
  return (
    <div className="space-y-2">
      <label
        className="text-sm font-medium text-foreground"
        htmlFor="diary-date"
      >
        Date
      </label>
      <input
        id="diary-date"
        name="date"
        type="date"
        defaultValue={defaultValue}
        className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35"
        onChange={(e) => {
          const v = e.target.value;
          if (v) {
            window.location.href = `/diary?date=${encodeURIComponent(v)}`;
          }
        }}
      />
    </div>
  );
}
