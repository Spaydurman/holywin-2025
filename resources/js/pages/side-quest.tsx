import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import Heading from "@/components/heading";
import { type BreadcrumbItem } from "@/types";
import axios from "axios";
import { sideQuest } from "@/routes";

const breadcrumbs = [
  {
    title: "Side Quest Form",
    href: sideQuest().url,
  },
];

const inputTypes = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
  { label: "Dropdown", value: "select" },
  { label: "Checkbox", value: "checkbox" },
];

const validationRules = [
  { label: "None", value: null },
  { label: "Required", value: "required" },
  { label: "Validate if same invited by", value: "validate_if_same_invited_by" },
  { label: "Validate code", value: "validate_code" },
  { label: "Validate unique", value: "unique" },
];

export default function SideQuest() {
  const [headers, setHeaders] = useState([
    { id: Date.now(), question: "", lines: [] },
  ]);

  // ➕ Add header
  const addHeader = () =>
    setHeaders([...headers, { id: Date.now(), question: "", lines: [] }]);

  // ➕ Add line
  const addLine = (headerId) => {
    setHeaders((prev) =>
      prev.map((h) =>
        h.id === headerId
          ? {
              ...h,
              lines: [
                ...h.lines,
                {
                  id: Date.now(),
                  input_type: "text",
                  placeholder: "",
                  is_question: false,
                  answer: "",
                  validation_rule: null,
                },
              ],
            }
          : h
      )
    );
  };

  // ✏️ Update header
  const updateHeader = (headerId, field, value) =>
    setHeaders((prev) =>
      prev.map((h) =>
        h.id === headerId ? { ...h, [field]: value } : h
      )
    );

  // ✏️ Update line
  const updateLine = (headerId, lineId, field, value) =>
    setHeaders((prev) =>
      prev.map((h) =>
        h.id === headerId
          ? {
              ...h,
              lines: h.lines.map((l) =>
                l.id === lineId ? { ...l, [field]: value } : l
              ),
            }
          : h
      )
    );

  // ❌ Remove line
  const removeLine = (headerId, lineId) =>
    setHeaders((prev) =>
      prev.map((h) =>
        h.id === headerId
          ? { ...h, lines: h.lines.filter((l) => l.id !== lineId) }
          : h
      )
    );

  // 🗑️ Remove header
  const removeHeader = (headerId) =>
    setHeaders((prev) => prev.filter((h) => h.id !== headerId));

  // 💾 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/side-quests", { headers });
      alert("✅ Side Quests saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save side quests");
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Side Quest" />
      <div className="container mx-auto py-10 p-8">
        <Heading title="Side Quest" />
        <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm rounded-lg p-6 shadow space-y-6 transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            {headers.map((header) => (
              <div
                key={header.id}
                className="border border-gray-300 dark:border-gray-700 rounded-xl p-4 space-y-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
              >
                {/* Header Row */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Header Question"
                    value={header.question}
                    onChange={(e) =>
                      updateHeader(header.id, "question", e.target.value)
                    }
                    className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => addLine(header.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-3 py-1 rounded-lg transition"
                  >
                    + Line
                  </button>
                  {headers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHeader(header.id)}
                      className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                    >
                      🗑 Remove
                    </button>
                  )}
                </div>

                {/* Lines */}
                {header.lines.length > 0 && (
                  <div className="space-y-3 pl-4">
                    {header.lines.map((line) => (
                      <div
                        key={line.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2 bg-white dark:bg-gray-800 transition-colors duration-300"
                      >
                        <div className="grid grid-cols-6 gap-3 items-center">
                          {/* Input Type */}
                          <select
                            value={line.input_type}
                            onChange={(e) =>
                              updateLine(
                                header.id,
                                line.id,
                                "input_type",
                                e.target.value
                              )
                            }
                            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                          >
                            {inputTypes.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>

                          {/* Placeholder */}
                          <input
                            type="text"
                            placeholder="Placeholder"
                            value={line.placeholder}
                            onChange={(e) =>
                              updateLine(
                                header.id,
                                line.id,
                                "placeholder",
                                e.target.value
                              )
                            }
                            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                          />

                          {/* Validation Rule */}
                          <select
                            value={line.validation_rule || ""}
                            onChange={(e) =>
                              updateLine(
                                header.id,
                                line.id,
                                "validation_rule",
                                e.target.value || null
                              )
                            }
                            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                          >
                            {validationRules.map((r) => (
                              <option key={r.value ?? "none"} value={r.value ?? ""}>
                                {r.label}
                              </option>
                            ))}
                          </select>

                          {/* Is Question Toggle */}
                          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked={line.is_question}
                              onChange={(e) =>
                                updateLine(
                                  header.id,
                                  line.id,
                                  "is_question",
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 accent-indigo-600 dark:accent-indigo-500"
                            />
                            <span>Is Question?</span>
                          </label>

                          {/* Remove Line */}
                          <button
                            type="button"
                            onClick={() => removeLine(header.id, line.id)}
                            className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                          >
                            ✖
                          </button>
                        </div>

                        {/* Answer Input (only shows if is_question is true) */}
                        {line.is_question && (
                          <div className="pl-2">
                            <input
                              type="text"
                              placeholder="Answer"
                              value={line.answer}
                              onChange={(e) =>
                                updateLine(
                                  header.id,
                                  line.id,
                                  "answer",
                                  e.target.value
                                )
                              }
                              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 p-2 rounded-lg focus:ring-2 focus:ring-green-500 transition-colors duration-300"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Add Header */}
            <button
              type="button"
              onClick={addHeader}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
            >
              + Add Question
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white p-3 rounded-lg transition"
            >
              Save Side Quests
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
