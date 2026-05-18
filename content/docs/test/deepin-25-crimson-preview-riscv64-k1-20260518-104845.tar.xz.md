---
title: SpacemiT K1 20260518 镜像测试报告
date: 2026-05-18
author: karanocave
---

## 下载镜像

通过镜像发布页下载 `deepin-25-crimson-preview-riscv64-k1-20260518-104845.tar.xz`，随后解压得到系统镜像与校验文件：

```bash
tar -xvf deepin-25-crimson-preview-riscv64-k1-20260518-104845.tar.xz
```

校验镜像：

```bash
$ cat deepin-k1-riscv64-25-desktop-installer.md5sum
d2e32e5c6d2a7c47c02950ac3d80dd8f  deepin-k1-riscv64-25-desktop-installer.boot.ext4
40475f63663cda6a7b8b8577c3c60bb7  deepin-k1-riscv64-25-desktop-installer.root.ext4

$ md5sum deepin-k1-riscv64-25-desktop-installer.boot.ext4
d2e32e5c6d2a7c47c02950ac3d80dd8f  deepin-k1-riscv64-25-desktop-installer.boot.ext4

$ md5sum deepin-k1-riscv64-25-desktop-installer.root.ext4
40475f63663cda6a7b8b8577c3c60bb7  deepin-k1-riscv64-25-desktop-installer.root.ext4

$ cat deepin-k1-riscv64-25-desktop-installer.sha256sum
ae7e1d7c45fb0c87e8375999ebed328538ff7acf5440180d2182a890ea49f7f6  deepin-k1-riscv64-25-desktop-installer.boot.ext4
82109567ecb14dcdb146b13ff1493e9e6a7c0f5212e7d7e304c3bbc0c21ecc50  deepin-k1-riscv64-25-desktop-installer.root.ext4
```

### 测试设备：SpacemiT MUSE Pi Pro

### 硬件准备

- SpacemiT MUSE Pi Pro
- 电源适配器
- USB 转 TTL 调试线
- 64GB MicroSD 卡
- USB 读卡器
- HDMI 显示器
- 键盘及鼠标

### 连接串口

使用 USB 转 TTL 调试线连接设备与电脑，波特率为 `115200`。本次测试的完整串口日志保存在：

`/Users/karanocave/Code/MusePiPro/serial-2026-05-18-135446.log`

### 刷写 bootloader

本次测试遵循 `sig-deepin-ports/content/docs/install/k1.md`。

Bootloader 使用 deepin-ports-kernel GitHub Actions 产物：

- `https://github.com/deepin-community/deepin-ports-kernel/actions/runs/25951392567`

根据 K1 安装文档与前次 `20260514` 测试中验证过的 SD 启动布局，本次 SD 卡启动介质写入为以下布局：

- `bootinfo_sd.bin` 写入首扇区前 80 字节
- `FSBL.bin` 写入 `128K`
- `u-boot-env-default.bin` 写入 `384K`
- `fw_dynamic.itb` 作为 `opensbi` 分区写入 `1M`
- `u-boot.itb` 作为 `uboot` 分区写入 `2M`
- `deepin-k1-riscv64-25-desktop-installer.boot.ext4` 写入 `bootfs` 分区，起始于 `4M`
- `deepin-k1-riscv64-25-desktop-installer.root.ext4` 写入 `rootfs` 分区，起始于 `260M`

实际生成的 GPT 分区如下：

- `fsbl`
- `env`
- `opensbi`
- `uboot`
- `bootfs`
- `rootfs`

### 刷写操作系统至 SD 卡

按照 `sig-deepin-ports/content/docs/install/k1.md` 的分区定义，将系统镜像直接写入 SD 卡。写入过程无 I/O 报错，写入后主机可识别出上述 6 个 GPT 分区。对写入结果进行读回检查后，`bootinfo_sd.bin` 首 80 字节匹配，`bootfs` 与 `rootfs` 在预期偏移处均可读出 `ext4` superblock 签名。

### 启动测试

