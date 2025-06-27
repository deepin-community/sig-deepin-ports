---
title: QEMU 20250625 镜像测试报告
date: 2025-06-27
author: apr3vau
---

## 下载镜像

通过[链接](https://ci.deepin.com/repo/deepin/deepin-ports/cdimage/20250625/riscv64/deepin-25-crimson-immutable-riscv64-20250625-171832.iso)下载 ISO 镜像。将下载后的镜像重命名为 `installer.iso` ，并置于当前目录下。

## 安装模拟器

```bash
# 本体
sudo apt install qemu-system-misc
# opengl 模块
sudo apt install qemu-system-modules-opengl
# EDK2 固件
sudo apt install qemu-efi-riscv64
```

## 准备虚拟磁盘

使用 `fallocate` 命令分配一块空的虚拟磁盘给 deepin RISC-V 操作系统，此处名为 `deepin.img` 。注意，deepin 安装需要至少 64G 空间，而针对虚拟磁盘则需要更多空间以满足需求。

```bash
fallocate -l 80G deepin.img
```

## 准备安装启动脚本

创建 QEMU 启动脚本文件，此处名为 `install.sh` 。脚本内容如下：

```bash
#!/bin/bash
VCPU=4
VRAM=8G

qemu-system-riscv64 \
    -smp $VCPU -m $VRAM -cpu rv64 \
    -machine virt,acpi=off \
    -device virtio-scsi-pci,id=scsi \
    -drive if=pflash,format=raw,unit=0,file=/usr/share/qemu-efi-riscv64/RISCV_VIRT_CODE.fd,readonly=on \
    -device scsi-cd,drive=cd0 \
    -drive file=./installer.iso,id=cd0,format=raw,readonly=on \
    -device virtio-net,netdev=deepinnet -netdev user,id=deepinnet,hostfwd=tcp:127.0.0.1:15900-:5900 \
    -device virtio-sound-pci,audiodev=deepinaudio -audiodev alsa,id=deepinaudio \
    -device qemu-xhci,id=xhci -device usb-tablet,bus=xhci.0 -device usb-kbd,bus=xhci.0 \
    -drive file=./deepin.img,if=virtio \
    -device virtio-vga-gl -display gtk,gl=on
    -serial mon:stdio
```

其中， `VCPU` 需要小于当前系统 CPU 核心数， `VRAM` 需要小于当前系统内存大小。可以在终端中观察到 UEFI 引导的过程。如需查看操作系统引导的过程，请在 GRUB 选项界面，在你想引导的系统选项上按 `e` 键，找到 `console=tty` 改为 `console=ttyS0` ，按下 Ctrl-x 开始引导即可

## 开始安装

在终端输入 `bash install.sh` ，观察到图形窗口弹出。等待安装器启动，使用图形窗口界面全盘安装 deepin ，等待安装完毕自动重启，完成安装。

![启动成功界面](/sig-deepin-ports/img/docs/test/deepin-25-crimson-immutable-riscv64-20250625-171832.iso.md/qemu.jpg)

## 准备后续启动脚本

若准备将 `installer.iso` 移除，则需同步移除 QEMU 启动选项中的对应参数移除。可以创建 `start.sh` 脚本，内容如下：

```bash
#!/bin/bash
VCPU=4
VRAM=8G

qemu-system-riscv64 \
    -smp $VCPU -m $VRAM -cpu rv64 \
    -machine virt,acpi=off \
    -device virtio-scsi-pci,id=scsi \
    -drive if=pflash,format=raw,unit=0,file=/usr/share/qemu-efi-riscv64/RISCV_VIRT_CODE.fd,readonly=on \
    -device virtio-net,netdev=deepinnet -netdev user,id=deepinnet,hostfwd=tcp:127.0.0.1:15900-:5900 \
    -device virtio-sound-pci,audiodev=deepinaudio -audiodev alsa,id=deepinaudio \
    -device qemu-xhci,id=xhci -device usb-tablet,bus=xhci.0 -device usb-kbd,bus=xhci.0 \
    -drive file=./deepin.img,if=virtio \
    -device virtio-vga-gl -display gtk,gl=on
    -serial mon:stdio
```

后续执行 `bash start.sh` 启动虚拟机即可。
