const ORDER_STATUS = [
    { value: 'pending', label: 'Pending', description: 'Order has been placed but not yet confirmed.' },
    { value: 'confirmed', label: 'Confirmed', description: 'Order has been confirmed and is being processed.' },
    { value: 'ready_to_ship', label: 'Ready to Ship', description: 'Order is packed and ready to be shipped.' },
    { value: 'shipped', label: 'Shipped', description: 'Order has been shipped to the customer.' },
    { value: 'delivered', label: 'Delivered', description: 'Order has been delivered to the customer.' },
    { value: 'partially_delivered', label: 'Partially Delivered', description: 'Some items in the order have been delivered.' },
    { value: 'cancelled', label: 'Cancelled', description: 'Order has been cancelled.' },
    { value: 'returned', label: 'Returned', description: 'Order has been returned by the customer.' },
    { value: 'refunded', label: 'Refunded', description: 'Order has been refunded to the customer.' },
    { value: 'partially_refunded', label: 'Partially Refunded', description: 'Some items in the order have been refunded.' },
] as const;

export default ORDER_STATUS;
export type OrderStatusType = (typeof ORDER_STATUS[number])['value'];