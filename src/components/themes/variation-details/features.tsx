import React from "react";

// Icon
import { BadgeCheckIcon } from "lucide-react"

// ShadCN
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"

const features = [
    {
        title: "Our motive",
        description: "আমাদের কোয়ালিটির গুড় ভালো কোনো স্টোর থেকে কিনলে ৬০০/৭০০ টাকা কেজি নিবে। তারা আমাদের মত কারও থেকেই নিয়ে যায়" +
            "কিন্তু আমরা দাম পাইনা। তাই আমি চেষ্টা করছি অনলাইনে মোটা মুটি একটা দামে বিক্রি করার জন্য যাতে আমাদেরও লস না হয় আর" +
            " আপনাদেরও বেশি দামে কেনা না লাগে।"
    },
    {
        title: "Verified Quality",
        description: "প্রথমত গুড় আমাদের নিজেদের বাসার। কোনো চাষীর থেকে সংগ্রহ করলে ভেজাল দেওয়ার সম্ভাবনা থাকে। অনেক\n" +
            "                চাষী বেশী টাকা পেয়েও লোভে পড়ে ভেজাল দেয়। যেহেতু আমাদের নিজেদের গুড় তাই এমন হওয়ার সম্ভাবনা নেই।",
    },
    {
        title: "Trusted Prices",
        description: "আমাদের থেকে কিনে ব্যবসায়ীরা অনেক বেশিদামে গুড় বিক্রি করে। সরাসরি আমাদের থেকে কিনলে নায্যমূল্যে গুড়\n" +
            "                কিনতে পারবেন।\n" +
            "            ",
    },
    {
        title: "Hygienic Production",
        description: "গুড় বানানোর সময় আমারা শতভাগ হাইজিন মেইনটেইন করি",
    },
    {
        title: "Cash on Delivery",
        description: "অগ্রিম টাকা ছাড়াই গুড় অর্ডার করতে পারবেন। গুড় পেয়ে টাকা পরিশোধ করতে পারবেন।",
    },
];

const FeaturesSection = () => {
    return (
        <section aria-labelledby="why-buy" className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10 md:py-12">
            <div className="text-center mb-8">
                <h2 id="why-buy" className="text-2xl sm:text-3xl font-semibold tracking-tight">
                    কেন আমাদের থেকে কিনবেন?
                </h2>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                    আপনার কেনাকাটা আরও সহজ, নিরাপদ এবং আনন্দময় করতে আমরা প্রতিশ্রুতিবদ্ধ।
                </p>
            </div>
            <div className="flex w-full max-w-md flex-col gap-2 md:max-w-none md:grid md:grid-cols-2 md:gap-6 mx-auto">
                {features.map((feature, index) => (
                    <Item key={index} variant="outline" size="sm">
                        <ItemMedia>
                            <BadgeCheckIcon className="size-5" color={'blue'}/>
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>{feature.title}</ItemTitle>
                            <ItemDescription>{feature.description}</ItemDescription>
                        </ItemContent>
                    </Item>
                ))}
            </div>
        </section>
    );
};

export default FeaturesSection;
