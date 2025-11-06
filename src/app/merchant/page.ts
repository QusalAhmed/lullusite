import { redirect, RedirectType } from 'next/navigation'


export default function MerchantPage() {
    redirect('/merchant/dashboard', RedirectType.replace)
}