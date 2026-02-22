import React, { useState, useEffectEvent, useEffect} from 'react';
import { cn } from "@/lib/utils";

// ShadCN
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
} from "@/components/ui/input-group"
import TextareaAutosize from "react-textarea-autosize"
import { toast } from 'sonner';

// Icon
import { Pencil, Check, X } from 'lucide-react';

// Tanstack Query
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Action
import updateSellerNote from '@/actions/order/update-seller-note';

const SellerNote = ({note, orderId}: { note: string | null; orderId: string }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentNote, setCurrentNote] = useState(note || '');
    const queryClient = useQueryClient();
    const {mutate: mutateNote, isPending} = useMutation({
        mutationFn: () => updateSellerNote({orderId, note: currentNote.trim()}),
        onSuccess: (data) => {
            setIsEditing(false);
            toast.success(data.message);
            queryClient.invalidateQueries({queryKey: ['order', orderId]}).then(r => console.log(r));
        },
        onError: (error) => {
            console.error('Error updating note:', error);
            toast.error('Failed to update note. Please try again.');
        },
    });
    
    const updateNote = useEffectEvent(() => {
        if (note) {
            setCurrentNote(note);
        }
    });
    useEffect(() => {
        updateNote();
    }, [note]);

    return (
        <div className="grid w-full max-w-sm gap-6">
            <InputGroup>
                <TextareaAutosize
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    data-slot="input-group-control"
                    className={cn(
                        'flex field-sizing-content w-full resize-none rounded-md px-2 py-1',
                        currentNote ? 'bg-lime-500 font-semibold' : undefined,
                    )}
                    placeholder="Add note..."
                />
                <InputGroupAddon align="block-end" className="p-0 m-0">
                    {isEditing ? (
                        <>
                            <InputGroupButton
                                onClick={() => mutateNote()}
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
                        </>
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