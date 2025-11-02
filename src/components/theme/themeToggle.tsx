'use client'
import { useTheme } from 'next-themes'

// Icon
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const {theme, setTheme} = useTheme()

    return (
        <div onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun size={24}/> : <Moon size={24}/>}
        </div>
    )
}
