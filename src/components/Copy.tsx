import React, { useState } from 'react';
import { toast } from "sonner";

// Framer Motion
import { motion } from "motion/react";

// Icons
import { Copy, Check } from "lucide-react";

const CopyUI = ({text}: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            toast.success("Copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <div className="flex items-center">
            {text}
            {
                copied ?
                    <motion.div initial={{opacity: 0, scale: 0.2}} animate={{opacity: 1, scale: 1}} transition={{duration: 0.2}}>
                        <Check
                            className="inline-block ml-1 w-4 h-4 text-green-500"
                        />
                    </motion.div> :
                    <motion.div
                        initial={{opacity: 0, translateY: 0}}
                        whileHover={{scale: 1.2}}
                        animate={{translateY: [10, 0], opacity: 1}}
                        transition={{duration: 0.3}}
                    >
                        <Copy
                            className="inline-block ml-1 cursor-pointer hover:text-gray-700"
                            onClick={handleCopy}
                            color={'#6b7280'}
                            size={12}
                        />
                    </motion.div>
            }
        </div>
    );
};

export default CopyUI;