import React, { useState, ChangeEvent, FormEvent, useEffect, Fragment } from "react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, ChevronRight, Edit, Trash2, Save, X } from 'lucide-react';

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

interface SideQuestLine {
  id: number;
  header_id: number;
  input_type: string;
  placeholder: string;
  is_question: boolean;
  answer: string;
  validation_rule: string | null;
  points: number;
  created_at: string;
  updated_at: string;
}

interface SideQuestHeader {
  id: number;
  question: string;
  created_at: string;
  updated_at: string;
  lines: SideQuestLine[];
}

interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

const inputTypes = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
  { label: "Dropdown", value: "select" },
  { label: "Checkbox", value: "checkbox" },
];

const validationRules = [
  { label: "Required", value: "required" },
  { label: "Validate if name exist", value: "validate_if_name_exist" },
  { label: "Validate if name exist and same inviter", value: "validate_if_name_exist_same_inviter" },
  { label: "Validate code", value: "validate_code" },
  { label: "Validate same bday", value: "validate_same_bday" },
  { label: "Validate if birthday is correct", value: 'validate_if_bday_is_correct' },
];

export default function SideQuest() {
  const [headers, setHeaders] = useState<Header[]>([
    { id: Date.now(), question: "", lines: [] },
  ]);
  const [tableHeaders, setTableHeaders] = useState<SideQuestHeader[]>([]);
  const [tablePagination, setTablePagination] = useState<Pagination | null>(null);
  const [tableLoading, setTableLoading] = useState(true);
  const [expandedHeaders, setExpandedHeaders] = useState<Set<number>>(new Set());
  const [editingHeaderId, setEditingHeaderId] = useState<number | null>(null);
  const [editingHeaderQuestion, setEditingHeaderQuestion] = useState('');
 const [editingLine, setEditingLine] = useState<Partial<SideQuestLine> | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

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
      // Refresh the table data after successful submission
      fetchTableHeaders();
    } catch (err) {
      console.error(err);
      setModalMessage("❌ Failed to save side quests");
      setIsErrorModalOpen(true);
    }
  };

  // Table functions
  const fetchTableHeaders = async () => {
    try {
      setTableLoading(true);
      // Using the correct API endpoint from the controller with pagination
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        per_page: perPage.toString()
      });
      const response = await axios.get(`${API_ENDPOINTS.SIDE_QUEST_HEADERS}?${params}`);
      setTableHeaders(response.data.data);
      setTablePagination(response.data);
    } catch (error) {
      console.error('Error fetching side quest headers:', error);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchTableHeaders();
  }, [search, page, perPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(Number(value));
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (tablePagination?.last_page || 1)) {
      setPage(newPage);
    }
  };

  const toggleExpand = (headerId: number) => {
    setExpandedHeaders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(headerId)) {
        newSet.delete(headerId);
      } else {
        newSet.add(headerId);
      }
      return newSet;
    });
  };

  const startEditingHeader = (header: SideQuestHeader) => {
    setEditingHeaderId(header.id);
    setEditingHeaderQuestion(header.question);
  };

  const saveHeader = async (headerId: number) => {
    try {
      await axios.put(`${API_ENDPOINTS.SIDE_QUEST_HEADERS}/${headerId}`, {
        question: editingHeaderQuestion
      });
      
      setTableHeaders(prev => prev.map(h =>
        h.id === headerId ? { ...h, question: editingHeaderQuestion } : h
      ));
      
      setEditingHeaderId(null);
      setEditingHeaderQuestion('');
      // Refresh the form data as well
      fetchTableHeaders();
    } catch (error) {
      console.error('Error updating header:', error);
    }
  };

 const deleteHeader = async (headerId: number) => {
    if (!confirm('Are you sure you want to delete this header and all its lines?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_ENDPOINTS.SIDE_QUEST_HEADERS}/${headerId}`);
      setTableHeaders(prev => prev.filter(h => h.id !== headerId));
      setExpandedHeaders(prev => {
        const newSet = new Set(prev);
        newSet.delete(headerId);
        return newSet;
      });
      // Refresh the form data as well
      fetchTableHeaders();
    } catch (error) {
      console.error('Error deleting header:', error);
    }
  };

  const startEditingLine = (line: SideQuestLine) => {
    setEditingLine({ ...line });
  };

  const saveLine = async () => {
    if (!editingLine || !editingLine.id) return;
    
    try {
      await axios.put(`${API_ENDPOINTS.SIDE_QUEST_LINES}/${editingLine.id}`, {
        header_id: editingLine.header_id,
        input_type: editingLine.input_type,
        placeholder: editingLine.placeholder,
        is_question: editingLine.is_question,
        answer: editingLine.answer,
        validation_rule: editingLine.validation_rule,
        points: editingLine.points
      });
      
      setTableHeaders(prev =>
        prev.map(header => ({
          ...header,
          lines: header.lines.map(line =>
            line.id === editingLine.id ? { ...editingLine } as SideQuestLine : line
          )
        }))
      );
      
      setEditingLine(null);
      // Refresh the form data as well
      fetchTableHeaders();
    } catch (error) {
      console.error('Error updating line:', error);
    }
  };

 const deleteLine = async (lineId: number, headerId: number) => {
    if (!confirm('Are you sure you want to delete this line?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_ENDPOINTS.SIDE_QUEST_LINES}/${lineId}`);
      setTableHeaders(prev =>
        prev.map(header =>
          header.id === headerId
            ? { ...header, lines: header.lines.filter(line => line.id !== lineId) }
            : header
        )
      );
      // Refresh the form data as well
      fetchTableHeaders();
    } catch (error) {
      console.error('Error deleting line:', error);
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
                      className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-40 dark:placeholder-gray-500 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors duration-300"
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
                                  className="w-4 h-4 accent-indigo-60 dark:accent-indigo-500"
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
        
        {/* Table for managing existing side quests */}
        <Card className="mt-8 rounded-lg shadow-lg transition-colors duration-300">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Manage Side Quests</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search side quests..."
                  value={search}
                  onChange={handleSearchChange}
                  className="max-w-md"
                />
              </div>
              <div className="w-32">
                <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-2/5 min-w-[200px]">Question</TableHead>
                    <TableHead className="w-1/5 min-w-[100px]">Lines Count</TableHead>
                    <TableHead className="w-2/5 min-w-[150px]">Created At</TableHead>
                    <TableHead className="w-1/5 min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-4">
                        <div className="flex flex-col gap-2">
                          {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : tableHeaders.length > 0 ? (
                    tableHeaders.map((header) => (
                      <React.Fragment key={header.id}>
                        <TableRow>
                          <TableCell className="font-medium min-w-[200px]">
                            {editingHeaderId === header.id ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={editingHeaderQuestion}
                                  onChange={(e) => setEditingHeaderQuestion(e.target.value)}
                                  className="w-64"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => saveHeader(header.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingHeaderId(null)}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleExpand(header.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  {expandedHeaders.has(header.id) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                                {header.question}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="min-w-[100px]">{header.lines.length}</TableCell>
                          <TableCell className="min-w-[150px]">{new Date(header.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="min-w-[120px]">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditingHeader(header)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteHeader(header.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedHeaders.has(header.id) && (
                          <TableRow>
                            <TableCell colSpan={4} className="p-0 border-t-0">
                              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg overflow-hidden">
                                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-sm text-gray-500 dark:text-gray-40 bg-gray-100 dark:bg-gray-700 min-w-[900px]">
                                  <div className="col-span-2 min-w-[150px]">Type</div>
                                  <div className="col-span-3 min-w-[200px]">Placeholder</div>
                                  <div className="col-span-1 min-w-[100px]">Is Question</div>
                                  <div className="col-span-2 min-w-[150px]">Validation</div>
                                  <div className="col-span-1 min-w-[80px]">Points</div>
                                  <div className="col-span-2 min-w-[150px]">Answer</div>
                                  <div className="col-span-1 min-w-[120px]">Actions</div>
                                </div>
                                <div className="max-h-96 overflow-y-auto overflow-x-auto bg-white dark:bg-gray-900 min-w-[900px]">
                                  {header.lines.map((line) => (
                                    <div key={line.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 last:border-0 items-center min-w-[900px]">
                                      <div className="col-span-2 min-w-[150px]">
                                        {editingLine && editingLine.id === line.id ? (
                                          <Input
                                            value={editingLine.input_type || ''}
                                            onChange={(e) => setEditingLine({
                                              ...editingLine,
                                              input_type: e.target.value
                                            })}
                                            className="w-full"
                                          />
                                        ) : (
                                          line.input_type
                                        )}
                                      </div>
                                      <div className="col-span-3 min-w-[200px]">
                                        {editingLine && editingLine.id === line.id ? (
                                          <Input
                                            value={editingLine.placeholder || ''}
                                            onChange={(e) => setEditingLine({
                                              ...editingLine,
                                              placeholder: e.target.value
                                            })}
                                            className="w-full"
                                          />
                                        ) : (
                                          line.placeholder
                                        )}
                                      </div>
                                      <div className="col-span-1 min-w-[100px]">
                                        {editingLine && editingLine.id === line.id ? (
                                          <select
                                            value={editingLine.is_question ? 'true' : 'false'}
                                            onChange={(e) => setEditingLine({
                                              ...editingLine,
                                              is_question: e.target.value === 'true'
                                            })}
                                            className="w-full border rounded p-1 text-sm"
                                          >
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                          </select>
                                        ) : (
                                          line.is_question ? 'Yes' : 'No'
                                        )}
                                      </div>
                                      <div className="col-span-2 min-w-[150px]">
                                        {editingLine && editingLine.id === line.id ? (
                                          <select
                                            value={editingLine.validation_rule || ''}
                                            onChange={(e) => setEditingLine({
                                              ...editingLine,
                                              validation_rule: e.target.value || null
                                            })}
                                            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded-lg focus:ring-2 focus:ring-indigo-50 transition-colors duration-300"
                                          >
                                            <option value="">None</option>
                                            {validationRules.map((rule) => (
                                              <option key={rule.value} value={rule.value}>
                                                {rule.label}
                                              </option>
                                            ))}
                                          </select>
                                        ) : (
                                          line.validation_rule || '-'
                                        )}
                                      </div>
                                      <div className="col-span-1 min-w-[80px]">
                                        {editingLine && editingLine.id === line.id ? (
                                          <Input
                                            type="number"
                                            value={editingLine.points || 0}
                                            onChange={(e) => setEditingLine({
                                              ...editingLine,
                                              points: Number(e.target.value)
                                            })}
                                            className="w-16"
                                          />
                                        ) : (
                                          line.points
                                        )}
                                      </div>
                                      <div className="col-span-2 min-w-[150px]">
                                        {editingLine && editingLine.id === line.id ? (
                                          <Input
                                            value={editingLine.answer || ''}
                                            onChange={(e) => setEditingLine({
                                              ...editingLine,
                                              answer: e.target.value
                                            })}
                                            className="w-full"
                                            placeholder="Answer"
                                          />
                                        ) : (
                                          line.answer || '-'
                                        )}
                                      </div>
                                      <div className="col-span-1 min-w-[120px] flex gap-1">
                                        {editingLine && editingLine.id === line.id ? (
                                          <>
                                            <Button
                                              size="sm"
                                              onClick={saveLine}
                                              className="h-8 w-8 p-0"
                                            >
                                              <Save className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => setEditingLine(null)}
                                              className="h-8 w-8 p-0"
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </>
                                        ) : (
                                          <>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => startEditingLine(line)}
                                            >
                                              <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              onClick={() => deleteLine(line.id, header.id)}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                  {header.lines.length === 0 && (
                                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 py-8 bg-white dark:bg-gray-900 min-w-[900px]">
                                      No lines available
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No side quests found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {!tableLoading && tablePagination && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                <div className="text-sm text-gray-600">
                  Showing {tablePagination.from} to {tablePagination.to} of {tablePagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    Previous
                  </Button>

                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, tablePagination.last_page) }, (_, i) => {
                      let pageNum;
                      if (tablePagination.last_page <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= tablePagination.last_page - 2) {
                        pageNum = tablePagination.last_page - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className={page === pageNum ? "bg-primary" : ""}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= (tablePagination?.last_page || 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
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
