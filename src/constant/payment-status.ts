const PAYMENT_STATUS = [
    { value: "unpaid", label: "Unpaid", bgColor: "bg-red-100", textColor: "text-red-800" },
    { value: "paid", label: "Paid", bgColor: "bg-green-100", textColor: "text-green-800" },
    { value: "partially_paid", label: "Partially Paid", bgColor: "bg-yellow-100", textColor: "text-yellow-800" },
    { value: "refunded", label: "Refunded", bgColor: "bg-blue-100", textColor: "text-blue-800" },
    { value: "partially_refunded", label: "Partially Refunded", bgColor: "bg-indigo-100", textColor: "text-indigo-800" },
    { value: "failed", label: "Failed", bgColor: "bg-gray-100", textColor: "text-gray-800" },
]

export default PAYMENT_STATUS;
export type PaymentStatusType = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];