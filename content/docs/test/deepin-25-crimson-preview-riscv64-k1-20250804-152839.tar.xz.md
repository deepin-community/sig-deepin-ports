---
title: SpacemiT K1 20250804 镜像测试报告
date: 2025-10-16
author: purofle
---

## 下载镜像

通过 [链接](https://ci.deepin.com/repo/deepin/deepin-ports/cdimage/20250804/riscv64/deepin-25-crimson-preview-riscv64-k1-20250804-152839.tar.xz) 下载镜像压缩包，随后使用以下命令解压镜像与校验码至当前文件夹：

```bash
tar -xvf deepin-25-crimson-preview-riscv64-k1-20250804-152839.tar.xz
```

校验镜像：
```bash
$ cat deepin-k1-riscv64-25-desktop-installer.md5sum
7476e644d487ee65648aa7df09ca9a8f  deepin-k1-riscv64-25-desktop-installer.boot.ext4
97772e7bc2d886a7b99c310630215ae8  deepin-k1-riscv64-25-desktop-installer.root.ext4

$ md5sum deepin-k1-riscv64-25-desktop-installer.root.ext4
97772e7bc2d886a7b99c310630215ae8  deepin-k1-riscv64-25-desktop-installer.root.ext4
$ md5sum deepin-k1-riscv64-25-desktop-installer.boot.ext4
7476e644d487ee65648aa7df09ca9a8f  deepin-k1-riscv64-25-desktop-installer.boot.ext4
```

### 测试设备：SpacemiT MUSE Pi Pro

### 硬件准备

- SpacemiT MUSE Pi Pro
- 支持 PD 协议的电源适配器
- USB 转 TTL 调试线
- USB-C to USB-C 数据线
- HDMI 显示器
- 键盘及鼠标

### 连接串口
使用 USB 转 TTL 调试线连接设备与电脑，设备上引脚旁有相关标注：

| 调试线引脚   |  板子标注  |
| ---------- | --------  |
| GND        | G         |
| RXD        | 朝外箭头   |
| TXD        | 朝内箭头   |

将调试线另一端连接电脑，电脑将出现 tty 设备名，在本报告中为 `/dev/ttyUSB0` (Linux)，随后使用任意串口调试工具连接串口，波特率为 115200

### 写入系统

#### 刷写最新版本 Bootloader

从 [该网站](https://github.com/deepin-community/deepin-riscv-kernel/actions) 的最新 "build all" action 中下载名为 `uboot-k1-spacemit` 的文件。下载完成后，解压得到以下文件：
```
.
├── fw_dynamic.itb    # 写入 opensbi 分区
└── k1
    ├── bootinfo_emmc.bin    # 写入 bootinfo 分区
    ├── bootinfo_sd.bin    # 写入 bootinfo 分区
    ├── bootinfo_spinand.bin    # 写入 bootinfo 分区
    ├── bootinfo_spinor.bin    # 写入 bootinfo 分区
    ├── FSBL.bin    # 写入 fsbl 分区
    ├── u-boot-env-default.bin    # 写入 env 分区
    └── u-boot.itb    # 写入 uboot 分区
```

按住设备上的 `FDL` 按钮，同时插入 Type-C to Type-C 数据线连接电脑，进入 DFU 模式，可见设备：
```bash
$ fastboot devices
dfu-device       DFU download
```
随后使用以下命令进入刷写模式，并刷写 bootloader：
```bash
fastboot stage FSBL.bin    # 加载第一阶段 bootloader
fastboot continue
sleep 1
fastboot stage u-boot.itb    # 加载第二阶段 bootloader (即 u-boot)
fastboot continue

fastboot flash bootinfo bootinfo_emmc.bin    # bootinfo_{spinor,spiand,emmc,sd} 取决于 bootloader 所在的存储介质
fastboot flash fsbl FSBL.bin    # 写入第一阶段 bootloader
fastboot flash env u-boot-env-default.bin    # 写入默认环境变量
fastboot flash opensbi ../fw_dynamic.itb    # 写入 opensbi
fastboot flash uboot u-boot.itb    # 写入 u-boot
```

#### 刷写操作系统至 eMMC

接下来可以直接使用 fastboot 将系统镜像刷写至 eMMC：

```bash
fastboot flash bootfs deepin-k1-riscv64-25-desktop-installer.boot.ext4
fastboot flash rootfs deepin-k1-riscv64-25-desktop-installer.root.ext4
```

### 启动测试
1. 重新拔插数据线，在串口中观察到 Bootloader 正常启动，并正常引导
2. 连接显示器及鼠标键盘，显示器正常显示，但是不展示 Plymouth。不识别通过绿联拓展坞插入的键盘鼠标，需要直接连接至设备的 USB 接口才可使用
3. 按照 GUI 指示初始化系统安装
4. 登陆后进入桌面，Deepin 各组件正常运行
5. 切换到 tty，检查网络发现无线网卡未识别

### 桌面环境测试
- DDE 桌面正常渲染，鼠标渲染不正常，移动时有闪烁
- 动画正常渲染，交互正常，但是较为卡顿
- 尝试运行 `es2_info`，可正常识别 `GL_VENDOR` 为 `Imagination Technologies`
- 运行 `eglinfo`，可识别 `PowerVR B-Series BXE-2-32`，但是运行中报错段错误
- 尝试运行 `es2gears` 正常进行图形渲染，`glxinfo` 和 `vkgears -info` 均显示设备为 `llvmpipe`
- `glmark2` 分数：22，`glmark2-es2` 分数：104
- LibreOffice 系软件正常工作，Deepin 内置核心应用均正常工作
- 尝试使用 `mpv` 观看 1920x1080 视频，画面正常，硬件编码器不工作，并且较为卡顿

### 异常记录
- `vkgears -info` 和 `glxinfo` 显示设备为 `llvmpipe`
- 运行 `glmark2` 和 `glxinfo` 时提示 `failed to load driver: spacemit`
- WI-FI 和蓝牙不工作
- 鼠标在桌面环境移动时闪烁

### 结论

**支持等级：7 开箱即用的 deepin 环境**

该镜像在 SpacemiT MUSE Pi Pro 上通过测试。
