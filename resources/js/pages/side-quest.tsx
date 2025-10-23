import React, { useState, ChangeEvent, FormEvent } from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import Heading from "@/components/heading";
import { type BreadcrumbItem } from "@/types";
import axios from "axios";
import { sideQuest } from "@/routes";
import API_ENDPOINTS from "@/config";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Side Quest Form",
    href: sideQuest().url,
  },
];

type ValidationRule =
  | "required"
  | "validate_if_same_invited_by"
  | "validate_code"
  | "unique"
 | null;

interface Line {
  id: number;
 input_type: string;
 placeholder: string;
  is_question: boolean;
  answer: string;
 validation_rule: ValidationRule;
  points: number;
}

interface Header {
  id: number;
  question: string;
 lines: Line[];
}

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
  const [headers, setHeaders] = useState<Header[]>([
    { id: Date.now(), question: "", lines: [] },
 ]);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // ➕ Add header
  const addHeader = (): void =>
    setHeaders([...headers, { id: Date.now(), question: "", lines: [] }]);

  // ➕ Add line
 const addLine = (headerId: number): void => {
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
                  points: 0,
                },
              ],
            }
          : h
      )
    );
  };

  // ✏️ Update header
 const updateHeader = (headerId: number, field: keyof Header, value: any): void =>
    setHeaders((prev) =>
      prev.map((h) =>
        h.id === headerId ? { ...h, [field]: value } : h
      )
    );

  // ✏️ Update line
  const updateLine = (
    headerId: number,
    lineId: number,
    field: keyof Line,
    value: any
 ): void =>
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
 const removeLine = (headerId: number, lineId: number): void =>
    setHeaders((prev) =>
      prev.map((h) =>
        h.id === headerId
          ? { ...h, lines: h.lines.filter((l) => l.id !== lineId) }
          : h
      )
    );

  // 🗑️ Remove header
 const removeHeader = (headerId: number): void =>
    setHeaders((prev) => prev.filter((h) => h.id !== headerId));

  // Function to clear the form
  const clearForm = (): void => {
    setHeaders([{ id: Date.now(), question: "", lines: [] }]);
  };

  // 💾 Submit
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      console.log(API_ENDPOINTS.POST_SIDE_QUESTS);
      await axios.post(API_ENDPOINTS.POST_SIDE_QUESTS, { headers });
      setModalMessage("✅ Side Quests saved successfully!");
      setIsSuccessModalOpen(true);
      clearForm(); // Clear the form on success
    } catch (err) {
      console.error(err);
      setModalMessage("❌ Failed to save side quests");
      setIsErrorModalOpen(true);
    }
 };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Side Quest" />
      <div className="container mx-auto py-6 px-4 sm:py-10 sm:px-8">
        <Card className="rounded-lg shadow-lg transition-colors duration-300">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Side Quest</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {headers.map((header) => (
                <div
                  key={header.id}
                  className="border border-gray-300 dark:border-gray-700 rounded-xl p-4 space-y-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
                >
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <input
                      type="text"
                      placeholder="Question"
                      value={header.question}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        updateHeader(header.id, "question", e.target.value)
                      }
                      className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-300"
                      required
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        type="button"
                        onClick={() => addLine(header.id)}
                        className="bg-indigo-60 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-3 py-2 rounded-lg transition"
                      >
                        + Line
                      </Button>
                      {headers.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeHeader(header.id)}
                          className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-3 py-2 rounded-lg transition"
                        >
                          🗑 Remove
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Lines */}
                  {header.lines.length > 0 && (
                    <div className="space-y-3 pl-2">
                      {header.lines.map((line) => (
                        <div
                          key={line.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2 bg-white dark:bg-gray-800 transition-colors duration-300"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-3">
                            {/* Input Type */}
                            <div className="lg:col-span-1">
                              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Type</label>
                              <select
                                value={line.input_type}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                  updateLine(
                                    header.id,
                                    line.id,
                                    "input_type",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-30 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded-lg focus:ring-2 focus:ring-indigo-50 transition-colors duration-300"
                              >
                                {inputTypes.map((t) => (
                                  <option key={t.value} value={t.value}>
                                    {t.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Placeholder */}
                            <div className="lg:col-span-2">
                              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Placeholder</label>
                              <input
                                type="text"
                                placeholder="Placeholder"
                                value={line.placeholder}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                  updateLine(
                                    header.id,
                                    line.id,
                                    "placeholder",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-30 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-40 dark:placeholder-gray-500 p-2 rounded-lg focus:ring-2 focus:ring-indigo-50 transition-colors duration-300"
                              />
                            </div>

                            {/* Validation Rule */}
                            <div className="lg:col-span-2">
                              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Validation</label>
                              <select
                                value={line.validation_rule || ""}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                  updateLine(
                                    header.id,
                                    line.id,
                                    "validation_rule",
                                    e.target.value || null
                                  )
                                }
                                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded-lg focus:ring-2 focus:ring-indigo-50 transition-colors duration-300"
                              >
                                {validationRules.map((r) => (
                                  <option key={r.value ?? "none"} value={r.value ?? ""}>
                                    {r.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Points */}
                            <div className="lg:col-span-1">
                              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Points</label>
                              <input
                                type="number"
                                placeholder="Points"
                                value={line.points}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                  updateLine(
                                    header.id,
                                    line.id,
                                    "points",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-40 dark:placeholder-gray-500 p-2 rounded-lg focus:ring-2 focus:ring-indigo-50 transition-colors duration-300"
                              />
                            </div>

                            {/* Is Question Toggle */}
                            <div className="lg:col-span-1 flex flex-col">
                              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Question?</label>
                              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mt-2">
                                <input
                                  type="checkbox"
                                  checked={line.is_question}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                            </div>
                            {/* Answer Input */}
                            {line.is_question && (
                              <div className="lg:col-span-7  pl-2">
                                <label className="text-xs text-gray-500 dark:text-gray-40 mb-1 block">Answer</label>
                                <input
                                  type="text"
                                  placeholder="Answer"
                                  value={line.answer}
                                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    updateLine(
                                      header.id,
                                      line.id,
                                      "answer",
                                      e.target.value
                                    )
                                  }
                                  className="w-full border border-gray-30 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-40 dark:placeholder-gray-500 p-2 rounded-lg focus:ring-2 focus:ring-indigo-50 transition-colors duration-300"
                                />
                              </div>
                            )}
                            {/* Remove Line */}
                            <div className="lg:col-span-1 flex flex-col">
                              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block invisible">Remove</label>
                              <div className="flex items-center justify-center h-full mt-2">
                                <Button
                                  type="button"
                                  onClick={() => removeLine(header.id, line.id)}
                                  className="bg-red-600 hover:bg-red-70 dark:bg-red-500 dark:hover:bg-red-60 text-white px-3 py-2 rounded-lg transition"
                                >
                                  ✖
                                </Button>
                              </div>
                            </div>
                          </div>

                          
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Add Header */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  onClick={addHeader}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                >
                  + Add Header
                </Button>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-indigo-60 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white p-2 sm:p-3 rounded-lg transition"
                >
                  Save Side Quests
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Success Modal */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription className="text-green-600 dark:text-green-400">
              {modalMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              type="button" 
              onClick={() => setIsSuccessModalOpen(false)}
              className="bg-indigo-60 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription className="text-destructive dark:text-destructive-foreground">
              {modalMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              type="button" 
              onClick={() => setIsErrorModalOpen(false)}
              variant="destructive"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
