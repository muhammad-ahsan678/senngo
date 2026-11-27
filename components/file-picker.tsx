"use client";

import { useCallback, useRef, useState } from "react";
import type { DragEvent } from "react";
import { File as FileIcon, Files, Plus, Upload, X } from "lucide-react";
import { UploadOptions } from "@/components/upload-options";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

type SelectedFile = { id: number; file: File };

const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 });

function formatFileSize(bytes: number) {
  if (bytes < 1_000) return `${bytes} B`;
  if (bytes < 1_000_000) return `${numberFormat.format(bytes / 1_000)} KB`;
  if (bytes < 1_000_000_000) return `${numberFormat.format(bytes / 1_000_000)} MB`;
  return `${numberFormat.format(bytes / 1_000_000_000)} GB`;
}

export function FilePicker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreBrowseFocus = useRef(false);
  const nextId = useRef(0);
  const dragDepth = useRef(0);
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const hasFiles = files.length > 0;

  const attachBrowseButton = useCallback((button: HTMLButtonElement | null) => {
    if (button && restoreBrowseFocus.current) {
      restoreBrowseFocus.current = false;
      button.focus();
    }
  }, []);

  function browseFiles() {
    inputRef.current?.click();
  }

  function addFiles(selection: FileList) {
    if (!selection.length) return;

    const addedFiles = Array.from(selection, (file) => ({ id: nextId.current++, file }));
    setFiles((current) => [...current, ...addedFiles]);
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    if (!event.dataTransfer.types.includes("Files")) return;

    event.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  }

  function handleDragLeave() {
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function removeFile(id: number, button: HTMLButtonElement) {
    const row = button.closest("li");
    const sibling = row?.nextElementSibling ?? row?.previousElementSibling;
    if (sibling) {
      sibling.querySelector("button")?.focus();
    } else {
      restoreBrowseFocus.current = true;
    }
    setFiles((current) => current.filter((entry) => entry.id !== id));
  }

  return (
    <>
      <header
        id="add-files"
        tabIndex={-1}
        className="mb-8 flex scroll-m-5 items-start justify-between gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:mb-10"
      >
        <div className="min-w-0">
          <h1 className="flex min-h-12 items-center text-3xl font-semibold tracking-[-0.055em] min-[360px]:text-4xl sm:min-h-14 sm:text-6xl">
            Send files
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Add the files you want to share.
          </p>
        </div>
        {hasFiles && (
          <Button
            ref={attachBrowseButton}
            variant="secondary"
            className="min-h-12 gap-2 sm:min-h-14 sm:px-5"
            onClick={browseFiles}
          >
            <Plus aria-hidden="true" className="size-4" />
            Add files
          </Button>
        )}
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(event) => {
            const input = event.currentTarget;
            if (input.files?.length) {
              if (!hasFiles) restoreBrowseFocus.current = true;
              addFiles(input.files);
            }
            input.value = "";
          }}
        />
      </header>

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(event) => {
          if (event.dataTransfer.types.includes("Files")) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
          }
        }}
        onDrop={handleDrop}
      >
        {!hasFiles && (
          <button
            ref={attachBrowseButton}
            type="button"
            aria-label="Browse files"
            className="group mb-8 block w-full cursor-pointer rounded-2xl border bg-card p-3 shadow-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:p-4"
            onClick={browseFiles}
          >
            <span
              className={cn(
                "flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed px-4 py-9 text-center transition-colors sm:min-h-64",
                isDragging ? "border-primary bg-accent" : "border-ring/55 bg-accent/35 group-hover:bg-accent/60",
              )}
            >
              <span className="grid size-14 place-items-center rounded-2xl border border-primary/10 bg-card text-primary shadow-xs ring-6 ring-accent">
                <Upload aria-hidden="true" className="size-6" />
              </span>
              <span className="mt-6 text-xl font-semibold tracking-tight">
                Drop files here
              </span>
              <span className="mt-1.5 text-sm text-muted-foreground">
                or <span className="font-medium text-foreground underline underline-offset-4">browse files</span>
              </span>
            </span>
          </button>
        )}

        <section
          aria-labelledby="selected-files-heading"
          className={cn(
            "rounded-2xl border bg-card shadow-xs transition-shadow",
            hasFiles && isDragging && "ring-2 ring-ring",
          )}
        >
          <div
            className={cn(
              "flex items-start justify-between gap-3 rounded-t-2xl border-b bg-card px-4 py-4 sm:px-5",
              hasFiles && "sticky top-0 z-10",
            )}
          >
            <div>
              <h2 id="selected-files-heading" className="text-lg font-semibold tracking-tight">
                Selected files
              </h2>
              <p role="status" className={hasFiles ? "mt-1 text-sm text-muted-foreground" : "sr-only"}>
                {files.length === 1 ? "1 file" : `${files.length} files`}
              </p>
            </div>
            {hasFiles && <UploadOptions />}
          </div>
          {!hasFiles ? (
            <EmptyState icon={<Files />}>No files selected yet.</EmptyState>
          ) : (
            <ul aria-label="Selected files" className="divide-y divide-border">
              {files.map(({ id, file }) => (
                <li key={id} className="flex min-h-20 items-center gap-3 px-4 py-2 sm:px-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                    <FileIcon aria-hidden="true" className="size-[18px]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-medium wrap-anywhere">{file.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  <Button
                    variant="icon"
                    className="scroll-mt-32"
                    aria-label={`Remove ${file.name}`}
                    onClick={(event) => removeFile(id, event.currentTarget)}
                  >
                    <X aria-hidden="true" className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
