---
title: T-Head TH1520 20250711 镜像测试报告
date: 2025-07-10
author: calsym456
---

## 下载镜像

通过[链接](https://ci.deepin.com/repo/deepin/deepin-ports/cdimage/20250711/riscv64/deepin-25-crimson-preview-riscv64-th1520-20250711-103950.tar.xz)下载镜像压缩包，随后使用以下命令解压镜像与校验码至当前文件夹：

```bash
tar -xvf deepin-25-crimson-preview-riscv64-th1520-20250711-103950.tar.xz
```

校验镜像：

```
$ cat deepin-th1520-riscv64-25-desktop-installer.sha256sum
3e94088523996fe23a21340a8e9605252696f75bb6896eed451e0a541140ffdd  deepin-th1520-riscv64-25-desktop-installer.boot.ext4
26018528b46539094deaf24f1bd0bedab7cee2cc9513130fe0fb3a5a9d31fdfc  deepin-th1520-riscv64-25-desktop-installer.root.ext4
$ sha256sum deepin-th1520-riscv64-25-desktop-installer.boot.ext4
3e94088523996fe23a21340a8e9605252696f75bb6896eed451e0a541140ffdd  deepin-th1520-riscv64-25-desktop-installer.boot.ext4
$ sha256sum deepin-th1520-riscv64-25-desktop-installer.root.ext4
26018528b46539094deaf24f1bd0bedab7cee2cc9513130fe0fb3a5a9d31fdfc  deepin-th1520-riscv64-25-desktop-installer.root.ext4
```

## 测试设备：SiPEED LicheePI 4A

### 硬件准备

- SiPEED LicheePI 4A
- 12V DC 电源适配器
- USB 转 TTL 调试线
- USB-C 数据线
- MicroSD卡
- HDMI 显示器
- 键盘、鼠标

### 连接串口

将USB转TTL调试线的引脚以下表顺序连接：

| 调试线引脚 | 板子引脚 |
| ---------- | -------- |
| GND        | GND      |
| RXD        | U0-TX    |
| TXD        | U0-RX    |

将调试线另一端连接电脑，电脑将出现tty设备名，在本报告中为`/dev/tty.usbserial-110` (macOS) / `/dev/ttyUSB0` (Linux) 。随后使用 GNU Screen 连接串口：

```bash
# macOS
sudo screen /dev/tty.usbserial-110 115200
# Linux
sudo screen /dev/ttyUSB0 115200
```

### 更新bootloader

从[该网站](https://github.com/deepin-community/deepin-riscv-kernel/actions)的最新“build all” action中下载名为 `uboot-th1520-revyos` 的文件。下载完成后，解压并找到 `uboot-th1520-revyos/light_lpi4a/u-boot-with-spl.bin` （8G版本） / `uboot-th1520-revyos/light_lpi4a_16g/u-boot-with-spl.bin` （16G版本）。

按住板上的BOOT按键不放，然后插入 USB-C 数据线将板子连接电脑并通电，进入 USB 烧录模式。确保本地电脑安装了 `fastboot` ，执行如下命令以刷入bootloader：

```bash
fastboot flash uboot u-boot-with-spl.bin
```

刷入后重启。

### 刷写操作系统至eMMC

连接串口，插入 USB-C 数据线将板子连接电脑并通电，可以看到板子进入u-boot启动阶段。按S键中断自动启动，进入u-boot命令行。执行 `fastboot usb 0` 以进入fastboot刷机模式。

确保本地电脑安装了 `fastboot` ，在一个新的终端执行如下命令，刷入启动分区和根分区：

```bash
fastboot flash boot deepin-th1520-riscv64-25-desktop-installer.boot.ext4
fastboot flash root deepin-th1520-riscv64-25-desktop-installer.root.ext4
```

示意输出如下：

```
$ fastboot flash boot deepin-th1520-riscv64-25-desktop-installer.boot.ext4
Sending sparse 'boot' 1/2 (114606 KB)              OKAY [  3.149s]
Writing 'boot'                                     OKAY [  1.848s]
Sending sparse 'boot' 2/2 (1916 KB)                OKAY [  0.077s]
Writing 'boot'                                     OKAY [  0.092s]

$ fastboot flash root deepin-th1520-riscv64-25-desktop-installer.root.ext4
Sending sparse 'root' 1/128 (114684 KB)            OKAY [  3.189s]
Writing 'root'                                     OKAY [  0.582s]
Sending sparse 'root' 2/128 (114684 KB)            OKAY [  3.147s]
Writing 'root'                                     OKAY [  0.529s]
......
Sending sparse 'root' 127/128 (110493 KB)          OKAY [  3.071s]
Writing 'root'                                     OKAY [  0.600s]
Sending sparse 'root' 128/128 (65808 KB)           OKAY [  1.842s]
Writing 'root'                                     OKAY [  2.044s]
Finished. Total time: 501.144s
```

刷入后重启。

### 启动测试

1. 将板子通电
2. 观察到 bootloader正常加载，成功找到操作系统并进行引导
3. 观察到内核正确启动，Plymouth 正常展示
4. HDMI 显示器显示安装器界面
5. 通过USB接入鼠标键盘，正常工作
6. 完成图形化安装引导，进入桌面环境

### 桌面环境测试

- 观察到 DDE 桌面环境缓慢但正确渲染，壁纸、任务栏、光标等皆正确绘制
- `glxgears` 、 `es2gears` 、`vkgears` 皆正常进行图形渲染，`glmark2` 分数：25，`glmark2-es2` 分数：477，GPU测试通过。
- 除影院外，控制中心、文件管理器、文本编辑器等系统内置应用皆正常工作
- `mpv` 在硬件解码播放视频时正常工作，浏览器视频播放正常工作
- Firefox 浏览器和 LibreOffice 办公套件可以正常工作。 `build-essential` 套件可以正常安装并工作。
- 板载 USB 接口、 RJ45 网络接口正常工作

### 异常记录

- `glxinfo` 、 `vkgears -info` 和 `glmark2` 输出中显示 `llvmpipe`。
- 影院无法正常工作，终端输出 `ERROR: Gaps in frame num` 和 `ERROR: BYTE_STREAM` 。

### 结论

**支持等级：5.5 图形化支持**

该镜像在 SiPEED LicheePI 4A 上通过测试。
