// Check authentication status
async function checkAuth() {
    try {
        const response = await fetch('../api/auth-check.php');
        const data = await response.json();
        
        if (!data.authenticated) {
            window.location.href = 'login.php';
        }
    } catch (error) {
        window.location.href = 'login.php';
    }
}

// Check auth on page load
checkAuth();