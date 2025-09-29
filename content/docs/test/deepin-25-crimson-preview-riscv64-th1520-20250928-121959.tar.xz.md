---
title: deepin-25-crimson-preview-riscv64-th1520-20250928-121959.tar.xz 镜像测试报告
date: 2025-09-29
---

## 下载镜像

```
$ curl -C - -LO https://ci.deepin.com/repo/deepin/deepin-ports/cdimage/20250928/riscv64/deepin-25-crimson-preview-riscv64-th1520-20250928-121959.tar.xz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
 25 3997M   25 1032M    0     0  4957k      0  0:13:45  0:03:33  0:10:12 6770k
curl: (18) transfer closed with 3108071460 bytes remaining to read

$ curl -C - -LO https://ci.deepin.com/repo/deepin/deepin-ports/cdimage/20250928/riscv64/deepin-25-crimson-preview-riscv64-th1520-20250928-121959.tar.xz
** Resuming transfer from byte position 1083164556
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
 34 2964M   34 1032M    0     0  5680k      0  0:08:54  0:03:06  0:05:48 6993k
curl: (18) transfer closed with 2025900278 bytes remaining to read

$ curl -C - -LO https://ci.deepin.com/repo/deepin/deepin-ports/cdimage/20250928/riscv64/deepin-25-crimson-preview-riscv64-th1520-20250928-121959.tar.xz
** Resuming transfer from byte position 2165335738
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
 53 1932M   53 1032M    0     0  7813k      0  0:04:13  0:02:15  0:01:58 6022k
curl: (18) transfer closed with 943714616 bytes remaining to read

$ curl -C - -LO https://ci.deepin.com/repo/deepin/deepin-ports/cdimage/20250928/riscv64/deepin-25-crimson-preview-riscv64-th1520-20250928-121959.tar.xz
** Resuming transfer from byte position 3247521400
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  899M  100  899M    0     0  7730k      0  0:01:59  0:01:59 --:--:-- 9005k

$ tar xvf deepin-25-crimson-preview-riscv64-th1520-20250928-121959.tar.xz
$ cat deepin-th1520-riscv64-25-desktop-installer.sha256sum
6fe113bd42d547e7e689f80857a2aea45a066e299f1d0361fc3d8b2c55368386  deepin-th1520-riscv64-25-desktop-installer.boot.ext4
d9a3c7fa640b9f0be64190d950e2723ec4c1ceb1722e13912e6bf6b577366cda  deepin-th1520-riscv64-25-desktop-installer.root.ext4

$ sha256sum deepin-th1520-riscv64-25-desktop-installer.boot.ext4
6fe113bd42d547e7e689f80857a2aea45a066e299f1d0361fc3d8b2c55368386  deepin-th1520-riscv64-25-desktop-installer.boot.ext4

$ sha256sum deepin-th1520-riscv64-25-desktop-installer.root.ext4
d9a3c7fa640b9f0be64190d950e2723ec4c1ceb1722e13912e6bf6b577366cda  deepin-th1520-riscv64-25-desktop-installer.root.ext4
```

## 测试设备：LiChee Pi 4A

### 硬件准备

例如：

- LiChee Pi 4A
- USB Type-C 电源适配器（5V-2A）
- USB 转 TTL 调试线
- MicroSD卡
- 鼠标、键盘
- HDMI 采集卡
- 3.5mm 耳机

### 连接串口

将 USB-TTL 调试线上的，连接到开发板上的：

 - GND 连接 GND
 - RXD 连接 U0-TX
 - TXD 连接 U0-RX

使用 GNU Screen 尝试读取串口：

```
$ sudo screen /dev/tty.usbserial-140 115200
```

### 刷写 bootloader （可选）

从 [此处](https://github.com/deepin-community/deepin-riscv-kernel/actions/runs/18068114234/artifacts/4123972676) 下载 `uboot-th1520-revyos.zip`，之后找到固件 `light_lpi4a_16g/u-boot-with-spl.bin` 并刷写：

```
# 按住 BOOT 按键，之后用 C-to-C 线连接开发板和电脑
$ fastboot flash ram u-boot-with-spl.bin
$ fastboot reboot
$ fastboot flash uboot u-boot-with-spl.bin
```

之后重启设备。

### 刷写操作系统至 eMMC

```
# 按住 BOOT 按键，之后用 C-to-C 线连接开发板和电脑
$ fastboot flash boot deepin-th1520-riscv64-25-desktop-installer.boot.ext4
$ fastboot flash root deepin-th1520-riscv64-25-desktop-installer.root.ext4
```

### 启动测试

1. 将板子通电
2. 连接采集卡、鼠标、键盘、耳机；板载 USB 接口正常工作
3. 等待启动系统；Plymouth 界面正常显示
4. 按照 GUI 指示初始化系统安装
5. 登陆，进入桌面，各 DDE 组件及壁纸正常显示且无明显渲染错误，动画效果卡顿但正常
6. 尝试切换 TTY 1-6
7. 打开控制中心，检查“关于本机”并进行简单操作
8. 测试网络（未识别无线网卡）
9. 尝试最大化、最小化、关闭、打开各个窗口
10. 检查 `/dev/dri`，发现了正常的集成显卡
11. 执行 `glxinfo`，观察到异常情况：渲染器为 `llvmpipe`，且存在驱动初始化报错信息
12. 执行 `glxgears`，观察到齿轮旋转，运行一段时间后帧率大致稳定在 175 FPS
13. 执行 `es2_info`，一切输出均正常
14. 执行 `es2gears_x11`，观察到齿轮旋转，运行一段时间后帧率大致稳定在 60 FPS
15. 执行 `eglinfo`，一切输出均正常
16. 执行 `eglgears_x11`，立即报错为"EGLUT: Failed to choose a config"
17. 执行 `vkgears -info`，观察到异常情况：渲染器为 `llvmpipe`；运行一段时间后帧率大致稳定在 60 FPS
18. 尝试调节设备分辨率，观察到分辨率调节行为正确
19. 尝试使用各种应用程序
20. 打开终端，执行基础、常见的命令（如 `ls`, `cp`）
21. 打开终端，执行 `fastfetch`
22. 打开文件管理器，进行基本操作
23. 分别测试计算器、音乐、应用商店、UOS AI 等功能
24. 测试系统监视器、日志收集工具和设备管理器
25. 尝试使用“音乐”和“影视”播放示例媒体文件
26. 安装 `mpv`
27. 分别尝试使用 `mpv` 和 `deepin-movie` 播放各码率和分辨率的视频
28. 测试使用 Firefox 浏览器
29. 使用 DDE 进行关机

### 异常记录

- 执行 `glxinfo`，观察到异常情况：渲染器为 `llvmpipe`，且存在驱动初始化报错信息
- 执行 `eglgears_x11`，立即报错为"EGLUT: Failed to choose a config"
- 执行 `vkgears -info`，观察到异常情况：渲染器为 `llvmpipe`
- 耳机音频输出异常（表现为无声）

### 结论

**支持等级：7.3 开箱即用的 deepin 环境**

该镜像在 LicheePi 4A 上通过测试。
