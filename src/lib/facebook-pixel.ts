/**
 * Facebook Pixel Event Tracking Utilities
 *
 * Use these helpers to track standard and custom Facebook Pixel events
 * throughout application.
 */

declare global {
    interface Window {
        fbq?: (action: string, eventName: string, params?: Record<string, unknown>) => void
    }
}

// Standard Facebook Pixel events
export type FacebookStandardEvent =
    | 'AddPaymentInfo'
    | 'AddToCart'
    | 'AddToWishlist'
    | 'CompleteRegistration'
    | 'Contact'
    | 'CustomizeProduct'
    | 'Donate'
    | 'FindLocation'
    | 'InitiateCheckout'
    | 'Lead'
    | 'PageView'
    | 'Purchase'
    | 'Schedule'
    | 'Search'
    | 'StartTrial'
    | 'SubmitApplication'
    | 'Subscribe'
    | 'ViewContent'

export interface FacebookEventParams {
    content_name?: string
    content_category?: string
    content_ids?: string[]
    content_type?: string
    value?: number
    currency?: string
    num_items?: number
    search_string?: string
    status?: boolean

    [key: string]: unknown
}

/**
 * Track a standard Facebook Pixel event
 *
 * @param eventName - The name of the standard event
 * @param params - Optional event parameters
 *
 * @example
 * trackEvent('AddToCart', {
 *   content_name: 'Product Name',
 *   content_ids: ['product_123'],
 *   content_type: 'product',
 *   value: 99.99,
 *   currency: 'USD'
 * })
 */
export const trackEvent = (
    eventName: FacebookStandardEvent,
    params?: FacebookEventParams
): void => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', eventName, params)
    }
}

/**
 * Track a custom Facebook Pixel event
 *
 * @param eventName - The name of the custom event
 * @param params - Optional event parameters
 *
 * @example
 * trackCustomEvent('ProductViewed', {
 *   product_id: '123',
 *   product_name: 'Cool Product'
 * })
 */
export const trackCustomEvent = (
    eventName: string,
    params?: Record<string, unknown>
): void => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('trackCustom', eventName, params)
    }
}

/**
 * Track page view event
 */
export const trackPageView = (): void => {
    trackEvent('PageView')
}

/**
 * Track add to cart event
 *
 * @param product - Product details
 */
export const trackAddToCart = (product: {
    id: string
    eventID: string
    name: string
    price: number
    currency?: string,
    contents: Array<{id: string; quantity: number}>
    category?: string,
}): void => {
    trackEvent('AddToCart', {
        eventID: product.eventID,
        content_name: product.name,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: product.currency || 'USD',
        content_category: product.category,
        contents: product.contents,
        num_items: product.contents.reduce((sum, item) => sum + item.quantity, 0),
    })
}

/**
 * Track purchase event
 *
 * @param purchase - Purchase details
 */
export const trackPurchase = (purchase: {
    value: number
    currency?: string
    content_ids?: string[]
    content_type?: string
    num_items?: number
    contents: Array<{id: string; quantity: number}>
}): void => {
    trackEvent('Purchase', {
        value: purchase.value,
        currency: purchase.currency || 'USD',
        content_ids: purchase.content_ids,
        content_type: purchase.content_type || 'product',
        num_items: purchase.num_items,
        contents: purchase.contents,
    })
}

/**
 * Track view content event
 *
 * @param content - Content details
 */
export const trackViewContent = (content: {
    id: string
    eventID?: string
    name: string
    type?: string
    value?: number
    currency?: string
    contents: Array<{id: string; quantity: number; name: string; value: number}>
}): void => {
    trackEvent('ViewContent', {
        content_name: content.name,
        content_ids: [content.id],
        content_type: content.type || 'product',
        value: content.value,
        currency: content.currency || 'USD',
        contents: content.contents,
        eventID: content.eventID,
    })
}

/**
 * Track initiate checkout event
 *
 * @param checkout - Checkout details
 */
export const trackInitiateCheckout = (checkout: {
    value: number
    currency?: string
    content_ids?: string[]
    num_items?: number
}): void => {
    trackEvent('InitiateCheckout', {
        value: checkout.value,
        currency: checkout.currency || 'USD',
        content_ids: checkout.content_ids,
        num_items: checkout.num_items,
    })
}

/**
 * Track search event
 *
 * @param searchString - The search query
 */
export const trackSearch = (searchString: string): void => {
    trackEvent('Search', {
        search_string: searchString,
    })
}

/**
 * Track lead event
 */
export const trackLead = (): void => {
    trackEvent('Lead')
}

/**
 * Track complete registration event
 */
export const trackCompleteRegistration = (): void => {
    trackEvent('CompleteRegistration', {
        status: true,
    })
}

/**
 * Check if Facebook Pixel is loaded
 *
 * @returns true if Facebook Pixel is loaded
 */
export const isFacebookPixelLoaded = (): boolean => {
    return typeof window !== 'undefined' && !!window.fbq
}

