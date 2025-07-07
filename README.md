# Samba Panel

[![Docker Image](https://img.shields.io/badge/docker-ghcr.io%2Flanakod%2Fsamba--panel-blue?logo=docker&style=flat-square)](https://github.com/Lanakod/samba-panel/pkgs/container/samba-panel)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Lanakod/samba-panel/docker-publish.yml?branch=main&label=build&style=flat-square)](https://github.com/Lanakod/samba-panel/actions)
[![License](https://img.shields.io/github/license/Lanakod/samba-panel?style=flat-square)](LICENSE)

🧰 **Samba Panel** is a web-based interface for managing [Samba](https://www.samba.org/) shares and users using the `dperson/samba` container. It allows you to create, update, and delete users and shares directly from a browser.

## 🐳 Docker Compose Setup

To get started, use the following `docker-compose.yaml`:

```yaml
name: samba
services:
  samba:
    container_name: samba
    image: dperson/samba
    read_only: false
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
    image: ghcr.io/lanakod/samba-panel:latest
    env_file: panel.env
    ports:
      - "80:3000"
    restart: unless-stopped
    volumes:
      - ./smb.conf:/etc/samba/smb.conf
      - ./smbpasswd:/etc/samba/smbpasswd
````


## 🔧 `panel.env`

Create a `.env` file named `panel.env` with the following:

```env
SMB_CONF_PATH=/etc/samba/smb.conf
SMBPASSWD_PATH=/etc/samba/smbpasswd
NEXT_PUBLIC_PANEL_URL=http://localhost
CONTAINER_NAME=samba
```

## 🧾 `smb.conf`

Here’s an example `smb.conf` that includes a global section and will be updated by the panel for individual shares:

```conf
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

> ⚠️ Only the `[global]` section should exist initially. Share sections will be managed by the panel.

## 📁 `smbpasswd`

Ensure that the `smbpasswd` file exists in your project root and is empty:

```bash
touch smbpasswd
```

> It will be populated automatically by Samba during user creation.

## 🚀 Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Lanakod/samba-panel.git
   cd samba-panel
   ```

2. Create the required config files:

   * `smb.conf` (with `[global]` section)
   * Empty `smbpasswd`
   * `panel.env`

3. Start the containers:

   ```bash
   docker compose up -d
   ```

4. Open your browser and go to [http://localhost](http://localhost)

## 🧠 Features

* Add/edit/remove Samba users
* Add/edit/remove share folders
* Automatically updates `smb.conf` and `smbpasswd`
* Live status updates from Samba container

## ✅ Requirements

* Docker & Docker Compose
* Permissions to mount volumes and manage containers

## 🔒 Notes

* The panel does not expose Samba credentials; it runs commands inside the Samba container.
* Make sure your system firewall allows SMB ports: `137/udp`, `138/udp`, `139/tcp`, `445/tcp`

## 🛠 Maintainer

Developed by [@lanakod](https://github.com/Lanakod)

## 📄 License

This project is licensed under the [MIT License](LICENSE).