---
title: "Installing and Using wkhtmltopdf / wkhtmltoimage on Cloudways"
description: "A quick guide to installing and using wkhtmltopdf/wkhtmltoimage on Cloudways for generating PDFs and images from HTML in a Laravel app."
pubDate: 2025-12-29
tags: [laravel]
draft: false
cover:
  src: "/blog-images/installing-and-using-wkhtmltopdf-wkhtmltoimage-on-cloudways/cover.webp"
  alt: "Installing and Using wkhtmltopdf / wkhtmltoimage on Cloudways"
---

# Installing and Using wkhtmltopdf / wkhtmltoimage on Cloudways

**Tested:** November 10, 2025  
**Use case:** Cloudways + Laravel + Snappy or any wrapper that needs wkhtmltopdf / wkhtmltoimage

If you're using Laravel with Snappy PDF (or similar) on Cloudways Hosting, follow these steps to set up `wkhtmltopdf` and `wkhtmltoimage`.

---

## 1. Download the Linux Binary

Download the precompiled Linux binary from the official GitHub releases page:

- https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.4/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz

---

## 2. Extract the Files

- On your local machine, extract the `.tar.xz` file using **WinRAR** or **7-Zip** (Run as Administrator).
- Inside the extracted folder, locate the `wkhtmltox/bin/` directory.

It should contain the following files:

- `wkhtmltopdf` (no file extension)
- `wkhtmltoimage` (no file extension)

![Cover](/blog-images/installing-and-using-wkhtmltopdf-wkhtmltoimage-on-cloudways/ss2.png)

---

## 3. Upload to Your Project

Upload the extracted `wkhtmltox` folder to your Laravel project on Cloudways via SFTP (FileZilla, etc.).

Example structure:

```text
/your-laravel-project/
├── app
├── binary
│   └── wkhtmltox
│       └── bin
│           ├── wkhtmltopdf
│           └── wkhtmltoimage
├── config
├── public
...
```

---

## 4. Reset File/Folder Permissions (Important!)

Cloudways uploads files with application user ownership, which prevents you from setting execute permissions. You need to reset ownership to your SSH user:

1. Log in to **Cloudways Platform**
2. Go to **Servers** → Select your server → Click **Globe Button** → Select your application
3. Navigate to **Application Settings** → **General** tab
4. Scroll down to **Reset File/Folders Permissions**
5. Select your **master user** (e.g., `master_xxxxxxxxxx`) from the dropdown

![Cover](/blog-images/installing-and-using-wkhtmltopdf-wkhtmltoimage-on-cloudways/ss1.png)

6. Click **Reset**
7. Wait for the process to complete

---

## 5. Set Permissions

Via SSH (Terminal or PuTTY), run:

```bash
chmod +x /home/master/applications/YOUR_APP_FOLDER/public_html/binary/wkhtmltox/bin/wkhtmltopdf
chmod +x /home/master/applications/YOUR_APP_FOLDER/public_html/binary/wkhtmltox/bin/wkhtmltoimage
```

Replace `YOUR_APP_FOLDER` with your actual application folder name.

---

## 6. Test the Installation

Verify the installation by running:

```bash
/home/master/applications/YOUR_APP_FOLDER/public_html/binary/wkhtmltox/bin/wkhtmltopdf --version
```

Expected output:

```text
wkhtmltopdf 0.12.4 (with patched qt)
```

---

## 7. Configure Snappy in Laravel

Update your `config/snappy.php`:

```php
return [
    'pdf' => [
        'enabled' => true,
        'binary'  => env('WKHTML_PDF_BINARY'),
        'timeout' => false,
        'options' => [],
    ],

    'image' => [
        'enabled' => true,
        'binary'  => env('WKHTML_IMG_BINARY'),
        'timeout' => false,
        'options' => [],
    ],
];
```

---

## 8. Update `.env` File

Add to your `.env` file:

```bash
WKHTML_PDF_BINARY=/home/master/applications/YOUR_APP_FOLDER/public_html/binary/wkhtmltox/bin/wkhtmltopdf
WKHTML_IMG_BINARY=/home/master/applications/YOUR_APP_FOLDER/public_html/binary/wkhtmltox/bin/wkhtmltoimage
```

Replace `YOUR_APP_FOLDER` with your actual application folder name.

---

## 9. Clear Laravel Caches

Run these commands to ensure Laravel uses the updated configuration:

```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

## Done

✅ <strong>Done!</strong> You can now use <code>wkhtmltopdf</code> and <code>wkhtmltoimage</code> within your Laravel system on <a href="https://www.cloudways.com/en/" target="_blank" rel="noopener noreferrer">Cloudways Hosting</a>.

---

## Troubleshooting

### Permission Denied Error

- Make sure you completed **[Step 4](#4-reset-filefolder-permissions-important)** (Reset File/Folder Permissions)
- Verify ownership with:

```bash
ls -la binary/wkhtmltox/bin/
```

- Owner should be your master user, not the application user

### Binary Not Found

- Check the correct path with:

```bash
pwd
ls -la binary/
```

- Ensure the folder structure matches **[Step 3](#3-upload-to-your-project)**.

### Exit Code 126

- This means permission denied — repeat **[Step 4](#4-reset-filefolder-permissions-important)** and **[Step 5](#5-set-permissions)**.

---