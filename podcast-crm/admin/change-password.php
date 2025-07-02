<?php
require_once __DIR__ . '/../config/config.php';

// Check if user is authenticated
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    header('Location: login.php');
    exit;
}

$message = '';
$error = '';

// Handle password change
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $currentPassword = $_POST['current_password'] ?? '';
    $newPassword = $_POST['new_password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';
    
    // Verify current password
    if (!password_verify($currentPassword, ADMIN_PASSWORD_HASH)) {
        $error = 'Current password is incorrect';
    } elseif (strlen($newPassword) < 8) {
        $error = 'New password must be at least 8 characters long';
    } elseif ($newPassword !== $confirmPassword) {
        $error = 'New passwords do not match';
    } else {
        // Generate new hash
        $newHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);
        
        // Show the hash to update in config
        $message = 'Password changed successfully! Update your config/config.php file with this new hash:';
        $configUpdate = "define('ADMIN_PASSWORD_HASH', '$newHash');";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Change Password - Podcast CRM</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .password-form {
            max-width: 400px;
            margin: 2rem auto;
            background: rgba(255, 255, 255, 0.05);
            padding: 2rem;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #b0b0b0;
            font-size: 0.9rem;
        }
        
        .form-group input {
            width: 100%;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            color: white;
            font-size: 1rem;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #00bfa5;
            background: rgba(255, 255, 255, 0.08);
        }
        
        .message-box {
            margin-bottom: 1.5rem;
            padding: 1rem;
            border-radius: 4px;
            font-size: 0.9rem;
        }
        
        .error {
            background: rgba(255, 59, 48, 0.1);
            border: 1px solid rgba(255, 59, 48, 0.3);
            color: #ff8a80;
        }
        
        .success {
            background: rgba(0, 191, 165, 0.1);
            border: 1px solid rgba(0, 191, 165, 0.3);
            color: #64ffda;
        }
        
        .config-hash {
            background: rgba(0, 0, 0, 0.3);
            padding: 1rem;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.85rem;
            word-break: break-all;
            margin-top: 1rem;
            color: #64ffda;
        }
        
        .back-link {
            display: inline-block;
            margin-bottom: 2rem;
            color: #00bfa5;
            text-decoration: none;
        }
        
        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="index.html" class="back-link">← Back to Dashboard</a>
        
        <h1>Change Password</h1>
        
        <div class="password-form">
            <?php if ($error): ?>
                <div class="message-box error"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>
            
            <?php if ($message): ?>
                <div class="message-box success">
                    <?php echo htmlspecialchars($message); ?>
                    <div class="config-hash"><?php echo htmlspecialchars($configUpdate); ?></div>
                    <p style="margin-top: 1rem; font-size: 0.85rem; color: #b0b0b0;">
                        Copy this line and replace the existing ADMIN_PASSWORD_HASH line in your config/config.php file.
                        After updating the file, you'll need to log in again with your new password.
                    </p>
                </div>
            <?php endif; ?>
            
            <form method="POST" action="">
                <div class="form-group">
                    <label for="current_password">Current Password</label>
                    <input type="password" id="current_password" name="current_password" required>
                </div>
                
                <div class="form-group">
                    <label for="new_password">New Password</label>
                    <input type="password" id="new_password" name="new_password" required minlength="8">
                    <small style="color: #666; font-size: 0.8rem;">Minimum 8 characters</small>
                </div>
                
                <div class="form-group">
                    <label for="confirm_password">Confirm New Password</label>
                    <input type="password" id="confirm_password" name="confirm_password" required>
                </div>
                
                <button type="submit" class="btn btn-primary">Change Password</button>
            </form>
        </div>
    </div>
</body>
</html>