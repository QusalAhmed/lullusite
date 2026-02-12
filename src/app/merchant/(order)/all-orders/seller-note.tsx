import React, {useState} from 'react';
import {cn} from "@/lib/utils";

// ShadCN
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
} from "@/components/ui/input-group"
import TextareaAutosize from "react-textarea-autosize"
import {toast} from 'sonner';

// Icon
import { Pencil, Check, X } from 'lucide-react';

// Tanstack Query
import { useMutation } from '@tanstack/react-query';

// Action
import updateSellerNote from '@/actions/order/update-seller-note';

const SellerNote = ({note, orderId}: { note: string |  null; orderId: string }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentNote, setCurrentNote] = useState(note || '');
    const { mutate: updateNote, isPending } = useMutation({
        mutationFn: () => updateSellerNote({ orderId, note: currentNote.trim() }),
        onSuccess: (data) => {
            setIsEditing(false);
            toast.success(data.message);
        },
        onError: (error) => {
            console.error('Error updating note:', error);
            toast.error('Failed to update note. Please try again.');
        },
    });

    return (
        <div className="grid w-full max-w-sm gap-6">
            <InputGroup>
                <TextareaAutosize
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    data-slot="input-group-control"
                    className={cn(
                        'flex field-sizing-content w-full resize-none rounded-md px-2 py-1 m-1',
                        currentNote ? 'bg-lime-500 font-semibold' : undefined,
                    )}
                    placeholder="Add note..."
                />
                <InputGroupAddon align="inline-end">
                    {isEditing ? (
                        <div className={'flex flex-col'}>
                            <InputGroupButton
                                onClick={() => updateNote()}
                                disabled={isPending}
                            >
                                <Check size={16}/>
                            </InputGroupButton>
                            <InputGroupButton
                                onClick={() => {
                                    setIsEditing(false);
                                    setCurrentNote(note || '');
                                }}
                                disabled={isPending}
                            >
                                <X size={16}/>
                            </InputGroupButton>
                        </div>
                    ) : (
                        <InputGroupButton
                            onClick={() => setIsEditing(true)}
                        >
                            <Pencil size={16}/>
                        </InputGroupButton>
                    )}
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
};

export default SellerNote;