# Samba Panel 🧰

[![Docker Image](https://img.shields.io/badge/docker-docker.io%2Flanakod%2Fsamba--panel-blue?logo=docker&style=flat-square)](https://hub.docker.com/r/lanakod/samba-panel)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Lanakod/samba-panel/docker.yml?branch=master&style=flat-square)](https://github.com/Lanakod/samba-panel/actions)
[![License](https://img.shields.io/github/license/Lanakod/samba-panel?style=flat-square)](LICENSE)
[![Downloads](https://img.shields.io/github/downloads/Lanakod/samba-panel/total.svg?style=flat-square)](https://github.com/Lanakod/samba-panel/releases)
![Docker Pulls](https://img.shields.io/docker/pulls/lanakod/samba-panel)

**Samba Panel** is a web-based interface for managing Samba users and file shares via Docker.

## 🚀 Quick Start (Docker Run)

You can run the panel directly without Docker Compose:

```bash
docker run -d   --name samba-panel   -p 80:3000   -v "$PWD/smb.conf:/etc/samba/smb.conf"   -v "$PWD/smbpasswd:/etc/samba/smbpasswd"   -v /var/run/docker.sock:/var/run/docker.sock   -e SMB_CONF_PATH=/etc/samba/smb.conf   -e SMBPASSWD_PATH=/etc/samba/smbpasswd   -e NEXT_PUBLIC_PANEL_URL=http://localhost   -e CONTAINER_NAME=samba   lanakod/samba-panel:latest
```

## 🐳 Docker Compose Setup (recommended)

```yaml
version: "3.8"
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