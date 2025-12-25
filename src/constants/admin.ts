/**
 * Admin Configuration
 * 
 * Admin Email: softvenceomega@gmail.com
 * Admin Password: Wordpress@2026
 * 
 * Note: This email is the only email that can access the admin dashboard.
 * The admin role is automatically granted when this email signs up or logs in.
 */

export const ADMIN_EMAIL = 'softvenceomega@gmail.com';
export const ADMIN_PASSWORD = 'Wordpress@2026'; // For reference/documentation only

/**
 * Check if an email is the admin email
 */
export const isAdminEmail = (email: string | null | undefined): boolean => {
    if (!email) return false;
    return email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
};

