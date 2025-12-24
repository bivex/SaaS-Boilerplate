/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-18T21:10:35
 * Last Updated: 2025-12-24T02:04:09
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import * as React from 'react';

import { cn } from '@/utils/Helpers';

/**
 * Table component for displaying tabular data.
 * This is a UI component library primitive - always use with TableHeader/TableHead
 * for proper accessibility when displaying data. Tables must have headers for screen readers.
 * For layout tables (non-data tables), set layout={true}. The table will not have explicit ARIA roles.
 * See DataTable component for example usage.
 *
 * @example
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Column 1</TableHead>
 *       <TableHead>Column 2</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>Data 1</TableCell>
 *       <TableCell>Data 2</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 */
const Table = ({
  ref,
  className,
  layout: _layout = false,
  ...props
}: React.HTMLAttributes<HTMLTableElement> & {
  ref?: React.RefObject<HTMLTableElement | null>;
  layout?: boolean;
}) => (
  <div className="relative w-full overflow-auto">
    {/* This is a generic table component. Headers should be provided via TableHeader when used. */}
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
);
Table.displayName = 'Table';

const TableHeader = ({ ref, className, ...props}: React.HTMLAttributes<HTMLTableSectionElement> & {
  ref?: React.RefObject<HTMLTableSectionElement | null>;
}) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
);
TableHeader.displayName = 'TableHeader';

const TableBody = ({ ref, className, ...props}: React.HTMLAttributes<HTMLTableSectionElement> & {
  ref?: React.RefObject<HTMLTableSectionElement | null>;
}) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
);
TableBody.displayName = 'TableBody';

const TableFooter = ({ ref, className, ...props}: React.HTMLAttributes<HTMLTableSectionElement> & {
  ref?: React.RefObject<HTMLTableSectionElement | null>;
}) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className,
    )}
    {...props}
  />
);
TableFooter.displayName = 'TableFooter';

const TableRow = ({ ref, className, ...props}: React.HTMLAttributes<HTMLTableRowElement> & {
  ref?: React.RefObject<HTMLTableRowElement | null>;
}) => (
  <tr
    ref={ref}
    className={cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      className,
    )}
    {...props}
  />
);
TableRow.displayName = 'TableRow';

const TableHead = ({ ref, className, ...props}: React.ThHTMLAttributes<HTMLTableCellElement> & {
  ref?: React.RefObject<HTMLTableCellElement | null>;
}) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
);
TableHead.displayName = 'TableHead';

const TableCell = ({ ref, className, ...props}: React.TdHTMLAttributes<HTMLTableCellElement> & {
  ref?: React.RefObject<HTMLTableCellElement | null>;
}) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
);
TableCell.displayName = 'TableCell';

const TableCaption = ({ ref, className, ...props}: React.HTMLAttributes<HTMLTableCaptionElement> & {
  ref?: React.RefObject<HTMLTableCaptionElement | null>;
}) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
);
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
