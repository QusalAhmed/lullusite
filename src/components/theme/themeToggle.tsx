'use client'
import { useTheme } from 'next-themes'

// ShadCN
import { Button } from '@/components/ui/button'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            Toggle {theme === 'dark' ? 'Light' : 'Dark'}
        </Button>
    )
}
