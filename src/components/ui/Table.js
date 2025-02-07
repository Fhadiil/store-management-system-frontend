// src/components/ui/table.jsx
import * as React from "react";

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <table ref={ref} className="w-full caption-bottom text-sm" {...props} />
));
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className="[&_tr]:border-b" {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className="[&_tr:last-child]:border-0" {...props} />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100"
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className="h-10 px-2 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
    {...props}
  />
));
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
