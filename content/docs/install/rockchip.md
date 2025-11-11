---
title: Rockchip 通用镜像 安装指南
date: 2025-11-05
---

## 支持设备

- Radxa Rock 5 全系列
- Radxa Rock 4D
- DshanPi A1
- 其它搭载 Rockchip 芯片的设备

## 下载并解压镜像

在[镜像列表](https://deepin-community.github.io/sig-deepin-ports/images/arm64)中下载最新的 `.tar.xz` 格式的镜像包至本地，随后使用以下命令解压镜像与校验码至当前文件夹：

``` shell
tar -xvf <你下载的镜像名称>.tar.xz
```

解压得到

- `deepin-rockchip-riscv64-25-desktop-installer.sha256sum`
  sha256 校验和
- `deepin-rockchip-riscv64-25-desktop-installer.md5sum`
  md5 校验和
- `deepin-rockchip-riscv64-25-desktop-installer.root.ext4`
  系统根目录分区镜像

校验镜像：

``` shell
$ cat deepin-rockchip-riscv64-25-desktop-installer.sha256sum
[hash sum]  deepin-rockchip-riscv64-25-desktop-installer.root.ext4

$ sha256sum deepin-rockchip-riscv64-25-desktop-installer.root.ext4
[hash sum]  deepin-rockchip-riscv64-25-desktop-installer.root.ext4
```

## 刷写 bootloader

### 准备 bootloader 文件

前往[deepin-ports-kernel](https://github.com/deepin-community/deepin-ports-kernel/actions)，进入最新的 `build all` 项，在 Artifacts 中选择对应项目下载并解压，截止当前，`deepin-ports-kernel` 项目提供支持以下设备 `defconfig` 的 u-boot：

- RK3576
  - evb
  - generic
  - rock4d
  - roc-pc
  - sige5
  - dshanpi-a1
- RK3588
  - cm3588-nas
  - coolpi-4b
  - coolpi-cm5-evb
  - coolpi-cm5-genbook
  - evb
  - gameforce-ace
  - generic
  - jaguar
  - khadas-edge2
  - nanopc-t6
  - nanopi-r6c
  - nanopi-r6s
  - neu6a-io
  - neu6b-io
  - nova
  - odroid-m2
  - orangepi-5-max
  - orangepi-5-plus
  - orangepi-5
  - orangepi-5-ultra
  - quartzpro64
  - rock5a
  - rock5b
  - rock-5c
  - rock-5-itx
  - sige7
  - tiger
  - toybrick
  - turing-rk1

它的目录结构如图所示：

```
.
├── rk35XX_spl_loader_*.bin    # spl loader 文件
└── XXXX-rk35XX   # 针对设备构建的 u-boot 文件（以下文件不一定全部存在）
    ├── idbloader.img  
    ├── u-boot.itb  
    ├── u-boot-rockchip.bin	
    └── u-boot-rockchip-spi.bin
└── ...   # 可能有若干目录，每个目录对应一种设备
```

### 安装 rkdeveloptools

可在 https://github.com/rockchip-linux/rkdeveloptool 处安装。

Archlinux 系统可通过 AUR 安装 `rkdeveloptool` 包。

### 进入刷写模式

使设备进入 MaskROM 模式，通常需要在按下设备 Maskrom 按钮时通电，并使用 USB 连接设备和电脑。

执行如下命令使设备加载 loader，进入刷写模式。

```
# 使用以下命令确认设备已连接并进入 MaskROM 模式
sudo rkdeveloptool ld
# 加载 loader
sudo rkdeveloptool db rk35XX_spl_loader_*.bin
```

### 写入 bootloader

#### 方法 1：刷入 SPI 镜像

如果设备存在 SPI 芯片且目录内有 `u-boot-rockchip-spi.bin`，推荐直接执行如下命令将新的 bootloader 写入到设备的 SPI 中。

```
# 写入 u-boot 的 SPI 镜像
sudo rkdeveloptool wl 0 u-boot-rockchip-spi.bin
# 重启
sudo rkdeveloptool rd
```

#### 方法 2：分别刷入

如果设备存在存储（例如 eMMC）且目录内有 `idbloader.img` 和 `u-boot.itb`，则可以通过此种方式分别刷入 loader 和 u-boot。

```
# 写入 TPL/SPL loader
rkdeveloptool wl 0x40 idbloader.img
# 写入 u-boot
rkdeveloptool wl 0x4000 u-boot.itb
# 重启
sudo rkdeveloptool rd
```

## 写入操作系统

### 通过 USB 设备 / SD 卡 / NVMe 硬盘启动

使用分区工具创建一个空白的 gpt 分区表，新增一个分区，使用 `dd` 命令将镜像写入对应分区。

``` shell
sudo dd if=deepin-rockchip-riscv64-25-desktop-installer.root.ext4 of=/dev/sdX1 status=progress bs=4M
```

### 通过 eMMC 设备启动

首先执行之前的「进入刷写模式」的步骤，然后执行以下命令：

```
# 写入 root 分区
rkdeveloptool wl 0x40000 deepin-rockchip-riscv64-25-desktop-installer.root.ext4
# 重启
sudo rkdeveloptool rd
```

## 注意事项

- 镜像启动时间可能较长，如需查看串口，请参见对应设备的[测试报告](https://deepin-community.github.io/sig-deepin-ports/docs)。
