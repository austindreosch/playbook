// Get the initials for the user
export const getInitials = (name) => {
    return name
        ?.split(' ')
        ?.map(word => word[0])
        ?.join('')
        ?.toUpperCase()
        ?.slice(0, 2) || 'U';
};

// Get the display email for the user
export const getDisplayEmail = (user) => {
    // If there's a direct email, use it
    if (user?.email) {
        return user.email;
    }

    // For GitHub users without email, use their username
    if (user?.nickname) {
        return `${user.nickname}@github`;
    }

    // For other providers or if no identifiable info
    return 'No email available';
};