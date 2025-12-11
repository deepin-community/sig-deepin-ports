---
title: Radxa Dragon Q6A 安装指南
date: 2025-12-11
---

## 支持设备

- Radxa Dragon Q6A

## 下载并解压镜像

在[镜像列表](https://deepin-community.github.io/sig-deepin-ports/images/arm64)中下载最新的 `.tar.xz` 格式的镜像包至本地，随后使用以下命令解压镜像与校验码至当前文件夹：

``` shell
tar -xvf <你下载的镜像名称>.tar.xz
```

解压得到

- `deepin-q6a-arm64-25-desktop-installer.sha256sum`
  sha256 校验和
- `deepin-q6a-arm64-25-desktop-installer.md5sum`
  md5 校验和
- `deepin-q6a-arm64-25-desktop-installer.efi.fat32`
  EFI 分区镜像
- `deepin-q6a-arm64-25-desktop-installer.root.ext4`
  系统根目录分区镜像

校验镜像：

``` shell
$ cat deepin-q6a-arm64-25-desktop-installer.sha256sum
[hash sum]  deepin-q6a-arm64-25-desktop-installer.root.ext4

$ sha256sum deepin-q6a-arm64-25-desktop-installer.root.ext4
[hash sum]  deepin-q6a-arm64-25-desktop-installer.root.ext4

$ sha256sum deepin-q6a-arm64-25-desktop-installer.efi.fat32
[hash sum]  deepin-q6a-arm64-25-desktop-installer.efi.fat32
```

## 刷写 bootloader

> 此设备出厂自带引导 EFI 启动的 bootloader，除非必要否则不需要刷写 bootloader。

WIP

## 写入操作系统 (SD 卡 / USB 存储)

### 创建分区表

使用分区工具创建一个空白的 gpt 分区表，并新增两个空白分区，第一个分区不应小于 256M 且标记类型为 01 (EFI 系统)，两个分区均不需要格式化。

### 写入镜像文件

使用 `dd` 命令将镜像依次写入两个分区：

``` shell
sudo dd if=deepin-q6a-arm64-25-desktop-installer.efi.fat32 of=/dev/sda1 status=progress bs=4M
sudo dd if=deepin-q6a-arm64-25-desktop-installer.root.ext4 of=/dev/sda2 status=progress bs=4M
```

## 启动

将存储介质插入设备，连接好 HDMI 视频输出和键盘鼠标输入，通电，等待设备启动至安装器界面，完成安装即可

## 注意事项

- 镜像启动时间可能较长，如需查看串口，请参见对应设备的[测试报告](https://deepin-community.github.io/sig-deepin-ports/docs)。
