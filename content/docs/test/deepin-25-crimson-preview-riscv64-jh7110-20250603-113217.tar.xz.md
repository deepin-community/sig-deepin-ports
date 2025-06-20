---
title: StarFive JH7110 20250603 镜像测试报告
date: 2025-06-18
author: apr3vau
---

## 下载镜像

通过[链接](https://ci.deepin.com/repo/deepin/deepin-ports/cdimage/20250603/riscv64/deepin-25-crimson-preview-riscv64-jh7110-20250603-113217.tar.xz)下载镜像压缩包，随后使用以下命令解压镜像与校验码至当前文件夹：

``` shell
tar -xvf deepin-25-crimson-preview-riscv64-jh7110-20250603-113217.tar.xz
```

校验镜像：

``` shell
# 两者一致即可
$ cat deepin-jh7110-riscv64-25-desktop-installer.sha256sum
c2653489c88fc40a620f82aab6ee6280edd6622f5ee01e88f0e83242a1e98fc7  deepin-jh7110-riscv64-25-desktop-installer.img
$ sha256sum deepin-jh7110-riscv64-25-desktop-installer.img
c2653489c88fc40a620f82aab6ee6280edd6622f5ee01e88f0e83242a1e98fc7  deepin-jh7110-riscv64-25-desktop-installer.img
```

## 测试设备：Milk-V Mars

### 硬件准备

- MilkV Mars
- 5V USB-C 电源适配器
- USB 转 TTL 调试线
- MicroSD卡
- HDMI 显示器
- 键盘、鼠标

### 连接串口

将USB转TTL调试线的针脚以如下方式连接至板子：

| GPIO 引脚   | USB UART |
|-------------|----------|
| GND (Pin 6) | GND      |
| TX (Pin 8)  | TX       |
| RX (Pin 10) | RX       |

使用 GNU Screen 连接串口：

``` shell
sudo screen /dev/tty.usbserial-1130 115200
```

### 刷写操作系统至 SD 卡

使用如下命令将镜像刷入 SD 卡，此处 SD 卡设备名为`/dev/disk4`。

deepin-25-crimson-preview-riscv64-jh7110-20250603-113217.tar.xz
``` shell
sudo dd if=deepin-jh7110-riscv64-25-desktop-installer.img of=/dev/disk4 status=progress
```

### 启动测试

1. 插入 SD 卡至板子下方卡槽中
2. 将板子通电
3. 观察到 bootloader正常加载：

```
Tring booting distro ...
switch to partitions #0, OK
mmc1 is current device
Try booting from MMC1 ...
420 bytes read in 5 ms (82 KiB/s)
...

Retrieving file: /extlinux/extlinux.conf
807 bytes read in 8 ms (97.7 KiB/s)
U-Boot menu
1:      Deepin 25 6.6.20-jh7110-starfive-66y
2:      Deepin 25 6.6.20-jh7110-starfive-66y (rescue target)
Enter choice: 1
```

4. 观察到 initrd 与内核正确启动，正常进入 systemd ，但 Plymouth 未展示：

```
Retrieving file: /initrd.img-6.6.20-jh7110-starfive-66y
79905980 bytes read in 3571 ms (21.3 MiB/s)
Retrieving file: /vmlinuz-6.6.20-jh7110-starfive-66y
9607273 bytes read in 437 ms (21 MiB/s)
append: root=LABEL=root console=ttyS0,115200 splash quiet earlycon=sbi rw
Retrieving file: /dtbs/linux-image-6.6.20-jh7110-starfive-66y/starfive/jh7110-starfive-visionfive-2-v1.3b.dtb
54960 bytes read in 14 ms (3.7 MiB/s)
   Uncompressing Kernel Image
Moving Image from 0x44000000 to 0x40200000, end=41d8c000
## Flattened Device Tree blob at 48000000
   Booting using the fdt blob at 0x48000000
   Using Device Tree in place at 0000000048000000, end 00000000480106af

Starting kernel ...

clk u5_dw_i2c_clk_core already disabled
clk u5_dw_i2c_clk_apb already disabled
[    0.260767] CCACHE: DataError @ 0x00000000.08040140
[    0.260851] CCACHE: DataFail @ 0x00000000.08040270
...
[   52.976220] Error: Driver 'vdec' is already registered, aborting...
Error: Driver 'vdec' is already registered, aborting...
FAT-fs (mmcblk1p3): Volume was not properly unmounted. Some data may be corrupt. Please run fsck.
[  OK  ] Finished plymouth-read-write.servi…Plymouth To Write Out Runtime Data.
         Mounting proc-sys-fs-binfmt_misc.m…cutable File Formats File System...
...
[  OK  ] Finished systemd-user-sessions.service - Permit User Sessions.
         Starting lightdm.service - Light Display Manager...
         Starting plymouth-quit-wait.servic…d until boot process finishes up...
[  OK  ] Started dde-dconfig-daemon.service - dde-dconfig-daemon service.
[  OK  ] Started cups.service - CUPS Scheduler.
[   61.009858] starfive-dwmac 16040000.ethernet end1: __stmmac_open: Cannot attach to PHY (error: -19)
[   61.058893] starfive-dwmac 16040000.ethernet end1: __stmmac_open: Cannot attach to PHY (error: -19)
[   61.096311] starfive-dwmac 16040000.ethernet end1: __stmmac_open: Cannot attach to PHY (error: -19)
[   61.127586] starfive-dwmac 16040000.ethernet end1: __stmmac_open: Cannot attach to PHY (error: -19)

Deepin GNU/Linux 23 deepin-PC ttyS0

deepin-PC login:
```

5. HDMI 显示器显示安装器界面
6. 通过USB接入鼠标键盘，正常工作
7. 完成安装引导，进入桌面环境
   - 观察到显示器输出正常，安装器界面、登录界面与 DDE 桌面环境皆正常显示。 TTY 切换功能正常工作。
   - 观察到DDE桌面、任务栏与弹出菜单皆正常渲染，动画正常显示。鼠标正常渲染，按键有卡顿。
   - 观察到glmark2正常进行图形渲染，OpenGL正常工作。

### 异常记录

- 观察到 Plymouth 未展示
- 观察到键盘按键输入有卡顿
- 在使用 ffmpeg 进行硬件解码时遇到找不到内部文件的错误，无法进行解码

### 结论

**支持等级：开箱即用的 deepin 环境**

该镜像在 MilkV Mars 上通过测试。