1. 将 SD 卡插入板卡，接入串口、显示器、键盘鼠标和电源。
2. 上电后观察到设备从 SD 卡启动，SPL 能够成功加载 `opensbi` 与 `uboot`：

```text
sys: 0x200
try sd...
bm:3
j...

U-Boot SPL 2022.10spacemit-gb26ef870-dirty (May 16 2026 - 03:18:15 +0000)
[   0.597] Boot from fit configuration k1-x_MUSE-Pi-Pro
[   0.599] ## Checking hash(es) for config conf_17 ... OK
[   0.605] ## Checking hash(es) for Image uboot ... crc32+ OK
[   0.616] ## Checking hash(es) for Image fdt_17 ... crc32+ OK
[   0.659] ## Checking hash(es) for config config_1 ... OK
[   0.661] ## Checking hash(es) for Image opensbi ... crc32+ OK
```

3. 进入 U-Boot 后，能够从 `bootfs` 成功读取 `env_k1-x.txt`，并正确匹配到 `k1-x_MUSE-Pi-Pro.dtb`、内核和 ramdisk：

```text
[   1.810] 355 bytes read in 7 ms (48.8 KiB/s)
[   1.811] ## Info: input data size = 356 = 0x164
[   1.815] load env_k1-x.txt from bootfs successful
[   1.839] Try to boot from mmc0 ...
[   1.938] product_name: k1-x_MUSE-Pi-Pro
[   1.939] match dtb by product_name: spacemit/6.6.63-k1-spacemit-66y/k1-x_MUSE-Pi-Pro.dtb
[   1.954] Loading kernel...
[   2.377] 36728320 bytes read in 387 ms (90.5 MiB/s)
[   2.422] Loading ramdisk ...
[   3.195] 71363273 bytes read in 752 ms (90.5 MiB/s)
```

4. U-Boot 日志中仍出现：

```text
No FDT memory address configured. Please configure
the FDT address via "fdt addr <address>" command.
Aborting!
```

但随后 U-Boot 继续完成 `Image`、`DTB` 与 `ramdisk` 的搬运并正常进入内核：

```text
[   3.226] Moving Image from 0x11000000 to 0x600000, end=299b000
[   3.250] ## Flattened Device Tree blob at 31000000
[   3.257]    Loading Ramdisk to 79972000, end 7dd80ac9 ... OK
[   3.298]    Loading Device Tree to 0000000079959000, end 0000000079971450 ... OK

Starting kernel ...

[    0.000000] Linux version 6.6.63-k1-spacemit-66y ...
[    0.000000] Machine model: spacemit k1-x MUSE-Pi-Pro board
```

5. 系统成功进入 `systemd`，串口日志中可见大量 target/service 启动信息，未进入 fallback shell：

```text
[   16.755566] systemd[1]: System time before build time, advancing clock.
[   16.813399] systemd[1]: Inserted module 'autofs4'
[  OK  ] Reached target remote-fs.target - Remote File Systems.
[  OK  ] Reached target slices.target - Slice Units.
```

6. 系统成功给出登录提示，串口控制台可使用默认账户登录：

```text
Deepin GNU/Linux 25 deepin-riscv64-k1 ttyS0

deepin-riscv64-k1 login: root
Password:
Verification successful
Linux deepin-riscv64-k1 6.6.63-k1-spacemit-66y #1 SMP PREEMPT Wed Dec 10 03:26:55 UTC 2025 riscv64
Welcome to deepin 25 GNU/Linux
```

7. 图形栈成功拉起。串口日志中可见 `lightdm` 启动、`Xorg` 访问 `powervr.ini`、HDMI 连接与 `PVR` 固件加载：

```text
Starting lightdm.service - Light Display Manager...
[drm] spacemit_hdmi_connector_detect() hdmi status connected
[drm] spacemit_hdmi_get_edid_block() len 128
PVR_K:  1: RGX Device registered BVNC 36.29.52.182 with 1 core in the system
[drm] Initialized pvr 24.2.6603887 20170530 for cac00000.imggpu on minor 0
audit: type=1400 ... profile="Xorg" name="/etc/powervr.ini/"
```

