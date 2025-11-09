import * as z from "zod";
import { startCase } from "lodash";

const subcategoryFormSchema = z.object({
    category: z
        .string()
        .min(1, "Please select a category.")
    ,
    name: z
        .string()
        .min(1, "Must be at least 1 character.")
        .max(128, "Must be at most 128 characters.")
        .nonempty("Name is required.")
        .transform((val) => startCase(val.toLowerCase())),
    description: z
        .string()
        .max(100, "Description must be at most 100 characters."),
})

export default subcategoryFormSchema;