---
title: ESWIN EIC7700 20250627 镜像测试报告
date: 2025-06-27
author: apr3vau
---

## 下载镜像

通过[链接](https://ci.deepin.com/repo/deepin/deepin-ports/cdimage/20250627/riscv64/deepin-25-crimson-preview-riscv64-eic7700-20250627-155140.tar.xz)下载镜像压缩包，随后使用以下命令解压镜像与校验码至当前文件夹：

```shell
tar -xvf deepin-25-crimson-preview-riscv64-eic7700-20250627-155140.tar.xz
```

校验镜像：

```shell
# 三者对应即可
$ cat deepin-eic7700-riscv64-25-desktop-installer.sha256sum
44d3cf2888cb6ba8155b57d1f5d2bbf0ca0e1e2ee694a5d2b428628c32ebb922  deepin-eic7700-riscv64-25-desktop-installer.boot.ext4
26e44dc499ef92a58c8255e0d1fd1164f2758f8a7c116860ac4f5d18e030b58f  deepin-eic7700-riscv64-25-desktop-installer.root.ext4

$ sha256sum deepin-eic7700-riscv64-25-desktop-installer.boot.ext4
44d3cf2888cb6ba8155b57d1f5d2bbf0ca0e1e2ee694a5d2b428628c32ebb922  deepin-eic7700-riscv64-25-desktop-installer.boot.ext4

$ sha256sum deepin-eic7700-riscv64-25-desktop-installer.root.ext4
26e44dc499ef92a58c8255e0d1fd1164f2758f8a7c116860ac4f5d18e030b58f  deepin-eic7700-riscv64-25-desktop-installer.root.ext4
```

## 测试设备：SiFive HiFive Premier P550

[参考文档](https://sifive.cdn.prismic.io/sifive/Z1h2tZbqstJ98Rbb_HF106_user_guide_V1p2_zh.pdf)

### 硬件准备

- SiFive HiFive Premier P550
- 12V DC 电源适配器
- USB-C 数据线
- USB-A 数据线
- HDMI 显示器
- 键盘、鼠标

### 刷写操作系统

#### 刷写操作系统至 eMMC

首先使用Type-C线将板子的UART接口与电脑连接，电脑将显示4个UART，其中第二大的端口号是用于连接终端/调试的UART，在本报告中为 `/dev/tty.usbserial-102` (macOS) / `/dev/ttyUSB2` (Linux)。执行如下命令以建立串口通信：

macOS: `sudo screen -L /dev/tty.usbserial-102 115200`
Linux: `sudo screen -L /dev/ttyUSB2 115200`

随后以Boot-SPI（默认）模式启动板子。在u-boot menu阶段按下 `Ctrl-C` 进入u-boot命令行，执行 `fastboot usb 0` 。

使用 USB-A 线缆将板子与电脑相连接。注意，必须使用如图所示的处于上方的 USB-A 接口。

![P550 USB Ports](/sig-deepin-ports/img/docs/test/deepin-25-crimson-preview-riscv64-eic7700-20250627-155140.tar.xz.md/p550-usb.jpg)
确保本地电脑安装了`fastboot`，在一个新的终端执行如下命令：

```shell
fastboot flash boot deepin-eic7700-riscv64-25-desktop-installer.boot.ext4
fastboot flash root deepin-eic7700-riscv64-25-desktop-installer.root.ext4
```

示意输出：

```text
$ fastboot flash boot deepin-eic7700-riscv64-25-desktop-installer.boot.ext4
Sending sparse 'boot' 1/1 (107313 KB)              OKAY [  3.390s]
Writing 'boot'                                     OKAY [  5.965s]
Finished. Total time: 9.583s

$ fastboot flash root deepin-eic7700-riscv64-25-desktop-installer.root.ext4
Sending sparse 'root' 1/38 (260442 KB)             OKAY [  8.067s]
Writing 'root'                                     OKAY [  2.739s]
Sending sparse 'root' 2/38 (234405 KB)             OKAY [  7.272s]
Writing 'root'                                     OKAY [  2.213s]
Sending sparse 'root' 3/38 (262141 KB)             OKAY [  8.129s]
Writing 'root'                                     OKAY [  2.435s]
Sending sparse 'root' 4/38 (261589 KB)             OKAY [  8.110s]
Writing 'root'                                     OKAY [  2.338s]
```

运行完毕后，回到UART终端，按下 `Ctrl-C` 退出 fastboot ，执行 `boot` 命令以进入启动列表。你将会看到新系统被列出。选择新系统，成功启动。

### 启动测试

1. 将板子通电
2. 观察到 bootloader正常加载，成功找到操作系统并进行引导
3. 观察到 initrd 与内核正确启动，正常进入 systemd ， Plymouth 正常展示
4. HDMI 显示器显示安装器界面
5. 通过USB接入鼠标键盘，正常工作
6. 完成图形化安装引导，进入桌面环境

### 桌面环境测试

- 观察到显示器输出正常，安装器界面、登录界面与 DDE 桌面环境皆正常显示。 TTY 切换功能正常工作。
- 观察到DDE桌面、任务栏与弹出菜单皆正常渲染，动画正常显示。鼠标正常渲染，按键无卡顿。
- `glxgears` 、 `es2gears` 、`vkgears` 皆正常进行图形渲染，`glmark2` 分数：32，`glmark2-es2` 分数：415，GPU测试通过。
- 控制中心、文件管理器、文本编辑器等系统内置应用皆正常工作
- `mpv` 与系统默认播放器在硬件解码播放视频时正常工作，浏览器视频播放正常工作
- Firefox 浏览器和 LibreOffice 办公套件可以正常工作。`build-essential` 套件可以正常安装并工作。
- 板载网卡可以正常工作

### 异常记录

- `glxinfo` 和 `vkgears -info` 输出中显示 `llvmpipe`。

### 结论

**支持等级：8.5 完整支持**

该镜像在 SiFive HiFive Premier P550 上通过测试。
