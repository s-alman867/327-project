<?php
require_once "database.php"; // database connection

$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $username = trim($_POST["username"]);
    $email    = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    if (!empty($username) && !empty($email) && !empty($password)) {

        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Insert user
        $stmt = $conn->prepare(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
        );
        $stmt->bind_param("sss", $username, $email, $hashedPassword);

        if ($stmt->execute()) {
            $message = "Account created successfully!";
        } else {
            $message = "Error: Username or Email already exists.";
        }

        $stmt->close();
    } else {
        $message = "All fields are required!";
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>KaruKunjo - Sign Up</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Fonts & Icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="style.css" rel="stylesheet">
</head>

<body>
    <div class="container-fluid d-flex justify-content-center align-items-center" style="min-height:100vh;">
        <div class="col-12 col-sm-8 col-md-6 col-lg-5">
            <div class="bg-secondary rounded p-4">

                <h3 class="text-center mb-3">
                    <i class="fa fa-user-edit me-2"></i> KaruKunjo Sign Up
                </h3>

                <!-- Message -->
                <?php if (!empty($message)): ?>
                    <div class="alert alert-info text-center">
                        <?= $message ?>
                    </div>
                <?php endif; ?>

                <!-- Signup Form -->
                <form method="POST">

                    <div class="form-floating mb-3">
                        <input type="text" name="username" class="form-control" placeholder="Username" required>
                        <label>Username</label>
                    </div>

                    <div class="form-floating mb-3">
                        <input type="email" name="email" class="form-control" placeholder="Email" required>
                        <label>Email Address</label>
                    </div>

                    <div class="form-floating mb-3">
                        <input type="password" name="password" class="form-control" placeholder="Password" required>
                        <label>Password</label>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 py-2">
                        Sign Up
                    </button>

                    <p class="text-center mt-3 mb-0">
                        Already have an account?
                        <a href="signin.php">Sign In</a>
                    </p>

                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>