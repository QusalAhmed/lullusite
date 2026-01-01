const DIVISION_LIST = [
    {value: "dhaka", label: "ঢাকা বিভাগ", code: "DHK"},
    {value: "chattogram", label: "চট্টগ্রাম বিভাগ", code: "CTG"},
    {value: "rajshahi", label: "রাজশাহী বিভাগ", code: "RJH"},
    {value: "khulna", label: "খুলনা বিভাগ", code: "KHL"},
    {value: "barishal", label: "বরিশাল বিভাগ", code: "BSL"},
    {value: "sylhet", label: "সিলেট বিভাগ", code: "SYL"},
    {value: "rangpur", label: "রংপুর বিভাগ", code: "RNG"},
    {value: "mymensingh", label: "ময়মনসিংহ বিভাগ", code: "MYM"},
] as const;

export default DIVISION_LIST;
export type DivisionType = (typeof DIVISION_LIST)[number]['value'];