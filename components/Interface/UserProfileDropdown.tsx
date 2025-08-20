import * as React from 'react';
import Link from 'next/link';
import { LogOut, Settings, UserPlus, Sun, Moon, Monitor } from 'lucide-react';

import { getDisplayEmail, getInitials } from '@/utilities/stringUtils';
import * as Avatar from '@/components/alignui/avatar';
import * as Badge from '@/components/alignui/badge';
import * as Divider from '@/components/alignui/divider';
import * as Dropdown from '@/components/alignui/dropdown';
import * as SegmentedControl from '@/components/alignui/segmented-control';
import type { UserProfile } from '@auth0/nextjs-auth0/client';

interface UserProfileDropdownProps {
    user?: UserProfile | null;
    className?: string;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ user, className = "" }) => {
    const adminSub = process.env.NEXT_PUBLIC_AUTH0_ADMIN_ID;
    const isAdmin = user && user.sub === adminSub;
    const [themeMode, setThemeMode] = React.useState('system');
    const [isOnline, setIsOnline] = React.useState(true);

    // Theme handling
    React.useEffect(() => {
        // Get stored theme or default to system
        const storedTheme = localStorage.getItem('theme') || 'system';
        setThemeMode(storedTheme);
        applyTheme(storedTheme);
    }, []);

    const applyTheme = (theme: string) => {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme === 'light') {
            root.classList.remove('dark');
        } else { // system
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    };

    const handleThemeChange = (newTheme: string) => {
        setThemeMode(newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };

    // Simple online status based on page visibility and activity
    React.useEffect(() => {
        const handleVisibilityChange = () => {
            setIsOnline(!document.hidden);
        };

        const handleActivity = () => {
            setIsOnline(true);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('mousemove', handleActivity);
        document.addEventListener('keypress', handleActivity);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('mousemove', handleActivity);
            document.removeEventListener('keypress', handleActivity);
        };
    }, []);

    // Default to a loading state if user data isn't available yet
    if (!user) {
        return (
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        );
    }

    return (
        <Dropdown.Root>
            <Dropdown.Trigger className={`flex items-center gap-2 outline-none rounded-full hover:opacity-80 transition-opacity ${className}`}>
                <Avatar.Root size="40" color="blue" className="shadow border border-orange-700">
                    {user.picture ? (
                        <Avatar.Image 
                            src={user.picture} 
                            alt="User"
                        />
                    ) : (
                        <div className="flex items-center justify-center size-full rounded-full bg-primary-base text-white font-bold text-sm">
                            {getInitials(user.name || '')}
                        </div>
                    )}
                    <Avatar.Indicator>
                        <Avatar.Status status={isOnline ? "online" : "offline"} />
                    </Avatar.Indicator>
                </Avatar.Root>
            </Dropdown.Trigger>
            <Dropdown.Content align="end">
                {/* User Info Section */}
                <div className="flex items-center gap-3 p-2">
                    <Avatar.Root size="40">
                        {user.picture ? (
                            <Avatar.Image 
                                src={user.picture} 
                                alt="User"
                            />
                        ) : (
                            <div className="flex items-center justify-center size-full rounded-full bg-primary-base text-white font-bold text-sm">
                                {getInitials(user.name || '')}
                            </div>
                        )}
                        <Avatar.Indicator>
                            <Avatar.Status status={isOnline ? "online" : "offline"} />
                        </Avatar.Indicator>
                    </Avatar.Root>
                    <div className="flex-1">
                        <div className="text-label-lg text-strong-950">{user.name}</div>
                        <div className="mt-1 text-subheading-sm text-sub-600">{getDisplayEmail(user)}</div>
                    </div>
                    {isAdmin && (
                        <Badge.Root variant="light" color="green" size="small">
                            ADMIN
                        </Badge.Root>
                    )}
                </div>

                <Divider.Root variant="line-spacing" />
                
                {/* Theme Selection */}
                <div className="flex items-center gap-3 p-2 max-h-[34px]">
                    <Monitor className="size-4 text-sub-600" />
                    <span className="text-label-md text-strong-950">Theme</span>
                    <span className="flex-1" />
                    <SegmentedControl.Root value={themeMode} onValueChange={handleThemeChange}>
                        <SegmentedControl.List
                            className="w-fit gap-1 rounded-full"
                            floatingBgClassName="rounded-full"
                        >
                            <SegmentedControl.Trigger value="light" className="aspect-square h-6 w-6">
                                <Sun className="size-3" />
                            </SegmentedControl.Trigger>
                            <SegmentedControl.Trigger value="dark" className="aspect-square h-6 w-6">
                                <Moon className="size-3" />
                            </SegmentedControl.Trigger>
                            <SegmentedControl.Trigger value="system" className="aspect-square h-6 w-6">
                                <Monitor className="size-3" />
                            </SegmentedControl.Trigger>
                        </SegmentedControl.List>
                    </SegmentedControl.Root>
                </div>
                
                {/* Menu Items */}
                <Dropdown.Group>
                    
                    <Dropdown.Item>
                        <Dropdown.ItemIcon as={Settings} />
                        Settings
                    </Dropdown.Item>
                </Dropdown.Group>
                
                <Divider.Root variant="line-spacing" />
                
                <Dropdown.Group>
                    {isAdmin && (
                        <Dropdown.Item asChild>
                            <Link href="/admin">
                                <Dropdown.ItemIcon as={UserPlus} />
                                Admin Panel
                            </Link>
                        </Dropdown.Item>
                    )}
                    <Dropdown.Item asChild>
                        <Link href="/api/auth/logout">
                            <Dropdown.ItemIcon as={LogOut} />
                            Logout
                        </Link>
                    </Dropdown.Item>
                </Dropdown.Group>
                
                <div className="p-2 text-paragraph-sm text-soft-400">
                    v.1.5.69 · Terms & Conditions
                </div>
            </Dropdown.Content>
        </Dropdown.Root>
    );
};

export default UserProfileDropdown;