<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- <title inertia>{{ config('Appcare') }}</title> --}}
    <title>PSN</title>
    {{-- favicon --}}
    <link rel="icon" href="{{ asset('img/psn.jpg') }}" type="image/png">
    {{-- atau bisa juga pakai .ico jika kamu punya file favicon.ico --}}
    {{-- <link rel="icon" href="{{ asset('favicon.ico') }}" type="image/x-icon"> --}}

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link
      href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap"
      rel="stylesheet"
    />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
  </head>
  <body class="font-sans antialiased">
    @inertia
  </body>
</html>
