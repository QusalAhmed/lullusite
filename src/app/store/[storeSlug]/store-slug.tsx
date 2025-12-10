'use client';

import React from 'react';

// Redux
import { useDispatch } from "react-redux";
import { setStoreSlug } from "@/lib/redux/features/store/store-slug";

const StoreSlug = ({storeSlug}: { storeSlug: string }) => {
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(setStoreSlug(storeSlug));
    }, [storeSlug, dispatch]);

    return null;
};

export default StoreSlug;