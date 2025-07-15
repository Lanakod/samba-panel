# Samba Panel 🧰

<img src="banner.png" alt="Samba Panel Banner" width="100%">

<p align="center">
  <a href="https://hub.docker.com/r/lanakod/samba-panel">
    <img src="https://img.shields.io/badge/docker-docker.io%2Flanakod%2Fsamba--panel-blue?logo=docker&style=flat-square" alt="Docker Image">
  </a>
  <a href="https://github.com/Lanakod/samba-panel/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/lanakod/samba-panel/docker-image.yml" alt="Build Status">
  </a>
  <a href="https://github.com/Lanakod/samba-panel/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/Lanakod/samba-panel?style=flat-square" alt="License">
  </a>
  <a href="https://github.com/Lanakod/samba-panel/releases">
    <img src="https://img.shields.io/github/downloads/Lanakod/samba-panel/total.svg?style=flat-square" alt="Downloads">
  </a>
  <img src="https://img.shields.io/docker/pulls/lanakod/samba-panel?style=flat-square" alt="Docker Pulls">
  <img src="https://img.shields.io/github/last-commit/Lanakod/samba-panel?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/github/languages/top/Lanakod/samba-panel?style=flat-square" alt="Top Language">
  <img src="https://img.shields.io/github/contributors/Lanakod/samba-panel?style=flat-square" alt="Contributors">
  <img src="https://img.shields.io/badge/platform-linux%20%7C%20arm64%20%7C%20amd64-success?style=flat-square&logo=linux" alt="Platforms">
</p>

**Samba Panel** is a web-based interface for managing Samba users and file shares via Docker.

👉 **Check out the [`example/`](example) folder** for a working Docker Compose setup including config files.

> **Language Note**: A Russian version of this documentation is available:  
> [README_RU.md](README_RU.md)

---

## 🚀 Quick Start (Docker Run)

You can run the panel directly without Docker Compose:

```bash
docker run -d \
  --name samba-panel \
  -p 80:3000 \
  -v "$PWD/smb.conf:/etc/samba/smb.conf" \
  -v "$PWD/smbpasswd:/etc/samba/smbpasswd" \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e SMB_CONF_PATH=/etc/samba/smb.conf \
  -e SMBPASSWD_PATH=/etc/samba/smbpasswd \
  -e NEXT_PUBLIC_PANEL_URL=http://localhost \
  -e CONTAINER_NAME=samba \
  lanakod/samba-panel:latest
```

## 🐳 Docker Compose Setup (recommended)

```yaml
name: samba-server
services:
  samba:
    container_name: samba
    image: dperson/samba
    ports:
      - "137:137/udp"
      - "138:138/udp"
      - "139:139/tcp"
      - "445:445/tcp"
    tmpfs:
      - /run
      - /tmp
    restart: unless-stopped
    stdin_open: true
    tty: true
    volumes:
      - ./smb.conf:/etc/samba/smb.conf
      - ./smbpasswd:/etc/samba/smbpasswd
    command: '-p -i /etc/samba/smbpasswd'

  panel:
    container_name: panel
    image: lanakod/samba-panel:latest
    env_file: panel.env
    ports:
      - "80:3000"
    restart: unless-stopped
    volumes:
      - ./smb.conf:/etc/samba/smb.conf
      - ./smbpasswd:/etc/samba/smbpasswd
      - /var/run/docker.sock:/var/run/docker.sock
```

### panel.env

```env
SMB_CONF_PATH=/etc/samba/smb.conf
SMBPASSWD_PATH=/etc/samba/smbpasswd
NEXT_PUBLIC_PANEL_URL=http://localhost
CONTAINER_NAME=samba

ADMIN_USERNAME=admin
ADMIN_PASSWORD=password
JWT_SECRET=my_super_secret_jwt_key
```

## 📄 smb.conf

Start with this minimal global configuration:

```ini
[global]
   workgroup = WORKGROUP
   server string = Samba Server %v
   security = user
   map to guest = bad user
   passdb backend = smbpasswd
   smb passwd file = /etc/samba/smbpasswd
   obey pam restrictions = no
   unix password sync = no
   restrict anonymous = 2
   invalid users = root
```

> 🛠 Samba shares will be managed through the panel interface.

## ✅ smbpasswd

Ensure the `smbpasswd` file is empty and present:

```bash
touch smbpasswd
chmod 600 smbpasswd
```

## 🛠 Features

- 🧑‍💻 Create, update, delete Samba users
- 📂 Create, update, delete Samba shares
- 🔄 Automatically updates `smb.conf` and `smbpasswd`
- 🔍 Live container status and logs
- 🥧 Multi-architecture Docker image (amd64 + arm64)

## 🎯 Requirements

- Docker & Docker Compose or Docker CLI
- Access to `/var/run/docker.sock` for container control

## 📝 License

Licensed under the [MIT License](LICENSE) — free to use and modify!

## 🛠 Maintainer

Developed and maintained by [@lanakod](https://github.com/Lanakod)

Enjoy hassle-free Samba management!