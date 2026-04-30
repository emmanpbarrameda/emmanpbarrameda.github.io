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

# Filament Take Picture Field v1.3
### A custom Filament form component to capture photos from your device camera.

![emmanpbarrameda-take-picture-field](https://github.com/user-attachments/assets/4020cccd-0914-45ce-be64-1db50bdcdcf7)

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

## Installation

```bash
composer require emmanpbarrameda/filament-take-picture-field:^1.3
```

## Requirements

- Laravel: ^10, ^11, ^12, or ^13
- PHP: ^8.1, ^8.2, or ^8.3
- Filament Forms: ^4.0 or ^5.0
- A device with camera access (desktop or mobile)

## Filament Theme Setup

If you are using a custom Filament theme, add the package Blade views to your theme CSS file so Tailwind can scan the component classes.

In your Filament custom theme CSS file, add:

```css
@source '../../../../vendor/emmanpbarrameda/filament-take-picture-field/resources/views/**/*.blade.php';
```


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
        ['key' => 'back', 'label' => 'Back Picture'],
    ])
    ->requireAllShots(true)

    // Enable TTS on multiple shots
    ->enableTextToSpeech(true, 'en-US')

    ->columnSpanFull()
    ->required(),

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
| `multiple(array $shots = [])` | Enable multiple-shot mode and define the shot sequence. Each shot should have a `key` and `label`. |
| `requireAllShots(bool $required = true)` | Require all configured multiple shots before saving. |
| `enableTextToSpeech(bool $enable = true, string $lang = 'en-US')` | Enable or disable text-to-speech instructions for multiple-shot mode. Example: `true, 'en-US'` |
| `columnSpanFull()` | Make the field span the full width of the form layout. |

## ❗ IMPORTANT NOTICE: For Local development

The browser's Camera API only works on **secure origins** (HTTPS). Many browsers treat `https://localhost` as secure, but **plain** `http://` over an IP (e.g., `http://127.0.0.1:8000`) is considered insecure and the camera will be blocked. If it isn't working for you on `localhost`, switch to HTTPS or use the temporary Chrome test flags below.

### Recommended (safer) options

### Temporary Chrome workaround (for testing only)

If you must test over plain HTTP on a LAN IP, you can launch Chrome to *temporarily* treat that origin as secure. **Do not use this for normal browsing.** Use a separate profile and close all Chrome windows first.

Replace `http://127.0.0.1:8000` with your dev server's URL.

**Windows:**

```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="C:\chrome-dev-test" --unsafely-treat-insecure-origin-as-secure=http://127.0.0.1:8000 --disable-web-security
```

**macOS:**

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --user-data-dir="/tmp/chrome-dev-test" \
  --unsafely-treat-insecure-origin-as-secure=http://127.0.0.1:8000 \
  --disable-web-security
```

**Linux:**

```bash
google-chrome \
  --user-data-dir="/tmp/chrome-dev-test" \
  --unsafely-treat-insecure-origin-as-secure=http://127.0.0.1:8000 \
  --disable-web-security
```

### Security notes

* These flags **removes important browser protections**. Use them **only** for local testing of your app.
* Always use a **separate** `--user-data-dir` so your main Chrome profile stays safe.
* Close all Chrome windows before running the command, and avoid visiting untrusted sites in that session.

## Screenshots (Single Mode)
<p align="center">
  <img width="1204" height="429" alt="image" src="https://github.com/user-attachments/assets/4020cccd-0914-45ce-be64-1db50bdcdcf7" />
  <img width="595" height="556" alt="image" src="https://github.com/user-attachments/assets/ec948c3e-1048-46f3-af22-fb5f1c7d434e" />
  <img width="583" height="460" alt="image" src="https://github.com/user-attachments/assets/85eab3cf-5edf-42cd-bb56-39d430417436" />
  <img width="1188" height="329" alt="image" src="https://github.com/user-attachments/assets/35f95c54-4cf6-4518-9e15-592eff044a28" />
</p>

## Screenshots (Multiple Mode)
<p align="center">
    <img width="1199" height="430" alt="image" src="https://github.com/user-attachments/assets/8b77a78b-89dc-49ba-a035-b4d0e9d141a6" />
    <img width="584" height="587" alt="image" src="https://github.com/user-attachments/assets/9df9b20d-85f9-4a5a-aa55-dd13159d2d54" />
    <img width="579" height="298" alt="image" src="https://github.com/user-attachments/assets/1f78f779-b233-4079-b64a-6525c2cf65af" />
    <img width="1203" height="486" alt="image" src="https://github.com/user-attachments/assets/9423fd58-2311-425e-b571-1cf13e1e1bf6" />
</p>


## Contributing

Contributions and pull requests for improvements are welcome!

## License
MIT