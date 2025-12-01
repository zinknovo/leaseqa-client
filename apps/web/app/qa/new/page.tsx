"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const folders = [
  { value: "lease_review", label: "Lease Review" },
  { value: "security_deposit", label: "Security Deposits" },
  { value: "maintenance", label: "Maintenance Duties" },
  { value: "eviction", label: "Evictions & Terminations" },
  { value: "utilities", label: "Utilities" },
  { value: "roommate_disputes", label: "Roommate Disputes" },
  { value: "lease_termination", label: "Early Termination" },
  { value: "rent_increase", label: "Rent Increases" },
  { value: "other", label: "Other" },
];

const schema = z.object({
  postType: z.enum(["question", "note", "poll"]).default("question"),
  visibility: z.enum(["class", "private"]).default("class"),
  folders: z.array(z.string()).min(1, "Pick at least one folder").max(3, "Select up to three folders"),
  summary: z
    .string()
    .min(10, "Summary must contain at least 10 characters")
    .max(100, "Summary must be 100 characters or fewer"),
  details: z.string().min(20, "Details must contain at least 20 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function NewPostPage() {
  const [details, setDetails] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      postType: "question",
      visibility: "class",
      folders: [],
      summary: "",
      details: "",
    },
  });

  const selectedFolders = watch("folders");

  const onSubmit = async (values: FormValues) => {
    console.log("submit", values);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // TODO: call /api/posts when backend is ready
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <header className="mb-8 space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Compose</p>
        <h1 className="text-3xl font-semibold text-white">Create a post</h1>
        <p className="text-sm text-slate-400">
          Share a question or experience to help other renters. Replies marked ⚖️ are from verified attorneys.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 rounded-2xl border border-white/5 bg-[var(--app-panel)] p-6 shadow-2xl shadow-black/30"
      >
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-white">Post type</h2>
          <div className="flex flex-wrap gap-3 text-sm text-slate-300">
            {[
              { value: "question", label: "Question (default)" },
              { value: "note", label: "Note" },
              { value: "poll", label: "Poll (placeholder)" },
            ].map((item) => (
              <label key={item.value} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2">
                <input
                  type="radio"
                  value={item.value}
                  {...register("postType")}
                  className="h-4 w-4 rounded border-white/20 bg-transparent text-[var(--accent-blue)] focus:ring-[color:var(--accent-blue)]"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-white">Audience</h2>
          <div className="flex flex-wrap gap-3 text-sm text-slate-300">
            {[
              { value: "class", label: "Entire class (default)" },
              { value: "private", label: "Specific user (coming soon)" },
            ].map((item) => (
              <label key={item.value} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2">
                <input
                  type="radio"
                  value={item.value}
                  {...register("visibility")}
                  className="h-4 w-4 rounded border-white/20 bg-transparent text-[var(--accent-blue)] focus:ring-[color:var(--accent-blue)]"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-white">Folders</h2>
            <p className="text-xs text-slate-500">
              Pick at least one folder so attorneys and tenants can find the right context.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {folders.map((folder) => {
                  const checked = selectedFolders.includes(folder.value);
                  return (
                    <label
                      key={folder.value}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm ${
                        checked
                          ? "border-[var(--accent-blue)] bg-[var(--pill-bg-strong)] text-white"
                          : "border-white/10 bg-black/20 text-slate-300 hover:border-white/20"
                        }`}
                    >
                    <input
                      type="checkbox"
                      value={folder.value}
                      {...register("folders")}
                      className="h-4 w-4 rounded border-white/20 bg-transparent text-[var(--accent-blue)] focus:ring-[color:var(--accent-blue)]"
                    />
                    {folder.label}
                  </label>
                );
              })}
          </div>
          {errors.folders && (
            <p className="text-xs text-red-400">{errors.folders.message}</p>
          )}
        </section>

        <section className="space-y-4">
          <div>
            <label className="text-base font-semibold text-white">
              Summary (max 100 characters)
            </label>
            <textarea
              {...register("summary")}
              className="mt-2 h-24 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white placeholder:text-slate-500 focus:border-[var(--accent-blue)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-blue)]"
              placeholder='One-line summary, e.g., "Is a three-month deposit legal in MA?"'
              maxLength={100}
            />
            {errors.summary && (
              <p className="mt-1 text-xs text-red-400">{errors.summary.message}</p>
            )}
          </div>
          <div>
            <label className="text-base font-semibold text-white">Details (rich text)</label>
            <div className="mt-2 rounded-xl border border-white/10 bg-black/10 p-2 dark-quill">
              <ReactQuill
                theme="snow"
                value={details}
                onChange={(value) => {
                  setDetails(value);
                  setValue("details", value, { shouldValidate: true });
                }}
                placeholder="Describe the situation, timeline, and any communication you have had."
              />
            </div>
            {errors.details && (
              <p className="mt-1 text-xs text-red-400">{errors.details.message}</p>
            )}
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">Publishing options</h2>
          <p className="text-xs text-slate-500">Email notifications are disabled for now.</p>
        </section>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/qa"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/5"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-xl bg-[var(--accent-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-blue-hover)] disabled:cursor-not-allowed disabled:bg-[var(--accent-blue-muted)]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publishing…" : "Post question"}
          </button>
        </div>
      </form>
    </div>
  );
}
