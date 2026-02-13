interface CreateOrderDataType {
    name?: string;
    phoneNumber: string;
    address?: string;
    division?: string;
    remark?: string;
    variations?: Array<{
        variationId: string;
        quantity: number;
    }>;
    source?: string;
}

export default CreateOrderDataType;