
# Samba Panel 🧰

<img src="banner.png" alt="Samba Panel Banner" width="100%">

<p align="center">
  <a href="https://hub.docker.com/r/lanakod/samba-panel">
    <img src="https://img.shields.io/badge/docker-docker.io%2Flanakod%2Fsamba--panel-blue?logo=docker&style=flat-square" alt="Docker Image">
  </a>
  <a href="https://github.com/Lanakod/samba-panel/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/Lanakod/samba-panel/docker.yml?branch=master&style=flat-square" alt="Build Status">
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

---

**Samba Panel** is a sleek, web-based dashboard for managing Samba users and shares via Docker—ideal for NAS setups or home servers.

---

## 🚀 Quick Start (Docker Run)

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

---

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

---

### 🔧 panel.env

```env
SMB_CONF_PATH=/etc/samba/smb.conf
SMBPASSWD_PATH=/etc/samba/smbpasswd
NEXT_PUBLIC_PANEL_URL=http://localhost
CONTAINER_NAME=samba
```

---

## 📄 smb.conf Template

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

---

## ✅ smbpasswd Setup

```bash
touch smbpasswd
chmod 600 smbpasswd
```

---

## 🛠 Features

- 🧑‍💻 Create, update, and delete Samba users
- 📂 Manage Samba shares easily
- 🔄 Automatically updates `smb.conf` and `smbpasswd`
- 📡 Real-time container monitoring & logs
- 🧬 Supports multi-architecture builds (amd64 + arm64)
- 🛡️ Read-only safe UI — config only changes via Docker volumes

---

## 🎯 Requirements

- Docker + Docker Compose or Docker CLI
- Access to `/var/run/docker.sock`

---

## 📝 License

Licensed under the [MIT License](LICENSE) — free to use and modify.

---

## 🛠 Maintainer

Built and maintained by [@lanakod](https://github.com/Lanakod)  
Enjoy hassle-free Samba management with a modern interface!