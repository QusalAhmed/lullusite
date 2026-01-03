interface OrderDataType {
    id: string;
    name: string;
    imageUrl?: string;
    price: string;
    stock: string;
    sku: string;
    variations?: OrderDataType[];
}

export default OrderDataType;