8. 通过串口登录后的系统检查结果如下：

```text
$ uname -a
Linux akiboni-PC 6.6.63-k1-spacemit-66y #1 SMP PREEMPT Wed Dec 10 03:26:55 UTC 2025 riscv64 GNU/Linux

$ ip link
1: lo: <LOOPBACK,UP,LOWER_UP> ...
2: end0: <NO-CARRIER,BROADCAST,MULTICAST,UP> ...

$ systemctl --failed --no-pager
● dde-update-grub.service loaded failed failed Transient Unit Update Grub
● nmbd.service            loaded failed failed Samba NMB Daemon

$ systemctl is-system-running
degraded
```

9. 当前图形会话存在，`lightdm`、`Xorg` 和桌面用户会话均已建立：

```text
$ loginctl list-sessions --no-pager
SESSION  UID USER    SEAT  TTY   STATE  IDLE SINCE
      1    0 root    -     ttyS0 active no   -
      4 1000 akiboni seat0 tty1  active no   -

$ pgrep -a Xorg
4029 /usr/lib/xorg/Xorg -background none :0 -seat seat0 ...

$ pgrep -a lightdm
4022 /usr/sbin/lightdm
4204 lightdm --session-child 13 20 21
```

10. 当前图形会话类型确认为 `deepin` 桌面，相关 DDE 组件已在运行：

```text
$ loginctl show-session 4 -p Name -p Type -p Class -p State -p Service -p Desktop
Name=akiboni
Service=lightdm
Desktop=deepin
Type=x11
Class=user
State=active

$ ps -fu akiboni | egrep 'dde-session|kwin|dde-shell'
/usr/bin/dde-session
/usr/bin/kwin_x11 --replace
/usr/lib/deepin-daemon/dde-session-daemon
/usr/bin/dde-shell -p org.deepin.ds.desktop
/usr/bin/dde-shell -C DDE --serviceName=org.deepin.dde.shell -d org.deepin.ds.desktop
```

11. `fastfetch` 与 `eglinfo` 显示图形输出与 GPU 已被识别，显示器已工作在 `1920x1080@75Hz`，OpenGL ES 渲染器为 `PowerVR B-Series BXE-2-32`：

```text
Display (L27q-35): 1920x1080 @ 75 Hz in 27" [External]
GPU: Imagination Technologies PowerVR B-Series BXE-2-32

OpenGL ES profile vendor: Imagination Technologies
OpenGL ES profile renderer: PowerVR B-Series BXE-2-32
OpenGL ES profile version: OpenGL ES 3.2 build 24.2@6603887
```

12. 继续按模板补充检查显示输出、DRM 节点和可选分辨率，确认当前 X11 会话已稳定驱动 HDMI 显示器：

```text
$ xrandr --current
Screen 0: minimum 320 x 200, current 1920 x 1080, maximum 4096 x 4096
HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis) 597mm x 336mm
   1920x1080     74.97*   60.00    60.00    50.00    59.94
   1680x1050     59.88
   1600x900      60.00
   1280x1024     60.02
   1440x900      59.90
   1366x768      59.79
   1280x720      60.00    50.00    59.94

$ ls -l /dev/dri
drwxr-xr-x  2 root root        100 ... by-path
crw-rw----+ 1 root video  226,   0 ... card0
crw-rw----+ 1 root video  226,   1 ... card1
crw-rw----+ 1 root render 226, 128 ... renderD128
```

13. 继续按模板检查图形驱动路径。结果表明：OpenGL ES 硬件路径可用，但 GLX 和 Vulkan 仍回退到软件渲染：

