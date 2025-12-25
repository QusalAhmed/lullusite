'use client';

    import React from 'react';

    // DotLottie React
    import { DotLottieReact } from '@lottiefiles/dotlottie-react';

    // Tanstack Query
    import { useQuery } from '@tanstack/react-query';

    // Actions
    import getBusinessInfo from '@/actions/store/get-business-info';

    const Floating = () => {
      const { data: businessInfo } = useQuery({
        queryKey: ['business-info'],
        queryFn: () => getBusinessInfo(),
        staleTime: Infinity,
      });

      if (!businessInfo) {
        return null;
      }

      return (
        <section className="fixed w-24 h-24 z-50 bottom-10 right-0 cursor-pointer">
          <DotLottieReact
            src="https://lottie.host/964f8569-6d5b-4abf-88b4-12a8bda80069/l3AbExb2U3.lottie"
            loop
            autoplay
            onClick={() => (window.location.href = `tel:${businessInfo.phone}`)}
          />
        </section>
      );
    };

    export default Floating;