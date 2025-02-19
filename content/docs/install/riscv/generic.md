---
title: QEMU 安装指南
date: 2025-01-09
meta_device: QEMU
meta_device_desc: 也兼容其它（假如存在）的主线内核 + UEFI平台
meta_device_img: images/devices/qemu.svg
---

## 支持设备

- QEMU 虚拟机

## 下载 ISO 镜像

选择 `通用设备 / QEMU` 下载 iso 格式的镜像至本地。

## 安装 QEMU 和 RISC-V EDK2 固件

以下命令适用于 deepin 23:

```
# 本体
sudo apt install qemu-system-misc
# opengl 模块
sudo apt install qemu-system-modules-opengl
# EDK2 固件
sudo apt install qemu-efi-riscv64
```

## 启动

参考脚本：

```
#!/bin/bash

# 从 ~/Downloads/ 中获得最新的镜像
IMAGE_SEARCH=$(find ./Downloads/deepin-23-beige-preview-riscv64-*.iso | sort | tail -n1)

IMAGE=${1:-$IMAGE_SEARCH}

VCPU=16
VRAM=16G

if [ ! -f ./test-disk.img ]; then
  # deepin 安装需要至少 64G 空间，如果仅体验 live 环境可以删去，并去掉下方启动命令的对应部分
  fallocate -l 80G test.img
fi

# 默认映射 5900 端口到本机 15900，可在虚拟机中安装 x11vnc 以便 vnc 连接
qemu-system-riscv64 \
    -smp $VCPU -m $VRAM -cpu rv64 \
    -machine virt,acpi=off \
    -device virtio-scsi-pci,id=scsi \
    -drive if=pflash,format=raw,unit=0,file=/usr/share/qemu-efi-riscv64/RISCV_VIRT_CODE.fd,readonly=on \
    -device scsi-cd,drive=cd0 \
    -drive file=$IMAGE,id=cd0,format=raw,readonly=on \
    -device virtio-net,netdev=deepinnet -netdev user,id=deepinnet,hostfwd=tcp:127.0.0.1:15900-:5900 \
    -device virtio-sound-pci,audiodev=deepinaudio -audiodev alsa,id=deepinaudio \
    -device qemu-xhci,id=xhci -device usb-tablet,bus=xhci.0 -device usb-kbd,bus=xhci.0 \
    -drive file=./test.img,if=virtio \
    -device virtio-vga-gl -display gtk,gl=on
```

## 注意事项

- `virtio-vga-gl` 为参考值，亦可选择 `virtio-gpu-gl`，部分硬件会导致启动卡在 openSBI
- 启动需要大约 3-5 分钟，如需查看串口，请切换到 serial 并在 grub 界面，将 `console=tty` 改为 `console=ttyS0` 即可
- 请在 Linux 平台上启动，否则 virtio-gpu 可能无法正常工作导致无法进入图形界面
