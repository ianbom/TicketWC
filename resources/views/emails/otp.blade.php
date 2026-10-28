<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Kode OTP Verifikasi</title>
    <style>
        .container {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f7f7f7;
        }
        .box {
            background: white;
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e5e5e5;
        }
        .otp {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            margin: 20px 0;
            color: #000;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #555;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="box">
        <h2>Kode OTP Verifikasi</h2>
        <p>Gunakan kode berikut untuk menyelesaikan proses registrasi Anda:</p>

        <div class="otp">{{ $otp }}</div>

        <p>Kode ini berlaku selama <strong>5 menit</strong>.</p>
    </div>

    <p class="footer">Email ini dikirim otomatis oleh sistem AppCare. Jangan balas email ini.</p>
</div>

</body>
</html>
