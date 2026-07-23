  "use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Minus,
  Package,
  PackageMinus,
  PackagePlus,
  Plus,
  RotateCcw,
  Search,
  Scale,
  X,
} from "lucide-react";
import {
  useGetInventoryItemsQuery,
  useInventoryActionMutation,
} from "@/lib/store/Api-Hooks/main.api";
import { InventoryItemResponse } from "@/app/api/inventory/route";
import { cn } from "@/lib/utils";

export const ADD_NEW_ITEM_VALUE = "__add_new_item__";
const LIME = "#ccff66";

type StockAction = "add" | "remove";
type ToastType = "success" | "error";

interface ToastState {
  id: number;
  type: ToastType;
  message: string;
}

const REMOVE_REASONS = [
  "Damaged",
  "Expired",
  "Inventory Correction",
  "Theft",
] as const;

const UNIT_OPTIONS = [
  "Units",
  "Pcs",
  "Kg",
  "Grams",
  "Liters",
  "Ml",
  "Boxes",
  "Packets",
] as const;

const fieldVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-gray-700"
    >
      {children}
      {required && (
        <span className="ml-1 text-red-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

const inputClassName =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-[#ccff66] focus:ring-2 focus:ring-[#ccff66]/25 disabled:cursor-not-allowed disabled:opacity-50";

function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastState;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg",
        toast.type === "success"
          ? "border-[#ccff66]/50 bg-white text-gray-800"
          : "border-red-200 bg-white text-red-600",
      )}
    >
      {toast.type === "success" ? (
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
      ) : (
        <AlertCircle size={18} className="mt-0.5 shrink-0" />
      )}
      <p className="flex-1 text-sm leading-relaxed">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded-md p-0.5 text-gray-400 transition-colors hover:text-gray-700"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  unitLabel = "Units",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unitLabel?: string;
}) {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => {
    if (max !== undefined) {
      onChange(Math.min(max, value + 1));
      return;
    }
    onChange(value + 1);
  };

  return (
    <div className="flex items-stretch overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="flex flex-1 items-center justify-center px-4 py-5 text-gray-600 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ccff66]/40 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus size={28} strokeWidth={2.5} />
      </button>

      <div
        className="flex flex-[2] flex-col items-center justify-center border-x border-gray-200 bg-white px-4 py-3"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {value}
        </span>
        <span className="mt-0.5 text-xs font-medium uppercase tracking-wider text-gray-500">
          {unitLabel}
        </span>
      </div>

      <button
        type="button"
        onClick={increase}
        disabled={max !== undefined && value >= max}
        aria-label="Increase quantity"
        className="flex flex-1 items-center justify-center px-4 py-5 text-gray-600 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ccff66]/40 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default function InventoryManagementForm() {
  const formId = useId();
  const listboxId = `${formId}-item-listbox`;
  const comboboxRef = useRef<HTMLDivElement>(null);

  const { data: items = [], isLoading: isLoadingItems, isError: isItemsError } =
    useGetInventoryItemsQuery();
  const [inventoryAction, { isLoading: isSubmitting }] =
    useInventoryActionMutation();

  const [selectedItemId, setSelectedItemId] = useState("");
  const [stockAction, setStockAction] = useState<StockAction>("add");
  const [quantity, setQuantity] = useState(1);
  const [vendorName, setVendorName] = useState("");
  const [removeReason, setRemoveReason] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newVendorName, setNewVendorName] = useState("");
  const [purchaseNotes, setPurchaseNotes] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [itemUnit, setItemUnit] = useState("Units");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const toastIdRef = useRef(0);

  const selectedItem = items.find((item) => item._id === selectedItemId) as InventoryItemResponse & { unit?: string } | undefined;
  const isNewItemMode = selectedItemId === ADD_NEW_ITEM_VALUE;
  const isRemoveMode = stockAction === "remove" && !isNewItemMode;

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  const showToast = (type: ToastType, message: string) => {
    toastIdRef.current += 1;
    setToasts((prev) => [
      ...prev,
      { id: toastIdRef.current, type, message },
    ]);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isNewItemMode) {
      setStockAction("add");
    }
  }, [isNewItemMode]);

  useEffect(() => {
    if (isRemoveMode && selectedItem) {
      setQuantity((prev) => Math.min(prev, Math.max(1, selectedItem.currentStock)));
    }
  }, [isRemoveMode, selectedItem]);

  const resetForm = () => {
    setSelectedItemId("");
    setStockAction("add");
    setQuantity(1);
    setVendorName("");
    setRemoveReason("");
    setNewItemName("");
    setNewVendorName("");
    setPurchaseNotes("");
    setAmountPaid("");
    setItemUnit("Units");
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  const handleItemSelect = (value: string) => {
    setSelectedItemId(value);
    setIsDropdownOpen(false);
    setSearchQuery("");
    setQuantity(1);
    setVendorName("");
    setRemoveReason("");
    setNewItemName("");
    setNewVendorName("");
    setPurchaseNotes("");
    setAmountPaid("");
    setItemUnit("Units");

    if (value !== ADD_NEW_ITEM_VALUE) {
      setStockAction("add");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedItemId) {
      showToast("error", "Please search and select an item first.");
      return;
    }

    try {
      if (isNewItemMode) {
        const parsedAmount = Number(amountPaid);

        if (!newItemName.trim()) {
          showToast("error", "New item name is required.");
          return;
        }
        if (!newVendorName.trim()) {
          showToast("error", "Vendor name is required.");
          return;
        }
        if (!amountPaid || Number.isNaN(parsedAmount) || parsedAmount < 0) {
          showToast("error", "Please enter a valid amount paid.");
          return;
        }

        const response = await inventoryAction({
          scenario: "new_item",
          name: newItemName.trim(),
          quantity,
          unit: itemUnit,
          vendorName: newVendorName.trim(),
          purchaseNotes: purchaseNotes.trim() || undefined,
          amountPaid: parsedAmount,
        }).unwrap();

        showToast("success", response.message || "New item added successfully.");
        resetForm();
        return;
      }

      if (stockAction === "add") {
        const response = await inventoryAction({
          scenario: "add_existing",
          itemId: selectedItemId,
          quantity,
          vendorName: vendorName.trim() || undefined,
        }).unwrap();

        showToast(
          "success",
          response.message ||
            `Added ${quantity} ${selectedItem?.unit || "unit(s)"} to ${selectedItem?.name ?? "item"}.`,
        );
        resetForm();
        return;
      }

      if (!removeReason) {
        showToast("error", "Reason for removal is required.");
        return;
      }

      const response = await inventoryAction({
        scenario: "remove_existing",
        itemId: selectedItemId,
        quantity,
        reason: removeReason,
      }).unwrap();

      showToast(
        "success",
        response.message ||
          `Removed ${quantity} ${selectedItem?.unit || "unit(s)"} from ${selectedItem?.name ?? "item"}.`,
      );
      resetForm();
    } catch (error) {
      const message =
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Something went wrong. Please try again.";

      showToast("error", message);
    }
  };

  const comboboxLabel = isNewItemMode
    ? "Add New Item"
    : selectedItem?.name ?? "Search or select an item...";

  const maxQuantity =
    isRemoveMode && selectedItem
      ? Math.max(0, selectedItem.currentStock)
      : undefined;

  const currentUnitLabel = isNewItemMode ? itemUnit : (selectedItem?.unit || "Units");

  return (
    <div>
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast toast={toast} onDismiss={dismissToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      <div className=" w-full">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${LIME}1a`, color: LIME }}
            >
              <PackagePlus size={22} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                Inventory Action Management
              </h1>
              <p className="text-sm text-gray-500">
                Add, remove, or register stock with full transaction history.
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-100 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6 p-5 sm:p-8"
            aria-label="Inventory action form"
          >
            <div ref={comboboxRef} className="relative">
              <FieldLabel htmlFor={`${formId}-item-trigger`} required>
                Select Item
              </FieldLabel>

              <button
                id={`${formId}-item-trigger`}
                type="button"
                role="combobox"
                aria-expanded={isDropdownOpen}
                aria-controls={listboxId}
                aria-haspopup="listbox"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={cn(
                  inputClassName,
                  "flex items-center justify-between text-left",
                  !selectedItemId && "text-gray-400",
                )}
              >
                <span className="flex min-w-0 items-center gap-2 truncate">
                  {isNewItemMode ? (
                    <Plus size={16} className="shrink-0" style={{ color: LIME }} />
                  ) : (
                    <Package size={16} className="shrink-0 text-gray-400" />
                  )}
                  <span className="truncate">{comboboxLabel}</span>
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 text-gray-400 transition-transform",
                    isDropdownOpen && "rotate-180",
                  )}
                />
              </button>

              {selectedItem && !isNewItemMode && (
                <p className="mt-1.5 text-xs text-gray-500">
                  Current stock:{" "}
                  <span className="font-medium text-gray-700">
                    {selectedItem.currentStock} {selectedItem.unit || "units"}
                  </span>
                </p>
              )}

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
                  >
                    <div className="flex items-center gap-2 border-b border-gray-100 p-2.5">
                      <Search size={16} className="shrink-0 text-gray-400" />
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search or select an item..."
                        className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
                        aria-label="Search items"
                        autoFocus
                      />
                    </div>

                    <ul
                      id={listboxId}
                      role="listbox"
                      className="max-h-56 overflow-y-auto py-1"
                    >
                      {isLoadingItems && (
                        <li className="flex items-center gap-2 px-3 py-3 text-sm text-gray-500">
                          <Loader2 size={16} className="animate-spin" />
                          Loading items...
                        </li>
                      )}

                      {isItemsError && (
                        <li className="px-3 py-3 text-sm text-red-500">
                          Failed to load items. Please refresh.
                        </li>
                      )}

                      {!isLoadingItems &&
                        !isItemsError &&
                        filteredItems.length === 0 && (
                          <li className="px-3 py-3 text-sm text-gray-500">
                            No items match your search.
                          </li>
                        )}

                      {filteredItems.map((item: InventoryItemResponse & { unit?: string }) => (
                        <li
                          key={item._id}
                          role="option"
                          aria-selected={selectedItemId === item._id}
                        >
                          <button
                            type="button"
                            onClick={() => handleItemSelect(item._id)}
                            className={cn(
                              "flex w-full items-center justify-between px-3 py-2.5 text-left text-sm text-gray-800 transition-colors hover:bg-gray-50",
                              selectedItemId === item._id && "bg-[#ccff66]/10",
                            )}
                            style={
                              selectedItemId === item._id
                                ? { color: LIME }
                                : undefined
                            }
                          >
                            <span>{item.name}</span>
                            <span className="text-xs text-gray-500">
                              {item.currentStock} {item.unit || "in stock"}
                            </span>
                          </button>
                        </li>
                      ))}

                      <li
                        role="separator"
                        className="my-1 border-t border-gray-100"
                        aria-hidden="true"
                      />

                      <li role="option" aria-selected={isNewItemMode}>
                        <button
                          type="button"
                          onClick={() => handleItemSelect(ADD_NEW_ITEM_VALUE)}
                          className={cn(
                            "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-[#ccff66]/10",
                            isNewItemMode && "bg-[#ccff66]/10",
                          )}
                          style={{ color: LIME }}
                        >
                          <Plus size={16} />
                           Add New Item
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {selectedItemId && (
                <motion.div
                  key="action-selector"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fieldVariants}
                  className="overflow-hidden"
                >
                  <p className="mb-2.5 text-sm font-medium text-gray-700">
                    Choose Action
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setStockAction("add")}
                      disabled={isNewItemMode}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff66]/40",
                        stockAction === "add" || isNewItemMode
                          ? "border-[#ccff66] bg-[#ccff66]/15"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300",
                        isNewItemMode && "cursor-default opacity-100",
                      )}
                    >
                      <PackagePlus
                        size={28}
                        style={
                          stockAction === "add" || isNewItemMode
                            ? { color: LIME }
                            : undefined
                        }
                        className={
                          stockAction === "add" || isNewItemMode
                            ? undefined
                            : "text-gray-400"
                        }
                      />
                      <span
                        className="text-sm font-semibold"
                        style={
                          stockAction === "add" || isNewItemMode
                            ? { color: LIME }
                            : undefined
                        }
                      >
                        Add Stock / Buy
                      </span>
                      {isNewItemMode && (
                        <span className="text-[10px] uppercase tracking-wide text-gray-500">
                          Locked for new items
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setStockAction("remove")}
                      disabled={isNewItemMode}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 disabled:cursor-not-allowed disabled:opacity-40",
                        stockAction === "remove" && !isNewItemMode
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300",
                      )}
                    >
                      <PackageMinus
                        size={28}
                        className={
                          stockAction === "remove" && !isNewItemMode
                            ? "text-red-500"
                            : "text-gray-400"
                        }
                      />
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          stockAction === "remove" && !isNewItemMode
                            ? "text-red-600"
                            : "text-gray-700",
                        )}
                      >
                        Remove Stock / Damaged
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {selectedItemId && (
                <motion.div
                  key={`fields-${isNewItemMode ? "new" : stockAction}`}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fieldVariants}
                  className="space-y-5 overflow-hidden"
                >
                  <div>
                    <FieldLabel htmlFor={`${formId}-quantity`} required>
                      Quantity
                    </FieldLabel>
                    <QuantityStepper
                      value={quantity}
                      onChange={setQuantity}
                      min={maxQuantity === 0 ? 0 : 1}
                      max={maxQuantity}
                      unitLabel={currentUnitLabel}
                    />
                    {isRemoveMode && selectedItem?.currentStock === 0 && (
                      <p className="mt-2 text-xs text-red-500">
                        This item has no stock available to remove.
                      </p>
                    )}
                  </div>

                  {!isNewItemMode && stockAction === "add" && (
                    <div>
                      <FieldLabel htmlFor={`${formId}-vendor`} >
                        Vendor Name
                        <span className="ml-1 text-xs font-normal text-gray-400">
                          (optional)
                        </span>
                      </FieldLabel>
                      <input
                        id={`${formId}-vendor`}
                        type="text"
                        value={vendorName}
                        onChange={(e) => setVendorName(e.target.value)}
                        placeholder="Who supplied this stock?"
                        className={inputClassName}
                      />
                    </div>
                  )}

                  {!isNewItemMode && stockAction === "remove" && (
                    <div>
                      <FieldLabel
                        htmlFor={`${formId}-remove-reason`}
                        required
                      >
                        Reason for Removal
                      </FieldLabel>
                      <select
                        id={`${formId}-remove-reason`}
                        value={removeReason}
                        onChange={(e) => setRemoveReason(e.target.value)}
                        className={cn(inputClassName, "cursor-pointer")}
                        required
                      >
                        <option value="" disabled>
                          Select a reason
                        </option>
                        {REMOVE_REASONS.map((reason) => (
                          <option key={reason} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {isNewItemMode && (
                    <>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                          <FieldLabel
                            htmlFor={`${formId}-new-item-name`}
                            required
                          >
                            New Item Name
                          </FieldLabel>
                          <input
                            id={`${formId}-new-item-name`}
                            type="text"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="e.g. Organic Almond Milk"
                            className={inputClassName}
                            required
                          />
                        </div>

                        <div>
                          <FieldLabel
                            htmlFor={`${formId}-item-unit`}
                            required
                          >
                            Unit Type
                          </FieldLabel>
                          <select
                            id={`${formId}-item-unit`}
                            value={itemUnit}
                            onChange={(e) => setItemUnit(e.target.value)}
                            className={cn(inputClassName, "cursor-pointer")}
                            required
                          >
                            {UNIT_OPTIONS.map((unit) => (
                              <option key={unit} value={unit}>
                                {unit}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <FieldLabel
                          htmlFor={`${formId}-new-vendor`}
                          required
                        >
                          Vendor Name
                        </FieldLabel>
                        <input
                          id={`${formId}-new-vendor`}
                          type="text"
                          value={newVendorName}
                          onChange={(e) => setNewVendorName(e.target.value)}
                          placeholder="Who supplied the item?"
                          className={inputClassName}
                          required
                        />
                      </div>

                      <div>
                        <FieldLabel htmlFor={`${formId}-purchase-notes`}>
                          Purchase Notes
                        </FieldLabel>
                        <textarea
                          id={`${formId}-purchase-notes`}
                          value={purchaseNotes}
                          onChange={(e) => setPurchaseNotes(e.target.value)}
                          placeholder="Invoice details, batch info, delivery notes..."
                          rows={3}
                          className={cn(inputClassName, "resize-none")}
                        />
                      </div>

                      <div>
                        <FieldLabel
                          htmlFor={`${formId}-amount-paid`}
                          required
                        >
                          Amount Paid
                        </FieldLabel>
                        <div className="relative">
                          <span
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400"
                            aria-hidden="true"
                          >
                            $
                          </span>
                          <input
                            id={`${formId}-amount-paid`}
                            type="number"
                            min={0}
                            step="0.01"
                            inputMode="decimal"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                            placeholder="0.00"
                            className={cn(
                              inputClassName,
                              "pl-7 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                            )}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff66]/30 disabled:opacity-50"
              >
                <RotateCcw size={16} />
                Reset Form
              </button>

              <button
                type="submit"
                disabled={
                  !selectedItemId ||
                  isSubmitting ||
                  (isRemoveMode && (selectedItem?.currentStock ?? 0) === 0) ||
                  quantity < 1
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-gray-900 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff66]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: LIME }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {isNewItemMode ? (
                      <PackagePlus size={16} />
                    ) : stockAction === "remove" ? (
                      <PackageMinus size={16} />
                    ) : (
                      <PackagePlus size={16} />
                    )}
                    {isNewItemMode
                      ? "Register New Item"
                      : stockAction === "remove"
                        ? "Remove Stock"
                        : "Add Stock"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}