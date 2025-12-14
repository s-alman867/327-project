<?php
session_start();
require_once "database.php";

$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    if (!empty($email) && !empty($password)) {

        $stmt = $conn->prepare(
            "SELECT user_id, username, password, role FROM users WHERE email = ?"
        );
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();

            if (password_verify($password, $user["password"])) {
                // Login success
                $_SESSION["user_id"] = $user["user_id"];
                $_SESSION["username"] = $user["username"];
                $_SESSION["role"] = $user["role"];

                // Redirect based on role
                if ($user["role"] === "admin") {
                    header("Location: dashboard.php");
                } else {
                    header("Location: index.html");
                }
                exit();
            } else {
                $error = "Invalid password!";
            }
        } else {
            $error = "No account found with this email!";
        }

        $stmt->close();
    } else {
        $error = "All fields are required!";
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>KaruKunjo - Sign In</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Icons -->
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
            <div class="bg-secondary rounded p-4 p-sm-5">

                <h3 class="text-primary text-center mb-3">
                    <i class="fa fa-user-edit me-2"></i>KaruKunjo
                </h3>

                <h4 class="text-center mb-3">Sign In</h4>

                <!-- Error Message -->
                <?php if (!empty($error)): ?>
                    <div class="alert alert-danger text-center">
                        <?= $error ?>
                    </div>
                <?php endif; ?>

                <!-- Login Form -->
                <form method="POST">

                    <div class="form-floating mb-3">
                        <input type="email" name="email" class="form-control"
                            placeholder="Email Address" required>
                        <label>Email Address</label>
                    </div>

                    <div class="form-floating mb-3">
                        <input type="password" name="password" class="form-control"
                            placeholder="Password" required>
                        <label>Password</label>
                    </div>

                    <button type="submit" class="btn btn-primary py-3 w-100 mb-3">
                        Sign In
                    </button>

                    <p class="text-center mb-0">
                        Don’t have an account?
                        <a href="signup.php">Sign Up</a>
                    </p>

                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>