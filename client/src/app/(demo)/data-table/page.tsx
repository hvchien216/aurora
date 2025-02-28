import React, { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Table } from "~/components/shared";
import { cn, getData } from "~/utils";

import "~/styles/globals.css";

type Props = {};

const Page = (props: Props) => {
  const [rowData, setRowData] = useState(getData());
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setRowData((rowData) =>
  //       rowData.map((item) => {
  //         const isRandomChance = Math.random() < 0.1;

  //         if (!isRandomChance) {
  //           return item;
  //         }
  //         const rnd = (Math.random() * PERCENTAGE_CHANGE) / 100;
  //         const change = Math.random() > 0.5 ? 1 - rnd : 1 + rnd;
  //         const price =
  //           item.price < 10
  //             ? item.price * change
  //             : // Increase price if it is too low, so it does not hang around 0
  //               Math.random() * 40 + 10;

  //         const timeline = item.timeline
  //           .slice(1, item.timeline.length)
  //           .concat(Number(price.toFixed(2)));

  //         return {
  //           ...item,
  //           price,
  //           timeline,
  //         };
  //       }),
  //     );
  //   }, updateInterval);

  //   return () => clearInterval(intervalId);
  // }, [updateInterval]);

  return (
    <div className={cn("h-4")}>
      <MoreHorizontal />
      <Table />
    </div>
  );
};

export default Page;