```text
$ glxinfo -B
glx: failed to create dri3 screen
failed to load driver: spacemit
direct rendering: Yes
OpenGL vendor string: Mesa
OpenGL renderer string: llvmpipe (LLVM 19.1.4, 128 bits)

$ es2_info
EGL_VENDOR: Mesa Project
GL_VENDOR: Imagination Technologies
GL_VERSION: OpenGL ES 3.2 build 24.2@6603887
GL_RENDERER: PowerVR B-Series BXE-2-32

$ eglinfo -B
GBM platform:
OpenGL ES profile renderer: PowerVR B-Series BXE-2-32

X11 platform:
OpenGL ES profile renderer: PowerVR B-Series BXE-2-32

Device #2:
OpenGL core profile renderer: llvmpipe (LLVM 19.1.4, 128 bits)

$ vkgears -info
deviceType    = CPU
deviceName    = llvmpipe (LLVM 19.1.4, 128 bits)
```

14. 继续按模板补充检查外设、网络和音频情况。USB 键盘鼠标已识别，音频设备已枚举；有线网络经人工验证可正常联网，Wi-Fi 与蓝牙则工作异常、未能识别可用设备：

```text
$ lsusb
Bus 002 Device 003: ID 046d:c09d Logitech, Inc. G102 LIGHTSYNC Gaming Mouse
Bus 002 Device 004: ID 17ef:6100 Lenovo Lenovo New Calliope USB Keyboard

$ aplay -l
card 0: sndhdmi [snd-hdmi], device 0: SSPA2-dummy_codec dummy_codec-0 []
card 1: sndes8326 [snd-es8326], device 0: i2s0-dai-ES8326 HiFi ES8326 HiFi-0 []

$ pactl info
Default Sink: alsa_output.platform-snd-card_0.stereo-fallback
Default Source: alsa_input.platform-snd-card_1.stereo-fallback
```

本次测试中，有线网络通过现场人工验证无异常，可正常访问软件仓库与互联网；但板载 Wi-Fi 网卡和蓝牙未能正常识别出可用设备，因此未完成无线联网与蓝牙配对测试。

15. 继续按模板补充检查基础构建环境与包管理。`apt` 相关操作经人工验证可以正常工作；系统内已安装 `build-essential`，且本地编译运行成功：

```text
$ apt-cache policy build-essential
build-essential:
  Installed: 12.12+deepin2
  Candidate: 12.12+deepin2

$ gcc /tmp/hello.c -o /tmp/hello && /tmp/hello
Hello, World!
```

16. 结合现场人工观察结果，第 `7` 章 deepin 内置应用与桌面体验基本通过。DDE 桌面、动画和交互均可用，但仍存在明显图形体验问题：

```text
DDE 桌面正常渲染，鼠标渲染不正常，移动时有闪烁。
动画正常渲染，交互正常，但是较为卡顿。
```

现场使用结果表明，第 `7` 章涉及的 deepin 内置应用基本可用；本次报告不再以串口注入应用的异常作为第 `7` 章结论依据。

17. 第 `8` 章视频播放测试已进行。使用 deepin 内置宣传视频进行播放时，能够输出画面和声音，但播放过程非常卡顿，体验较差：

```text
播放 deepin 内置宣传视频时，画面与播放流程可以启动，但整体非常卡顿。
```

18. 第 `9` 章第一方仓库软件与基本构建环境基本无问题。`apt` 相关操作经人工验证可以正常工作，本地 C 构建环境也可正常使用。

### 通过的最高条件

本次测试稳定通过了 `4.1 显示服务启动`、`4.2 图形化登录`、`4.3 基本桌面会话`，并继续通过了第 `7` 章、第 `9` 章以及第 `10.1/10.2` 章中的主要人工验证项目：

- 串口与本机状态均显示 `lightdm`、`Xorg` 和 seat0 图形会话已建立
- 显示器已成功连接并输出 `1920x1080@74.97Hz`
- 存在桌面用户会话 `akiboni`
- `Desktop=deepin`，且 `dde-session`、`kwin_x11`、`dde-shell` 均在运行
- `/dev/dri` 下存在 `card*` 与 `renderD128`
- `es2_info` 与 `eglinfo` 的 X11/GBM 路径可识别 `PowerVR B-Series BXE-2-32`
- DDE 桌面、deepin 内置应用、第一方仓库软件整体基本可用
- USB 外设、RJ45 有线网络和音频播放均经人工验证无异常

