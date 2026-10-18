---
title: "FilamentPHP Take Picture Field Plugin"
description: "A custom Filament form component plugin to capture photos from your device camera."
pubDate: 2026-04-30
tags: [filamentphp, laravel, livewire]
draft: false
cover:
  src: "/blog-images/filament-take-picture-field/cover.webp"
  alt: "filament-take-picture-field"
---

# Filament Take Picture Field v1.4
### A custom Filament form component to capture photos from your device camera.

![emmanpbarrameda-take-picture-field](https://github.com/user-attachments/assets/ec5e39fb-f591-40bb-8c43-fddd8765157e)

## Features

- Capture photos directly from the user's device camera
- Seamless integration with Filament forms
- Configurable storage options: disk, directory, and visibility
- Camera selector support for devices with multiple cameras
- Adjustable aspect ratio, image quality, and maximum capture dimensions
- Multiple-shot mode with custom shot keys and labels
- Option to require all configured shots before saving
- Text-to-speech instructions for multiple-shot capture
- Support for previewing, retaking, and removing captured photos
- Camera in a modal or inline, with configurable mirroring

## Requirements

- Laravel: ^11.28, ^12, or ^13
- PHP: ^8.2
- Filament: ^4.0 or ^5.0
- A device with camera access (desktop or mobile)

## Installation

```bash
composer require emmanpbarrameda/filament-take-picture-field:^1.4
```

Then publish the plugin's assets (most apps already run this automatically through `php artisan filament:upgrade`):

```bash
php artisan filament:assets
```

## Filament Theme Setup

The field's styles are compiled by your Filament theme, so a custom theme is required. If you don't have one yet, create it:

```bash
php artisan make:filament-theme
```

Then add the package Blade views to your theme CSS file (e.g. `resources/css/filament/admin/theme.css`) so Tailwind can scan the component classes:

```css
@source '../../../../vendor/emmanpbarrameda/filament-take-picture-field/resources/views/**/*.blade.php';
```

And rebuild your assets:

```bash
npm run build
```

## Upgrading from v1.3

No code changes are needed. After updating:

1. Run `php artisan filament:assets`. The component's JavaScript is now a separate asset that Filament loads only on pages that use the field.
2. Make sure your theme's `@source` line ends with `resources/views/**/*.blade.php`, since the views are now split into subfolders. Then run `npm run build`.

## Usage

Add the component to your Filament form:

```php
use emmanpbarrameda\FilamentTakePictureField\Forms\Components\TakePicture;

TakePicture::make('pictures')
    ->label('Pictures')
    ->disk('public')
    ->directory('uploads/services/pictures')
    ->visibility('public')

    ->aspect('16:9')
    ->captureMaxDimensions(1280, 720)
    ->imageQuality(50)
    ->showCameraSelector(true)

    // Multiple shots configuration
    ->multiple([
        ['key' => 'main', 'label' => 'Main Picture'],
        ['key' => 'front', 'label' => 'Front Picture'],
        ['key' => 'left', 'label' => 'Left Side Picture'],
        ['key' => 'right', 'label' => 'Right Side Picture'],
        ['key' => 'back', 'label' => 'Back Picture', 'instruction' => 'Turn the item around and take a picture of the back'],
    ])
    ->requireAllShots(true)

    // Enable TTS on multiple shots
    ->enableTextToSpeech(true, 'en-US')

    ->columnSpanFull()
    ->required(),

```

Each shot can also have an optional `instruction`, which is shown under the progress bar and read aloud when text-to-speech is enabled.

For a multiple-shot field, cast the database column to an array on your model:

```php
protected $casts = [
    'pictures' => 'array',
];
```

## Configuration Options

| Method | Description |
|--------|-------------|
| `label(string $label)` | Set the field label displayed in the Filament form. |
| `disk(string $disk)` | Set the storage disk for saving photos. Example: `public` |
| `directory(?string $directory)` | Set the directory path within the disk where photos will be stored. Example: `uploads/services/payment_receipts_proof` |
| `visibility(string $visibility)` | Set the file visibility, such as `public` or `private`. |
| `aspect(string $ratio)` | Set the capture aspect ratio, such as `16:9`, `4:3`, or `1:1`. |
| `captureMaxDimensions(?int $width, ?int $height)` | Set the maximum captured image width and height. Example: `1280, 720` |
| `imageQuality(int $quality)` | Set the JPEG image quality from `1` to `100`. Example: `50` |
| `showCameraSelector(bool $show = true)` | Show or hide the camera selector for devices with multiple cameras. |
| `useModal(bool $useModal = true)` | Show the camera in a modal (`true`, default) or inline below the field (`false`). |
| `mirroredView(?bool $mirrored = true)` | Control mirroring. `null` (default) mirrors the front camera only, `true` always mirrors, `false` never mirrors. Also applies to the saved image. |
| `autoStart(bool $autoStart = true)` | Open the camera automatically when the field becomes visible. |
| `multiple(array $shots = [])` | Enable multiple-shot mode and define the shot sequence. Each shot should have a `key` and `label`, and can have an `instruction`. |
| `requireAllShots(bool $required = true)` | Require all configured multiple shots before saving. |
| `enableTextToSpeech(bool $enable = true, string $lang = 'en-US')` | Enable or disable text-to-speech instructions for multiple-shot mode. Example: `true, 'en-US'` |
| `shouldDeleteOnEdit(bool $condition = true)` | Delete the previously stored photo when it is replaced (single mode). Default: `true` |
| `columnSpanFull()` | Make the field span the full width of the form layout. |

## ❗ IMPORTANT NOTICE: For Local development Testing

The browser's Camera API only works in a **secure context**. `http://localhost` and `http://127.0.0.1` already count as secure, so local development on your own computer works without HTTPS.

Plain `http://` on a **LAN IP** (e.g. `http://192.168.1.5:8000`, when you open your dev server on your phone) is considered insecure, and the camera will be blocked.

### Recommended (safer) options

- Open the app through `http://localhost` or `http://127.0.0.1` on the same computer.
- To test on a phone, use HTTPS through a tunnel such as [ngrok](https://ngrok.com), [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/), or `herd share` / `valet share`.

### Temporary Chrome workaround (for testing only)

If you must test over plain HTTP on a LAN IP, you can launch Chrome to *temporarily* treat that origin as secure. **Do not use this for normal browsing.** Use a separate profile and close all Chrome windows first.

Replace `http://192.168.1.5:8000` with your dev server's URL.

**Windows:**

```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="C:\chrome-dev-test" --unsafely-treat-insecure-origin-as-secure=http://192.168.1.5:8000
```

**macOS:**

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --user-data-dir="/tmp/chrome-dev-test" \
  --unsafely-treat-insecure-origin-as-secure=http://192.168.1.5:8000
```

**Linux:**

```bash
google-chrome \
  --user-data-dir="/tmp/chrome-dev-test" \
  --unsafely-treat-insecure-origin-as-secure=http://192.168.1.5:8000
```

### Security notes

* This flag **removes an important browser protection** for that origin. Use it **only** for local testing of your app.
* Always use a **separate** `--user-data-dir` so your main Chrome profile stays safe.
* Close all Chrome windows before running the command, and avoid visiting untrusted sites in that session.

## Screenshots (Single Mode)
<p align="center">
  <img width="100%" alt="Single mode screenshot 1" src="https://github.com/user-attachments/assets/edc45324-8d45-49de-91b0-22b7668dedd3" />
  <img width="100%" alt="Single mode screenshot 2" src="https://github.com/user-attachments/assets/7746c51e-c72f-4680-b968-f4fda67ba869" />
  <img width="49%" alt="Single mode screenshot 3" src="https://github.com/user-attachments/assets/3d6cf609-f170-4569-9ae4-310116edcab7" />
  <img width="49%" alt="Single mode screenshot 4" src="https://github.com/user-attachments/assets/ca4b5eb7-2956-48d9-bf03-9f3790cb9804" />
</p>

## Screenshots (Multiple Mode)
<p align="center">
  <img width="100%" alt="Multiple mode screenshot 1" src="https://github.com/user-attachments/assets/755072b8-7053-41c1-aeff-fb526312c549" />
  <img width="49%" alt="Multiple mode screenshot 2" src="https://github.com/user-attachments/assets/8fe30301-8589-4df8-bcdf-07e62b69ce3e" />
  <img width="49%" alt="Multiple mode screenshot 3" src="https://github.com/user-attachments/assets/765fcb1a-ecdf-45d0-852f-c5c9dbedd350" />
  <img width="100%" alt="Multiple mode screenshot 4" src="https://github.com/user-attachments/assets/ba4248d5-1da3-4b43-8ab4-6f705c7ea39a" />
</p>


## Contributing

Contributions and pull requests for improvements are welcome!

## License
MIT