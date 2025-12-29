---
title: "Install Laravel on Ubuntu on Windows 11 Using Docker"
description: "A step-by-step guide to installing Laravel on Windows 11 using Ubuntu (WSL) + Docker, setting up Laravel, configuring the database ports, and running your project locally."
pubDate: 2025-12-29
tags: [docker, windows, ubuntu]
draft: false
cover:
  src: "/blog-images/install-laravel-on-ubuntu-on-windows-11-using-docker/cover.webp"
  alt: "Install Laravel on Ubuntu on Windows 11 Using Docker"
---

# Install Laravel on Ubuntu on Windows 11 Using Docker

![Cover](/blog-images/install-laravel-on-ubuntu-on-windows-11-using-docker/ss1.jpg)

---

## PROCESS

### 1. Install WSL (Ubuntu)

- Run **PowerShell as Administrator**, then:

```bash
wsl --install
```

> Follow the prompts to install Ubuntu.

---

### 2. Update Ubuntu Packages

```bash
sudo apt update && sudo apt upgrade -y
```

---

### 3. Install PHP 8.2 (or any version you need)

> Run the following commands:

```bash
sudo apt update

sudo apt install software-properties-common ca-certificates lsb-release apt-transport-https

sudo add-apt-repository ppa:ondrej/php

sudo apt update

sudo apt install php8.2-cli php8.2-common php8.2-mbstring php8.2-xml php8.2-bcmath php8.2-curl php8.2-mysql php8.2-zip php8.2-readline php8.2-gd php8.2-intl php8.2-tokenizer php8.2-soap
```

---

### 4. Download & Install Docker for Windows

- Create an account: https://login.docker.com/u/login  
- Download: https://docs.docker.com/desktop/setup/install/windows-install

---

### 5. Configure Docker

- Open **Docker Desktop**
- Go to **Settings → Resources → WSL Integration**
- ✅ Turn on **Ubuntu**

![Cover](/blog-images/install-laravel-on-ubuntu-on-windows-11-using-docker/ss3.png)

---

### 6. Test Docker via Ubuntu Command Line:

> To Check if Docker is installed correctly, run:
```bash
docker --version
```

> To test Docker by creating a cxample image (for testing only), run:
```bash
docker pull hello-world
```

![Cover](/blog-images/install-laravel-on-ubuntu-on-windows-11-using-docker/ss7.png)
<p class="img-caption"><em>A new 'hello world' image has been created inside of your Docker image</em></p>

<br></br>
> If you get **permission denied**, run:
```bash
docker login -u yourDockerUsername
```

> Then Generate a **New Personal Access Token** at: https://app.docker.com/settings → **Personal Access Tokens** → **Generate New Token**, then re-run the login if needed.

<br></br>
> After Re-login and Generating, **add user to Docker group:**

```bash
sudo usermod -aG docker $USER
```

> Then **re-open Ubuntu Command Line**, and test again, via:
```bash
docker pull hello-world
```

---

### 7. Create Main Laravel Projects Directory

> In Ubuntu Command Line, go to your `home directory`:
```bash
cd ~
```

> Create a MAIN FOLDER for your Laravel projects:
```bash
mkdir LaravelProjects
```
> **Why this folder?** `LaravelProjects` will serve as your main workspace for all Laravel projects, so everything stays organized in one place. You can name it anything or skip this step, but using one dedicated folder is recommended.

<br></br>
> To go inside of the `LaravelProjects` directory, run:
```bash
cd LaravelProjects
```

---

### 8. Create a Laravel Project

```bash
composer create-project laravel/laravel firstwebsite
```
> To go inside of the project folder, run:

```bash
cd firstwebsite
```
> Command Line Tips:
- To go back: `cd ..`
- To list directories: `ls -d */` or type `ls`

---

### 9. Install Laravel Sail

```bash
composer require laravel/sail --dev
```

> Next: After the following installation, run:

```bash
php artisan sail:install
```

---

### 10. Open Project in VS Code

```bash
code .
```

> Trust the folder when prompted.

---

> **BUT, Before running our Laravel project in Docker, we need to configure the `.env` file and set up the `database`.**

### 11. Configure `.env` File

Edit your `.env`:

```bash
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=firstwebsite
DB_USERNAME=sail
DB_PASSWORD=password

FORWARD_DB_PORT=3308
```

> use `3308` (or any, not 3306) for `FORWARD_DB_PORT` to avoids conflict with the host's MySQL when using Docker.

---

### 12. Run Migrations

```bash
./vendor/bin/sail artisan migrate
```

---

### 13. Verify Database Using GUI

Use **DBeaver** or **MySQL Workbench** with the following settings:

```text
Host: 127.0.0.1
Port: 3308
User: sail
Password: password
```
![Cover](/blog-images/install-laravel-on-ubuntu-on-windows-11-using-docker/ss2.png)

> If checking the database fails, run the command `./vendor/bin/sail up -d` inside your Laravel project, then check again.

---

### 14. Run Laravel Sail

```bash
# to start laravel server
./vendor/bin/sail up -d

# or to stop laravel server
./vendor/bin/sail down

# or to verify if running
./vendor/bin/sail ps
```

![Cover](/blog-images/install-laravel-on-ubuntu-on-windows-11-using-docker/ss4.png)

---

### 15. Access Laravel in Browser

Make sure it’s running:

```bash
./vendor/bin/sail up -d
```


Then open:

- http://localhost
- http://127.0.0.1

![Cover](/blog-images/install-laravel-on-ubuntu-on-windows-11-using-docker/ss5.png)

---

## DONE!

![Cover](/blog-images/install-laravel-on-ubuntu-on-windows-11-using-docker/ss6.png)

✅ **Done!** Laravel is now running inside Docker with Ubuntu on WINDOWS 11.
