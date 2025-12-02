'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'

// Embla Carousel
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

// Styles
import styles from './carousel.module.css'

// Types
import {ProductType} from "@/actions/store/get-product";
type Image = NonNullable<ProductType>['variations'][number]['images'][number];

export default function Carousel(
    {images}: {images: Image[]}
) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        skipSnaps: false,
    }, [
        Autoplay({
            delay: 3000,
            stopOnInteraction: false
        })
    ]);

    useEffect(() => {
        if(emblaApi) {
            console.log(emblaApi.slideNodes()) // Access API
        }
    }, [emblaApi]);

    return (
        <div className={styles.embla} ref={emblaRef}>
            <div className={styles.embla__container}>
                {images.map(({image}, index) => (
                    <div className={styles.embla__slide} key={index}>
                        <div className={styles.embla__slide__inner}>
                            <Image
                                src={image.thumbnailUrl}
                                alt={image.altText}
                                width={400}
                                height={400}
                                loading="eager"
                                className="object-cover w-full h-64 md:h-80 lg:h-96"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
