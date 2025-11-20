"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation";

// Form
import ImageZone from "@/components/image-zone";
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useFieldArray } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

// Actions
import getCategory from "@/actions/category/get-category"
import addProduct from "@/actions/product/add-product"

// Type
import type { GetCategoryType } from "@/actions/category/get-category"
import type { ImageZoneType } from "@/types/image-zone"

// Validations
import productFormSchema from "@/lib/validations/product.schema"

//ShadCN
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldContent,
    FieldSet,
    FieldLegend
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
    InputGroupInput,
    InputGroupButton,
} from "@/components/ui/input-group"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu"

// Icon
import { ChevronDown, XIcon } from "lucide-react"

export default function AddProductForm() {
    // Categories list
    const [categories, setCategories] = useState<GetCategoryType>()
    // We store the selected subcategory ID (not the label) to submit to backend
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("")
    // When there is no subcategory, allow selecting the main category id
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")
    // Image
    const [images, setImages] = useState<ImageZoneType[]>([])
    // Router
    const router = useRouter();

    const form = useForm<z.infer<typeof productFormSchema>>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: "memoize useImages so that it doesn't change while drilling",
            name_local: "",
            images: [],
            description: "memoize useImages so that it doesn't change while drilling",
            category: "",
            subcategory: "",
            sellerSKU: "",
            tags: [{tag: ""}],
            youtubeVideoLink: "",
            seoDescription: "",
            variations: [{name: "", price: 0, stock: 0, weight: 0, image: []}],
        },
    })

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "tags",
    })

    const {fields: variationFields, append: variationAppend, remove: variationRemove} = useFieldArray({
        control: form.control,
        name: "variations",
    })

    // Helper to fetch categories
    const refreshCategories = () => {
        getCategory().then((res) => {
            setCategories(res)
        }).catch(() => {
            toast.error("Failed to load categories. Please try again.")
        })
    }

    useEffect(() => {
        refreshCategories()
    }, [])

    useEffect(() => {
        form.register("category")
    }, [form]);

    useEffect(() => {
        console.log('Images: ', images);

        // Clear all duplicate images based on serverImageId from images state
        const uniqueImagesMap = new Map<string, ImageZoneType>();
        images.forEach(image => {
            if (image.serverImageId) {
                uniqueImagesMap.set(image.serverImageId, image);
            }
        });

        // Map images to fields based on identifier
        images.forEach(image => {
            const identifier = image.identifier;
            if (identifier && image.status === 'uploaded' && image.serverImageId) {
                // Set to main product image
                if (identifier === "main-product-image") {
                    const currentImages: string[] = form.getValues("images") || [];
                    form.setValue("images", [
                        ...new Set([...currentImages, image.serverImageId])
                    ]);
                    // Trigger form validation
                    form.trigger("images").then(r => console.log("Triggered image validation:", r));
                    return;
                }

                // Find the index of the variation with matching field.id
                const variationIndex = variationFields.findIndex(field => field.id === identifier);
                if (variationIndex !== -1) {
                    const currentImages: string[] = form.getValues(`variations.${variationIndex}.image`) || [];
                    // Update the form value for that variation's image field
                    form.setValue(`variations.${variationIndex}.image`, [
                        ...new Set([...currentImages, image.serverImageId])
                    ]);
                }
            }
        });
    }, [images, form, variationFields]);

    // Resolve the label to show in trigger from selected ID
    const selectedSubcategoryLabel = useMemo(() => {
        if (!categories) return ""
        if (selectedSubcategoryId) {
            for (const cat of categories) {
                const match = cat.subCategories.find((s) => s.id === selectedSubcategoryId)
                if (match) return `${cat.name} › ${match.name}`
            }
        }
        if (selectedCategoryId) {
            const cat = categories.find(c => c.id === selectedCategoryId)
            if (cat) return `${cat.name}`
        }
        return ""
    }, [categories, selectedSubcategoryId, selectedCategoryId])

    function onSubmit(data: z.infer<typeof productFormSchema>) {
        console.log("Form submitted:", data)
        addProduct(data)
            .then((response) => {
                if (response.success) {
                    toast.success("Product added successfully!")
                    setTimeout(() => {
                        router.push('add-product/success/' + response.productId);
                    }, 1000);
                }
                else
                    toast.error(response.message || "Failed to add product. Please try again.")
            })
            .catch((error) => {
                console.error("Error adding product:", error)
                toast.error(
                    error?.message || "Failed to add product. Please try again."
                )
            })
    }

    return (
        <form id="form-add-product" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    name="name"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-product-name">
                                Product Name (English)
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-product-name"
                                aria-invalid={fieldState.invalid}
                                placeholder="English product name"
                                autoComplete="on"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="name_local"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-product-name-local">
                                Product Name (Bengali)
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-product-name-local"
                                aria-invalid={fieldState.invalid}
                                placeholder="Bangla product name"
                                autoComplete="on"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="youtubeVideoLink"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-youtube-video-link">
                                YouTube Video Link
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-youtube-video-link"
                                aria-invalid={fieldState.invalid}
                                placeholder="Youtube video link"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                            <FieldDescription>
                                Video is important to showcase your product to customers.
                                Upload video to YouTube and paste the link here.
                            </FieldDescription>
                        </Field>
                    )}
                />

                <Controller
                    name="images"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-main-image">
                                Main product image
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-main-image"
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                                type='hidden'
                            />
                            {images.length > 0 && (
                                <aside className="mb-4">
                                    <div className={'flex flex-row items-start justify-start gap-2 flex-wrap'}>
                                        {images.filter(img => img.identifier === "main-product-image").map((img) => (
                                            <div key={img.imageId}
                                                 className="relative w-24 h-24 border rounded-md overflow-hidden">
                                                <Image
                                                    src={img.preview}
                                                    alt="Main Product Image"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute top-1 right-1 bg-white rounded-full p-1 hover:bg-red-100"
                                                    onClick={() => {
                                                        // Remove image from state
                                                        setImages((prevImages) =>
                                                            prevImages.filter((image) => image.imageId !== img.imageId)
                                                        );
                                                        // Also remove from form values
                                                        const currentImages: string[] = form.getValues("images") || [];
                                                        form.setValue(
                                                            "images",
                                                            currentImages.filter((imageId) => imageId !== img.serverImageId)
                                                        );
                                                    }}
                                                >
                                                    <XIcon className="w-4 h-4 text-red-500"/>
                                                </button>
                                                {img.status === 'uploading' && (
                                                    <div
                                                        className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 animate-pulse"/>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </aside>
                            )}
                            <ImageZone
                                setImage={setImages}
                                dropComponent={
                                    <div
                                        className="p-4 border-2 border-dashed border-gray-300 rounded-md text-center text-gray-500"
                                    >
                                        Drag & drop images here, or click to select files
                                    </div>
                                }
                                dragComponent={
                                    <div
                                        className="p-4 border-2 border-dashed border-blue-300 rounded-md text-center text-blue-500 bg-blue-50"
                                    >
                                        Drop images to upload
                                    </div>
                                }
                                identifier="main-product-image"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                            <FieldDescription>
                                Upload main product image. This image will be used as the primary
                                image for your product listing.
                                Don&#39;t upload more than <span className='font-semibold'>8</span> images.
                            </FieldDescription>
                        </Field>
                    )}
                />

                <Controller
                    name="subcategory"
                    control={form.control}
                    render={({fieldState}) => (
                        <Field data-invalid={fieldState.invalid}
                        >
                            <FieldContent>
                                <FieldLabel htmlFor="form-category-select" className="flex flex-col md:flex-row gap-4">
                                    Select Category
                                    <Link href="/merchant/category" target="_blank"
                                          className="text-sm font-normal underline text-primary hover:text-primary/80">
                                        Add Category
                                    </Link>
                                    <Button variant="outline"
                                            size="sm"
                                            type="button"
                                            onClick={refreshCategories}
                                    >
                                        Refresh
                                    </Button>
                                </FieldLabel>
                                <FieldDescription>
                                    Choose the category that best fits your product.
                                </FieldDescription>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </FieldContent>
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    className="px-2 py-1 border border-input bg-background rounded-md text-left flex items-center justify-between hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!categories || categories.length === 0}
                                >
                                    {selectedSubcategoryLabel || <span className={'text-gray-500'}>Select Category</span>}
                                    <ChevronDown/>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => {
                                        setSelectedSubcategoryId("");
                                        setSelectedCategoryId("");
                                        form.setValue("subcategory", "", {shouldValidate: true, shouldDirty: true});
                                        form.setValue("category", "", {shouldValidate: true, shouldDirty: true});
                                    }}>
                                        Clear
                                    </DropdownMenuItem>
                                    <DropdownMenuLabel className={'text-gray-500'}>Select Category</DropdownMenuLabel>
                                    {categories?.map((category) => (
                                        <DropdownMenuSub key={category.id}>
                                            <DropdownMenuSubTrigger>
                                                {category.name}
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    {category.subCategories.length > 0 ? (
                                                        <DropdownMenuRadioGroup
                                                            value={selectedSubcategoryId}
                                                            onValueChange={(val) => {
                                                                setSelectedSubcategoryId(val);
                                                                setSelectedCategoryId(category.id);
                                                                form.setValue("category", category.id, {
                                                                    shouldValidate: false,
                                                                    shouldDirty: true
                                                                });
                                                                form.setValue("subcategory", val, {
                                                                    shouldValidate: true,
                                                                    shouldDirty: true
                                                                });
                                                                form.clearErrors(["subcategory", "category"])
                                                            }}
                                                        >
                                                            {category.subCategories.map((subCategory) => (
                                                                <DropdownMenuRadioItem
                                                                    key={subCategory.id}
                                                                    value={subCategory.id}
                                                                >
                                                                    {subCategory.name}
                                                                </DropdownMenuRadioItem>
                                                            ))}
                                                        </DropdownMenuRadioGroup>
                                                    ) : (
                                                        <DropdownMenuItem onClick={() => {
                                                            setSelectedCategoryId(category.id);
                                                            setSelectedSubcategoryId("");
                                                            form.setValue("subcategory", "", {
                                                                shouldValidate: false,
                                                                shouldDirty: true
                                                            });
                                                            form.setValue("category", category.id, {
                                                                shouldValidate: true,
                                                                shouldDirty: true
                                                            });
                                                            form.clearErrors(["subcategory", "category"])
                                                        }}>
                                                            Select {category.name}
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </Field>
                    )}
                />
                <FieldSet className="gap-4">
                    <FieldLegend variant="label">Add Tags</FieldLegend>
                    <FieldDescription>
                        Add product tag for seo and search optimization.
                    </FieldDescription>
                    <FieldGroup className="gap-4">
                        {fields.map((field, index) => (
                            <Controller
                                key={field.id}
                                name={`tags.${index}.tag`}
                                control={form.control}
                                render={({field: controllerField, fieldState}) => (
                                    <Field
                                        orientation="horizontal"
                                        data-invalid={fieldState.invalid}
                                    >
                                        <FieldContent>
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...controllerField}
                                                    id={`form-tag-${index}`}
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="product tag"
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupButton
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon-xs"
                                                        onClick={() => remove(index)}
                                                        aria-label={`Remove email ${index + 1}`}
                                                    >
                                                        <XIcon/>
                                                    </InputGroupButton>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </FieldContent>
                                    </Field>
                                )}
                            />
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({tag: ""})}
                        >
                            Add Tag
                        </Button>
                    </FieldGroup>
                    {form.formState.errors.tags?.root && (
                        <FieldError errors={[form.formState.errors.tags.root]}/>
                    )}
                </FieldSet>
                <Controller
                    name="seoDescription"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-seo-description">
                                SEO Description
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    id="form-seo-description"
                                    placeholder="Enter SEO description for your product."
                                    rows={6}
                                    className="min-h-24 resize-none"
                                    aria-invalid={fieldState.invalid}
                                />
                                <InputGroupAddon align="block-end">
                                    <InputGroupText className="tabular-nums">
                                        {field.value.length}/255 characters
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            <FieldDescription>
                                SEO description helps improve your product&#39;s visibility on search engines.
                            </FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="description"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-description">
                                Description
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupTextarea
                                    {...field}
                                    id="form-description"
                                    placeholder="I'm having an issue with the login button on mobile."
                                    rows={8}
                                    className="min-h-36 resize-none"
                                    aria-invalid={fieldState.invalid}
                                />
                                <InputGroupAddon align="block-end">
                                    <InputGroupText className="tabular-nums">
                                        {(field.value?.length ?? 0)}/100 characters
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            <FieldDescription>
                                Include steps to reproduce, expected behavior, and what
                                actually happened.
                            </FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="sellerSKU"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid} orientation="responsive">
                            <FieldLabel htmlFor="form-seller-sku">
                                Seller SKU
                            </FieldLabel>
                            <Input
                                {...field}
                                id="form-youtube-video-link"
                                aria-invalid={fieldState.invalid}
                                placeholder="seller sku"
                            />
                            <FieldDescription>
                                Seller unique sku
                            </FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />
                <FieldSet className="gap-4">
                    <FieldLegend variant="label">Add Variation</FieldLegend>
                    <FieldGroup className="gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => variationAppend({name: "", price: 0, stock: 0, weight: 0, image: []})}
                        >
                            Add Variation
                        </Button>
                        <FieldDescription>
                            NB: Product variation can&#39;t be empty. Remove empty variation
                        </FieldDescription>
                        {variationFields.map((field, index) => (
                            <div key={field.id}
                                 className="border rounded-lg p-4 space-y-4 relative grid grid-cols-2 gap-4"
                            >
                                <div className="flex justify-between items-center mb-2 col-span-full">
                                    <h4 className="font-medium text-md">
                                        Variation #<span className={'text-gray-500 font-semibold text-lg pl-1'}>{index + 1}</span>
                                    </h4>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-lg"
                                        onClick={() => variationRemove(index)}
                                        aria-label={`Remove variation ${index + 1}`}
                                    >
                                        <XIcon/>
                                    </Button>
                                </div>

                                <Controller
                                    name={`variations.${index}.name`}
                                    control={form.control}
                                    render={({field: controllerField, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={`form-variation-name-${index}`}>
                                                Variation Name
                                            </FieldLabel>
                                            <Input
                                                {...controllerField}
                                                id={`form-variation-name-${index}`}
                                                aria-invalid={fieldState.invalid}
                                                placeholder="e.g., Small, Red, 100ml"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name={`variations.${index}.price`}
                                    control={form.control}
                                    render={({field: controllerField, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={`form-variation-price-${index}`}>
                                                Price
                                            </FieldLabel>
                                            <Input
                                                {...controllerField}
                                                id={`form-variation-price-${index}`}
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="0.00"
                                                onChange={(e) => controllerField.onChange(parseInt(e.target.value) || 0)}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name={`variations.${index}.stock`}
                                    control={form.control}
                                    render={({field: controllerField, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={`form-variation-stock-${index}`}>
                                                Stock
                                            </FieldLabel>
                                            <Input
                                                {...controllerField}
                                                id={`form-variation-stock-${index}`}
                                                type="number"
                                                step="1"
                                                min="-1"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Stock quantity"
                                                onChange={(e) => controllerField.onChange(parseInt(e.target.value) || '')}
                                            />
                                            <FieldDescription>
                                                Set stock -1 for unlimited stock
                                            </FieldDescription>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name={`variations.${index}.weight`}
                                    control={form.control}
                                    render={({field: controllerField, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={`form-variation-weight-${index}`}>
                                                Weight (kg)
                                            </FieldLabel>
                                            <Input
                                                {...controllerField}
                                                id={`form-variation-weight-${index}`}
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="0.00"
                                                onChange={(e) => controllerField.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name={`variations.${index}.image`}
                                    control={form.control}
                                    render={({fieldState}) => (
                                        <Field data-invalid={fieldState.invalid} orientation="responsive" className="col-span-full">
                                            <FieldLabel htmlFor={`form-variation-image-${index}`}>
                                                Image
                                            </FieldLabel>
                                            {images.length > 0 && (
                                                <aside className="mb-4">
                                                    <div className={'flex flex-row items-start justify-start gap-2 flex-wrap'}>
                                                        {images.filter(img => img.identifier === field.id).map((img) => (
                                                            <div key={img.imageId}
                                                                 className="relative w-24 h-24 border rounded-md overflow-hidden">
                                                                <Image
                                                                    src={img.preview}
                                                                    alt="Variation Image"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="absolute top-1 right-1 bg-white rounded-full p-1 hover:bg-red-100"
                                                                    onClick={() => {
                                                                        // Remove image from state
                                                                        setImages((prevImages) =>
                                                                            prevImages.filter((image) => image.imageId !== img.imageId)
                                                                        );
                                                                        // Also remove from form values
                                                                        const currentImages: string[] = form.getValues(`variations.${index}.image`) || [];
                                                                        form.setValue(
                                                                            `variations.${index}.image`,
                                                                            currentImages.filter((imageId) => imageId !== img.serverImageId)
                                                                        );
                                                                    }}
                                                                >
                                                                    <XIcon className="w-4 h-4 text-red-500"/>
                                                                </button>
                                                                {img.status === 'uploading' && (
                                                                    <div
                                                                        className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 animate-pulse"/>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </aside>
                                            )}
                                            <ImageZone
                                                setImage={setImages}
                                                dropComponent={
                                                    <div
                                                        className="p-4 border-2 border-dashed border-gray-300 rounded-md text-center text-gray-500">
                                                        Drag & drop images here, or click to select files
                                                    </div>
                                                }
                                                dragComponent={
                                                    <div
                                                        className="p-4 border-2 border-dashed border-blue-300 rounded-md text-center text-blue-500 bg-blue-50">
                                                        Drop images to upload
                                                    </div>
                                                }
                                                identifier={field.id}
                                                maxFiles={1}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]}/>
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>
                        ))}
                    </FieldGroup>
                    {form.formState.errors.variations?.root && (
                        <FieldError errors={[form.formState.errors.variations.root]}/>
                    )}
                </FieldSet>
                <Field orientation="horizontal">
                    <Button type="submit"
                            form="form-add-product"
                            disabled={form.formState.isSubmitting}
                            className="w-full"
                            variant="outline"
                    >
                        {form.formState.isSubmitting ? "Submitting..." : "Add Product"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
