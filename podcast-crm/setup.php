<?php
// Setup script to generate password hash
echo "<h2>Podcast CRM Setup</h2>";

if ($_POST['password'] ?? false) {
    $password = $_POST['password'];
    $hash = password_hash($password, PASSWORD_DEFAULT);
    
    echo "<h3>Password Hash Generated:</h3>";
    echo "<code style='background: #f0f0f0; padding: 10px; display: block;'>" . htmlspecialchars($hash) . "</code>";
    echo "<p><strong>Copy this hash and paste it into config/config.php as ADMIN_PASSWORD_HASH</strong></p>";
    echo "<p>Then delete this setup.php file for security.</p>";
} else {
?>
    <form method="POST">
        <label>Enter your desired admin password:</label><br>
        <input type="password" name="password" required style="padding: 5px; margin: 10px 0;"><br>
        <button type="submit" style="padding: 10px 20px;">Generate Hash</button>
    </form>
    <p><em>This will generate a secure hash for your config file.</em></p>
<?php
}
?>