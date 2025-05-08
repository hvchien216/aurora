import { useState, type JSX } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../alert-dialog";
import { Button, type ButtonProps } from "../button";

export const useConfirm = (
  title: string,
  message: string,
  confirmButtonProps: {
    variant: ButtonProps["variant"];
    label: string;
  } = {
    variant: "default",
    label: "Confirm",
  },
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = () => setPromise(null);

  const handleCancel = () => {
    promise?.resolve(false);

    handleClose();
  };

  const handleConfirm = () => {
    promise?.resolve(true);

    handleClose();
  };

  const ConfirmDialog = () => (
    <AlertDialog open={promise !== null}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="pt-2">
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>

          <Button variant={confirmButtonProps.variant} onClick={handleConfirm}>
            {confirmButtonProps.label}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return [ConfirmDialog, confirm];
};
