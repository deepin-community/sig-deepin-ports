---
title: ESWIN EIC7700 20250603 镜像测试报告
date: 2025-06-20
author: apr3vau
---

## 下载镜像

通过[链接](https://ci.deepin.com/repo/deepin/deepin-ports/cdimage/20250603/riscv64/deepin-25-crimson-preview-riscv64-eic7700-20250603-105747.tar.xz)下载镜像压缩包，随后使用以下命令解压镜像与校验码至当前文件夹：

``` shell
tar -xvf deepin-25-crimson-preview-riscv64-eic7700-20250603-105747.tar.xz
```

校验镜像：

``` shell
# 三者对应即可
$ cat deepin-eic7700-riscv64-25-desktop-installer.sha256sum 
efcc71bdbf53d166536527dd9b2b3bdd597a9cab80852cf292d417452fcf0b60  deepin-eic7700-riscv64-25-desktop-installer.boot.ext4
52c5615d8ea3525d5de3516a06d39e102511d1d0cea925e012903b8d8b9340cf  deepin-eic7700-riscv64-25-desktop-installer.root.ext4

$ sha256sum deepin-eic7700-riscv64-25-desktop-installer.boot.ext4 
efcc71bdbf53d166536527dd9b2b3bdd597a9cab80852cf292d417452fcf0b60  deepin-eic7700-riscv64-25-desktop-installer.boot.ext4

$ sha256sum deepin-eic7700-riscv64-25-desktop-installer.root.ext4
52c5615d8ea3525d5de3516a06d39e102511d1d0cea925e012903b8d8b9340cf  deepin-eic7700-riscv64-25-desktop-installer.root.ext4
```

## 测试设备：MilkV Megrez

### 硬件准备

- MilkV Megrez
- 12V DC 电源适配器
- USB-C 数据线
- 下列存储设备之一
  - MicroSD卡
  - M.2 SATA SSD硬盘
  - SATA3 硬盘 + SATA 连接线 + SATA 电源线
- HDMI 显示器
- 键盘、鼠标

### 连接串口

使用 USB-C 数据线插入 Megrez 的 USB-C 调试口连接电脑，随后使用 GNU Screen 连接串口：

``` shell
# macOS 示例
sudo screen /dev/tty.usbserial-<编号> 115200
# Linux 示例
sudo screen /dev/ttyUSB<编号> 115200
```

### 刷写操作系统

图一：各接口位置

![Megrez View](/sig-deepin-ports/img/docs/test/deepin-25-crimson-preview-riscv64-eic7700-20250603-105747.tar.xz.md/megrez-view.png)

图二：SATA 接口切换器

![Megrez SATA SEL](/sig-deepin-ports/img/docs/test/deepin-25-crimson-preview-riscv64-eic7700-20250603-105747.tar.xz.md/megrez-view.png)

#### 刷写操作系统至 SD 卡

首先将SD卡分为`boot`和`root`两个分区，随后刷入对应镜像。此处设备名为`/dev/sdd`。

``` shell
sudo dd if=deepin-eic7700-riscv64-25-desktop-installer.boot.ext4 of=/dev/sdd1 status=progress
sudo dd if=deepin-eic7700-riscv64-25-desktop-installer.root.ext4 of=/dev/sdd2 status=progress
```

成功后，将 SD 卡插入设备的 SD 卡插槽中，如图一标号 1 所示。

#### 刷写操作系统至 SATA M.2 SSD硬盘

步骤同上，成功后，将 SATA M.2 SSD 硬盘插入设备的 SATA M.2 接口，如图一标号 2 所示，再将如图二所示的 SATA SEL 开关拨至如图所示的下方。

#### 刷写操作系统至 SATA3 硬盘

步骤同上。成功后，将 SATA3 硬盘的 7-pin SATA 端子插入如图一标号 3 所示的 SATA接口，并单独连接 15 pin 供电线。最后，再将如图二所示的 SATA SEL 开关拨至如图所示的上方。

### 启动测试

1. 将板子通电
2. 观察到 bootloader正常加载，成功找到操作系统并进行引导

此处为 SATA 启动输出示例：

```
Autoboot in 5 seconds
Scanning for bootflows in all bootdevs
Seq  Method       State   Uclass    Part  Name                      Filename
---  -----------  ------  --------  ----  ------------------------  ----------------
Scanning global bootmeth 'efi_mgr':
Card did not respond to voltage select! : -110
MMC: no card present
No EFI system partition
No EFI system partition
Failed to persist EFI variables
Hunting with: mmc
Scanning bootdev 'sdhci@50450000.bootdev':
Card did not respond to voltage select! : -110
Scanning bootdev 'sd@50460000.bootdev':
MMC: no card present
MMC: no card present
MMC: no card present
MMC: no card present
Hunting with: nvme
eswin_pcie_wait_link_up: error: wait linkup timeout
PCIE-0: Link up (Gen1-x1, Bus0)
Hunting with: ahci
scanning bus for devices...
Rescanning SATA bus for devices...
SATA Device Info:
S/N: AA000000000000001269
Product model number: Great Wall GW1000 256GB
Firmware version: X1126A0
Capacity: 500118192 sectors
Scanning bootdev 'sata@0x50420000.bootdev':
  0  extlinux     ready   ahci         1  sata@0x50420000.bootdev.p /extlinux/extlinux.conf
** Booting bootflow 'sata@0x50420000.bootdev.part_1' with extlinux
U-Boot menu
1:      Deepin 25 6.6.87-eic770x-rockos-66y-gbb0c69aeae19
2:      Deepin 25 6.6.87-eic770x-rockos-66y-gbb0c69aeae19 (rescue target)
Enter choice: 1
```

3. 观察到 initrd 与内核正确启动，正常进入 systemd ，但 Plymouth 未展示
4. HDMI 显示器显示安装器界面
5. 通过USB接入鼠标键盘，正常工作
6. 完成图形化安装引导，进入桌面环境

### 桌面环境测试

- 观察到显示器输出正常，安装器界面、登录界面与 DDE 桌面环境皆正常显示。 TTY 切换功能正常工作。
- 观察到DDE桌面、任务栏与弹出菜单皆流畅渲染，动画流畅显示。鼠标正常渲染，按键无卡顿。
- 观察到系统内置应用正常工作，控制中心、应用商店等正常加载。
- 观察到 mpv 与系统默认播放器在硬件解码 h264 与 hevc 视频时正常工作，浏览器视频播放正常工作
- 观察到 glxgears 、 es2gears 、vkgears 正常进行图形渲染， OpenGL 、OpenGLES 和 Vulkan 皆正常工作。
- 观察到 glmark2 和 glmark2-es2 正常进行渲染且正确输出硬件信息， GPU 驱动正常工作。

### 异常记录

- 观察到 Plymouth 未展示

### 结论

**支持等级：完整支持**

该镜像在 MilkV Megrez 上通过测试。
