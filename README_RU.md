# Samba Panel 🧰

<img src="banner.png" alt="Баннер Samba Panel" width="100%">

<p align="center">
  <a href="https://hub.docker.com/r/lanakod/samba-panel">
    <img src="https://img.shields.io/badge/docker-docker.io%2Flanakod%2Fsamba--panel-blue?logo=docker&style=flat-square" alt="Docker Image">
  </a>
  <a href="https://github.com/Lanakod/samba-panel/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/lanakod/samba-panel/docker-image.yml" alt="Статус сборки">
  </a>
  <a href="https://github.com/Lanakod/samba-panel/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/Lanakod/samba-panel?style=flat-square" alt="Лицензия">
  </a>
  <a href="https://github.com/Lanakod/samba-panel/releases">
    <img src="https://img.shields.io/github/downloads/Lanakod/samba-panel/total.svg?style=flat-square" alt="Загрузки">
  </a>
  <img src="https://img.shields.io/docker/pulls/lanakod/samba-panel?style=flat-square" alt="Docker Pulls">
  <img src="https://img.shields.io/github/last-commit/Lanakod/samba-panel?style=flat-square" alt="Последний коммит">
  <img src="https://img.shields.io/github/languages/top/Lanakod/samba-panel?style=flat-square" alt="Основной язык">
  <img src="https://img.shields.io/github/contributors/Lanakod/samba-panel?style=flat-square" alt="Участники">
  <img src="https://img.shields.io/badge/platform-linux%20%7C%20arm64%20%7C%20amd64-success?style=flat-square&logo=linux" alt="Платформы">
</p>

**Samba Panel** - веб-интерфейс для управления пользователями Samba и общими ресурсами через Docker.

👉 **Пример рабочей конфигурации** смотрите в папке [`example/`](example) (включает файлы Docker Compose).

---

## 🚀 Быстрый старт (Docker Run)

Запустите панель без Docker Compose:

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

## 🐳 Настройка Docker Compose (рекомендуется)

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

### Файл panel.env

```env
SMB_CONF_PATH=/etc/samba/smb.conf
SMBPASSWD_PATH=/etc/samba/smbpasswd
NEXT_PUBLIC_PANEL_URL=http://localhost
CONTAINER_NAME=samba
```

## 📄 smb.conf

Минимальная стартовая конфигурация:

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

> 🛠 Общие ресурсы Samba будут управляться через интерфейс панели.

## ✅ smbpasswd

Создайте пустой файл `smbpasswd`:

```bash
touch smbpasswd
chmod 600 smbpasswd
```

## 🛠 Возможности

- 🧑‍💻 Создание, изменение, удаление пользователей Samba
- 📂 Создание, изменение, удаление общих ресурсов Samba
- 🔄 Автоматическое обновление `smb.conf` и `smbpasswd`
- 🔍 Мониторинг состояния контейнера и журналов в реальном времени
- 🥧 Поддержка Docker-образов для разных архитектур (amd64 + arm64)

## 🎯 Требования

- Docker и Docker Compose (или Docker CLI)
- Доступ к `/var/run/docker.sock` для управления контейнерами

## 📝 Лицензия

Распространяется под [MIT License](LICENSE) — свободное использование и модификация!

## 🛠 Разработчик

Разработано и поддерживается [@lanakod](https://github.com/Lanakod)

Удобного управления Samba!