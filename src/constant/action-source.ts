const ACTION_SOURCE = [
    { value: 'email', label: 'Email' },
    { value: 'website', label: 'Website' },
    { value: 'app', label: 'App' },
    { value: 'phone_call', label: 'Phone Call' },
    { value: 'chat', label: 'Chat' },
    { value: 'physical_store', label: 'Physical Store' },
    { value: 'system_generated', label: 'System Generated' },
    { value: 'business_messaging', label: 'Business Messaging' },
    { value: 'other', label: 'Other' },
]

export default ACTION_SOURCE;
export type ActionSourceType = (typeof ACTION_SOURCE[number])['value'];