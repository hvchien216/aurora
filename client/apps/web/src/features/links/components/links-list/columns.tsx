import { memo, type ReactNode } from "react";
import {
  Avatar,
  AvatarImage,
  CopyButton,
  DataTableColumnHeader,
  LinkLogo,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@leww/ui";
import { type ColumnDef } from "@tanstack/react-table";
import { Check, CircleCheck, MousePointerClick } from "lucide-react";

import {
  cn,
  formatDate,
  getApexDomain,
  getPrettyUrl,
  linkConstructor,
  nFormatter,
  pluralize,
  timeAgo,
} from "@leww/utils";
import { A_BILLION } from "~/constants";
import { type Link } from "~/features/links/schemas";

export const columns: ColumnDef<Link>[] = [
  {
    id: "select",
    header: ({ table }) =>
      table.getRowCount() > 0 && (
        <div className="my-1">
          <SelectionWrapper
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={() =>
              table.toggleAllPageRowsSelected(
                !(
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomePageRowsSelected() && "indeterminate")
                ),
              )
            }
          >
            <div className="size-2 shrink-0 sm:size-6" />
          </SelectionWrapper>
        </div>
      ),
    cell: ({ row }) => (
      <SelectionWrapper
        checked={row.getIsSelected()}
        onCheckedChange={() => {
          row.toggleSelected(!row.getIsSelected());
        }}
      >
        <LinkLogo
          apexDomain={getApexDomain(row.original.url)}
          className={cn(
            "shrink-0 transition-[width,height]",
            "size-4 sm:size-6",
          )}
          imageProps={{
            loading: "lazy",
          }}
        />
      </SelectionWrapper>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "key",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Key" />
    ),
    cell: ({ row }) => {
      const key = row.getValue("key") as string;
      const domain = process.env.NEXT_PUBLIC_DOMAIN;

      return (
        <div className="flex max-w-20 items-center space-x-1.5">
          <span className="font-semibold leading-6 text-neutral-800 transition-colors hover:text-black">
            {linkConstructor({
              domain,
              key,
              pretty: true,
            })}
          </span>
          <CopyButton
            value={linkConstructor({
              domain,
              key,
            })}
            variant="neutral"
            className="p-1.5"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Destination Link" />
    ),
    cell: ({ row }) => {
      const url = row.getValue("url") as string;
      return (
        <p className="flex max-w-[31.25rem] items-center">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold leading-6 text-neutral-800 transition-colors hover:text-black"
          >
            {getPrettyUrl(url)}
          </a>
        </p>
      );
    },
  },
  {
    accessorKey: "clicks",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Clicks" />
    ),
    cell: ({ row, cell }) => {
      const totalClicks = cell.getValue<Link["clicks"]>();
      const lastClicked = row.original.lastClicked;

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "flex w-min items-center gap-1 whitespace-nowrap rounded-md px-1 py-px transition-colors",
              )}
            >
              <MousePointerClick
                className={cn(
                  "size-4 shrink-0 text-neutral-600/70",
                  totalClicks > 0 && "text-primary",
                )}
              />
              <span>{`${nFormatter(totalClicks)} ${pluralize("click", totalClicks)}`}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="px-2.5 py-2 text-xs">
            <div className="flex flex-col gap-2.5 whitespace-nowrap">
              <div className="text-sm leading-none">
                {`${nFormatter(totalClicks, {
                  full: totalClicks < A_BILLION,
                })} ${pluralize("click", totalClicks)}`}
              </div>
              <p className="text-xs leading-none text-neutral-400">
                {lastClicked
                  ? `Last clicked ${timeAgo(lastClicked, {
                      withAgo: true,
                    })}`
                  : "No clicks yet"}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created Date" />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="flex w-min items-center">
              <span className="text-nowrap leading-6 text-neutral-800 transition-colors hover:text-black">
                {timeAgo(createdAt, {
                  withAgo: true,
                })}
              </span>
            </p>
          </TooltipTrigger>
          <TooltipContent className="px-2.5 py-2 text-xs">
            {formatDate(createdAt, {
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            })}
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    enableSorting: false,
    accessorKey: "userId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created By" />
    ),
    cell: ({ row }) => {
      const userId = row.original.userId;
      const avatar = `https://api.dicebear.com/9.x/shapes/svg?seed=${userId}`;

      // TODO: get user email
      return (
        <Avatar className="size-8 rounded-full">
          <AvatarImage src={avatar} alt={"" + userId} />
        </Avatar>
      );
    },
  },
];

type SelectionWrapperProps = {
  checked: boolean | "indeterminate";
  onCheckedChange: () => void;
  children: ReactNode;
};

const SelectionWrapper = memo(
  ({ children, checked, onCheckedChange }: SelectionWrapperProps) => {
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={!!checked}
        data-checked={checked}
        onClick={onCheckedChange}
        className={cn(
          "group relative hidden shrink-0 items-center justify-center outline-none sm:flex",
          checked && "flex",
        )}
      >
        {/* Link logo background circle */}
        <div className="absolute inset-0 shrink-0 rounded-full border border-neutral-200 opacity-100 transition-opacity">
          <div className="h-full w-full rounded-full border border-white bg-gradient-to-t from-neutral-100" />
        </div>
        <div className="relative p-2 transition-[padding,transform] group-hover:scale-90">
          <div className="hidden sm:block">{children}</div>
          <div className="size-5 sm:hidden" />
        </div>
        {/* Checkbox */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center rounded-full border border-neutral-400 bg-white ring-0 ring-black/5",
            "opacity-100 max-sm:ring sm:opacity-0",
            "transition-all duration-150 group-hover:opacity-100 group-hover:ring group-focus-visible:opacity-100 group-focus-visible:ring",
            "group-data-[checked=true]:opacity-100",
            "group-data-[checked=indeterminate]:opacity-100",
          )}
        >
          <div
            className={cn(
              "rounded-full bg-neutral-800 p-1",
              "scale-90 opacity-0 transition-[transform,opacity] duration-100 group-data-[checked=true]:scale-100 group-data-[checked=true]:opacity-100",
              "group-data-[checked=indeterminate]:scale-100 group-data-[checked=indeterminate]:bg-neutral-700 group-data-[checked=indeterminate]:opacity-100",
            )}
          >
            {checked === "indeterminate" ? (
              <Check className="size-6 text-white" />
            ) : (
              <CircleCheck className="size-6 text-white" />
            )}
          </div>
        </div>
      </button>
    );
  },
);

SelectionWrapper.displayName = "SelectionWrapper";
