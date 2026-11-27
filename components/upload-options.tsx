"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { Lock, Upload } from "lucide-react";
import { Dialog } from "radix-ui";
import { Button } from "@/components/ui/button";

export function UploadOptions() {
  const passwordId = useId();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");

  function saveOptions(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("password");
    setPassword(typeof value === "string" ? value : "");
    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="flex shrink-0 flex-col items-end">
        <Dialog.Trigger asChild>
          <Button className="min-h-12 px-5 text-base sm:min-h-14 sm:px-7">
            <Upload aria-hidden="true" className="size-5" />
            Upload
          </Button>
        </Dialog.Trigger>
        <p role="status" className="flex items-center gap-1.5 text-xs text-muted-foreground not-empty:mt-2">
          {password && (
            <>
              <Lock aria-hidden="true" className="size-4" />
              Password added
            </>
          )}
        </p>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/65" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-1/2 overflow-y-auto rounded-2xl border bg-card p-5 text-card-foreground shadow-xl sm:p-6">
          <Dialog.Title className="text-xl font-semibold tracking-tight">Upload options</Dialog.Title>
          <Dialog.Description className="mt-1.5 text-sm text-muted-foreground">
            Add a password for this transfer, or leave it blank.
          </Dialog.Description>

          <form method="post" autoComplete="off" onSubmit={saveOptions} className="mt-5">
            <label htmlFor={passwordId} className="text-sm font-medium">
              Password <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id={passwordId}
              name="password"
              type="password"
              defaultValue={password}
              className="mt-2 block min-h-11 w-full rounded-lg border border-input bg-background px-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
            <p className="mt-3 text-sm text-muted-foreground">Uploads are currently unavailable.</p>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Dialog.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Dialog.Close>
              <Button type="submit">Save options</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