因此本次镜像已明显超过“仅命令行支持”与“仅 greeter 可见”的阶段，并达到“开箱即用的 deepin 环境”范围内的大部分要求。

### 未通过的最高条件

本次未继续上调到 `8 完整支持`，直接原因是 `10.3 板载无线功能` 未通过：

- 有线网络、USB 外设和音频播放均可正常工作
- 但板载 Wi-Fi 网卡和蓝牙完全无法使用，未能识别到可用设备
- 因此设备不能达到“所有板载硬件功能均得到驱动支持和功能验证”的第 `8` 级要求

因此本报告将支持等级上调至第 `7` 级，而不继续上调到第 `8` 级。

### 异常记录

- U-Boot 自动引导阶段仍输出：
  - `No FDT memory address configured. Please configure`
  - `Aborting!`
  但该信息未阻止后续进入 Linux 内核
- `systemctl --failed` 显示存在失败服务：
  - `dde-update-grub.service`
  - `nmbd.service`
- `systemctl is-system-running` 状态为 `degraded`
- `glxinfo -B` 仍显示：
  - `failed to load driver: spacemit`
  - `OpenGL renderer string: llvmpipe (LLVM 19.1.4, 128 bits)`
- `eglinfo -B` 的 X11/GBM OpenGL ES 路径可识别 `PowerVR B-Series BXE-2-32`，但同一输出中仍存在 `llvmpipe` 的 Mesa 平台项
- `vkgears -info` 识别到的 Vulkan 设备仍为 CPU `llvmpipe`
- `glmark2` 与 `glmark2-es2` 当前未安装，故 `6.3 GPU 基准测试` 暂未执行
- 有线网络现场人工验证无异常，`apt` 相关操作也可正常完成；但这部分未附命令行记录
- 板载 Wi-Fi 网卡和蓝牙工作不正常，未能识别到可用无线/蓝牙设备
- DDE 桌面正常渲染，但鼠标渲染不正常，移动时有闪烁
- DDE 动画与交互可以正常工作，但整体较为卡顿
- 播放 deepin 内置宣传视频时能够正常启动播放，但整体非常卡顿
- 串口日志中仍可见若干非致命警告，例如：
  - `Failed to get fastboot key config: -19`
  - `Failed to probe HUSB239: -19`
  - `rproc-virtio ... Failed to set DMA mask 3fffffff`
  - `rpi_touchscreen ... please check LCD connection`

### 未验证项目

- `5.1-5.3` 中依赖直接观察和输入设备交互的项目，如桌面右键菜单、框选、Alt+Tab、托盘展开、控制中心手动调节
- `10.1` U 盘自动挂载
- `8.1-8.2` 中更细致的视频硬件编解码能力与码率/格式覆盖
- `9.2` LibreOffice 输入保存流程的完整矩阵
- `10.3` 中 Wi-Fi 扫描连接与蓝牙配对的完整功能路径

### 结论

**支持等级：7.3 开箱即用的 deepin 环境**

该镜像在 SpacemiT MUSE Pi Pro 上通过测试。

> 本次测试确认：相较 `20260514` 镜像，`20260518` 版本已经修复此前 `bootfs` 内容不完整导致的 bootloader 阶段失败问题。设备可从 SD 卡完成 `SPL -> U-Boot -> Linux kernel -> initrd -> systemd -> lightdm/Xorg` 整条启动链路，并建立 `deepin` 图形用户会话。进一步测试表明，OpenGL ES 路径已经可以识别 `PowerVR B-Series BXE-2-32`，DDE 桌面和 deepin 内置应用基本可用，第一方仓库软件与本地构建环境基本无问题，USB、RJ45 和音频播放也可正常工作；但鼠标移动存在闪烁、桌面与视频播放较为卡顿，GLX/Vulkan 仍回退到 `llvmpipe`，且 Wi-Fi 与蓝牙完全无法使用。因此本报告将该镜像评定为 `7.3 开箱即用的 deepin 环境`，暂不到 `8 完整支持`。
